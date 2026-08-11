# SONG_SOLILOQUY_MASTER_SPEC_V5

This is the governing specification for the Song Soliloquy analysis engine. If other project documentation conflicts with this document, this document wins.

## Part A — readable analysis

### 1. Song Context
- Artist
- Song
- Featured artists
- Producer
- Project/Album
- Release date
- BPM if identifiable/provided
- Overall mood
- Main themes
- Narrative perspective

### 2. Comprehensive Bar Analysis

For each important bar/section use exactly these analytical fields:

**BAR** — verbatim quoted lyric evidence.

**BREAKDOWN** — plain meaning.

**DEEPER READ** — layered meaning, symbolism, subtext, philosophy.

**TECHNICAL NOTES** — rhyme scheme, cadence, alliteration, punchline setup, entendre, metaphor, imagery, references.

**WHY IT HITS** — emotional, intellectual, stylistic, and song-level significance.

### 3. Metaphor & Entendre Detection

Perform a dedicated sweep of the **entire lyrics**, not only bars selected for Section 2.

#### 3a. Figurative language

For every metaphor, simile, symbol, personification, and notable imagery record:

- TYPE
- PHRASE — exact words from lyric line
- LINE — full exact lyric line
- SECTION
- MEANING
- WHY IT WORKS

#### 3b. Entendres

For every credible double or triple entendre record:

- TYPE (`double_entendre` / `triple_entendre`)
- PHRASE
- LINE
- SECTION
- CONFIDENCE (`high` / `medium` / `low`)
- LAYERS with meaning and evidence for each reading

Never force an entendre. Confidence honesty matters more than count.

#### Anchoring rule

`PHRASE` must occur character-for-character inside `LINE`, and `LINE` must occur character-for-character inside the lyrics stored in the JSON. Never paraphrase an annotation anchor.

### 4. Raw Notes

Include first impressions, major themes, possible title ideas, recurring motifs, best discussion points, strongest quotables, questions raised, visual ideas, B-roll ideas, and related songs/artists/themes.

### 5. Key Bars Detection

Select 5–10 key bars. For each include quoted bar, why important, represented theme, and classifications drawn from emotional, technical, philosophical, street wisdom, punchline, narrative, and cultural reference.

### 6. Hottest Bar Detection

Select exactly one hottest bar based on wordplay, originality, emotional weight, quotability, delivery potential, layered meaning, and representation of the song.

Include:

- bar
- why it wins
- surface meaning
- hidden meaning
- technical craft
- viewer reaction potential
- YouTube discussion value
- heat score from 1–100

### 7. NotebookLM Source Pack

Include song metadata, themes, narrator profile, bar-analysis summary, key bars, hottest bar, vocabulary/glossary, cultural references, metaphor/entendre highlights, comparison points, and discussion prompts.

### 8. NotebookLM Questions

Generate questions that produce substantive discussion of message, worldview, pain/ambition/morality, hottest bar, layered language, metaphors, production, and comparable songs.

### 9. YouTube-Ready Angle

Include best YouTube title, hook/opening line, main thesis, three strongest talking points, best opening quote, best ending quote, and suggested thumbnail text.

### 10. Website Metadata

Include SEO title, meta description under 160 characters, lowercase-hyphenated URL slug, tags, and similar-song comparison points.

---

## Part B — JSON download contract

Produce one canonical JSON object per song using schema version `song-soliloquy/v1.1`.

Filename convention:

`{artist}-{song-title}-song-soliloquy.json`

### Non-negotiable rules

1. JSON is the master upload file and source of truth.
2. Full user-provided lyrics are stored in `lyrics`, sectioned and verbatim.
3. Never replace lyrics with a summary or placeholder.
4. Part A and JSON must agree on bars, detections, key bars, hottest bar/score, notes, NotebookLM material, YouTube angle, SEO, and comparisons.
5. Figurative-language and entendre anchors obey `phrase ∈ line ∈ lyrics` at character level.
6. `export_status` is `complete` only when every required structure is populated. Genuine absence of a detection type may be represented by an explicit empty array.
7. If required data is missing, use `incomplete` and list missing field names in `missing_required_fields`.
8. Escape quotation marks and emit valid JSON.

### Required top-level structures

- `schema_version`
- `export_status`
- `missing_required_fields`
- `metadata`
- `lyrics`
- `song_context`
- `figurative_language`
- `entendres`
- `bar_analysis`
- `key_bars`
- `hottest_bar`
- `raw_notes`
- `notebooklm_source_pack`
- `notebooklm_questions`
- `youtube_ready_angle`
- `seo`
- `similar_songs`

See [`song-soliloquy.schema.json`](song-soliloquy.schema.json) for the machine-readable representation.

## Self-check

Before treating an export as complete verify:

- JSON parses;
- complete supplied lyrics are present;
- whole-lyrics figurative pass is complete;
- whole-lyrics entendre pass is complete;
- all anchors resolve exactly;
- bar analyses agree with readable output;
- 5–10 key bars agree with readable output;
- hottest bar and score agree;
- NotebookLM source pack/questions are populated;
- YouTube angle is populated;
- SEO is populated;
- similar songs are populated;
- export status is truthful.

## Core rules

- The JSON is the source of truth; the website does not regenerate missing analysis.
- Never omit supplied lyrics from a complete export.
- Never paraphrase annotation `phrase` or `line` values.
- Never force an entendre.
- One canonical JSON export per song breakdown.
