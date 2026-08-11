# Roadmap

## Phase 0 — Contract consolidation

- [x] Establish Master Spec V5 as normative documentation.
- [x] Document `song-soliloquy/v1.1` schema.
- [x] Define annotation integrity and completion rules.
- [x] Define overall website / NotebookLM / YouTube architecture.

## Phase 1 — Validator

- [ ] Build JSON Schema validation into CI.
- [ ] Add custom anchor validator for `phrase ∈ line ∈ lyrics`.
- [ ] Validate key/hottest bars against lyrics.
- [ ] Validate export-status semantics.
- [ ] Add fixture tests for valid and invalid song files.

## Phase 2 — Canonical catalog

- [ ] Create one normalized JSON file per completed song in `data/songs/`.
- [ ] Establish filename/slug conventions.
- [ ] Migrate completed historical analyses.
- [ ] Add catalog index generation.

## Phase 3 — Website ingestion

- [ ] Directly ingest canonical JSON.
- [ ] Render lyric annotations with exact anchors.
- [ ] Render bar analyses, key bars, hottest bar, metadata, and related songs.
- [ ] Expose validation failures clearly.

## Phase 4 — Research provenance

- [ ] Add optional source/provenance model for BPM, key, samples, credits, and reference verification.
- [ ] Support cross-source disagreement and confidence.
- [ ] Add research checklist to editorial workflow.

## Phase 5 — Knowledge graph

- [ ] Define typed song-to-song relationships.
- [ ] Store evidence and confidence per relationship.
- [ ] Generate related-song recommendations by dimension.
- [ ] Build reference/sample/theme indexes.

## Phase 6 — Media pipeline

- [ ] Generate NotebookLM source packs from canonical JSON.
- [ ] Generate episode briefs/scripts from canonical JSON.
- [ ] Build visual/B-roll shot lists.
- [ ] Create reusable Connections and Hottest Bar segments.

## Phase 7 — Catalog intelligence

- [ ] Hottest Bar leaderboards / Bar of the Day.
- [ ] Artist and producer profiles.
- [ ] Rhyme/wordplay taxonomy search.
- [ ] BPM/harmony neighborhoods.
- [ ] Sample lineage maps.
- [ ] Thematic playlists and private programming.
