# Song Soliloquy — Overall Project Architecture

## 1. Mission

Song Soliloquy is a rap-song intelligence and storytelling platform. Its purpose is to preserve the exact lyrical evidence supplied for analysis, interpret that evidence at bar level and song level, enrich it with musicological and cultural research, and transform the result into structured data that can support multiple publishing formats.

The project has three simultaneous identities:

- **Analysis methodology:** a repeatable editorial framework for serious rap criticism.
- **Data product:** a normalized JSON corpus of songs, bars, references, figurative devices, themes, and cross-song relationships.
- **Media engine:** a source system for website pages, NotebookLM conversations, YouTube videos, and private-platform programming.

## 2. System model

```text
SOURCE MATERIAL
  lyrics + metadata + audio/music research
          |
          v
RESEARCH NORMALIZATION
  provenance + confidence + sectioning
          |
          v
SONG SOLILOQUY ANALYSIS ENGINE
  context
  bar analysis
  whole-lyrics figurative sweep
  whole-lyrics entendre sweep
  key bars
  hottest bar
  raw notes
          |
          v
CANONICAL JSON — song-soliloquy/v1.1
          |
   +------+------+----------------+
   |             |                |
   v             v                v
WEBSITE      NOTEBOOKLM        YOUTUBE / VIDEO
renderer     source pack       script & visuals
   |
   v
CATALOG / KNOWLEDGE GRAPH
related songs + references + rankings + discovery
```

## 3. Input layer

### 3.1 Primary evidence

The lyric text supplied for analysis is the textual evidence base. Section labels and lyric lines should be preserved exactly in the canonical JSON so annotations can anchor against them.

### 3.2 Song metadata

Core metadata includes artist, song/title, featured artists, producer, project/album, release date, BPM when available, slugs, mood, themes, and narrative perspective.

### 3.3 Music-analysis enrichment

The project vision includes specialized tools for dimensions that lyric text alone cannot establish:

- tempo/BPM and key cross-checking;
- chord/harmonic progression;
- samples and sample lineage;
- mood/audio descriptors;
- song structure;
- production characteristics.

The system should preserve source provenance because different services may disagree.

### 3.4 Cultural/reference enrichment

References may include sports, film, television, literature, religion, history, street culture, brands, geography, music history, artists, public figures, and events. The analysis should distinguish a confirmed reference from a plausible interpretive connection.

## 4. Analysis engine

### 4.1 Song Context

Establishes the record's identity, mood, themes, and narrator perspective before microscopic analysis begins.

### 4.2 Comprehensive Bar Analysis

Important bars receive five explicit analytical lenses: quoted bar, plain-language breakdown, deeper read, technical notes, and why it hits. This creates editorial depth while keeping interpretation auditable against the lyric evidence.

### 4.3 Whole-lyrics detection pass

This is structurally different from selected-bar commentary. Every lyric line is swept for figurative language and entendres so the website can highlight exact phrases. Detection entries therefore behave like annotations, not prose notes.

### 4.4 Raw Notes

The exploratory layer: first impressions, motifs, questions, title concepts, visual concepts, B-roll, strongest discussion points, and comparison candidates. This intentionally preserves creative possibilities that may not belong in formal analysis.

### 4.5 Key Bars

Five to ten bars are promoted as representative evidence and classified by function: emotional, technical, philosophical, street wisdom, punchline, narrative, and/or cultural reference.

### 4.6 Hottest Bar

One bar is selected and scored 1–100. This creates both an editorial conclusion and a normalized field that can support catalog-level ranking or Bar of the Day features.

### 4.7 NotebookLM transformation

The analysis is reformatted into a discussion-ready source pack and a set of questions. The intended model is: lyrics = evidence; analysis = intelligence; source pack/questions = conversational scaffolding.

### 4.8 YouTube transformation

The analysis produces a title, opening hook, thesis, three strongest talking points, opening/closing quotations, and thumbnail text. A full production script can be derived later without replacing the canonical analysis.

### 4.9 Website metadata

Each record receives SEO title, sub-160-character description, canonical-style slug, tags, and related-song comparison points.

## 5. Canonical data contract

The current schema is `song-soliloquy/v1.1`.

The JSON contains:

- schema/export state;
- metadata;
- sectioned lyrics;
- song context;
- figurative-language annotations;
- entendre annotations;
- bar analyses;
- key bars;
- hottest bar + score;
- raw notes;
- NotebookLM source pack;
- NotebookLM questions;
- YouTube-ready angle;
- SEO;
- similar songs.

The JSON is deliberately richer than a website view model. Presentation layers should select from it rather than mutate or invent its analytical content.

## 6. Annotation integrity

The website's inline highlighting creates a strict referential-integrity requirement:

```text
phrase ∈ line ∈ lyrics
```

This is character-level containment, not semantic equivalence. Normalizing apostrophes, punctuation, capitalization, spacing, or wording inside annotation anchors can break highlighting.

Recommended validator invariants:

