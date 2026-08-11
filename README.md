# Song Soliloquy

**A structured rap-analysis, research, publishing, and media-production system.**

Song Soliloquy turns a song plus its source material into a rigorous, reusable analysis package that can power a website, NotebookLM discussion, YouTube episodes, private-platform programming, search/SEO, and a growing cross-song knowledge graph.

## What the project is

Song Soliloquy is not only a lyric-breakdown format. It is an end-to-end content system with five layers:

1. **Source & research layer** — lyrics supplied for analysis plus verified metadata and music-analysis inputs such as BPM, key/chords, samples, mood, structure, and cultural context.
2. **Analysis engine** — song context, comprehensive bar analysis, whole-lyrics figurative-language and entendre detection, raw research notes, key bars, and a scored hottest bar.
3. **Canonical data layer** — one `song-soliloquy/v1.1` JSON object per song. The JSON is the source of truth for downstream products.
4. **Publishing layer** — website song pages, inline lyric highlighting, SEO, related-song discovery, and Bar of the Day/ranking experiences.
5. **Media layer** — NotebookLM source packs and questions, YouTube-ready angles/scripts, visual/B-roll concepts, and comparison segments.

## Governing principle

> **The JSON file is the source of truth. The website renders it; downstream media products derive from it.**

The canonical specification is [`spec/SONG_SOLILOQUY_MASTER_SPEC_V5.md`](spec/SONG_SOLILOQUY_MASTER_SPEC_V5.md). If another project document conflicts with it, the master spec wins.

## Core analysis contract

Every completed analysis has ten readable sections:

1. Song Context
2. Comprehensive Bar Analysis
3. Metaphor & Entendre Detection
4. Raw Notes
5. Key Bars Detection
6. Hottest Bar Detection
7. NotebookLM Source Pack
8. NotebookLM Questions
9. YouTube-Ready Angle
10. Website Metadata

The machine-readable export contains the same substance in the `song-soliloquy/v1.1` schema. Part A and the JSON must agree.

## Repository map

```text
Song-Soliloquy/
├── README.md
├── PROJECT_ARCHITECTURE.md
├── CONTRIBUTING.md
├── spec/
│   ├── SONG_SOLILOQUY_MASTER_SPEC_V5.md
│   ├── song-soliloquy.schema.json
│   └── DATA_INTEGRITY.md
├── docs/
│   ├── ANALYSIS_WORKFLOW.md
│   ├── RESEARCH_TOOLKIT.md
│   ├── NOTEBOOKLM_WORKFLOW.md
│   ├── YOUTUBE_WORKFLOW.md
│   ├── WEBSITE_ARCHITECTURE.md
│   └── ROADMAP.md
├── examples/
│   └── README.md
├── data/
│   ├── songs/.gitkeep
│   └── README.md
└── legacy/
    └── README.md
```

## Research toolkit

The project is designed to combine human interpretation with specialized research sources. Candidate inputs include Tunebat and SongBPM for tempo/key cross-checking, Hooktheory for harmony/chord relationships, Cyanite for mood/semantic audio descriptors, WhoSampled for sample lineage, and authoritative artist/project sources for metadata. Research claims should be labeled by provenance and confidence rather than silently treated as lyric-derived facts.

## Signature cross-song connection system

Each song can connect to other songs through multiple dimensions:

- BPM / tempo pocket
- key, mode, or chord progression
- sample source or sample lineage
- production texture
- rhyme architecture
- metaphor/entendre technique
- recurring pop-culture reference
- thematic/philosophical overlap
- narrative perspective
- artist/scene lineage

This turns the catalog into a discoverable knowledge graph rather than a flat archive.

## Data integrity rules

- Preserve user-provided lyrics verbatim in the canonical song JSON.
- Figurative-language and entendre `phrase` values must occur character-for-character inside their `line`.
- Each detection `line` must occur character-for-character inside the stored lyrics.
- Never manufacture an entendre to increase detection count; use confidence levels honestly.
- `export_status: complete` is permitted only when every required field is populated.
- A song with genuinely no detections may use an explicit empty array.
- The website must not regenerate missing analysis during import.

## Suggested product surfaces

**Website:** searchable analysis library, lyrics with anchored annotations, key bars, hottest-bar ranking, related-song graph, SEO pages.

**YouTube:** deep-dive episodes built from the canonical analysis, with a recurring Connections segment linking musical and lyrical DNA across records.

**NotebookLM / private media:** lyrics as evidence, analysis as the primary intelligence layer, and structured source packs/questions as the discussion layer.

**Future:** catalog-wide similarity engine, artist dashboards, reference index, sample lineage maps, rhyme-technique taxonomy, playlists, voting, and premium/private programming.

## Status

This architecture consolidates the project around **Master Spec V5** and schema version **`song-soliloquy/v1.1`**. Existing historical blueprint/patch documents in the repository should be treated as legacy implementation history unless deliberately promoted into the current spec.
