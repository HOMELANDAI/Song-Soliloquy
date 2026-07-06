# Song Soliloquy Patch v3.3
## Content Integrity + Per-Song Parser Fix

**Patch type:** Bug fix / data integrity / parser hardening  
**Status:** Additive corrective patch  
**Applies to:** Upload parser, Library, SongDetail, song resolver, localStorage preview store, Supabase-ready persistence, UI rendering  
**Do not modify:** Approved visual layout, theme toggle, OBS integration, motion layer, Live Studio route exposure, Supabase architecture, canonical slug resolver except where noted for content integrity.

---

## 1. Problem Summary

Three different Song Detail pages are rendering different song titles but the same lyric lines and similar analysis content. This proves that routing and title metadata are mostly working, but per-song content is not being bound correctly.

The visible symptom:

```txt
/song/ransom-sloth-song-soliloquy-breakdown
/song/ransom-tears-from-a-third-eye
/song/ransom-beautiful-gravesites-song-soliloquy-breakdown
```

show different headers, but the Lyrics panel repeats the same lines:

```txt
I kept the receipts of every promise that they burned,
counted lessons like a ledger, that's the interest that I earned.
Mama prayed in a language that the landlord couldn't read,
so I learned to translate hunger into hustle and a creed.
```

Those lines are behaving like a placeholder/demo lyric block, not real uploaded file content.

---

## 2. Diagnosis

This is not primarily a route issue anymore. The Song Detail page is opening. The bug is in **content extraction, fallback logic, or render binding**.

Likely causes, in order of probability:

### Cause A — Demo lyrics fallback is being reused globally

The upload parser may fail to extract lyrics from the uploaded Markdown file. When that happens, the normalizer fills missing lyrics from a static demo/default object.

Bad pattern:

```ts
lyrics: parsed.lyrics?.length ? parsed.lyrics : DEMO_ANALYSIS.lyrics
```

or:

```ts
const song = { ...parsedSong, ...DEFAULT_SONG_ANALYSIS }
```

This causes different uploaded songs to inherit the same placeholder lyrics.

### Cause B — Merge order is overwriting uploaded content

If default/demo content is spread after parsed content, the default content overwrites the real upload.

Bad:

```ts
const normalized = {
  ...parsedSong,
  ...defaultSong,
};
```

Good:

```ts
const normalized = {
  ...defaultSong,
  ...parsedSong,
};
```

Better: do not use default/demo values for core user-uploaded fields at all.

### Cause C — SongDetailContent is rendering a static sample instead of `song.lyrics`

The header may use the resolved song record while the Lyrics section uses a static import, sample object, mock dataset, or first demo record.

Bad:

```tsx
<LyricsPanel lyrics={DEMO_ANALYSIS.lyrics} />
```

Bad:

```tsx
const lyrics = demoSongs[0].lyrics;
```

Good:

```tsx
<LyricsPanel lyrics={song.lyrics} />
```

### Cause D — Missing React keys / stale component state

If the same component instance remains mounted while the route changes, child state may keep the previous song's lyrics.

Fix with route-level and component-level keys:

```tsx
<SongDetailContent key={song.canonicalSlug} song={song} />
<LyricsPanel key={`${song.canonicalSlug}:lyrics`} lyrics={song.lyrics} />
```

Also reset selected bar/state on song change.

### Cause E — LocalStorage contains polluted records from earlier broken parser versions

Previous patches may have saved malformed records. Those records can keep rendering stale/demo content even after code is fixed.

The app needs a content-repair migration plus a cache clear/debug tool.

---

## 3. Mandatory Fix Principle

```txt
Demo content may be used only for the Demo mode.
Uploaded songs must never inherit demo lyrics, demo bars, demo analysis, demo key bars, or demo hottest bar content.
```

If an uploaded file cannot be parsed, show a parser warning and a controlled incomplete-data state. Do not silently fill the song with fake/default/demo content.

---

## 4. ACTION: Paste Into Figma Make / Builder