1. Every `figurative_language[].phrase` occurs in its `line`.
2. Every `figurative_language[].line` occurs in the named lyric section.
3. Every `entendres[].phrase` occurs in its `line`.
4. Every `entendres[].line` occurs in the named lyric section.
5. `hottest_bar.bar` is present in lyrics.
6. Every `key_bars[].bar` is present in lyrics.
7. `export_status=complete` implies all required top-level structures are populated.
8. SEO description length is <= 160 characters.
9. Slugs are lowercase/hyphenated.

## 7. Cross-song knowledge graph

A defining feature of the wider project is comparison. Related songs should eventually be represented as typed edges rather than only free text.

Potential relationship types:

```text
SAME_SAMPLE
SAMPLE_LINEAGE
SIMILAR_BPM
SIMILAR_KEY
SIMILAR_CHORD_PROGRESSION
SIMILAR_PRODUCTION_TEXTURE
SHARED_POP_CULTURE_REFERENCE
SHARED_WORDPLAY_PATTERN
SHARED_THEME
SHARED_NARRATIVE_MODE
SHARED_RHYME_TECHNIQUE
ARTIST_LINEAGE
SCENE_LINEAGE
```

A relationship should eventually carry evidence, source/provenance, confidence, and an explanation suitable for viewers.

## 8. Website architecture

The website is a renderer and discovery interface, not a second analysis engine. Major surfaces can include:

- song analysis page;
- lyrics + anchored annotations;
- bar analysis cards;
- key bars;
- hottest bar + heat score;
- themes and references;
- related songs;
- artist pages;
- producer pages;
- reference/topic pages;
- Bar of the Day ballot/ranking;
- search/filter by technique, theme, BPM, producer, sample, etc.

Import should validate the canonical JSON and reject or clearly flag integrity failures rather than silently fabricating missing content.

## 9. NotebookLM architecture

For a high-quality Audio Overview/discussion workflow, organize material into separable conceptual layers:

1. **Lyrics/evidence** — exact source text available to the project.
2. **Canonical analysis** — the primary interpretive source.
3. **Source pack** — compressed metadata, themes, narrator profile, references, glossary, key/hottest bars, and comparisons.
4. **Questions/prompts** — discussion agenda.
5. **Optional script/voice guide** — narrative emphasis and desired episode framing.

The source pack should encourage synthesis rather than simply restating a finished YouTube script.

## 10. YouTube / private-platform architecture

A repeatable episode can follow:

1. Cold open / strongest claim.
2. Song context.
3. Production DNA: tempo, harmony, sample, texture, structure.
4. Lyrical architecture: rhyme, cadence, technical construction.
5. Bar laboratory: key lines and layered readings.
6. Cultural/reference decoding.
7. Philosophical or narrative thesis.
8. **Connections** — comparable songs by BPM, harmony, sample lineage, reference, technique, or theme.
9. Hottest Bar.
10. Closing thesis + audience prompt.

The Connections segment is especially important because it converts isolated reviews into an interconnected catalog.

## 11. Research provenance model

Future song records should consider provenance metadata for externally researched facts:

```json
{
  "value": "90",
  "source": "SongBPM",
  "source_url": "...",
  "retrieved_at": "...",
  "confidence": "high",
  "verification": "cross-checked"
}
```

This is particularly useful for BPM, key, samples, release metadata, and disputed reference interpretations.

## 12. Content pipeline

Recommended lifecycle:

```text
INGESTED
  -> RESEARCHED
  -> ANALYZED
  -> VALIDATED
  -> EDITORIAL_REVIEW
  -> PUBLISHED
  -> MEDIA_READY
  -> ARCHIVED/UPDATED
```

The current `export_status` remains the file-completeness state; workflow state should be a separate future concern.

## 13. Quality gates

A song should not be considered website-ready until:

- required metadata is populated;
- complete supplied lyrics are sectioned;
- whole-lyrics figurative sweep is complete;
- whole-lyrics entendre sweep is complete;
- all anchors validate;
- selected bar analyses match the readable analysis;
- 5–10 key bars are present;
- exactly one hottest bar has a score;
- NotebookLM fields are populated;
- YouTube fields are populated;
- SEO and similar-song fields are populated;
- JSON parses successfully;
- export status accurately reflects completeness.

## 14. Repository strategy

The repository already contains historical blueprint and parser-patch documents. Do not erase that history casually. Going forward:

- `/spec` = normative current contract;
- `/docs` = current explanatory/product documentation;
- `/data/songs` = canonical song JSON exports;
- `/examples` = sanitized/example payloads and usage;
- `/legacy` = historical design/patch documents when they are reorganized;
- root = minimal project navigation and contributor information.

## 15. Product expansion opportunities

Once a sufficiently large catalog exists, the structured corpus can support:

- lyric-technique search;
- rhyme-pattern taxonomy;
- pop-culture/reference index;
- sample family trees;
- BPM/harmonic neighborhoods;
- artist worldview comparisons;
- producer sonic profiles;
- hottest-bar leaderboards;
- curated playlists based on lyrical or musical DNA;
- NotebookLM-generated private audio programming;
- personalized discovery based on themes/techniques rather than genre alone.

## 16. Architectural north star

Song Soliloquy should behave like a combination of **critical publication, annotated rap database, music-research notebook, and media-production operating system**. The structured analysis—not the webpage or the video—is the durable asset. Every surface should become better as the canonical catalog becomes deeper and more interconnected.
