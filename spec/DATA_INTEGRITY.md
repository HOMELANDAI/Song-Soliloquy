# Data Integrity Contract

## Canonical rule

The canonical song JSON is the source of truth. Rendering, podcast preparation, scripts, and discovery features consume it; they do not silently repair or regenerate its analysis.

## Exact lyric anchoring

Annotation integrity is defined as:

`phrase ∈ line ∈ lyrics`

Containment is character-for-character. Preserve punctuation, apostrophes, capitalization, spelling, and spacing in anchor fields.

## Completion

`export_status: complete` means every required analytical structure is populated and internally consistent. If any required field cannot be completed, use `incomplete` and enumerate it in `missing_required_fields`.

## Required validation checks

1. JSON parses.
2. `schema_version` is `song-soliloquy/v1.1`.
3. Lyrics supplied for the analysis are preserved in section order.
4. Every figurative-language phrase is contained in its line.
5. Every figurative-language line resolves in the named lyric section.
6. Every entendre phrase is contained in its line.
7. Every entendre line resolves in the named lyric section.
8. Entendres have 2–3 meaning layers and an honest confidence value.
9. Every key bar resolves to stored lyrics.
10. There are 5–10 key bars in a complete export.
11. The hottest bar resolves to stored lyrics and has an integer score from 1–100.
12. NotebookLM, YouTube, SEO, raw notes, and similar-song structures are populated.
13. SEO meta description is <=160 characters.
14. URL slug is lowercase and hyphenated.
15. `missing_required_fields` is empty when export status is complete.

## Editorial integrity

Validation can prove structural consistency but not interpretive truth. Editorial review must still test whether references are supported, metaphors are properly classified, entendres are not forced, technical notes are credible, and comparison songs have a defensible relationship.