```text
Fix the Song Soliloquy bug where different uploaded song pages display the same lyrics and analysis content.

The screenshots show that Sloth, Tears From a Third Eye, and Beautiful Gravesites have different song headers but the Lyrics panel repeats the same placeholder-looking lines. This means route resolution and title metadata are working, but per-song content extraction or render binding is broken.

Treat this as a content integrity and parser fallback bug, not a visual design issue and not a slug routing issue.

Do not change the approved layout, theme toggle, OBS integration, motion layer, Live Studio, Supabase plan, or overall visual system.

Implement a strict per-song content integrity patch:

1. Remove demo/default fallback content from uploaded songs.
   Demo lyrics, demo bar analysis, demo key bars, and demo hottest bars may only be used in Demo mode or explicitly marked demo records. Uploaded songs must never inherit DEMO_ANALYSIS, DEFAULT_SONG_CONTENT, SAMPLE_LYRICS, or mock bars.

2. Audit upload parsing and normalization.
   Search for any fallback pattern like:
   - parsed.lyrics || DEMO_ANALYSIS.lyrics
   - parsed.barAnalysis || DEMO_ANALYSIS.barAnalysis
   - parsed.keyBars || DEMO_ANALYSIS.keyBars
   - parsed.hottestBar || DEMO_ANALYSIS.hottestBar
   - { ...parsedSong, ...defaultSong }
   - demoSongs[0]
   - sampleLyrics
   - placeholderLyrics
   Replace these with strict empty arrays/nulls plus parser warnings for uploaded records.

3. Add a new utility called contentIntegrity.ts with:
   - hashText(input)
   - hashLyrics(lyrics)
   - hashSongContent(song)
   - detectDemoFallbackLeak(song)
   - validateUploadedSongContent(song)
   - buildContentWarnings(song, allSongs)

4. Every saved uploaded song record must include:
   - sourceFilename
   - rawMarkdown
   - rawMarkdownHash
   - lyricsHash
   - barAnalysisHash
   - contentHash
   - parserWarnings[]
   - parseStatus: "complete" | "partial" | "failed"
   - isDemo: false

5. Add duplicate-content detection.
   If two different uploaded songs have different canonicalSlug values but the same lyricsHash and the same barAnalysisHash, flag them with:
   "Possible content fallback or duplicate parse detected."
   Do not block saving, but show a warning in admin/debug mode.

6. Fix SongDetailContent rendering so every section receives the resolved song object directly.
   The header, lyrics, bar analysis, key bars, hottest bar, raw notes, NotebookLM pack, YouTube angle, context cards, and figurative language modules must all read from the same resolved song object.

7. Add component keys to prevent stale state across song pages:
   - SongDetailContent key={song.canonicalSlug}
   - LyricsPanel key={`${song.canonicalSlug}:lyrics`}
   - BarAnalysisSection key={`${song.canonicalSlug}:bars`}
   - KeyBarsSection key={`${song.canonicalSlug}:keybars`}
   - HottestBarSection key={`${song.canonicalSlug}:hottest`}

8. Reset selected lyric/bar state on song change.
   If SongDetail has selectedBarId, activeSection, selectedQuote, or selectedAnalysis state, reset song-specific state when canonicalSlug changes.

9. Improve Markdown lyrics extraction.
   The parser should extract from headings in this priority:
   - ## Lyrics
   - # Lyrics
   - [Lyrics] / lyrics section if present
   - lines between Lyrics and the next major heading
   - verse blocks such as [Verse], [Verse 1], [Intro], [Hook], [Chorus], [Outro]

10. Improve bar-analysis extraction.
   Parse repeated blocks with labels:
   - BAR:
   - BREAKDOWN:
   - DEEPER READ:
   - TECHNICAL NOTES:
   - WHY IT HITS:
   Do not generate fake bar analysis if blocks are missing. Store empty array and parser warning instead.

11. Add an Upload Parse Preview screen before saving.
   After a file is uploaded, show parsed fields:
   - Title
   - Artist
   - Canonical slug
   - Lyrics lines detected
   - Bar analysis cards detected
   - Key bars detected
   - Hottest bar detected
   - Parser warnings
   Include buttons:
   - Save Analysis
   - Cancel
   - View Raw Extract
   This ensures we can see if the parser captured the correct lyrics before it enters Library.

12. Add a temporary Content Debug panel to SongDetail admin/debug mode.
   Show:
   - canonicalSlug
   - sourceFilename
   - rawMarkdownHash
   - lyricsHash
   - barAnalysisHash
   - contentHash
   - parseStatus
   - parserWarnings
   - first 5 extracted lyric lines
   - first 3 bar-analysis bar quotes
   - isDemo

13. Add a Clear Uploaded Preview Cache button that clears older polluted records:
   - song-soliloquy.uploadedSongs.v1
   - ss_uploaded_analyses
   Then return the user to /upload.

14. Add migration/repair on getUploadedSongAnalyses().
   On first read, re-parse rawMarkdown for existing uploaded songs. If a record has placeholder/demo lyrics or identical lyricsHash to a known demo record, re-extract lyrics and analysis from rawMarkdown. If rawMarkdown is missing, mark parseStatus as partial and show a warning.

15. Add tests/acceptance checks.
   Upload three different Song Soliloquy Markdown files. Confirm:
   - The titles are different.
   - The canonical slugs are different.
   - The first five lyric lines are different unless the actual files are identical.
   - lyricsHash differs across different songs.
   - Bar analysis differs across different songs.
   - Library click opens the correct song page.
   - Refresh does not replace uploaded content with demo content.

Acceptance criteria:
1. Sloth, Tears From a Third Eye, and Beautiful Gravesites no longer show the same lyric block unless the uploaded files actually contain the same lyrics.
2. Uploaded song content never falls back to demo lyrics or demo analysis.
3. SongDetail renders all sections from the resolved song object only.
4. Upload Parse Preview shows the correct extracted lyric lines before save.
5. Content Debug shows unique lyricsHash/contentHash for different songs.
6. Parser warnings appear instead of silently filling missing content with placeholders.
7. Old polluted localStorage records can be repaired or cleared.
8. Existing visual layout remains unchanged.
```

