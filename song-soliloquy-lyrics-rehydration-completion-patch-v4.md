# Song Soliloquy Patch v4.0
## Lyrics Rehydration + Analysis Completion

**Patch type:** Import completion / lyrics rehydration / analysis integrity  
**Applies to:** Figma Make / Builder implementation of the Song Soliloquy engine, especially the existing **Import a Breakdown** dialog and JSON import workflow.  
**Do not modify:** Approved visual design, existing bar-analysis content, key bars, hottest bar, raw notes, NotebookLM pack, YouTube angle, SEO, related-song data, routing, OBS, motion, theme system, or unrelated application architecture.

---

## 1. Problem

Some Song Soliloquy JSON files may contain a complete or near-complete analysis but omit the full lyrics. This can happen because the breakdown was generated while lyric reproduction was restricted even though the analysis itself was already completed.

The site must not discard, overwrite, or regenerate the existing analysis simply because the lyric payload is absent.

The correct behavior is:

```text
EXISTING ANALYSIS = AUTHORITATIVE
USER-SUPPLIED LYRICS = MISSING SOURCE EVIDENCE
SITE = REHYDRATE + VALIDATE + COMPLETE ONLY WHAT DEPENDS ON LYRICS
```

---

## 2. Core Preservation Rule

When a partial Song Soliloquy JSON is imported:

### NEVER overwrite these existing fields merely because lyrics are missing:

- metadata
- song_context
- bar_analysis
- key_bars
- hottest_bar
- raw_notes
- notebooklm_source_pack
- notebooklm_questions
- youtube_ready_angle
- seo
- similar_songs

If those structures are already populated, preserve them byte-for-byte at the object/string level unless a later validation step proves a quoted lyric anchor does not exist in the newly supplied lyrics.

The site is completing the record, not re-authoring it.

---

## 3. Import Behavior

In the existing **Import a Breakdown** dialog:

1. Parse the uploaded JSON.
2. Inspect `lyrics`.
3. If `lyrics` is populated and usable, continue normal import.
4. If `lyrics` is missing, empty, malformed, or explicitly listed in `missing_required_fields`, show a **Complete Breakdown — Add Lyrics** step in the same dialog.
5. Let the user:
   - paste lyrics into a large textarea, or
   - upload a `.txt` / `.md` text file.
6. Parse the supplied text into the canonical lyrics array.
7. Merge that lyrics array into the existing Song Soliloquy JSON.
8. Run the **lyrics-dependent completion pass** described below.
9. Recalculate `missing_required_fields`.
10. Set `export_status` to `complete` only if every required field is now valid.

Do not ask for lyrics when usable lyrics already exist in the JSON.

---

## 4. Lyrics Parsing

Implement:

```ts
type LyricSection = {
  section: string;
  lines: string[];
};

function parseLyricsText(input: string): LyricSection[]
```

Recognize section headers including:

- `[Intro]`
- `[Verse]`
- `[Verse 1]`
- `[Verse 2]`
- `[Chorus]`
- `[Hook]`
- `[Bridge]`
- `[Outro]`
- `[Pre-Chorus]`
- `[Refrain]`
- `[Interlude]`

Preserve lyric lines exactly as pasted except for removing empty leading/trailing lines around sections.

Do not normalize apostrophes, punctuation, capitalization, slang spelling, censored spellings, or parenthetical ad-libs inside actual lyric lines.

If no section header exists, store the text as:

```json
[
  {
    "section": "Lyrics",
    "lines": ["..."]
  }
]
```

---

## 5. Lyrics-Dependent Completion Pass

Add:

```ts
function completeBreakdownWithLyrics(
  existing: SongSoliloquy,
  suppliedLyricsText: string
): CompletionResult
```

The completion pass has five jobs only.

### Job A — Insert canonical lyrics

Set:

```ts
next.lyrics = parseLyricsText(suppliedLyricsText)
```

Remove `lyrics` from `missing_required_fields` if parsing succeeds.

### Job B — Validate existing quoted analysis against supplied lyrics

For every existing:

