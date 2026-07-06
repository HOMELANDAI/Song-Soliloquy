# Song Soliloquy Patch v3.9
## Markdown Section Boundary + Bar Block Parser Fix

**Patch type:** GitHub archive / developer handoff  
**Status:** Additive parser-hardening patch  
**Primary area:** Upload parser, Markdown fallback extraction, upload parse preview diagnostics  
**Do not modify:** Visual layout, theme toggle, OBS/Live Studio, Supabase plan, Library admin, SongDetail design, canonical slug resolver

---

## Purpose

Fix partial imports where metadata, key bars, hottest bar, NotebookLM, and YouTube angle may be detected, but lyrics and bar analysis are not properly extracted from a legacy Markdown-only Song Soliloquy breakdown file.

This patch specifically addresses the case where the Upload Parse Preview shows:

```txt
Lyrics Lines: 1
Bar Analysis Cards: 0
Key Bars: 8
Hottest Bar: Detected
NotebookLM Sections: 1
YouTube Angle: Detected
Parse Status: partial
```

and the first extracted lyric is actually source-pack prose, such as:

```txt
This source pack is built from the provided lyrics for Beautiful Gravesites...
```

That sentence is not a lyric. It indicates that the parser is mistaking ordinary mentions of the word `lyrics` inside NotebookLM/source-pack prose for an actual Lyrics section.

---

## Diagnosed Issue

The parser is too loose in two places:

1. **Lyrics section detection**  
   It appears to be searching for the word `lyrics` anywhere in the file, rather than only recognizing legitimate section headings or standalone lyric labels.

2. **Bar analysis block parsing**  
   It detects a Bar Analysis section but does not extract individual `BAR / BREAKDOWN / DEEPER READ / TECHNICAL NOTES / WHY IT HITS` blocks, likely because the label-matching logic is too strict.

---

## Core Rule

The parser must not treat ordinary mentions of `lyrics` as a Lyrics section.

Only headings or standalone labels can start a section.

The website should never create replacement analysis during upload. For uploaded breakdown files:

```txt
The uploaded file is the source of truth.
The website is the renderer.
The parser is the translator.
Missing sections create parser warnings, not demo content.
```

---

## Required Fix

### 1. Heading-Only Section Detection

The parser must only start a section when a line is a real Markdown heading or a recognized standalone section label.

Valid lyrics starts include:

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

Invalid lyrics starts include:

```txt
This source pack is built from the provided lyrics...
The provided lyrics...
Lyrics section may be missing...
Questions NotebookLM should answer about lyrics...
Any sentence that merely contains the word lyrics.
```

---

### 2. Strict Section Boundary Logic

Once a section starts, it must end at the next recognized major section heading.

Major section headings include:

```txt
Song Context
Comprehensive Bar Analysis
Complete Bar-by-Bar Breakdown
Bar Analysis
Key Bars
Hottest Bar
Raw Notes
NotebookLM Source Pack
NotebookLM Questions
YouTube-Ready Angle
SEO Metadata
Similar Songs
Figurative Language
Context Cards
Did You Know Cards
```

---

### 3. Lyrics Extraction Rules

Extract lyrics only from a confirmed Lyrics section or from bracketed lyric subsections inside that confirmed section.

Recognized lyric subsection labels:

```txt
[Intro]
[Verse]
[Verse 1]
[Verse 2]
[Hook]
[Chorus]
[Bridge]
[Outro]
```

Do not extract these as lyrics:

```txt
NotebookLM prose
Source-pack descriptions
Analysis paragraphs
Questions
Metadata notes
Parser warnings
```

---

### 4. False-Positive Lyric Filters

Reject extracted lyric candidates that begin with or include source-pack prose such as:

```txt
This source pack is built
The provided lyrics
This analysis
This song breakdown
NotebookLM
Questions NotebookLM
Suggested podcast
Main themes
Character/narrator profile
```

If the only detected lyric line matches one of these false-positive patterns, set `lyricsLinesDetected` back to `0` and add a parser warning:

```txt
Detected lyric candidate was rejected as analysis/source-pack prose.
```

---

### 5. Bar Analysis Block Parsing

The parser should support all of the following formats.

#### Format A: Plain block labels

```txt
BAR:
“quote”
BREAKDOWN:
text
DEEPER READ:
text
TECHNICAL NOTES:
text
WHY IT HITS:
text
```

