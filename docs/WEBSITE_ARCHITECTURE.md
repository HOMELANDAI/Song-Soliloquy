# Website Architecture

## Role of the website

The website is the renderer, discovery layer, and interaction surface for canonical Song Soliloquy data. It should not become a hidden second analysis engine.

## Import contract

Input: one `song-soliloquy/v1.1` JSON object.

Import should:

1. parse JSON;
2. validate required structures;
3. validate annotation anchors;
4. validate key/hottest bars against lyrics;
5. validate SEO/slug constraints;
6. respect `export_status`;
7. render only supported data or clearly expose validation errors.

## Primary song page modules

- hero metadata;
- context/mood/themes;
- lyrics view;
- inline figurative-language highlights;
- inline entendre highlights with confidence/layers;
- bar-analysis cards;
- key bars;
- hottest bar + score;
- cultural/reference information;
- related songs;
- NotebookLM/media links where appropriate.

## Catalog surfaces

Future catalog-level views can include artist, producer, theme, technique, reference, sample, BPM, and hottest-bar indexes.

## Knowledge graph

Related songs should evolve from free-text comparisons into typed relationships. This enables pages such as “songs using the same sample,” “songs in this BPM pocket,” “songs referencing the same film/person,” or “songs using similar wordplay.”

## Parser principle

Legacy Markdown/parser documents in the repository represent implementation history. The current target contract is direct canonical JSON ingestion. Fallback parsing may remain useful for migration, but it must not override the canonical JSON model.
