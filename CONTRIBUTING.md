# Contributing

## Authority

Read `spec/SONG_SOLILOQUY_MASTER_SPEC_V5.md` before changing analysis/export behavior. It is the normative project contract.

## Song data

Canonical song exports belong in `data/songs/` and should use:

`{artist}-{song-title}-song-soliloquy.json`

Before committing a complete export, confirm it passes the requirements in `spec/DATA_INTEGRITY.md`.

## Analysis changes

Do not change quoted lyric anchors while editing explanatory prose. Annotation phrases/lines are referential data and must continue to resolve exactly against stored lyrics.

## Research claims

Prefer verified credits and research sources. Distinguish facts, tool-derived values, and editorial interpretation. When a claim is uncertain, record uncertainty rather than presenting it as settled.

## Similar-song recommendations

Every comparison should name the actual connection: tempo, harmony, sample, production, rhyme, reference, wordplay, theme, or narrative perspective. Avoid unsupported generic similarity.

## Pull requests

A PR affecting the schema or master spec should explain migration impact on existing song JSON and website rendering.