- `bar_analysis[].bar`
- `key_bars[].bar`
- `hottest_bar.bar`
- `figurative_language[].line`
- `figurative_language[].phrase`
- `entendres[].line`
- `entendres[].phrase`

check exact character-level presence.

Rules:

```text
phrase must exist inside line
line must exist inside stored lyrics
bar must exist inside stored lyrics
```

Do not delete an existing analysis entry merely because validation fails.

Instead attach an import/completion warning such as:

```text
Existing bar analysis could not be exactly anchored to supplied lyrics. Review quote text; explanatory analysis was preserved.
```

### Job C — Complete missing lyrics-dependent annotation fields

If the existing JSON has missing or empty:

- `figurative_language`
- `entendres`

then the site may run an analysis-completion request using the newly supplied lyrics and existing analysis as context.

The request must be **narrowly scoped** to missing lyrics-dependent fields.

Do not ask the model to regenerate the full breakdown.

If these arrays are already populated, preserve them and validate anchors first.

### Job D — Repair anchors without changing analysis meaning

If an existing figurative-language or entendre detection clearly refers to a lyric line but its stored quote is slightly paraphrased, the completion engine may re-anchor the entry to the exact user-supplied line **only when the match is unambiguous**.

Allowed repair:

```text
existing explanatory meaning stays the same
phrase/line fields are replaced with exact lyric text
```

Do not invent a new interpretation during anchor repair.

If the match is ambiguous, preserve the original entry and flag it for review.

### Job E — Recalculate completion status

After lyrics insertion and validation:

```ts
const required = [
  "metadata",
  "lyrics",
  "figurative_language",
  "entendres",
  "bar_analysis",
  "key_bars",
  "hottest_bar",
  "raw_notes",
  "notebooklm_source_pack",
  "notebooklm_questions",
  "youtube_ready_angle",
  "seo",
  "similar_songs"
];
```

Recompute `missing_required_fields` from actual content.

If none are missing:

```ts
next.export_status = "complete";
next.missing_required_fields = [];
```

Otherwise:

```ts
next.export_status = "incomplete";
next.missing_required_fields = [...actualMissing];
```

---

## 6. Critical Rule: Bar Analysis Must Survive

The site must treat existing bar analysis as independent editorial work.

Bad behavior:

```ts
if (!song.lyrics.length) {
  song.bar_analysis = [];
}
```

Bad behavior:

```ts
const regenerated = await regenerateWholeBreakdown(lyrics);
return regenerated;
```

Required behavior:

```ts
const next = structuredClone(existing);
next.lyrics = parseLyricsText(suppliedLyricsText);
validateExistingBars(next);
completeOnlyMissingLyricDependentFields(next);
return next;
```

The bar explanation is not invalid simply because the original export omitted the lyric array.

Only the exact quote anchoring needs verification once lyrics are supplied.

---

## 7. Model Completion Request Contract

If the site has access to an analysis model/API, use a narrowly scoped prompt/request resembling this contract:

```text
You are completing an existing Song Soliloquy JSON record.

The existing analysis is authoritative and must be preserved.
Do NOT rewrite or regenerate existing bar_analysis, key_bars, hottest_bar,
raw_notes, NotebookLM fields, YouTube fields, SEO, metadata, or similar_songs.

The user has now supplied the full lyrics.

Tasks:
1. Organize the supplied lyrics into the canonical lyrics array.
2. Validate existing bar/key/hottest-bar quotes against the lyrics.
3. Populate figurative_language only if it is missing or incomplete.
4. Populate entendres only if it is missing or incomplete.
5. Ensure every figurative-language and entendre phrase is verbatim inside its line,
   and every line is verbatim inside lyrics.
6. Preserve all existing explanatory analysis wherever possible.
7. Return the updated Song Soliloquy JSON only.
8. Recalculate export_status and missing_required_fields truthfully.

Never manufacture new full-song analysis when existing analysis is already present.
```

If the existing JSON already has figurative-language and entendre arrays, prefer local validation/re-anchoring over an AI call.

---

## 8. Recommended Types