---

## 5. ARCHIVE: Developer Implementation Notes

Save this `.md` patch in GitHub as:

```txt
docs/patches/song-soliloquy-content-integrity-parser-fallback-patch-v3-3.md
```

Recommended issue title:

```txt
Fix uploaded song pages reusing demo/default lyric content
```

Recommended labels:

```txt
bug
parser
data-integrity
song-detail
upload-flow
high-priority
```

---

## 6. Suggested File Changes

```txt
src/data/uploadedSongStore.ts
src/data/songResolver.ts
src/data/staticSongStore.ts
src/lib/songMetadataExtractor.ts
src/lib/songMarkdownParser.ts
src/lib/contentIntegrity.ts
src/components/pages/UploadPage.tsx
src/components/pages/SongDetail.tsx
src/components/pages/SongDetailContent.tsx
src/components/song/LyricsPanel.tsx
src/components/song/BarAnalysisSection.tsx
src/components/song/KeyBarsSection.tsx
src/components/song/HottestBarSection.tsx
src/components/debug/ContentDebugPanel.tsx
src/components/upload/UploadParsePreview.tsx
```

---

## 7. Data Contract Additions

Extend `SongAnalysis`:

```ts
export type ParseStatus = "complete" | "partial" | "failed";

export type ParserWarning = {
  code: string;
  message: string;
  severity: "info" | "warning" | "error";
  section?: string;
};

export type SongAnalysis = {
  id: string;
  title: string;
  artist: string;
  canonicalSlug: string;
  slug: string;
  slugAliases: string[];

  lyrics: LyricSection[];
  barAnalysis: BarAnalysisCard[];
  keyBars: KeyBar[];
  hottestBar: HottestBar | null;

  rawMarkdown?: string;
  sourceFilename?: string;
  rawMarkdownHash?: string;
  lyricsHash?: string;
  barAnalysisHash?: string;
  contentHash?: string;
  parserWarnings: ParserWarning[];
  parseStatus: ParseStatus;
  isDemo: boolean;
};
```

