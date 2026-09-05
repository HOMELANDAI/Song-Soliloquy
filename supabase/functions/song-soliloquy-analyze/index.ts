import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ENGINE_VERSION = "song-soliloquy-engine/1.1.1";
const SCHEMA_VERSION = "song-soliloquy/v1.1";
const DEFAULT_MODEL = "gpt-5";
const MAX_LYRIC_CHARS = 120_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "600",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" };

type LyricSection = { section: string; lines: string[] };
type AnyRecord = Record<string, any>;
type Issue = { code: string; path: string; message: string };
type ValidationResult = {
  valid: boolean;
  errors: Issue[];
  warnings: Issue[];
  counts: {
    lyric_sections: number;
    lyric_lines: number;
    bar_analysis: number;
    wordplay_bars: number;
    key_bars: number;
    figurative_language: number;
    entendres: number;
  };
};
type LanguageAudit = {
  figurative_language: AnyRecord[];
  entendres: AnyRecord[];
  wordplay_bar_analysis: AnyRecord[];
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}
function safeJson(value: string | undefined): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
function isAuthorized(req: Request): boolean {
  const apiKey = (req.headers.get("apikey") ?? "").trim();
  const bearer = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const publishable = safeJson(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS"));
  const allowed = new Set<string>([
    ...Object.values(publishable),
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  ].filter(Boolean));
  return allowed.has(apiKey) || allowed.has(bearer);
}
function parseLyricsText(input: string): LyricSection[] {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const sections: LyricSection[] = [];
  let current: LyricSection | null = null;
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    const header = trimmed.match(/^\[([^\]]+)\]$/);
    if (header) {
      if (current && current.lines.length) sections.push(current);
      current = { section: header[1], lines: [] };
      continue;
    }
    if (!trimmed) continue;
    if (!current) current = { section: "Lyrics", lines: [] };
    current.lines.push(rawLine);
  }
  if (current && current.lines.length) sections.push(current);
  return sections;
}
function normalizeLyrics(input: unknown): LyricSection[] {
  if (typeof input === "string") return parseLyricsText(input);
  if (!Array.isArray(input)) return [];
  const out: LyricSection[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const section = typeof item.section === "string" && item.section.trim() ? item.section : "Lyrics";
    const lines = Array.isArray(item.lines)
      ? item.lines.filter((x: unknown) => typeof x === "string" && x.trim().length > 0)
      : [];
    if (lines.length) out.push({ section, lines });
  }
  return out;
}
function allLyricLines(song: AnyRecord): string[] {
  return normalizeLyrics(song?.lyrics).flatMap((section) => section.lines);
}
function allLyricText(song: AnyRecord): string {
  return allLyricLines(song).join("\n");
}
function quoteExists(song: AnyRecord, quote: unknown): boolean {
  if (typeof quote !== "string" || !quote.length) return false;
  const lines = allLyricLines(song);
  return lines.includes(quote) || allLyricText(song).includes(quote);
}
function nonEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
}
function mergeNonEmpty(base: AnyRecord, preferred: AnyRecord): AnyRecord {
  const next = { ...base };
  for (const [key, value] of Object.entries(preferred ?? {})) {
    if (nonEmpty(value)) next[key] = value;
  }
  return next;
}
function lyricsCharCount(lyrics: LyricSection[]): number {
  return lyrics.reduce((n, s) => n + s.section.length + s.lines.reduce((a, line) => a + line.length, 0), 0);
}