```ts
type CompletionWarning = {
  code:
    | "BAR_NOT_ANCHORED"
    | "KEY_BAR_NOT_ANCHORED"
    | "HOTTEST_BAR_NOT_ANCHORED"
    | "FIGURATIVE_LINE_NOT_ANCHORED"
    | "FIGURATIVE_PHRASE_NOT_ANCHORED"
    | "ENTENDRE_LINE_NOT_ANCHORED"
    | "ENTENDRE_PHRASE_NOT_ANCHORED"
    | "AMBIGUOUS_ANCHOR_REPAIR"
    | "MISSING_REQUIRED_FIELD";
  message: string;
  path?: string;
};

type CompletionResult = {
  song: SongSoliloquy;
  warnings: CompletionWarning[];
  repairedAnchors: number;
  preservedBarAnalysisCount: number;
  completedFields: string[];
};
```

---

## 9. Exact-Presence Helpers

```ts
function allLyricLines(song: SongSoliloquy): string[] {
  return song.lyrics.flatMap(section => section.lines);
}

function hasExactLyricLine(song: SongSoliloquy, text: string): boolean {
  return allLyricLines(song).includes(text);
}

function lyricText(song: SongSoliloquy): string {
  return allLyricLines(song).join("\n");
}

function validatePhraseLine(phrase: string, line: string): boolean {
  return Boolean(phrase && line && line.includes(phrase));
}
```

For `bar_analysis[].bar`, `key_bars[].bar`, and `hottest_bar.bar`, permit either:

1. exact line match, or
2. exact contiguous text contained across the joined canonical lyrics,

because some analyzed bars may contain two adjacent lyric lines.

Do not use fuzzy matching to silently approve an anchor.

Fuzzy matching may only be used to propose a repair for user/admin review or for an unambiguous automatic repair with a warning log.

---

## 10. Preserve-First Merge

Use a merge strategy like:

```ts
function mergeLyricsIntoExistingBreakdown(
  existing: SongSoliloquy,
  lyrics: LyricSection[]
): SongSoliloquy {
  return {
    ...existing,
    lyrics,
    missing_required_fields: (existing.missing_required_fields ?? [])
      .filter(field => field !== "lyrics")
  };
}
```

Never use a default/template object spread after the existing record because it may overwrite completed analysis.

Bad:

```ts
return {
  ...existing,
  ...EMPTY_TEMPLATE,
  lyrics
};
```

Good:

```ts
return {
  ...existing,
  lyrics
};
```

---

## 11. Import Dialog States

### State A — Complete JSON

```text
Breakdown detected
Analysis: Found
Lyrics: Found
Status: Ready to import

[Import Breakdown]
```

### State B — Analysis present, lyrics missing

```text
Breakdown detected
Analysis: Found
Lyrics: Missing

Complete Breakdown — Add Lyrics
Paste the full lyrics or upload a text file.
Existing analysis will be preserved.

[Paste textarea]
[Upload Lyrics]

[Add Lyrics & Complete Breakdown]
```

### State C — Lyrics added, validation warnings

```text
Lyrics added successfully.
Existing analysis preserved.

3 quote anchors need review.
The breakdown can remain imported as incomplete until they are corrected.

[Review Warnings]
[Import as Incomplete]
```

### State D — Completed

```text
Breakdown completed.
Lyrics added.
Existing bar analysis preserved.
All lyric anchors validated.
Status: Complete

[Import Breakdown]
```

---

## 12. Do Not Couple Copyright/Source Restrictions to Existing Analysis

The application should distinguish between:

```text
A) generating/reproducing lyric text
B) storing lyric text explicitly supplied by the user
C) preserving or generating analysis about lyric text
```

For this workflow, the user supplies the lyric source directly to the site.

Therefore, the site's completion engine should treat those lyrics as input evidence for the user's record and use them to complete the structured analysis data.

Do not automatically erase or suppress existing bar analysis because the exported JSON did not originally contain lyrics.

---

## 13. Acceptance Tests

### Test 1 — Existing full analysis, no lyrics

Given:

```text
lyrics = []
bar_analysis = 18 populated entries
key_bars = 7 entries
hottest_bar = populated
figurative_language = populated
entendres = populated
export_status = incomplete
missing_required_fields = ["lyrics"]
```