#### Format B: Bold inline labels

```txt
**BAR:** “quote”
**BREAKDOWN:** text
**DEEPER READ:** text
**TECHNICAL NOTES:** text
**WHY IT HITS:** text
```

#### Format C: Heading labels

```txt
### BAR
“quote”
### BREAKDOWN
text
### DEEPER READ
text
### TECHNICAL NOTES
text
### WHY IT HITS
text
```

#### Format D: Inline plain labels

```txt
BAR: “quote”
BREAKDOWN: text
DEEPER READ: text
TECHNICAL NOTES: text
WHY IT HITS: text
```

---

### 6. Label Normalization

Before matching labels, normalize each candidate label by:

```txt
trim whitespace
remove Markdown heading marks #
remove bold/italic markers ** and __
remove trailing colon
remove em dash / en dash if used after label
uppercase the label
collapse multiple spaces
```

These should all normalize to `BAR`:

```txt
BAR:
**BAR:**
### BAR
#### BAR:
BAR —
```

These should normalize cleanly:

```txt
BREAKDOWN
DEEPER READ
TECHNICAL NOTES
WHY IT HITS
```

---

### 7. Bar Block Recovery

If the Bar Analysis section contains repeated quote blocks followed by `BREAKDOWN`, `DEEPER READ`, `TECHNICAL NOTES`, or `WHY IT HITS` labels but lacks an explicit `BAR` label, infer each quote block as the `bar` field.

Do not invent missing analysis. Only recover structure from content that exists in the uploaded file.

---

### 8. NotebookLM Contamination Guard

Do not parse bar-analysis blocks from inside `NotebookLM Source Pack` unless the structured JSON payload explicitly identifies them as `bar_analysis`.

Markdown fallback extraction should prioritize the main `Comprehensive Bar Analysis` / `Bar Analysis` section and avoid duplicating secondary NotebookLM summaries as the main bar analysis.

---

### 9. Upload Parse Preview Diagnostics

Add these fields to Upload Parse Preview and Raw File Diagnostics:

```txt
detectedLyricsHeading
lyricsSectionStartLine
lyricsSectionEndLine
rejectedLyricCandidates[]
detectedBarAnalysisHeading
barAnalysisSectionStartLine
barAnalysisSectionEndLine
barLabelsFoundCount
breakdownLabelsFoundCount
firstThreeDetectedBars[]
```

---

### 10. Parser Warning Updates

If a Bar Analysis section is found but no BAR blocks are found, show:

```txt
Bar Analysis section found, but no parseable BAR/BREAKDOWN blocks were detected. Check label formatting or use structured song-soliloquy-json export.
```

If a lyric candidate is rejected, show:

```txt
Rejected false lyric candidate from NotebookLM/source-pack prose.
```

---

## Preferred Future Path

The structured JSON path remains the preferred future path.

If a `song-soliloquy-json` block exists, trust that first and skip Markdown guessing.

Long-term export format:

```txt
Human-readable Markdown
+
Machine-readable song-soliloquy-json payload
```

---

## Acceptance Criteria

- Source-pack prose is never counted as lyrics.
- The phrase `This source pack is built from the provided lyrics...` is never counted as a lyric line.
- Lyrics extraction requires a confirmed Lyrics heading or standalone label.
- Bar analysis cards are extracted from `BAR / BREAKDOWN / DEEPER READ / TECHNICAL NOTES / WHY IT HITS` blocks.
- Bold label variants are supported.
- Heading label variants are supported.
- Inline label variants are supported.
- NotebookLM prose cannot contaminate lyrics or bar analysis.
- Upload Parse Preview shows section line numbers and failed-section diagnostics.
- Partial extraction warnings say exactly which section failed and why.
- Existing upload, Library, SongDetail, admin deletion, theme toggle, OBS, motion layer, and Supabase plan remain unchanged.

---

## Suggested File Placement

```txt
homeadeas/
  projects/
    song-soliloquy/
      patches/
        song-soliloquy-markdown-section-boundary-bar-block-parser-fix-v3-9.md
```

or:

```txt
homeadeas/
  docs/
    song-soliloquy/
      patches/
        v3-9-markdown-section-boundary-bar-block-parser-fix.md
```