const requiredTopLevel = [
  "metadata", "lyrics", "song_context", "figurative_language", "entendres", "bar_analysis", "key_bars", "hottest_bar",
  "raw_notes", "notebooklm_source_pack", "notebooklm_questions", "youtube_ready_angle", "seo", "similar_songs",
];
function hasWordplayTag(entry: AnyRecord): boolean {
  const tags = [...(Array.isArray(entry?.tags) ? entry.tags : []), ...(Array.isArray(entry?.bar_type) ? entry.bar_type : [])]
    .map((x) => String(x).toLowerCase());
  return tags.some((x) => x.includes("wordplay") || x.includes("pun"));
}
function validateSong(song: AnyRecord): ValidationResult {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const lines = allLyricLines(song);
  const lyricSet = new Set(lines);
  const lyricText = lines.join("\n");
  if (song?.schema_version !== SCHEMA_VERSION) errors.push({ code: "SCHEMA_VERSION", path: "schema_version", message: `Expected ${SCHEMA_VERSION}.` });
  for (const field of requiredTopLevel) {
    const value = song?.[field];
    const allowedEmptyDetection = (field === "figurative_language" || field === "entendres") && Array.isArray(value);
    if (!nonEmpty(value) && !allowedEmptyDetection) errors.push({ code: "MISSING_REQUIRED_FIELD", path: field, message: `${field} is required.` });
  }
  if (!lines.length) errors.push({ code: "LYRICS_EMPTY", path: "lyrics", message: "Lyrics must contain at least one line." });

  const figurative = Array.isArray(song?.figurative_language) ? song.figurative_language : [];
  figurative.forEach((entry: AnyRecord, i: number) => {
    const p = `figurative_language[${i}]`;
    if (typeof entry?.phrase !== "string" || typeof entry?.line !== "string" || !entry.line.includes(entry.phrase)) errors.push({ code: "FIGURATIVE_PHRASE_NOT_ANCHORED", path: p, message: "Figurative phrase must occur exactly inside its line." });
    if (typeof entry?.line !== "string" || !lyricSet.has(entry.line)) errors.push({ code: "FIGURATIVE_LINE_NOT_ANCHORED", path: p, message: "Figurative line must occur exactly in lyrics." });
    if (!nonEmpty(entry?.meaning) || !nonEmpty(entry?.why_it_works)) errors.push({ code: "FIGURATIVE_BREAKDOWN_MISSING", path: p, message: "Figurative detections require meaning and why_it_works." });
  });

  const entendres = Array.isArray(song?.entendres) ? song.entendres : [];
  entendres.forEach((entry: AnyRecord, i: number) => {
    const p = `entendres[${i}]`;
    if (typeof entry?.phrase !== "string" || typeof entry?.line !== "string" || !entry.line.includes(entry.phrase)) errors.push({ code: "ENTENDRE_PHRASE_NOT_ANCHORED", path: p, message: "Entendre phrase must occur exactly inside its line." });
    if (typeof entry?.line !== "string" || !lyricSet.has(entry.line)) errors.push({ code: "ENTENDRE_LINE_NOT_ANCHORED", path: p, message: "Entendre line must occur exactly in lyrics." });
    const meanings = Array.isArray(entry?.meanings) ? entry.meanings : [];
    if (meanings.length < 2 || meanings.length > 3) errors.push({ code: "ENTENDRE_LAYER_COUNT", path: `${p}.meanings`, message: "Entendres require 2-3 meaning layers." });
    meanings.forEach((m: AnyRecord, j: number) => {
      if (!nonEmpty(m?.meaning) || !nonEmpty(m?.evidence)) errors.push({ code: "ENTENDRE_LAYER_EVIDENCE_MISSING", path: `${p}.meanings[${j}]`, message: "Every entendre layer requires meaning and textual evidence." });
    });
  });

  const bars = Array.isArray(song?.bar_analysis) ? song.bar_analysis : [];
  let wordplayBars = 0;
  bars.forEach((entry: AnyRecord, i: number) => {
    const p = `bar_analysis[${i}]`;
    if (!quoteExists(song, entry?.bar)) errors.push({ code: "BAR_NOT_ANCHORED", path: `${p}.bar`, message: "Analyzed bar must occur exactly in lyrics." });
    if (hasWordplayTag(entry)) {
      wordplayBars++;
      if (!nonEmpty(entry?.breakdown) || !nonEmpty(entry?.deeper_read) || !nonEmpty(entry?.why_it_hits)) errors.push({ code: "WORDPLAY_BREAKDOWN_MISSING", path: p, message: "Wordplay bars require breakdown, deeper_read, and why_it_hits." });
      if (typeof entry?.technical_notes !== "string" || entry.technical_notes.trim().length < 20) errors.push({ code: "WORDPLAY_TECHNICAL_NOTES_MISSING", path: `${p}.technical_notes`, message: "Wordplay bars require explicit technical explanation of the mechanism." });
    }
  });

  const keyBars = Array.isArray(song?.key_bars) ? song.key_bars : [];
  if (keyBars.length && (keyBars.length < 5 || keyBars.length > 10)) errors.push({ code: "KEY_BAR_COUNT", path: "key_bars", message: "Complete exports require 5-10 key bars." });
  keyBars.forEach((entry: AnyRecord, i: number) => {
    if (!quoteExists(song, entry?.bar)) errors.push({ code: "KEY_BAR_NOT_ANCHORED", path: `key_bars[${i}].bar`, message: "Key bar must occur exactly in lyrics." });
  });
  if (song?.hottest_bar) {
    if (!quoteExists(song, song.hottest_bar.bar)) errors.push({ code: "HOTTEST_BAR_NOT_ANCHORED", path: "hottest_bar.bar", message: "Hottest bar must occur exactly in lyrics." });
    const score = song.hottest_bar.score;
    if (!Number.isInteger(score) || score < 1 || score > 100) errors.push({ code: "HOTTEST_BAR_SCORE", path: "hottest_bar.score", message: "Hottest bar score must be an integer from 1-100." });
  }
  const metaDescription = song?.seo?.meta_description;
  if (typeof metaDescription === "string" && metaDescription.length > 160) errors.push({ code: "META_DESCRIPTION_LENGTH", path: "seo.meta_description", message: "Meta description must be 160 characters or fewer." });
  const slug = song?.seo?.url_slug;
  if (typeof slug === "string" && slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push({ code: "SEO_SLUG", path: "seo.url_slug", message: "SEO slug must be lowercase and hyphenated." });
  if (lyricText.length > MAX_LYRIC_CHARS) errors.push({ code: "LYRICS_TOO_LARGE", path: "lyrics", message: `Lyrics exceed ${MAX_LYRIC_CHARS} characters.` });

  return { valid: errors.length === 0, errors, warnings, counts: { lyric_sections: normalizeLyrics(song?.lyrics).length, lyric_lines: lines.length, bar_analysis: bars.length, wordplay_bars: wordplayBars, key_bars: keyBars.length, figurative_language: figurative.length, entendres: entendres.length } };
}
function fieldForValidationPath(path: string): string | null {
  const root = path.split(/[.[]/)[0];
  return requiredTopLevel.includes(root) ? root : null;
}
function finalizeStatus(song: AnyRecord, validation: ValidationResult): AnyRecord {
  const missing = new Set<string>();
  for (const field of requiredTopLevel) {
    const value = song?.[field];
    const allowedEmptyDetection = (field === "figurative_language" || field === "entendres") && Array.isArray(value);
    if (!nonEmpty(value) && !allowedEmptyDetection) missing.add(field);
  }
  for (const error of validation.errors) {
    const field = fieldForValidationPath(error.path);
    if (field) missing.add(field);
  }
  return { ...song, schema_version: SCHEMA_VERSION, export_status: missing.size === 0 && validation.valid ? "complete" : "incomplete", missing_required_fields: [...missing] };
}

const stringSchema = { type: "string" };
const stringArray = { type: "array", items: stringSchema };
const meaningLayerSchema = { type: "object", additionalProperties: false, required: ["layer", "meaning", "evidence"], properties: { layer: { type: "integer", minimum: 1, maximum: 3 }, meaning: stringSchema, evidence: stringSchema } };
const figurativeItemSchema = { type: "object", additionalProperties: false, required: ["type", "phrase", "line", "section", "meaning", "why_it_works"], properties: { type: { type: "string", enum: ["metaphor", "simile", "symbol", "personification", "imagery"] }, phrase: stringSchema, line: stringSchema, section: stringSchema, meaning: stringSchema, why_it_works: stringSchema } };
const entendreItemSchema = { type: "object", additionalProperties: false, required: ["type", "phrase", "line", "section", "confidence", "meanings"], properties: { type: { type: "string", enum: ["double_entendre", "triple_entendre"] }, phrase: stringSchema, line: stringSchema, section: stringSchema, confidence: { type: "string", enum: ["high", "medium", "low"] }, meanings: { type: "array", minItems: 2, maxItems: 3, items: meaningLayerSchema } } };
const barEntendreSchema = { type: "object", additionalProperties: false, required: ["type", "confidence", "meanings"], properties: { type: { type: "string", enum: ["double_entendre", "triple_entendre"] }, confidence: { type: "string", enum: ["high", "medium", "low"] }, meanings: { type: "array", minItems: 2, maxItems: 3, items: meaningLayerSchema } } };
const barAnalysisItemSchema = { type: "object", additionalProperties: false, required: ["bar", "breakdown", "deeper_read", "technical_notes", "why_it_hits", "figurative_language", "entendres", "pop_culture_references", "tags", "themes", "bar_type"], properties: { bar: stringSchema, breakdown: stringSchema, deeper_read: stringSchema, technical_notes: stringSchema, why_it_hits: stringSchema, figurative_language: { type: "object", additionalProperties: false, required: ["metaphors", "similes", "symbols", "imagery"], properties: { metaphors: stringArray, similes: stringArray, symbols: stringArray, imagery: stringArray } }, entendres: { type: "array", items: barEntendreSchema }, pop_culture_references: stringArray, tags: stringArray, themes: stringArray, bar_type: stringArray } };

const SONG_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["schema_version", "export_status", "missing_required_fields", "metadata", "lyrics", "song_context", "figurative_language", "entendres", "bar_analysis", "key_bars", "hottest_bar", "raw_notes", "notebooklm_source_pack", "notebooklm_questions", "youtube_ready_angle", "seo", "similar_songs"],
  properties: {
    schema_version: { type: "string", enum: [SCHEMA_VERSION] }, export_status: { type: "string", enum: ["complete", "incomplete"] }, missing_required_fields: stringArray,
    metadata: { type: "object", additionalProperties: false, required: ["artist", "song", "title", "featured_artists", "producer", "project", "release_date", "bpm", "canonical_slug", "suggested_url_slug", "overall_mood", "main_themes", "narrative_perspective"], properties: { artist: stringSchema, song: stringSchema, title: stringSchema, featured_artists: stringArray, producer: stringSchema, project: stringSchema, release_date: stringSchema, bpm: stringSchema, canonical_slug: stringSchema, suggested_url_slug: stringSchema, overall_mood: stringSchema, main_themes: stringArray, narrative_perspective: stringSchema } },
    lyrics: { type: "array", items: { type: "object", additionalProperties: false, required: ["section", "lines"], properties: { section: stringSchema, lines: stringArray } } },
    song_context: { type: "object", additionalProperties: false, required: ["overall_mood", "main_themes", "narrative_perspective", "narrator_profile"], properties: { overall_mood: stringSchema, main_themes: stringArray, narrative_perspective: stringSchema, narrator_profile: stringSchema } },
    figurative_language: { type: "array", items: figurativeItemSchema }, entendres: { type: "array", items: entendreItemSchema }, bar_analysis: { type: "array", items: barAnalysisItemSchema },
    key_bars: { type: "array", minItems: 5, maxItems: 10, items: { type: "object", additionalProperties: false, required: ["bar", "why_important", "theme", "classification"], properties: { bar: stringSchema, why_important: stringSchema, theme: stringSchema, classification: stringArray } } },
    hottest_bar: { type: "object", additionalProperties: false, required: ["bar", "why_it_wins", "surface_meaning", "hidden_meaning", "technical_craft", "viewer_reaction_potential", "youtube_discussion_value", "score"], properties: { bar: stringSchema, why_it_wins: stringSchema, surface_meaning: stringSchema, hidden_meaning: stringSchema, technical_craft: stringSchema, viewer_reaction_potential: stringSchema, youtube_discussion_value: stringSchema, score: { type: "integer", minimum: 1, maximum: 100 } } },
    raw_notes: { type: "object", additionalProperties: false, required: ["first_impressions", "major_themes", "possible_title_ideas", "recurring_motifs", "best_discussion_points", "strongest_quotables", "questions_the_song_raises", "possible_visual_ideas", "possible_b_roll_ideas", "related_songs_artists_themes"], properties: { first_impressions: stringArray, major_themes: stringArray, possible_title_ideas: stringArray, recurring_motifs: stringArray, best_discussion_points: stringArray, strongest_quotables: stringArray, questions_the_song_raises: stringArray, possible_visual_ideas: stringArray, possible_b_roll_ideas: stringArray, related_songs_artists_themes: stringArray } },
    notebooklm_source_pack: { type: "object", additionalProperties: false, required: ["song_metadata", "main_themes", "narrator_profile", "bar_by_bar_summary", "key_bars_summary", "hottest_bar_summary", "vocabulary_glossary", "cultural_references", "metaphor_and_entendre_highlights", "comparison_points", "discussion_prompts"], properties: { song_metadata: stringSchema, main_themes: stringArray, narrator_profile: stringSchema, bar_by_bar_summary: stringSchema, key_bars_summary: stringSchema, hottest_bar_summary: stringSchema, vocabulary_glossary: stringArray, cultural_references: stringArray, metaphor_and_entendre_highlights: stringArray, comparison_points: stringArray, discussion_prompts: stringArray } },
    notebooklm_questions: stringArray,
    youtube_ready_angle: { type: "object", additionalProperties: false, required: ["best_youtube_title", "hook_opening_line", "main_thesis", "three_strongest_talking_points", "best_quote_to_open_with", "best_quote_to_end_with", "suggested_thumbnail_text"], properties: { best_youtube_title: stringSchema, hook_opening_line: stringSchema, main_thesis: stringSchema, three_strongest_talking_points: stringArray, best_quote_to_open_with: stringSchema, best_quote_to_end_with: stringSchema, suggested_thumbnail_text: stringArray } },
    seo: { type: "object", additionalProperties: false, required: ["seo_title", "meta_description", "url_slug", "tags"], properties: { seo_title: stringSchema, meta_description: { type: "string", maxLength: 160 }, url_slug: stringSchema, tags: stringArray } },
    similar_songs: { type: "array", items: { type: "object", additionalProperties: false, required: ["artist", "song", "why_it_compares"], properties: { artist: stringSchema, song: stringSchema, why_it_compares: stringSchema } } }
  }
};
const LANGUAGE_AUDIT_SCHEMA = { type: "object", additionalProperties: false, required: ["figurative_language", "entendres", "wordplay_bar_analysis"], properties: { figurative_language: { type: "array", items: figurativeItemSchema }, entendres: { type: "array", items: entendreItemSchema }, wordplay_bar_analysis: { type: "array", items: barAnalysisItemSchema } } };
const MODEL_GENERATION_OMIT_FIELDS = new Set(["lyrics", "schema_version", "export_status", "missing_required_fields"]);
const MODEL_GENERATION_SCHEMA = {
  ...SONG_SCHEMA,
  required: SONG_SCHEMA.required.filter((field) => !MODEL_GENERATION_OMIT_FIELDS.has(field)),
  properties: Object.fromEntries(
    Object.entries(SONG_SCHEMA.properties).filter(([field]) => !MODEL_GENERATION_OMIT_FIELDS.has(field)),
  ),
};

const MASTER_INSTRUCTIONS = `You are the Song Soliloquy rap lyric analysis engine. Produce rigorous, culturally literate rap criticism while preserving the artist's intent, tone, street context, philosophical context, and technical craft.
The canonical output is Song Soliloquy schema_version song-soliloquy/v1.1.
Required analysis:
1. Song context: artist, song, features, producer, project, release date, BPM when supplied/known, mood, themes, narrative perspective.
2. Comprehensive bar analysis. Analyze every important bar AND every line containing notable wordplay. For each, explain literal meaning, deeper read, technical mechanics, references, emotional function, and why it matters.
3. METAPHOR / FIGURATIVE LANGUAGE SWEEP: inspect the ENTIRE supplied lyrics, line by line. Detect every credible metaphor, simile, symbol, personification, and notable imagery. Do not confuse literal statements with metaphor. Exact phrase must appear character-for-character inside exact line; exact line must appear in supplied lyrics.
4. WORDPLAY SWEEP: inspect the ENTIRE supplied lyrics, line by line for puns, homophones, polysemy, idiom flips, name flips, semantic pivots, sound-based wordplay, syntactic ambiguity, number/sports/brand/cultural-reference flips, compound meanings, and setup/payoff punchlines. Every notable wordplay line must have a bar_analysis entry. Put "wordplay" in tags. technical_notes must name the device and explain exactly how the wording creates multiple associations or a punchline. Wordplay is broader than entendre: do not label ordinary wordplay as an entendre unless the same phrase sustains two or three distinct readings.
5. ENTENDRE SWEEP: inspect the ENTIRE supplied lyrics line by line for credible double/triple entendres. Never force one. Require 2-3 distinct readings supported by the actual wording, with high/medium/low confidence. Explain evidence for every layer. Exact anchoring is mandatory.
6. Raw research notes: first impressions, themes, title ideas, motifs, discussion points, quotables, questions, visuals, B-roll, comparisons.
7. Select 5-10 key bars with importance, theme, and classifications.
8. Select exactly one hottest bar. Explain surface/hidden meaning, craft, reaction potential, YouTube value, and assign integer score 1-100.
9. Build NotebookLM source pack and questions.
10. Build YouTube-ready title, hook, thesis, three talking points, opening/closing quote, thumbnail text.
11. Build website SEO metadata and similar-song comparisons.
Quality rules:
- Lyrics are evidence. Never rewrite, normalize, fabricate, or paraphrase lyric text in lyrics, bar, phrase, or line fields.
- Do not invent song facts. If metadata is not supplied and cannot be known confidently, use an empty string rather than fabricate.
- Distinguish metaphor from imagery, wordplay from entendre, and reference from wordplay. A reference alone is not wordplay unless the wording manipulates it.
- Do not inflate entendre counts. A second association is not automatically a second semantic reading.
- Every technical claim should identify the actual mechanism: rhyme, cadence, alliteration, pun, homophone, polysemy, idiom reversal, cultural flip, syntactic ambiguity, metaphorical mapping, or other concrete device.
- Similar-song entries are editorial comparisons, not claims of identical composition unless supported by supplied evidence.
- The website JSON is the source of truth.
- Complete only when all required structures are populated and exact anchors are valid.
The supplied lyrics are user-provided source material for literary, cultural, and technical criticism.
Analyze violent, criminal, sexual, drug-related, or otherwise explicit references descriptively and critically. Do not turn them into instructions, encouragement, operational guidance, or advice.
Quote lyric text only where exact quotation is required for bar analysis, figurative-language anchoring, entendre anchoring, key bars, or hottest bar.
Do not reproduce the complete lyrics or unnecessary contiguous passages. The application preserves and restores the canonical user-supplied lyrics server-side.`;
const LANGUAGE_AUDIT_INSTRUCTIONS = `Perform a SECOND-PASS LANGUAGE DEVICE AUDIT of the entire supplied rap lyrics. This pass exists to catch language devices the general analysis may miss.
A. Figurative language: return every credible metaphor, simile, symbol, personification, and notable imagery. Exact phrase inside exact line. Do not classify a literal statement as a metaphor.
B. Wordplay: return a full bar_analysis entry for every notable wordplay line or contiguous bar. Include "wordplay" in tags. Cover puns, homophones, polysemy, idiom flips, name flips, semantic pivots, sound-based wordplay, syntactic ambiguity, numeric/sports/brand/cultural flips, compound meanings, and setup/payoff punchlines. technical_notes must identify and explain the mechanism. If a bar is merely vivid or metaphorical but not wordplay, do not put it here.
C. Entendres: return only phrases with two or three genuinely distinct readings. Give evidence for each layer and honest confidence. Ordinary puns or references without multiple sustained readings belong under wordplay, not entendres.
Do not paraphrase quote fields. Do not manufacture detections to increase count.
Treat the lyrics as user-provided source material for critical literary analysis. Describe explicit references critically, never as instructions, encouragement, operational guidance, or advice. Quote only the minimal exact text required to anchor a figurative-language, wordplay, or entendre finding; do not reproduce full lyrics or unnecessary contiguous passages.`;

function extractOpenAIText(payload: AnyRecord): string {
  if (typeof payload?.output_text === "string" && payload.output_text) return payload.output_text;
  for (const item of payload?.output ?? []) {
    if (item?.type !== "message") continue;
    for (const content of item?.content ?? []) if (content?.type === "output_text" && typeof content?.text === "string") return content.text;
  }
  return "";
}
function openAIHeaders(): Record<string, string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured in Supabase Edge Function secrets.");
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-Client-Request-Id": crypto.randomUUID(),
  };
}
function openAIRequestBody(userPrompt: string, schemaName: string, schema: AnyRecord, systemPrompt: string, maxOutputTokens: number): AnyRecord {
  const model = Deno.env.get("SONG_SOLILOQUY_MODEL") || DEFAULT_MODEL;
  return {
    model,
    store: false,
    background: true,
    reasoning: { effort: "high" },
    max_output_tokens: maxOutputTokens,
    input: [
      { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
      { role: "user", content: [{ type: "input_text", text: userPrompt }] },
    ],
    text: { format: { type: "json_schema", name: schemaName, strict: true, schema } },
  };
}
async function startOpenAIBackground(userPrompt: string, schemaName: string, schema: AnyRecord, systemPrompt = MASTER_INSTRUCTIONS, maxOutputTokens = 32000): Promise<AnyRecord> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: openAIHeaders(),
    body: JSON.stringify(openAIRequestBody(userPrompt, schemaName, schema, systemPrompt, maxOutputTokens)),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || `OpenAI background start failed with HTTP ${response.status}.`);
  if (typeof payload?.id !== "string" || !payload.id) throw new Error("OpenAI background response did not include a response id.");
  return payload;
}
async function retrieveOpenAIResponse(responseId: string): Promise<AnyRecord> {
  const response = await fetch(`https://api.openai.com/v1/responses/${encodeURIComponent(responseId)}`, {
    method: "GET",
    headers: openAIHeaders(),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || `OpenAI response retrieval failed with HTTP ${response.status}.`);
  return payload;
}
function terminalOpenAIError(payload: AnyRecord, stage: string): string {
  const status = String(payload?.status ?? "unknown");
  const direct = payload?.error?.message;
  if (typeof direct === "string" && direct.trim()) return `${stage} failed: ${direct}`;
  const reason = payload?.incomplete_details?.reason;
  if (typeof reason === "string" && reason.trim()) return `${stage} ended ${status}: ${reason}`;
  return `${stage} ended with OpenAI status ${status}.`;
}
function parseCompletedStructuredOutput(payload: AnyRecord, stage: string): AnyRecord {
  if (payload?.status !== "completed") throw new Error(terminalOpenAIError(payload, stage));
  const text = extractOpenAIText(payload);
  if (!text) throw new Error(`${stage} completed without structured output text.`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${stage} returned output that could not be parsed as JSON.`);
  }
}
function unionByKey(existing: AnyRecord[], incoming: AnyRecord[], keyFn: (x: AnyRecord) => string): AnyRecord[] {
  const map = new Map<string, AnyRecord>();
  for (const item of existing ?? []) map.set(keyFn(item), item);
  for (const item of incoming ?? []) if (!map.has(keyFn(item))) map.set(keyFn(item), item);
  return [...map.values()];
}
function appendUniqueSentence(existing: string, addition: string): string {
  const a = (existing ?? "").trim();
  const b = (addition ?? "").trim();
  if (!b || a.includes(b)) return a;
  return a ? `${a} ${b}` : b;
}
function mergeLanguageAudit(song: AnyRecord, audit: LanguageAudit): AnyRecord {
  const next = structuredClone(song);
  next.figurative_language = unionByKey(Array.isArray(next.figurative_language) ? next.figurative_language : [], Array.isArray(audit?.figurative_language) ? audit.figurative_language : [], (x) => `${x.type}|${x.section}|${x.line}|${x.phrase}`);
  next.entendres = unionByKey(Array.isArray(next.entendres) ? next.entendres : [], Array.isArray(audit?.entendres) ? audit.entendres : [], (x) => `${x.type}|${x.section}|${x.line}|${x.phrase}`);
  const bars = Array.isArray(next.bar_analysis) ? [...next.bar_analysis] : [];
  for (const auditBar of Array.isArray(audit?.wordplay_bar_analysis) ? audit.wordplay_bar_analysis : []) {
    const idx = bars.findIndex((b: AnyRecord) => b?.bar === auditBar?.bar);
    if (idx < 0) {
      const tags = Array.from(new Set([...(auditBar.tags ?? []), "wordplay"]));
      bars.push({ ...auditBar, tags });
      continue;
    }
    const current = bars[idx];
    bars[idx] = {
      ...current,
      technical_notes: appendUniqueSentence(current.technical_notes, auditBar.technical_notes),
      tags: Array.from(new Set([...(current.tags ?? []), ...(auditBar.tags ?? []), "wordplay"])),
      bar_type: Array.from(new Set([...(current.bar_type ?? []), ...(auditBar.bar_type ?? [])])),
      pop_culture_references: Array.from(new Set([...(current.pop_culture_references ?? []), ...(auditBar.pop_culture_references ?? [])])),
      themes: Array.from(new Set([...(current.themes ?? []), ...(auditBar.themes ?? [])])),
    };
  }
  next.bar_analysis = bars;
  return next;
}
function protectedMerge(existing: AnyRecord, generated: AnyRecord, lyrics: LyricSection[]): AnyRecord {
  const protectedFields = ["song_context", "bar_analysis", "key_bars", "hottest_bar", "raw_notes", "notebooklm_source_pack", "notebooklm_questions", "youtube_ready_angle", "seo", "similar_songs"];
  const next: AnyRecord = { ...generated, schema_version: SCHEMA_VERSION, lyrics };
  next.metadata = mergeNonEmpty(generated?.metadata ?? {}, existing?.metadata ?? {});
  for (const field of protectedFields) if (nonEmpty(existing?.[field])) next[field] = existing[field];
  if (Array.isArray(existing?.figurative_language) && existing.figurative_language.length) next.figurative_language = existing.figurative_language;
  if (Array.isArray(existing?.entendres) && existing.entendres.length) next.entendres = existing.entendres;
  return next;
}
function languageAuditPrompt(lyrics: LyricSection[]): string {
  return `Audit these CANONICAL USER-SUPPLIED LYRICS line by line. Return all credible figurative-language detections, all notable wordplay bars, and only genuine double/triple entendres.\n\nLYRICS:\n${JSON.stringify(lyrics)}`;
}
function generalPrompt(mode: string, existing: AnyRecord, metadata: AnyRecord, lyrics: LyricSection[]): string {
  return mode === "complete"
    ? `COMPLETE MODE. Existing Song Soliloquy analysis is authoritative. Preserve populated existing fields, but add missing language-device detections and technical wordplay explanation when the dedicated audit finds omissions. Do not delete existing analysis.\n\nEXISTING ANALYSIS:\n${JSON.stringify(existing)}\n\nCANONICAL USER-SUPPLIED LYRICS:\n${JSON.stringify(lyrics)}\n\nReturn only the analysis fields defined by the supplied structured-output schema. Do not output lyrics, schema_version, export_status, or missing_required_fields. The backend restores those canonical fields.`
    : `FULL MODE. Perform the complete Song Soliloquy Master Spec workflow. In addition to the general analysis, conduct an explicit whole-lyrics sweep for figurative language, wordplay, and entendres. Every notable wordplay line must appear in bar_analysis tagged wordplay with its mechanism explained in technical_notes.\n\nSUPPLIED METADATA:\n${JSON.stringify(metadata)}\n\nCANONICAL USER-SUPPLIED LYRICS:\n${JSON.stringify(lyrics)}\n\nReturn only the analysis fields defined by the supplied structured-output schema. Do not output lyrics, schema_version, export_status, or missing_required_fields. The backend restores those canonical fields.`;
}
function normalizeResponseId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^resp_[A-Za-z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return respond({ ok: false, error: "Method not allowed" }, 405);
  if (!isAuthorized(req)) return respond({ ok: false, error: "Unauthorized" }, 401);

  let body: AnyRecord;
  try {
    body = await req.json();
  } catch {
    return respond({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const mode = String(body?.mode ?? "health").toLowerCase();
  const model = Deno.env.get("SONG_SOLILOQUY_MODEL") || DEFAULT_MODEL;

  if (mode === "health") {
    return respond({
      ok: true,
      engine_version: ENGINE_VERSION,
      schema_version: SCHEMA_VERSION,
      model,
      openai_configured: Boolean(Deno.env.get("OPENAI_API_KEY")),
      language_audit: true,
      async_background: true,
      enforced_detection: ["figurative_language", "wordplay", "entendres"],
      modes: ["full", "complete", "validate", "status"],
    });
  }

  const existing = body?.existing_analysis && typeof body.existing_analysis === "object" ? body.existing_analysis : {};
  const lyrics = normalizeLyrics(body?.lyrics ?? existing?.lyrics);

  if (mode === "validate") {
    if (!lyrics.length) return respond({ ok: false, error: "Lyrics are required for this mode." }, 400);
    if (lyricsCharCount(lyrics) > MAX_LYRIC_CHARS) return respond({ ok: false, error: `Lyrics exceed ${MAX_LYRIC_CHARS} characters.` }, 413);
    const candidate = { ...existing, lyrics, schema_version: SCHEMA_VERSION };
    const first = validateSong(candidate);
    const song = finalizeStatus(candidate, first);
    const validation = validateSong(song);
    return respond({ ok: validation.valid, mode, engine_version: ENGINE_VERSION, model: null, song, validation });
  }

  if (mode === "status") {
    const analysisMode = String(body?.analysis_mode ?? body?.original_mode ?? "full").toLowerCase();
    if (analysisMode !== "full" && analysisMode !== "complete") return respond({ ok: false, error: "analysis_mode must be full or complete" }, 400);
    if (!lyrics.length) return respond({ ok: false, error: "Lyrics are required for status finalization." }, 400);
    if (lyricsCharCount(lyrics) > MAX_LYRIC_CHARS) return respond({ ok: false, error: `Lyrics exceed ${MAX_LYRIC_CHARS} characters.` }, 413);

    const generalId = normalizeResponseId(body?.job?.general_response_id ?? body?.general_response_id);
    const auditId = normalizeResponseId(body?.job?.language_audit_response_id ?? body?.language_audit_response_id);
    if (!generalId || !auditId) return respond({ ok: false, error: "Valid general_response_id and language_audit_response_id are required." }, 400);

    try {
      const [generalState, auditState] = await Promise.all([
        retrieveOpenAIResponse(generalId),
        retrieveOpenAIResponse(auditId),
      ]);
      const generalStatus = String(generalState?.status ?? "unknown");
      const auditStatus = String(auditState?.status ?? "unknown");
      const pendingStatuses = new Set(["queued", "in_progress"]);

      if (pendingStatuses.has(generalStatus) || pendingStatuses.has(auditStatus)) {
        return respond({
          ok: true,
          pending: true,
          mode: analysisMode,
          engine_version: ENGINE_VERSION,
          model,
          job: { general_response_id: generalId, language_audit_response_id: auditId },
          stages: { general_analysis: generalStatus, language_audit: auditStatus },
        }, 202);
      }

      if (generalStatus !== "completed") {
        return respond({
          ok: false,
          pending: false,
          mode: analysisMode,
          engine_version: ENGINE_VERSION,
          model,
          stage: "general_analysis",
          openai_status: generalStatus,
          error: terminalOpenAIError(generalState, "General analysis"),
        }, 502);
      }
      if (auditStatus !== "completed") {
        return respond({
          ok: false,
          pending: false,
          mode: analysisMode,
          engine_version: ENGINE_VERSION,
          model,
          stage: "language_audit",
          openai_status: auditStatus,
          error: terminalOpenAIError(auditState, "Language audit"),
        }, 502);
      }

      const generated = parseCompletedStructuredOutput(generalState, "General analysis");
      const audit = parseCompletedStructuredOutput(auditState, "Language audit") as LanguageAudit;
      const metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : {};
      let song: AnyRecord = analysisMode === "complete"
        ? protectedMerge(existing, generated, lyrics)
        : { ...generated, schema_version: SCHEMA_VERSION, lyrics, metadata: mergeNonEmpty(generated?.metadata ?? {}, metadata) };

      song = mergeLanguageAudit(song, audit);
      const firstValidation = validateSong(song);
      song = finalizeStatus(song, firstValidation);
      const validation = validateSong(song);

      return respond({
        ok: validation.valid,
        pending: false,
        mode: analysisMode,
        engine_version: ENGINE_VERSION,
        model,
        song,
        validation,
        language_audit: {
          figurative_language_detected: audit.figurative_language?.length ?? 0,
          wordplay_bars_detected: audit.wordplay_bar_analysis?.length ?? 0,
          entendres_detected: audit.entendres?.length ?? 0,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown status error";
      return respond({ ok: false, pending: false, mode: analysisMode, engine_version: ENGINE_VERSION, model, error: message }, 502);
    }
  }

  if (mode !== "full" && mode !== "complete") return respond({ ok: false, error: "mode must be one of: health, full, complete, validate, status" }, 400);
  if (!lyrics.length) return respond({ ok: false, error: "Lyrics are required for this mode." }, 400);
  if (lyricsCharCount(lyrics) > MAX_LYRIC_CHARS) return respond({ ok: false, error: `Lyrics exceed ${MAX_LYRIC_CHARS} characters.` }, 413);
  if (!Deno.env.get("OPENAI_API_KEY")) return respond({ ok: false, error: "Analysis engine is deployed but OPENAI_API_KEY is not configured in Supabase Edge Function secrets.", engine_version: ENGINE_VERSION }, 503);

  const metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : {};
  try {
    const [generalStart, auditStart] = await Promise.all([
      startOpenAIBackground(generalPrompt(mode, existing, metadata, lyrics), "song_soliloquy_v1_1", MODEL_GENERATION_SCHEMA, MASTER_INSTRUCTIONS, 32000),
      startOpenAIBackground(languageAuditPrompt(lyrics), "song_soliloquy_language_audit", LANGUAGE_AUDIT_SCHEMA, LANGUAGE_AUDIT_INSTRUCTIONS, 22000),
    ]);

    return respond({
      ok: true,
      pending: true,
      mode,
      engine_version: ENGINE_VERSION,
      model,
      job: {
        general_response_id: generalStart.id,
        language_audit_response_id: auditStart.id,
      },
      stages: {
        general_analysis: String(generalStart.status ?? "queued"),
        language_audit: String(auditStart.status ?? "queued"),
      },
    }, 202);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown analysis start error";
    return respond({ ok: false, pending: false, mode, engine_version: ENGINE_VERSION, model, error: message }, 502);
  }
});

