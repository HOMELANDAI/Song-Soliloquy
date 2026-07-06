# Song Soliloquy GitHub Update Pack
## Patches v3.6 through v3.9

**Purpose:** Archive the recent operational patches as GitHub-ready documentation.  
**Use:** Commit this file as a rolling update note, or split each section into separate patch files under `/patches`.

---

## Recommended GitHub Placement

```txt
homeadeas/
  projects/
    song-soliloquy/
      patches/
        song-soliloquy-admin-menu-layering-zindex-patch-v3-6.md
        song-soliloquy-delete-confirmation-action-patch-v3-7.md
        song-soliloquy-upload-extractor-hardening-patch-v3-8.md
        song-soliloquy-markdown-section-boundary-bar-block-parser-fix-v3-9.md
      docs/
        song-soliloquy-github-update-pack-v3-6-to-v3-9.md
```

---

# v3.6 — Admin Menu Layering / Z-Index Patch

## Issue

The Admin Library dropdown menu opened behind song rows, information bars, or footer content. Admin actions were difficult or impossible to click.

## Diagnosis

Classic z-index / stacking-context / overflow clipping bug. Likely caused by parent containers using `overflow`, `transform`, `filter`, `backdrop-filter`, `opacity`, or `isolation`.

## Fix

Render admin menus through a top-level portal layer instead of inside Library row cards.

## Core Rule

```txt
Admin menus and modals should live in a portal layer, not inside Library row cards.
```

## Acceptance Criteria

- Admin dropdown appears above all song rows.
- Admin dropdown appears above footer.
- Menu items are fully clickable.
- Confirmation modals appear above dropdown and page.
- Fix works near the bottom of Library page.
- Existing upload, parser, Library, SongDetail, theme toggle, OBS, and motion features remain unchanged.

---

# v3.7 — Delete Confirmation Action Patch

## Issue

The Permanent Delete modal said `Type DELETE to confirm`, but after typing `DELETE`, the destructive action button remained disabled.

## Diagnosis

The visible modal instruction and validation logic were out of sync, or the button was reading stale/different state.

## Fix

Normalize confirmation logic:

```ts
confirmationText.trim().toUpperCase() === "DELETE"
```

## Core Rule

```txt
If the modal says “Type DELETE to confirm,” then DELETE must enable the destructive action.
```

## Acceptance Criteria

- Typing `DELETE` enables the Permanently Delete button.
- `delete`, `Delete`, or ` DELETE ` also work after normalization.
- Clicking Permanently Delete removes uploaded song from Admin Library.
- Soft Delete moves song to Trash.
- Trash filter shows soft-deleted songs.
- Permanent delete removes song from Trash.
- Same song can be re-uploaded after deletion.

---

# v3.8 — Upload Extractor Hardening Patch

## Issue

Upload Parse Preview showed metadata was detected, but full breakdown modules were not extracted.

Observed condition:

```txt
Title detected
Artist detected
Producer detected
Project detected
Release date detected
Lyrics Lines: 0
Bar Analysis Cards: 0
Key Bars: 0
Hottest Bar: Not found
NotebookLM Sections: 0
YouTube Angle: Not found
Parse Status: metadata_only
```

## Diagnosis

The website can read basic metadata but cannot reliably extract complete analysis modules from human-readable Markdown alone.

## Fix

Introduce a deterministic file-ingestion contract:

```txt
Human-readable Markdown
+
Machine-readable song-soliloquy-json payload
```

The parser must check, in order:

```txt
1. song-soliloquy-json structured payload
2. ssol-json structured payload
3. SONG_SOLILOQUY_JSON_START / END block
4. strict Markdown heading extraction
5. metadata-only fallback with warnings
```

## Core Rule

```txt
The uploaded file is the source of truth.
The website is the renderer.
The parser is the translator.
The website must not create replacement analysis during upload.
Missing sections create parser warnings, not demo content.
```

## Acceptance Criteria

- Complete structured Song Soliloquy export populates full song page.
- Metadata-only uploads are not saved as complete analyses.
- Upload Parse Preview clearly shows which sections were detected.
- Parser warnings explain exactly what is missing.
- Required Export Template is available from upload page.
- No demo/default lyrics or bars are ever used for uploaded songs.

---

# v3.9 — Markdown Section Boundary + Bar Block Parser Fix

## Issue

Upload Parse Preview improved but still showed partial extraction:

```txt
Lyrics Lines: 1
Bar Analysis Cards: 0
Key Bars: 8
Hottest Bar: Detected
NotebookLM Sections: 1
YouTube Angle: Detected
Parse Status: partial
```

The first extracted lyric was not a lyric:

```txt
This source pack is built from the provided lyrics for Beautiful Gravesites...
```

## Diagnosis

The parser mistook ordinary source-pack prose containing the word `lyrics` for a real Lyrics section. It also detected Bar Analysis but failed to parse BAR/BREAKDOWN blocks.

## Fix

Use strict heading-only section detection and tolerant bar-label normalization.

## Core Rule

```txt
The parser must not treat ordinary mentions of “lyrics” as a Lyrics section.
Only headings or standalone labels can start a section.
```

## Required Behavior

Valid lyrics starts:

```txt
# Lyrics
## Lyrics
### Lyrics
Lyrics:
LYRICS
[Lyrics]
Beautiful Gravesites Lyrics
Sloth Lyrics
Tears From a Third Eye Lyrics
```

Invalid lyrics starts:

```txt
This source pack is built from the provided lyrics...
The provided lyrics...
Lyrics section may be missing...
Questions NotebookLM should answer about lyrics...
```

Supported bar block formats:

```txt
BAR:
BREAKDOWN:
DEEPER READ:
TECHNICAL NOTES:
WHY IT HITS:
```

Also support bold, heading, and inline variants.

## Acceptance Criteria

- Source-pack prose is never counted as lyrics.
- Lyrics extraction requires confirmed Lyrics heading.
- Bar analysis blocks parse across plain, bold, heading, and inline label variants.
- NotebookLM prose cannot contaminate lyrics or bar analysis.
- Upload Parse Preview shows line numbers and failed-section diagnostics.

---

## Current Strategic Note

The long-term ingestion path should prioritize structured payloads over Markdown guessing.

Every future Song Soliloquy export should include:

```txt
1. Human-readable Markdown for people
2. song-soliloquy-json payload for the website
```

This preserves the full analysis package while making upload/import deterministic.