---

## 8. contentIntegrity.ts Reference Shape

```ts
const DEMO_LEAK_PATTERNS = [
  "I kept the receipts of every promise that they burned",
  "counted lessons like a ledger",
  "Mama prayed in a language that the landlord couldn't read",
  "translate hunger into hustle and a creed",
];

export function detectDemoFallbackLeak(song: SongAnalysis): ParserWarning[] {
  if (song.isDemo) return [];

  const lyricsText = flattenLyrics(song.lyrics).join("\n").toLowerCase();

  const leaks = DEMO_LEAK_PATTERNS.filter((pattern) =>
    lyricsText.includes(pattern.toLowerCase())
  );

  if (!leaks.length) return [];

  return [
    {
      code: "DEMO_CONTENT_LEAK",
      severity: "error",
      section: "lyrics",
      message:
        "Uploaded song appears to contain demo/placeholder lyric content. Re-parse rawMarkdown and do not save demo fallback content.",
    },
  ];
}
```

---

## 9. Parser Behavior Rules

### For uploaded songs

Allowed missing-field fallback:

```txt
missing lyrics -> [] + parser warning
missing bar analysis -> [] + parser warning
missing key bars -> [] + parser warning
missing hottest bar -> null + parser warning
```

Forbidden missing-field fallback:

```txt
missing lyrics -> demo lyrics
missing bar analysis -> demo analysis
missing key bars -> demo key bars
missing hottest bar -> demo hottest bar
```

### For demo mode only

Demo records may use curated demo content only if:

```ts
isDemo: true
source: "demo"
```

---

## 10. UI Behavior for Partial Parses

If lyrics are missing:

```txt
Lyrics Not Parsed
The uploaded file was saved, but the lyrics section could not be extracted. Open Parse Preview or Raw Extract to review the Markdown structure.
```

If bar analysis is missing:

```txt
Bar Analysis Not Parsed
No BAR / BREAKDOWN / DEEPER READ blocks were detected in this upload.
```

If demo leakage is detected:

```txt
Content Integrity Warning
This uploaded song appears to be showing placeholder/demo lyrics. Re-parse the source file or clear the preview cache and upload again.
```

---

## 11. Testing Checklist

Test with three known different files:

```txt
ransom-sloth-song-soliloquy-breakdown.md
ransom-tears-from-a-third-eye-song-soliloquy-breakdown.md
ransom-beautiful-gravesites-song-soliloquy-breakdown.md
```

Check:

```txt
[ ] Upload Parse Preview shows different lyric first lines for each file.
[ ] Library shows all three records.
[ ] Each Library card opens a unique song page.
[ ] Each Song Detail page has a unique lyricsHash.
[ ] Each Song Detail page has a unique contentHash.
[ ] No uploaded song has isDemo: true.
[ ] No uploaded song contains the known placeholder lyric lines unless the source file actually contains them.
[ ] Refresh keeps the correct content.
[ ] Theme switching does not alter content.
[ ] Presentation Mode does not alter content.
[ ] OBS overlay preview uses the same resolved song object.
```

---

## 12. Build Order

1. Add `contentIntegrity.ts`.
2. Remove demo fallback from uploaded song normalization.
3. Add parser warnings and parseStatus.
4. Add Upload Parse Preview.
5. Add Content Debug panel.
6. Add component keys/state reset in SongDetail.
7. Add migration/repair for old polluted records.
8. Clear preview cache and re-upload test files.
9. Confirm three different songs render three different lyric sections.

---

## 13. Final Rule

```txt
The title, metadata, lyrics, analysis, key bars, hottest bar, and creator tools on a Song Detail page must all come from the same resolved SongAnalysis object.
```

No page section should import or reference demo content unless the resolved song is explicitly marked `isDemo: true`.