When the user pastes valid lyrics:

Expected:

```text
lyrics populated
18 bar_analysis entries preserved
7 key_bars preserved
hottest_bar preserved
figurative_language preserved and validated
entendres preserved and validated
missing_required_fields = []
export_status = complete
```

### Test 2 — Analysis present, lyrics + figurative detections missing

Expected:

```text
preserve bar analysis
insert lyrics
run only figurative-language detection
validate everything
complete if no other fields missing
```

### Test 3 — Existing quoted bar differs from pasted lyric

Expected:

```text
keep explanatory bar analysis
flag BAR_NOT_ANCHORED
attempt exact/unambiguous anchor repair
never discard entire bar_analysis object
```

### Test 4 — Complete JSON already has lyrics

Expected:

```text
no lyrics prompt
no analysis regeneration
normal import
```

### Test 5 — User adds lyrics but another field is missing

Expected:

```text
lyrics accepted
remove lyrics from missing_required_fields
keep export_status = incomplete
show remaining missing field(s)
```

---

## 14. Definition of Done

The patch is complete when:

- the Import a Breakdown dialog detects missing lyrics;
- the user can paste/upload lyrics;
- lyrics are stored inside the same canonical JSON record;
- existing bar analysis is preserved;
- existing key bars/hottest bar are preserved;
- exact lyric anchors are validated;
- missing figurative/entendre data can be completed without regenerating the whole analysis;
- export status is recalculated from actual required fields;
- the final downloadable/saved JSON contains both the original analysis and the newly supplied lyrics;
- no demo/default content is introduced;
- no existing analysis is silently lost.

---

## 15. Figma Make / Builder Instruction

Paste the following into Figma Make / Builder:

```text
PATCH THE EXISTING SONG SOLILOQUY IMPORT WORKFLOW.

Do not redesign the approved interface.
Do not rebuild the song analysis.
Do not overwrite existing bar analysis.

The existing Import a Breakdown dialog must detect whether an imported Song Soliloquy JSON contains usable lyrics.

If lyrics already exist, import normally.

If lyrics are missing, empty, malformed, or listed in missing_required_fields, expand the same dialog with a Complete Breakdown — Add Lyrics step. Allow the user to paste full lyrics into a textarea or upload a TXT/MD file.

Parse section labels such as [Intro], [Verse], [Verse 1], [Chorus], [Hook], [Bridge], [Outro], [Pre-Chorus], [Refrain], and [Interlude]. Preserve the exact user-supplied lyric wording.

Merge the parsed lyrics into the EXISTING JSON RECORD.

PRESERVE all populated existing fields, especially:
metadata, song_context, bar_analysis, key_bars, hottest_bar, raw_notes, notebooklm_source_pack, notebooklm_questions, youtube_ready_angle, seo, and similar_songs.

Do not regenerate those fields just because lyrics were missing.

After lyrics are added, run a lyrics-dependent completion pass:
- validate every existing bar_analysis.bar against the supplied lyrics;
- validate every key_bars.bar against lyrics;
- validate hottest_bar.bar against lyrics;
- validate figurative_language phrase inside line and line inside lyrics;
- validate entendres phrase inside line and line inside lyrics;
- preserve explanatory analysis when an anchor fails and show a warning instead of deleting it;
- repair quote anchors only when the exact matching lyric is unambiguous;
- if figurative_language or entendres are missing, complete ONLY those missing lyrics-dependent fields using the supplied lyrics and existing analysis as context;
- do not regenerate the entire breakdown;
- recalculate missing_required_fields from the actual JSON;
- set export_status to complete only when all required fields are populated and validated.

Add completion warnings for unresolved quote anchors.

The completed/saved/downloaded JSON must contain the newly supplied lyrics plus all previously existing analysis.

Primary principle:
EXISTING ANALYSIS IS AUTHORITATIVE.
USER-SUPPLIED LYRICS REHYDRATE THE RECORD.
THE SITE COMPLETES ONLY WHAT THE LYRICS MAKE POSSIBLE TO VALIDATE OR FILL.
```
