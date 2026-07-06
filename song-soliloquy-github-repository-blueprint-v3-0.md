# Song Soliloquy GitHub Repository Blueprint

Version: 3.0 - includes workflow audit, optional entertainment-value layers, Did You Know / Context Cards, production-performance notes, verification fields, Supabase backend integration, Song Detail route import stability, upload slug-resolution/persistence patch, OBS Live Studio integration, and alternate skin/theme toggle system.

Repository-ready project file for building, documenting, and maintaining the Song Soliloquy website, upload engine, analysis schema, design system, content archive, and creator workflow.


## Version 2.1 Change Note

This update audits the track-submission workflow and adds optional enrichment layers for entertainment value and deeper context. The core recommendation is to add **Context Cards / Did You Know Cards** supported by a **Reference Ledger**, **Production Lens**, **Performance Notes**, **Rewind Triggers**, **Emotional Arc**, **First Listen vs Deep Listen**, and **Verification Status**. These are optional modules, not mandatory filler.


## Version 2.2 Change Note

This update adds a Supabase backend integration plan for the Song Soliloquy website. Supabase becomes the live backend for uploaded files, parsed song-analysis records, public/draft publishing states, Search, Storage, Auth, Row Level Security, Context Cards, Reference Ledger records, and the Connection Web. GitHub remains the source of truth for code, migrations, schemas, documentation, and deployment workflow.


## Version 2.3 Change Note

This update adds a runtime-stability patch for the Song Detail route. The Figma Make preview showed `Unexpected Application Error: Failed to fetch dynamically imported module ... /src/app/components/pages/SongDetail.tsx`. The patch treats this as a route module loading problem, not a content/schema/Supabase issue.

The fix is to remove route-level dynamic imports for core page routes inside the Figma preview, statically import `SongDetail`, add branded `RouteErrorBoundary` / `errorElement` coverage, verify export shape, remove nested `React.lazy` chains from the song detail page, and reserve lazy loading for optional below-the-fold modules after the main song page is stable.

---


## Version 2.4 Change Note

This update fixes the post-upload `Song Not Found` state seen after a successful file upload. The current screen proves the previous dynamic-import crash is resolved; the app now loads the `SongDetail` route but cannot resolve the uploaded song under the slug it navigated to.

The patch adds canonical slug derivation, filename/export-suffix cleanup, generated import ID handling, slug aliases, localStorage persistence for Figma preview, Supabase alias-table support for production, Library inclusion of uploaded songs, and redirect/canonicalization behavior for legacy or generated upload URLs.

Core rule: the public song URL should use the canonical song slug, such as `ransom-tears-from-a-third-eye`, while the original filename and generated upload slug should be saved as aliases, not used as the primary route.

---


Suggested file path options:

- `README.md` if this is a dedicated Song Soliloquy repository.
- `docs/SONG_SOLILOQUY_REPOSITORY_BLUEPRINT.md` if this lives inside a larger `homeadeas` repository.
- `docs/product/song-soliloquy.md` if `homeadeas` will contain multiple product ideas.

Suggested repository names:

- `homeadeas/song-soliloquy`
- `homeadeas/song-soliloquy-web`
- `homeadeas/song-soliloquy-engine`
- `homeadeas/song-soliloquy-content`

---

## 1. Project Summary

**Song Soliloquy** is a rap lyric analysis and creator workflow platform.

The project turns song lyrics, metadata, producer information, emotional interpretation, bar-by-bar breakdowns, technical rhyme notes, key-bar detection, hottest-bar detection, raw research notes, NotebookLM source packs, YouTube-ready angles, and similar-song relationships into an interactive website experience.

The product should not feel like a generic lyrics website. It should feel like a premium lyric-analysis engine, a rap scholar's archive, a creator dashboard, and a cinematic evidence board for decoding bars.

Core tagline:

> Where bars become evidence.

Core product idea:

> Upload a Song Soliloquy breakdown file and turn it into a full interactive analysis page.

---

## 2. Correct Understanding of GitHub's Role

GitHub will make the project more organized, durable, and easier to update, but it will not automatically make the website robust by itself.

GitHub helps by becoming the source of truth for:

- Website code
- Content files
- Upload schema
- Markdown and JSON templates
- Design system documentation
- Figma prompts
- Change history
- Collaboration
- Issues, bug reports, and feature planning
- Automation through GitHub Actions
- Deployment triggers for GitHub Pages, Vercel, Netlify, Cloudflare Pages, or another host

Robustness comes from the full system around GitHub:

1. A clear content schema.
2. A repeatable upload/export format.
3. Validation checks before content goes live.
4. Version control for every update.
5. Automated builds and deployments.
6. A reliable website framework.
7. A clean folder structure.
8. Backup and rollback ability.
9. Clear editorial review rules.
10. A plan for copyrighted lyrics and public publishing rights.

Best framing:

> GitHub is the control room and version history. The website, parser, database, and deployment pipeline are the engine.

---

## 3. Product Vision

Song Soliloquy should let a user move from analysis to publishing with very little friction.

Primary workflow:

1. The Song Soliloquy engine analyzes a song.
2. The engine exports a structured Markdown file and/or JSON file.
3. The file is uploaded, committed, or imported into the website.
4. The website parses the file.
5. The website creates an interactive song page.
6. The page displays lyrics, bar analysis, key bars, hottest bar, raw notes, NotebookLM pack, YouTube angle, and connection data.
7. The creator can export source packs, video outlines, quote cards, and metadata.
8. The content archive grows song by song.

Long-term vision:

> Song Soliloquy becomes a searchable archive of rap meaning, technical craft, cultural references, production context, and creator-ready commentary.

---

## 3A. Song Submission Workflow Audit and Content Enrichment Layer

This update audits what happens when a song is submitted, what information the engine already produces, and what optional information can add entertainment value without bloating or forcing every page.

### 3A.1 Current Submission Workflow

The current workflow is strong because a submitted song can already produce:

1. Song metadata.
2. Full song context.
3. Lyrics or lyric excerpts.
4. Comprehensive bar-by-bar analysis.
5. Deeper meaning analysis.
6. Technical rhyme, cadence, wordplay, and imagery notes.
7. Key bars detection.
8. Hottest bar detection.
9. Raw notes.
10. NotebookLM source pack.
11. NotebookLM questions.
12. YouTube-ready angle.
13. Website metadata and SEO fields.
14. Similar songs and comparison points.
15. Connection data for BPM, key/chord progression, samples, references, lyric wordplay, and related songs.

This gives the project a complete foundation. The missing opportunity is not simply adding more information. The opportunity is adding a small number of structured layers that make each breakdown more entertaining, more browsable, and more valuable for video creation.

### 3A.2 Guiding Rule for New Fields

Do not force every song to have every enrichment field.

Use this priority system:

- **Required:** must exist for every publishable breakdown.
- **Recommended:** should exist when the information is obvious from the song and analysis.
- **Conditional:** should exist only when the song gives enough evidence or a reliable source can verify it.
- **Avoid:** do not invent, over-explain, or add trivia that does not deepen the song.

The enrichment layer should feel like:

> extra meaning, not extra clutter.

### 3A.3 Strongest Holes to Fill

The following fields add the most value to Song Soliloquy.

#### 1. Executive Thesis

A one- or two-sentence statement that tells the reader what the breakdown is really arguing.

Purpose:

- Gives the page a clear editorial spine.
- Helps viewers understand the central takeaway quickly.
- Creates stronger YouTube intros and SEO descriptions.

Example field:

```yaml
enrichment:
  executive_thesis: "This song is not just a flex; it is a survival testimony about how ambition changes when pain becomes discipline."
```

#### 2. Emotional Arc Map

A short map of how the song moves emotionally.

Purpose:

- Shows progression instead of treating the verse like disconnected bars.
- Helps the website visualize the song as a journey.
- Gives creators a clean video structure.

Recommended subfields:

- Opening emotional state.
- Turning point.
- Closing emotional state.
- Final listener impression.

#### 3. Production-to-Meaning Notes

The current system captures producer and possible BPM/key/sample data, but it should also explain how the production changes the meaning of the lyrics.

Purpose:

- Connects beat, loop, drums, tempo, space, sample texture, and mix to lyrical emotion.
- Makes the site feel more like a music-analysis platform, not only a lyric-analysis archive.
- Adds entertainment value for producers, beat heads, and YouTube viewers.

Recommended subfields:

- Tempo feel.
- Beat texture.
- Sample or loop mood.
- Drum pocket.
- Bass/low-end mood.
- Space/silence.
- Vocal delivery.
- How the production supports or contradicts the lyrics.

#### 4. Performance and Delivery Notes

The analysis should preserve not only what the artist says, but how the artist performs it.

Purpose:

- Captures pauses, emphasis, breath control, cadence shifts, rhyme-pocket changes, and punchline timing.
- Helps a video creator explain why a bar hits even before the listener fully decodes it.
- Supports a future Performance View on the website.

Recommended subfields:

- Cadence notes.
- Flow switches.
- Delivery intensity.
- Pause placement.
- Ad-lib function.
- Rhyme pocket.
- Performance highlight timestamps, if available.

#### 5. What You Might Have Missed

A short section for the overlooked layer of the song: the reference, rhyme trick, emotional pivot, producer choice, or subtle callback a casual listener could miss.

Purpose:

- Gives the site a strong entertainment moment near the top of the page.
- Creates a natural YouTube hook.
- Shows the value of Song Soliloquy before the reader enters the full deep dive.

Recommended subfields:

- Title.
- Explanation.
- Related bar ID.
- Value type: hidden meaning, rhyme craft, reference, production, callback, narrative pivot.
- Confidence level.

#### 6. Context Nuggets / Did You Know Cards

This is the best entertainment-value addition, but it must be controlled. These cards should appear only when the fact is useful, interesting, and either verifiable or clearly derived from the submitted song data.

Purpose:

- Adds the "I did not know that" factor.
- Creates sharable sidebars.
- Helps readers connect the song to history, culture, samples, slang, artist career arcs, and related songs.

Good Did You Know card types:

- Sample origin.
- Producer context.
- Album placement.
- Artist-era context.
- Religious, literary, historical, or film reference.
- Slang or street-term explanation.
- Callback to an older song.
- Link to another Song Soliloquy breakdown.
- Technical craft surprise, such as a rhyme pattern that runs longer than it first appears.

Bad Did You Know card types:

- Random trivia that does not explain the song.
- Unverified gossip.
- Speculation presented as fact.
- Personal details unrelated to the lyric.
- Overly obvious facts.

Each card should include:

```json
{
  "title": "",
  "fact": "",
  "why_it_matters": "",
  "source_type": "lyrics | metadata | external_source | internal_archive | analyst_note",
  "source_url": "",
  "confidence": "unverified | needs_review | verified",
  "display_mode": "sidebar | inline | card | hidden_until_verified"
}
```

#### 7. Rewind Triggers

A Rewind Trigger is a moment that makes a listener run the line back. It may not always be the hottest bar.

Purpose:

- Captures replay value across the whole song.
- Helps create Shorts, TikTok clips, and YouTube chapter moments.
- Gives readers a quick way to find the densest or most surprising moments.

Trigger types:

- Dense internal rhyme.
- Sudden emotional reveal.
- Double meaning.
- Historical/cultural reference.
- Delivery switch.
- Beat drop or silence.
- Punchline reversal.
- Moral contradiction.

#### 8. Bar Function Taxonomy

Bar tags currently classify bars by theme, but the engine should also classify what job each bar performs inside the song.

Useful functions:

- Thesis bar.
- Setup bar.
- Pivot bar.
- Confession bar.
- Threat bar.
- Flex bar.
- Warning bar.
- Memory bar.
- Prayer bar.
- Moral conflict bar.
- Scene-setting bar.
- Punchline payoff bar.
- Worldview bar.

Purpose:

- Makes the bar explorer much more powerful.
- Helps users understand why the song is structured the way it is.
- Improves search and filtering.

#### 9. Listener Reaction Map

The same line can hit different audiences differently.

Purpose:

- Adds entertainment value.
- Gives creators ready-made commentary angles.
- Helps separate surface reaction from deeper analysis.

Recommended subfields:

- What a casual listener hears.
- What a rap nerd catches.
- What a creator can build a segment around.
- What a new fan learns about the artist.

#### 10. Tension Map

A Tension Map identifies the competing forces inside the song.

Examples:

- Survival vs. morality.
- Pride vs. humility.
- Violence vs. peace.
- Faith vs. doubt.
- Street logic vs. personal growth.
- Memory vs. reinvention.
- Wealth vs. guilt.

Purpose:

- Makes the deeper read more organized.
- Helps the site explain philosophical conflict.
- Gives the YouTube thesis more depth.

#### 11. Visual Translation Pack

The current workflow already includes B-roll ideas and thumbnail text. This should be expanded into a small reusable visual package.

Purpose:

- Helps the YouTube side immediately.
- Makes the site valuable to editors and designers.
- Connects the written analysis to visual storytelling.

Recommended subfields:

- Suggested color palette.
- Visual motifs.
- B-roll ideas.
- Thumbnail symbols.
- On-screen text moments.
- Quote-card candidates.
- Scene transitions.

#### 12. Reference Ledger

The analysis already explains references inside paragraphs, but references should also be stored in a structured ledger.

Purpose:

- Makes cultural, religious, historical, sports, film, street, literary, business, legal, and music references searchable.
- Feeds the Connection Web.
- Lets Did You Know cards pull from verified reference entries.
- Prevents important context from getting buried inside long paragraphs.

Recommended subfields:

- Reference text.
- Reference type.
- Related bar ID.
- Plain explanation.
- Why it matters.
- Verification status.
- Source notes.
- Public display status.

#### 13. First Listen vs Deep Listen

A high-value entertainment section that shows how the song changes after analysis.

Purpose:

- Makes the value of the website immediately clear.
- Gives the reader a simple before/after experience.
- Creates a strong short-form or YouTube segment.

Recommended subfields:

- First-listen impression.
- Deep-listen reveal.
- Changed interpretation.
- Best example bar ID.

#### 14. Viewer Engagement Prompts

The existing YouTube-ready angle should be expanded with prompts that create audience participation.

Purpose:

- Helps creators turn analysis into comments, polls, quizzes, and community posts.
- Makes every breakdown easier to repurpose across YouTube, Shorts, Instagram, TikTok, and newsletters.

Recommended subfields:

- Comment prompt.
- Poll question.
- Poll options.
- Quiz question.
- Quiz answer.
- Community post prompt.

#### 15. Verification and Source Status

This is especially important for Did You Know cards, samples, dates, producer credits, and real-world references.

Purpose:

- Protects trust.
- Prevents unsupported claims.
- Allows the site to show facts confidently or hide them until reviewed.

Status levels:

- `derived_from_lyrics`
- `metadata_provided`
- `internal_archive_match`
- `external_source_needed`
- `verified_external_source`
- `do_not_publish_yet`

### 3A.4 Recommended New Website Modules

Add these optional modules to the song page:

1. **The Thesis:** the one-line argument of the breakdown.
2. **What You Might Have Missed:** the overlooked reference, pivot, rhyme trick, or meaning layer.
3. **Emotional Arc:** a visual beginning-to-ending mood path.
4. **Production & Performance:** how the beat and delivery shape the meaning.
5. **Did You Know:** verified context nuggets.
6. **Reference Ledger:** searchable cultural, historical, musical, and lyrical references.
7. **Rewind Triggers:** moments worth replaying.
8. **First Listen vs Deep Listen:** what changes after analysis.
9. **Listener Lens:** casual listener vs. deep listener vs. creator angle.
10. **Tension Map:** the philosophical or emotional conflict inside the song.
11. **Visual Translation:** B-roll, thumbnail symbols, quote-card moments, and visual motifs.

### 3A.5 Enrichment Display Rules

Only display an enrichment module publicly when at least one of these is true:

- It helps explain the song.
- It makes the page more entertaining.
- It gives the creator a better video angle.
- It connects the song to another song, artist, producer, sample, motif, or reference.
- It gives a viewer a clean "did you catch that?" moment.

Hide or mark for review when:

- The information is not verified.
- The claim depends on outside facts that have not been sourced.
- The note feels like filler.
- The note distracts from the artist's intent.

### 3A.6 Enrichment Scoring

Use a simple internal scoring model to decide what should be surfaced.

```txt
0 = do not display
1 = keep as private raw note
2 = display inside full analysis only
3 = display as sidebar nugget
4 = display as featured card
5 = strong enough for YouTube hook, Short, or thumbnail concept
```

Criteria:

- Relevance to the song.
- Entertainment value.
- Verification confidence.
- Creator usefulness.
- Connection value to other songs.
- Emotional or technical impact.

### 3A.7 Bottom Line

The best new layer is not a random trivia section.

The best new layer is:

> a verified Context Nuggets system supported by emotional arc, production meaning, performance notes, rewind triggers, and listener reaction mapping.

This gives every Song Soliloquy page more personality, more replay value, and more video potential while keeping the analysis serious.

---

## 4. Core User Types

### 4.1 Primary User: Creator / Analyst

The main user is someone who creates lyric breakdowns, YouTube essays, reaction videos, shorts, podcast episodes, or written analysis.

They need:

- Fast upload
- Clean song pages
- Copyable quotes
- Key bar extraction
- Hottest bar detection
- YouTube hook support
- NotebookLM exports
- B-roll ideas
- Similar-song connections
- Searchable archive

### 4.2 Secondary User: Viewer / Reader

A public visitor wants to explore a song breakdown in a way that feels entertaining, readable, and deep.

They need:

- Clear page structure
- Annotated lyrics
- Plain-language explanations
- Deeper meaning
- Cultural context
- Technical notes without confusion
- Strong visual hierarchy
- Related songs and themes

### 4.3 Future User: Contributor / Researcher

A contributor may add song data, references, sources, or corrections.

They need:

- Clear contribution rules
- File templates
- Content validation
- Style guide
- Issue templates
- Pull request checklist

---

## 5. Recommended Architecture

### Option A: Content-Driven Static Site

Best for the first public version.

How it works:

- Song breakdowns live as Markdown files in `content/breakdowns/`.
- Each file has YAML frontmatter and structured sections.
- A static site generator builds public pages.
- Search indexes and connection maps are generated at build time.
- GitHub Actions validates and deploys the site.

Recommended stack:

- Next.js, Astro, or SvelteKit
- Markdown/MDX for content
- JSON schema validation
- GitHub Actions for checks
- Vercel, Netlify, Cloudflare Pages, or GitHub Pages for deployment

Benefits:

- Simple to maintain
- Easy to version
- Easy to review changes
- Good for SEO
- Fast public pages
- Content can live in GitHub

Limitations:

- Upload/editing may require an admin interface later
- Build step needed for every content update
- Dynamic user features require extra backend services

### Option B: Dynamic App With Database

Best for a more advanced version.

How it works:

- Website has an admin upload panel.
- Files are uploaded through the website.
- Parser extracts fields and stores structured data in a database.
- Song pages render dynamically.

Possible stack:

- Next.js app router
- Supabase, Neon/Postgres, Firebase, or PlanetScale
- Object storage for uploaded files
- Auth for admin/editor accounts
- API routes for parsing and validation

Benefits:

- Better upload experience
- Easier editing from the browser
- Good for multiple users
- Better for private/public publishing controls

Limitations:

- More moving parts
- Database maintenance
- Auth/security required
- More engineering work

### Option C: Hybrid Approach - Recommended

Start with GitHub as the content source, then add a database/admin layer later.

Phase 1:

- Markdown files in GitHub
- Static site generation
- Manual upload/commit workflow
- Strong schema and folder structure

Phase 2:

- Admin upload interface
- Parser converts Markdown to JSON
- Validated content can still be exported back to GitHub
- Database powers search, filters, and connection graph

This keeps the first version simple while leaving room for growth.

---

## 6. Repository Structure

Recommended structure for a dedicated Song Soliloquy website repository:

```txt
song-soliloquy/
  README.md
  LICENSE
  .gitignore
  package.json
  .env.example

  app/
    page.tsx
    upload/
      page.tsx
    library/
      page.tsx
    songs/
      [slug]/
        page.tsx
    artists/
      [slug]/
        page.tsx
    producers/
      [slug]/
        page.tsx
    themes/
      [slug]/
        page.tsx
    api/
      parse-breakdown/
        route.ts
      validate-breakdown/
        route.ts

  src/
    components/
      layout/
      navigation/
      upload/
      song/
      lyrics/
      analysis/
      key-bars/
      hottest-bar/
      enrichment/
      notebooklm/
      youtube/
      connection-web/
      research-vault/
      export/
      ui/
    lib/
      parser/
      schema/
      search/
      slugify/
      connections/
      enrichment/
      scoring/
      verification/
      export/
    styles/
      tokens.css
      globals.css
      themes/
        theme-01-noir-gold.css
        theme-02-midnight-rose-chrome.css

  content/
    breakdowns/
      ransom-pride-song-soliloquy-breakdown.md
      artist-song-title-song-soliloquy-breakdown.md
    data/
      artists.json
      producers.json
      themes.json
      references.json
      songs.json
      connection-graph.json
    drafts/
    archived/

  schemas/
    song-analysis.schema.json
    song-frontmatter.schema.json
    connection.schema.json
    enrichment.schema.json
    did-you-know.schema.json
    youtube-angle.schema.json
    notebooklm-pack.schema.json

  scripts/
    parse-markdown-to-json.ts
    validate-breakdowns.ts
    generate-search-index.ts
    generate-connection-graph.ts
    generate-enrichment-report.ts
    verify-context-nuggets.ts
    check-slugs.ts
    export-notebooklm-pack.ts

  public/
    images/
    quote-cards/
    thumbnails/
    icons/

  docs/
    PRODUCT_BRIEF.md
    CONTENT_SCHEMA.md
    UPLOAD_FILE_SPEC.md
    DESIGN_SYSTEM.md
    FIGMA_PROMPT_ORIGINAL.md
    FIGMA_PATCH_MIDNIGHT_ROSE_CHROME.md
    CONTENT_WORKFLOW.md
    ENRICHMENT_LAYER_SPEC.md
    DID_YOU_KNOW_CARD_SPEC.md
    CONTRIBUTING.md
    COPYRIGHT_AND_LYRICS_POLICY.md
    ROADMAP.md

  .github/
    workflows/
      validate-content.yml
      build-preview.yml
      deploy-site.yml
      generate-indexes.yml
    ISSUE_TEMPLATE/
      bug_report.md
      content_correction.md
      feature_request.md
      song_analysis_request.md
    pull_request_template.md
```

For a larger `homeadeas` repository with multiple ideas, place Song Soliloquy under a project folder:

```txt
homeadeas/
  projects/
    song-soliloquy/
      README.md
      docs/
      schemas/
      content/
      design/
      prompts/
```

---

## 7. Master Upload File Format

The preferred master upload file is Markdown.

Reason:

- Human readable
- GitHub friendly
- Easy to version
- Easy to convert into HTML, JSON, PDF, DOCX, or CMS content
- Preserves headings, quotes, metadata, and long-form analysis
- Works well for NotebookLM, future website ingestion, and content archiving

Recommended filename format:

```txt
artist-song-title-song-soliloquy-breakdown.md
```

Example:

```txt
ransom-pride-song-soliloquy-breakdown.md
```

The website should also support a machine-readable JSON file later:

```txt
artist-song-title-song-soliloquy-breakdown.json
```

Best approach:

- Markdown is the editorial/source archive.
- JSON is the parsed machine-readable data.
- The website can generate JSON from Markdown during upload or build.

---

## 8. Markdown Frontmatter Template

Each song breakdown should begin with frontmatter like this:

```yaml
---
id: "artist-song-title"
slug: "artist-song-title-song-soliloquy-breakdown"
status: "draft" # draft, review, published, archived
visibility: "private" # private, unlisted, public

song:
  title: ""
  artist: ""
  featured_artists: []
  producer: ""
  project: ""
  track_number: ""
  release_date: ""

analysis:
  overall_mood: ""
  main_themes: []
  narrative_perspective: ""
  narrator_profile: ""
  emotional_intensity_score: null
  technical_density_score: null
  quotability_score: null
  youtube_potential_score: null
  notebooklm_readiness_score: null

content:
  has_lyrics: true
  has_bar_analysis: true
  has_key_bars: true
  has_hottest_bar: true
  has_raw_notes: true
  has_notebooklm_pack: true
  has_youtube_angle: true
  has_connection_web: false

website:
  seo_title: ""
  meta_description: ""
  url_slug: ""
  thumbnail_text: []
  tags: []
  canonical_artist_slug: ""
  canonical_producer_slug: ""

connections:
  bpm: null
  key: ""
  chord_progression: ""
  samples_used: []
  pop_culture_references: []
  lyric_wordplay_tags: []
  similar_songs: []
  related_artists: []
  related_themes: []

enrichment:
  executive_thesis: ""
  what_you_might_have_missed: []
  emotional_arc:
    opening_state: ""
    turning_point: ""
    closing_state: ""
    final_listener_impression: ""
  production_to_meaning:
    tempo_feel: ""
    beat_texture: ""
    sample_or_loop_mood: ""
    drum_pocket: ""
    bass_low_end_mood: ""
    space_or_silence: ""
    vocal_delivery: ""
    meaning_connection: ""
  performance_notes:
    cadence: []
    flow_switches: []
    emphasis_points: []
    adlibs: []
  did_you_know:
    enabled: false
    items: []
  reference_ledger: []
  rewind_triggers: []
  first_listen_vs_deep_listen:
    first_listen_impression: ""
    deep_listen_reveal: ""
    changed_interpretation: ""
    best_example_bar_id: ""
  bar_function_tags: []
  listener_reaction_map:
    casual_listener: ""
    rap_nerd: ""
    creator: ""
    new_listener: ""
  tension_map:
    central_tension: ""
    competing_forces: []
  visual_translation:
    color_palette: []
    b_roll_motifs: []
    thumbnail_symbols: []
    quote_card_candidates: []
  viewer_engagement:
    comment_prompt: ""
    poll_question: ""
    poll_options: []
    quiz_question: ""
    quiz_answer: ""
    community_post_prompt: ""
  verification:
    needs_fact_check: []
    confidence_notes: []

rights:
  lyrics_source: ""
  lyrics_license_status: "unknown"
  public_lyrics_display: "review_required"
  notes: ""

created_at: ""
updated_at: ""
---
```

---

## 9. Markdown Body Template

Every breakdown file should follow this structure:

```md
# Song Title - Artist | Song Soliloquy Breakdown

## 1. Song Context

- Artist:
- Song:
- Producer:
- Project/Album:
- Release date:
- Overall mood:
- Main themes:
- Narrative perspective:

## 2. Lyrics

> Add lyrics or selected lyric excerpts here, depending on publishing rights.

## 3. Comprehensive Bar Analysis

### Bar 01

**BAR:**
> "Quoted bar here"

**BREAKDOWN:**
Plain-language explanation.

**DEEPER READ:**
Layered meaning, symbolism, subtext, or philosophy.

**TECHNICAL NOTES:**
Rhyme scheme, cadence, alliteration, punchline, metaphor, double entendre, imagery.

**WHY IT HITS:**
Why the bar matters emotionally, intellectually, stylistically, or narratively.

**TAGS:**
- Emotional
- Technical
- Philosophical
- Street Wisdom

## 4. Raw Notes

### First Impressions

### Major Themes

### Possible Title Ideas

### Recurring Motifs

### Best Discussion Points

### Strongest Quotables

### Questions the Song Raises

### Possible Visual Ideas

### Possible B-roll Ideas

### Related Songs / Artists / Themes to Compare

## 5. Key Bars Detection

### Key Bar 01

> "Quoted bar"

- Why it is important:
- Theme represented:
- Classification:
  - Emotional bar
  - Technical bar
  - Philosophical bar
  - Street wisdom bar
  - Punchline bar
  - Narrative bar
  - Cultural reference bar

## 6. Hottest Bar Detection

**HOTTEST BAR:**
> "Quoted bar"

**WHY IT WINS:**
Explanation.

**WHAT MAKES IT HOT:**

- Surface meaning:
- Hidden meaning:
- Technical craft:
- Viewer reaction potential:
- YouTube discussion value:

## 7. NotebookLM Source Pack

### Lyrics Section

### Song Metadata

### Main Themes

### Character / Narrator Profile

### Bar-by-Bar Analysis

### Key Bars

### Hottest Bar

### Vocabulary / Glossary

### Cultural References

### Similar Songs or Comparison Points

### Questions NotebookLM Should Answer

### Suggested Podcast-Style Discussion Prompts

## 8. NotebookLM Questions

## 9. YouTube-Ready Angle

- Best YouTube title:
- Hook/opening line:
- Main thesis:
- Three strongest talking points:
- Best quote to open with:
- Best quote to end with:
- Suggested thumbnail text:

## 10. Enrichment Layer

### Executive Thesis

### What You Might Have Missed

- Title:
- Explanation:
- Related bar ID:
- Value type:
- Confidence:

### Emotional Arc

- Opening state:
- Turning point:
- Closing state:
- Final listener impression:

### Production-to-Meaning Notes

- Tempo feel:
- Beat texture:
- Sample/loop mood:
- Drum pocket:
- Bass/low-end mood:
- Space/silence:
- Vocal delivery:
- How production affects meaning:

### Performance and Delivery Notes

- Cadence:
- Flow switches:
- Pause/emphasis moments:
- Ad-lib function:

### Did You Know / Context Nuggets

#### Nugget 01

- Title:
- Fact:
- Why it matters:
- Source type:
- Source URL or note:
- Confidence: unverified / needs_review / verified
- Display mode: sidebar / inline / card / hidden_until_verified

### Reference Ledger

- Reference text:
- Reference type:
- Related bar ID:
- Plain explanation:
- Why it matters:
- Verification status:
- Source notes:
- Public display:

### Rewind Triggers

- Bar or moment:
- Trigger type:
- Why it makes the listener run it back:

### Bar Function Map

- Bar ID:
- Function: thesis / setup / pivot / confession / warning / flex / worldview / payoff
- Reason:

### First Listen vs Deep Listen

- First-listen impression:
- Deep-listen reveal:
- Changed interpretation:
- Best example bar ID:

### Listener Reaction Map

- Casual listener:
- Rap nerd:
- Creator angle:
- New listener takeaway:

### Tension Map

- Central tension:
- Competing forces:

### Visual Translation Pack

- Color palette:
- Visual motifs:
- B-roll motifs:
- Thumbnail symbols:
- Quote-card candidates:

### Viewer Engagement Prompts

- Comment prompt:
- Poll question:
- Poll options:
- Quiz question:
- Quiz answer:
- Community post prompt:

## 11. Website Metadata

- Suggested SEO title:
- Suggested meta description:
- Suggested URL slug:
- Tags:
- Similar songs/comparison points:
```

---

## 10. JSON Data Contract

The website parser should convert Markdown into this general JSON shape.

```json
{
  "metadata": {
    "artist": "",
    "song": "",
    "producer": "",
    "project": "",
    "release_date": "",
    "featured_artists": [],
    "track_number": "",
    "overall_mood": "",
    "main_themes": [],
    "narrative_perspective": ""
  },
  "lyrics": [
    {
      "section": "Verse 1",
      "lines": []
    }
  ],
  "bar_analysis": [
    {
      "bar_id": "bar-001",
      "section": "Verse 1",
      "bar": "",
      "breakdown": "",
      "deeper_read": "",
      "technical_notes": "",
      "why_it_hits": "",
      "tags": [],
      "themes": [],
      "references": [],
      "bar_type": []
    }
  ],
  "raw_notes": {
    "first_impressions": [],
    "major_themes": [],
    "possible_title_ideas": [],
    "recurring_motifs": [],
    "best_discussion_points": [],
    "strongest_quotables": [],
    "questions_the_song_raises": [],
    "possible_visual_ideas": [],
    "possible_b_roll_ideas": [],
    "related_songs_artists_themes": []
  },
  "key_bars": [
    {
      "bar": "",
      "why_important": "",
      "theme": "",
      "classification": []
    }
  ],
  "hottest_bar": {
    "bar": "",
    "why_it_wins": "",
    "surface_meaning": "",
    "hidden_meaning": "",
    "technical_craft": "",
    "viewer_reaction_potential": "",
    "youtube_discussion_value": ""
  },
  "notebooklm_source_pack": {
    "lyrics": "",
    "song_metadata": {},
    "main_themes": [],
    "character_narrator_profile": "",
    "bar_by_bar_analysis": [],
    "key_bars": [],
    "hottest_bar": {},
    "vocabulary_glossary": [],
    "cultural_references": [],
    "similar_songs_or_comparison_points": [],
    "questions": [],
    "podcast_discussion_prompts": []
  },
  "youtube_ready_angle": {
    "best_youtube_title": "",
    "hook_opening_line": "",
    "main_thesis": "",
    "three_strongest_talking_points": [],
    "best_quote_to_open_with": "",
    "best_quote_to_end_with": "",
    "suggested_thumbnail_text": []
  },
  "enrichment": {
    "executive_thesis": "",
    "what_you_might_have_missed": [
      {
        "title": "",
        "explanation": "",
        "related_bar_id": "",
        "value_type": "hidden_meaning | rhyme_craft | reference | production | callback | narrative_pivot",
        "confidence": "low | medium | high"
      }
    ],
    "emotional_arc": {
      "opening_state": "",
      "turning_point": "",
      "closing_state": "",
      "final_listener_impression": ""
    },
    "production_to_meaning": {
      "tempo_feel": "",
      "beat_texture": "",
      "sample_or_loop_mood": "",
      "drum_pocket": "",
      "bass_low_end_mood": "",
      "space_or_silence": "",
      "vocal_delivery": "",
      "meaning_connection": ""
    },
    "performance_notes": {
      "cadence": [],
      "flow_switches": [],
      "emphasis_points": [],
      "adlibs": []
    },
    "did_you_know": [
      {
        "title": "",
        "fact": "",
        "why_it_matters": "",
        "source_type": "lyrics | metadata | external_source | internal_archive | analyst_note",
        "source_url": "",
        "confidence": "unverified | needs_review | verified",
        "display_mode": "sidebar | inline | card | hidden_until_verified",
        "entertainment_value_score": null
      }
    ],
    "reference_ledger": [
      {
        "reference_id": "ref-001",
        "reference_text": "",
        "reference_type": "cultural | religious | historical | sports | film_tv | street | personal | music | literary | business | legal",
        "related_bar_id": "",
        "plain_explanation": "",
        "why_it_matters": "",
        "verification_status": "verified | likely | inferred | unknown",
        "source_notes": "",
        "public_display": true
      }
    ],
    "rewind_triggers": [
      {
        "bar_id": "",
        "moment": "",
        "trigger_type": "double_meaning | reference | delivery_switch | emotional_reveal | rhyme_density | beat_moment | punchline_reversal",
        "why_replayable": ""
      }
    ],
    "bar_function_map": [
      {
        "bar_id": "",
        "function": "thesis | setup | pivot | confession | threat | flex | warning | memory | prayer | moral_conflict | scene_setting | payoff | worldview",
        "reason": ""
      }
    ],
    "first_listen_vs_deep_listen": {
      "first_listen_impression": "",
      "deep_listen_reveal": "",
      "changed_interpretation": "",
      "best_example_bar_id": ""
    },
    "listener_reaction_map": {
      "casual_listener": "",
      "rap_nerd": "",
      "creator": "",
      "new_listener": ""
    },
    "tension_map": {
      "central_tension": "",
      "competing_forces": []
    },
    "visual_translation": {
      "color_palette": [],
      "visual_motifs": [],
      "b_roll_motifs": [],
      "thumbnail_symbols": [],
      "quote_card_candidates": []
    },
    "viewer_engagement": {
      "comment_prompt": "",
      "poll_question": "",
      "poll_options": [],
      "quiz_question": "",
      "quiz_answer": "",
      "community_post_prompt": ""
    },
    "verification": {
      "needs_fact_check": [],
      "confidence_notes": [],
      "public_display_status": "draft | review_required | approved"
    }
  },
  "connections": {
    "bpm": null,
    "key": "",
    "chord_progression": "",
    "samples_used": [],
    "pop_culture_references": [],
    "lyric_wordplay": [],
    "similar_songs": []
  }
}
```

---

## 11. Website Pages

### 11.1 Homepage

Purpose:

- Explain the platform.
- Show the visual identity.
- Push users to upload or explore a demo.

Required sections:

- Hero
- Upload CTA
- Product explanation
- Demo dashboard preview
- Creator benefits
- Recent analyses
- Footer

### 11.2 Upload / Import Page

Purpose:

- Accept Markdown, JSON, TXT, DOCX, or PDF analysis files.
- Parse content into structured fields.
- Let the user review metadata before publishing.

Required states:

- Empty
- Hover
- Uploading
- Parsing
- Validation error
- Success
- Metadata review

### 11.3 Analysis Library

Purpose:

- Search and filter all published song breakdowns.

Filters:

- Artist
- Producer
- Project
- Mood
- Theme
- Bar type
- Release year
- Upload date
- Hottest bar score
- Has NotebookLM pack
- Has YouTube angle
- Has connection data

### 11.4 Song Analysis Detail Page

Purpose:

- Display the full interactive breakdown for one song.

Required sections:

- Song header
- Quick stats
- Song context
- Lyrics
- Comprehensive bar analysis
- Key bars
- Hottest bar
- The Thesis
- Emotional arc
- Production and performance notes
- Did You Know / context nuggets
- Rewind triggers
- Listener reaction map
- Tension map
- Themes
- References
- Raw notes
- NotebookLM pack
- NotebookLM questions
- YouTube-ready angle
- Similar songs
- Export tools

### 11.5 Bar Explorer

Purpose:

- Let users filter bars by function and impact.

Filters:

- Emotional
- Technical
- Philosophical
- Street Wisdom
- Punchline
- Narrative
- Cultural Reference
- Religious Reference
- Historical Reference
- Personal Confession

### 11.6 Hottest Bar Page

Purpose:

- Spotlight the best bar and explain why it wins.

Required fields:

- Hottest bar quote
- Score
- Why it wins
- Surface meaning
- Hidden meaning
- Technical craft
- Viewer reaction potential
- YouTube discussion value

### 11.7 NotebookLM Source Pack Page

Purpose:

- Present a clean source document for copying or exporting.

Exports:

- Markdown
- PDF
- TXT
- Google Docs future integration

### 11.8 YouTube Script Lab

Purpose:

- Turn analysis into creator assets.

Required fields:

- Best title
- Hook
- Main thesis
- Three talking points
- Opening quote
- Ending quote
- Thumbnail text
- Shorts hooks
- B-roll ideas

### 11.9 Connection Web

Purpose:

- Show how songs connect by musical, lyrical, cultural, and thematic traits.

Connection types:

- BPM similarity
- Key/chord progression
- Shared samples
- Similar instrumentation
- Pop culture references
- Lyric wordplay
- Similar themes
- Same producer
- Similar mood
- Same artist era
- Similar narrative perspective
- YouTube comparison angle

### 11.10 Research Vault

Purpose:

- Store reusable knowledge across songs.

Categories:

- Vocabulary / glossary
- Cultural references
- Religious references
- Historical references
- Street terminology
- Producer notes
- Sample notes
- Similar artists
- Similar songs
- Recurring motifs
- Visual / B-roll references
- YouTube title archive
- Thumbnail text archive

---

## 12. Design System

Song Soliloquy should support more than one visual theme.

### Theme 01: Noir Archive / Black Gold

Mood:

- Black background
- Burnished gold accents
- Smoke, paper grain, lyric manuscript energy
- Noir archive, rap scholar notebook, evidence board

Use for:

- Classic Song Soliloquy look
- Serious archival presentation
- Cinematic essay style

### Theme 02: Midnight Matte / Rose Chrome

Mood:

- Deep matte midnight blue
- Rose gold accents
- Chrome technical surfaces
- Luxury recording studio after midnight
- Premium lyric-analysis command center

Core palette:

```css
:root[data-theme="midnight-rose-chrome"] {
  --color-deep-midnight-blue: #030B1A;
  --color-matte-navy-black: #061225;
  --color-ink-blue: #081A33;
  --color-smoked-blue-charcoal: #0D203A;
  --color-dark-steel-navy: #132A46;
  --color-matte-panel-blue: #0B1B31;
  --color-elevated-card-navy: #10243E;
  --color-soft-glass-navy: #132B49;

  --color-rose-gold-primary: #B76E79;
  --color-soft-rose-gold: #D8A0A8;
  --color-burnished-rose: #8F4E5A;
  --color-pale-champagne-rose: #E7C2B8;

  --color-polished-chrome: #D7DEE8;
  --color-liquid-silver: #B8C2CE;
  --color-cool-steel: #8C99A8;
  --color-dark-chrome: #4A5665;

  --color-main-text: #F4F7FA;
  --color-secondary-text: #B9C4D0;
  --color-muted-text: #7F8EA0;
}
```

Theme meaning:

- Deep blue represents depth, memory, solitude, and deep listening.
- Rose gold represents emotional impact, soul, pain, wisdom, and hottest-bar moments.
- Chrome represents analysis, metadata, technical craft, rhyme structure, and precision.

---

## 13. Component Inventory

Required components:

### Layout

- Top navigation
- Left sidebar navigation
- Mobile bottom navigation
- Footer
- Page header
- Breadcrumbs

### Upload

- Drag-and-drop upload box
- File preview card
- Upload progress meter
- Parsing checklist
- Validation error alert
- Success confirmation
- Metadata review form

### Song Analysis

- Song header
- Metadata panel
- Narrator profile card
- Quick stats card
- Emotional arc meter
- Technical density meter
- Quotability meter
- YouTube potential meter
- NotebookLM readiness meter
- Executive thesis card
- What You Might Have Missed card
- Emotional arc timeline
- Production-to-meaning card
- Performance/delivery card
- Did You Know context nugget card
- Reference ledger drawer
- Rewind trigger chip
- First Listen vs Deep Listen split card
- Listener reaction map card
- Tension map card

### Lyrics

- Annotated lyrics panel
- Clickable lyric line
- Line status markers
- Key bar underline
- Hottest bar badge
- Cultural reference underline
- Performance view markers

### Bar Analysis

- Bar analysis card
- Collapsible breakdown section
- Deeper read section
- Technical notes section
- Why it hits section
- Bar type tags
- Copy button
- Save to notes button
- Add to YouTube script button
- Add to NotebookLM pack button

### Key Bars and Hottest Bar

- Key bar ranked card
- Hottest bar spotlight card
- Hottest bar score gauge
- Quote card export preview

### Creator Tools

- Raw note card
- Creator scratchpad
- YouTube title card
- Hook card
- Talking point card
- Thumbnail text plate
- Shorts hook card
- Visual translation pack card
- Quote-card candidate selector
- Viewer engagement prompt card

### Research and Connections

- Connection web node
- Connection web edge
- Node side drawer
- Reference card
- Glossary card
- Similar-song card
- Research vault table

### Export

- Export modal
- Export checkbox
- Copy confirmation toast
- Download format selector

---

## 14. Upload and Parsing Workflow

### 14.1 Input File Types

The website should eventually accept:

- `.md`
- `.json`
- `.txt`
- `.docx`
- `.pdf`
- `.ssol` future custom package

Phase 1 should prioritize:

1. Markdown
2. JSON

### 14.2 Parser Steps

1. Read file.
2. Detect file type.
3. Extract frontmatter if present.
4. Identify required sections.
5. Parse song metadata.
6. Parse lyrics.
7. Parse bar analysis blocks.
8. Parse raw notes.
9. Parse key bars.
10. Parse hottest bar.
11. Parse NotebookLM pack.
12. Parse YouTube-ready angle.
13. Parse connection data.
14. Parse enrichment fields.
15. Parse executive thesis.
16. Parse What You Might Have Missed cards.
17. Parse emotional arc.
18. Parse production-to-meaning notes.
19. Parse performance and delivery notes.
20. Parse Did You Know / context nugget cards.
21. Parse reference ledger.
22. Parse rewind triggers.
23. Parse bar function map.
24. Parse First Listen vs Deep Listen.
25. Parse listener reaction map.
26. Parse tension map.
27. Parse visual translation pack.
28. Parse viewer engagement prompts.
29. Validate required fields.
30. Validate verification status for publishable context nuggets.
31. Generate slug if missing.
32. Generate search index fields.
33. Create preview page.
34. Save draft or publish.

### 14.3 Validation Rules

A valid breakdown should include:

- Song title
- Artist
- Producer, if known
- Project/album, if known
- Release date, if known
- Overall mood
- Main themes
- Narrative perspective
- At least one bar analysis card
- Key bars section
- Hottest bar section
- NotebookLM questions
- YouTube-ready angle
- SEO title
- Meta description
- URL slug

Warnings should appear for:

- Missing producer
- Missing release date
- No similar songs
- No cultural references
- No glossary
- No B-roll ideas
- Public lyrics display not reviewed
- Meta description too long
- Duplicate slug
- Did You Know card has no confidence status
- Did You Know card marked verified without a source note or approved internal evidence
- Production-to-meaning notes missing from a song where the beat/sample is central to the analysis
- No emotional arc for a narrative-heavy song
- No rewind triggers for a dense or highly technical song
- Enrichment module appears to contain filler rather than song-specific value

---

## 15. Search and Indexing

The site should generate a searchable index from the content files.

Searchable fields:

- Song title
- Artist
- Featured artists
- Producer
- Project
- Release date
- Mood
- Themes
- Bar text
- Bar tags
- References
- Glossary terms
- Similar songs
- YouTube titles
- Thumbnail text
- Raw notes
- Executive thesis
- Emotional arc
- Production-to-meaning notes
- Performance and delivery notes
- Did You Know cards
- What You Might Have Missed cards
- Reference ledger entries
- Rewind triggers
- First Listen vs Deep Listen
- Bar function tags
- Listener reaction map
- Tension map
- Visual translation pack

Generated file:

```txt
public/search-index.json
```

Search result types:

- Song result
- Bar result
- Artist result
- Producer result
- Theme result
- Reference result
- YouTube angle result

---

## 16. Connection Graph System

The connection graph should turn the archive into a web of related music analysis.

### 16.1 Connection Fields

Each song should support:

- BPM
- Key
- Chord progression
- Samples used
- Sample source
- Similar instrumentation
- Pop culture references
- Religious references
- Historical references
- Street terminology
- Lyric wordplay tags
- Similar songs
- Related artists
- Related producers
- Shared themes
- Similar narrative perspectives
- Similar emotional arc
- Similar production texture
- Similar bar functions
- Shared callbacks or catalog references
- Related YouTube discussion angle

### 16.2 Connection Types

```json
{
  "source_song_id": "",
  "target_song_id": "",
  "connection_type": "shared_theme",
  "connection_label": "Shared theme: betrayal",
  "strength": 0.82,
  "evidence": [
    {
      "bar": "",
      "note": ""
    }
  ],
  "youtube_angle": ""
}
```

### 16.3 Connection Strength Ideas

Connection strength can be calculated from:

- Same producer
- Same artist
- Shared tags
- Shared sample source
- Similar BPM range
- Same key
- Same mood
- Same references
- Similar bar classifications
- Similar emotional arc
- Shared rewind-trigger type
- Shared Did You Know reference type
- Similar YouTube thesis

---

## 17. GitHub Actions Automation Plan

### 17.1 Validate Content

Create `.github/workflows/validate-content.yml`.

```yaml
name: Validate Song Soliloquy Content

on:
  pull_request:
    paths:
      - "content/**"
      - "schemas/**"
      - "scripts/**"
  push:
    branches:
      - main
    paths:
      - "content/**"
      - "schemas/**"
      - "scripts/**"

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Validate breakdown files
        run: npm run validate:content

      - name: Check duplicate slugs
        run: npm run check:slugs
```

### 17.2 Generate Search Index

Create `.github/workflows/generate-indexes.yml`.

```yaml
name: Generate Search and Connection Indexes

on:
  push:
    branches:
      - main
    paths:
      - "content/**"
      - "scripts/**"

jobs:
  generate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Generate search index
        run: npm run generate:search

      - name: Generate connection graph
        run: npm run generate:connections
```

### 17.3 Deploy Site

Create `.github/workflows/deploy-site.yml` after choosing hosting.

For GitHub Pages, use GitHub Pages deployment actions.

For Vercel, connect the repository to Vercel and let Vercel build from `main`.

For Netlify or Cloudflare Pages, connect the repository and set build commands.

Suggested build commands:

```txt
npm ci
npm run build
```

Suggested output directory depends on framework:

- Next.js dynamic app: platform-specific
- Next.js static export: `out/`
- Astro: `dist/`
- SvelteKit static: `build/`

---

## 18. Issue Labels

Recommended GitHub labels:

```txt
area:website
area:upload-engine
area:schema
area:design-system
area:content
area:connection-web
area:enrichment-layer
area:did-you-know
area:verification
area:notebooklm
area:youtube-lab
area:research-vault
area:seo
area:accessibility
area:deployment
area:legal-review

type:bug
type:feature
type:content-update
type:design
type:documentation
type:refactor
type:research

priority:low
priority:medium
priority:high
priority:urgent

status:needs-review
status:blocked
status:ready
status:in-progress
status:done
```

---

## 19. Pull Request Checklist

Create `.github/pull_request_template.md`.

```md
# Song Soliloquy Pull Request

## Summary

Describe what changed.

## Type of Change

- [ ] Website feature
- [ ] Upload/parser update
- [ ] Content breakdown
- [ ] Schema change
- [ ] Design system update
- [ ] Connection graph update
- [ ] Documentation
- [ ] Bug fix

## Content Checklist

- [ ] Song title included
- [ ] Artist included
- [ ] Producer included or marked unknown
- [ ] Project/album included or marked unknown
- [ ] Release date included or marked unknown
- [ ] Song context included
- [ ] Bar analysis included
- [ ] Key bars included
- [ ] Hottest bar included
- [ ] Raw notes included
- [ ] NotebookLM pack included
- [ ] YouTube-ready angle included
- [ ] Website metadata included
- [ ] Enrichment layer reviewed
- [ ] Executive thesis included or marked not applicable
- [ ] Production/performance notes included or marked not applicable
- [ ] Did You Know cards are verified or hidden from public display
- [ ] Rewind triggers included or marked not applicable
- [ ] Slug is unique
- [ ] Lyrics rights/public display reviewed

## Technical Checklist

- [ ] Content validates against schema
- [ ] Search index updates correctly
- [ ] Connection graph updates correctly
- [ ] Page builds without error
- [ ] Mobile layout reviewed
- [ ] Accessibility reviewed

## Notes

Add anything reviewers should know.
```

---

## 20. Issue Templates

### 20.1 Song Analysis Request

```md
# Song Analysis Request

## Song Information

- Artist:
- Song:
- Producer:
- Project/Album:
- Release date:
- Lyrics source:

## Requested Output

- [ ] Full breakdown
- [ ] Bar-by-bar analysis
- [ ] Key bars
- [ ] Hottest bar
- [ ] Raw notes
- [ ] NotebookLM pack
- [ ] YouTube angle
- [ ] Similar-song connections
- [ ] Executive thesis
- [ ] Emotional arc
- [ ] Production/performance notes
- [ ] Did You Know / context nuggets
- [ ] Rewind triggers
- [ ] Listener reaction map
- [ ] Visual translation pack

## Notes

Add any special references, context, or angle.
```

### 20.2 Content Correction

```md
# Content Correction

## Page or File

Link or filename:

## Problem

Describe the issue.

## Correction

Provide the corrected information.

## Source / Reasoning

Add source or explanation.
```

### 20.3 Feature Request

```md
# Feature Request

## Feature

Describe the feature.

## Why It Matters

Explain how this improves Song Soliloquy.

## Related Workflow

- [ ] Upload engine
- [ ] Song page
- [ ] Bar explorer
- [ ] Hottest bar
- [ ] NotebookLM
- [ ] YouTube lab
- [ ] Connection web
- [ ] Research vault
- [ ] Export
```

---

## 21. Environment Variables

Create `.env.example`.

```txt
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Song Soliloquy

# Database - future
DATABASE_URL=

# File storage - future
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

# Auth - future
AUTH_SECRET=
AUTH_PROVIDER_CLIENT_ID=
AUTH_PROVIDER_CLIENT_SECRET=

# External APIs - future
GENIUS_API_TOKEN=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
YOUTUBE_API_KEY=

# Analytics - optional
NEXT_PUBLIC_ANALYTICS_ID=
```

Never commit real API keys or secrets to GitHub.

Use GitHub repository secrets or hosting-platform environment variables for production secrets.

---

## 22. Content Rights and Lyrics Note

Song Soliloquy is an analysis and commentary platform, but lyrics are usually copyrighted.

Recommended policy:

- Keep full lyrics in private source files if needed for analysis.
- For public pages, consider displaying selected excerpts with commentary rather than full lyrics unless proper rights/licensing are secured.
- Add a `rights` section to frontmatter.
- Add a review status before publishing any page that displays lyrics publicly.
- Keep notes about lyric source and licensing status.
- Consult qualified legal counsel before launching a public lyrics archive.

Suggested frontmatter fields:

```yaml
rights:
  lyrics_source: ""
  lyrics_license_status: "unknown"
  public_lyrics_display: "review_required"
  public_excerpt_strategy: "selected_excerpts_with_commentary"
  notes: ""
```

---

## 23. SEO Structure

Each published song page should include:

- SEO title
- Meta description
- URL slug
- Artist
- Song title
- Producer
- Project
- Release date
- Main themes
- Key bars
- Hottest bar
- Similar songs
- Open Graph title
- Open Graph description
- Social thumbnail

Suggested URL formats:

```txt
/songs/ransom-pride-song-soliloquy-breakdown
/artists/ransom
/producers/v-don
/themes/street-philosophy
/references/oedipus
/bars/hottest
```

Suggested SEO title pattern:

```txt
[Artist] - [Song] Breakdown: Bars, Meaning, Key Lines and Hottest Bar
```

Suggested meta description pattern:

```txt
A deep Song Soliloquy breakdown of [Artist]'s "[Song]," covering bar-by-bar meaning, technical craft, key bars, hottest bar, themes, references, and YouTube-ready analysis.
```

---

## 24. Roadmap

### Phase 0: Repository Setup

- Create GitHub repo.
- Add this blueprint.
- Add docs folder.
- Add content folder.
- Add schemas folder.
- Add initial README.
- Add `.env.example`.

### Phase 1: Content System

- Define Markdown template.
- Define JSON schema.
- Add sample breakdown file.
- Add parser script.
- Add validation script.
- Add search index script.
- Add enrichment schema.
- Add Did You Know card schema.
- Add verification status rules for context nuggets.

### Phase 2: Static Website Prototype

- Build homepage.
- Build upload page mock state.
- Build library page.
- Build song detail page.
- Build bar analysis cards.
- Build key bars and hottest bar components.
- Build NotebookLM and YouTube sections.
- Build executive thesis, emotional arc, Did You Know, production/performance, rewind trigger, and listener lens modules.

### Phase 3: Design System

- Add Theme 01 Noir Archive / Black Gold.
- Add Theme 02 Midnight Matte / Rose Chrome.
- Create shared tokens.
- Create component variants.
- Document accessibility rules.

### Phase 4: Upload Engine

- Parse Markdown upload.
- Parse JSON upload.
- Validate file.
- Show metadata review.
- Save draft.
- Publish page.

### Phase 5: Connection Web

- Add connection fields.
- Build connection graph generator.
- Add song nodes.
- Add theme, producer, sample, reference, and mood nodes.
- Add graph UI.

### Phase 6: Creator Dashboard

- Add YouTube script lab.
- Add copy/export tools.
- Add quote-card export.
- Add shorts hooks.
- Add thumbnail text archive.

### Phase 7: Public Launch

- Review copyright/lyrics policy.
- Add SEO metadata.
- Add analytics.
- Add sitemap.
- Add robots.txt.
- Add public/private visibility controls.
- Deploy production site.

---

## 25. Minimum Viable Product

The first working version should include:

1. Homepage.
2. Analysis library.
3. Song detail page.
4. Manual Markdown breakdown files in GitHub.
5. Parser or manual MDX rendering.
6. Key bars section.
7. Hottest bar section.
8. NotebookLM source pack section.
9. YouTube-ready angle section.
10. Basic search by artist, song, producer, and theme.
11. Theme 02 Midnight Matte / Rose Chrome visual direction.

MVP rule:

> Do not build the full upload engine before the content page works. First prove that one complete breakdown can become a beautiful, useful, interactive page.

---

## 26. Example First Tasks

Create these initial GitHub issues:

1. Create Song Soliloquy repo structure.
2. Add master Markdown breakdown template.
3. Add JSON schema for song analysis.
4. Add sample breakdown file.
5. Build homepage layout.
6. Build song detail page layout.
7. Build bar analysis card component.
8. Build hottest bar card component.
9. Build NotebookLM source pack component.
10. Build YouTube-ready angle component.
11. Add Midnight Matte / Rose Chrome theme tokens.
12. Add content validation workflow.
13. Add search-index generation script.
14. Add connection graph schema.
15. Add enrichment layer schema.
16. Add Did You Know card component and verification rules.
17. Add production/performance notes component.
18. Add emotional arc timeline component.
19. Draft copyright and lyrics display policy.

---

## 27. Definition of Done

A song breakdown is ready to publish when:

- Metadata is complete.
- Markdown validates.
- Slug is unique.
- Song page renders correctly.
- Mobile layout is readable.
- Key bars display correctly.
- Hottest bar displays correctly.
- NotebookLM pack copies correctly.
- YouTube angle exports correctly.
- Search index includes the song.
- Connection graph updates.
- Enrichment layer is reviewed for usefulness.
- Did You Know cards are verified or hidden.
- Production/performance notes are present when central to the song.
- Emotional arc is present for narrative-heavy songs.
- SEO metadata is present.
- Public lyric display has been reviewed.

---

## 28. Enrichment Layer Implementation Spec

This section converts the workflow audit into buildable website logic.

### 28.1 Field Priority

```txt
Required for publishing:
- Metadata
- Song context
- Bar analysis
- Key bars
- Hottest bar
- NotebookLM questions
- YouTube-ready angle
- SEO metadata
- Rights/public display status

Recommended when useful:
- Executive thesis
- What You Might Have Missed
- Emotional arc
- Production-to-meaning notes
- Performance and delivery notes
- Reference ledger
- Rewind triggers
- First Listen vs Deep Listen
- Listener reaction map
- Tension map
- Visual translation pack
- Viewer engagement prompts

Conditional only when verified or clearly supported:
- Did You Know cards
- Sample origin facts
- Artist-era claims
- Historical context
- Real-world event references
- External comparison claims
```

### 28.2 Did You Know Card Rules

A Did You Know card should not be published just because it is interesting. It should be published only when it deepens the song.

Publish when:

- The fact explains a bar, sample, reference, or creative decision.
- The fact supports a YouTube talking point.
- The fact connects this song to another track, producer, sample, artist era, or cultural reference.
- The fact is verified or clearly marked as analysis.

Do not publish when:

- The fact is not sourced.
- The fact is gossip.
- The fact is filler.
- The fact distracts from the artist's intent.
- The fact requires legal or rights review and has not been cleared.

### 28.3 Suggested Enrichment UI Order

On the song detail page, enrichment should appear in this order:

1. Executive Thesis near the top of the page.
2. What You Might Have Missed immediately after the overview.
3. Emotional Arc after Song Context.
4. Production & Performance after Lyrics or before Bar Analysis.
5. Reference Ledger as a drawer or tab connected to bar cards.
6. Rewind Triggers beside Key Bars.
7. Did You Know cards in the right sidebar and inside relevant bar cards.
8. First Listen vs Deep Listen as a split-card after Song Context or before YouTube-ready angle.
9. Listener Reaction Map inside the YouTube-ready section.
10. Visual Translation Pack inside the YouTube Script Lab.
11. Viewer Engagement prompts inside the creator-only panel.
12. Verification notes hidden from public view unless user is an admin/editor.

### 28.4 New Components to Build

```txt
src/components/enrichment/ExecutiveThesisCard.tsx
src/components/enrichment/WhatYouMightHaveMissedCard.tsx
src/components/enrichment/EmotionalArcTimeline.tsx
src/components/enrichment/ProductionMeaningPanel.tsx
src/components/enrichment/PerformanceNotesPanel.tsx
src/components/enrichment/DidYouKnowCard.tsx
src/components/enrichment/ReferenceLedgerDrawer.tsx
src/components/enrichment/RewindTriggerList.tsx
src/components/enrichment/FirstListenDeepListenCard.tsx
src/components/enrichment/BarFunctionBadge.tsx
src/components/enrichment/ListenerReactionMap.tsx
src/components/enrichment/TensionMap.tsx
src/components/enrichment/VisualTranslationPack.tsx
src/components/enrichment/ViewerEngagementPrompts.tsx
src/components/enrichment/VerificationStatusBadge.tsx
```

### 28.5 New Schemas to Add

```txt
schemas/enrichment.schema.json
schemas/did-you-know.schema.json
schemas/what-you-might-have-missed.schema.json
schemas/reference-ledger.schema.json
schemas/production-meaning.schema.json
schemas/performance-notes.schema.json
schemas/first-listen-deep-listen.schema.json
schemas/viewer-engagement.schema.json
schemas/verification-status.schema.json
```

### 28.6 Admin Review States

```txt
draft = visible only to editors
needs_review = parsed but not approved
approved = safe for public display
hidden_until_verified = stored privately but not displayed
rejected = do not publish
```

### 28.7 Entertainment Value Without Forcing It

The website should never require a Did You Know card. Some songs are powerful because of plain emotional writing, not external trivia. The enrichment layer should respect that.

Best practice:

> If the enrichment note does not make the listener hear the song differently, leave it out.

---

## 29. Final Product Principle

Song Soliloquy should always protect the depth of the analysis.

Every technical decision should support this goal:

> Make the listener hear the song deeper than they did before.

Every page should help the user answer:

- What is the artist really saying?
- Why does the bar hit?
- What craft is hidden inside the line?
- What references make it richer?
- What does this reveal about the song's worldview?
- How can this become a strong video, essay, podcast, or research source?

---

## 30. Recommended Next Commit

After adding this file, the next commit could be:

```txt
git add docs/SONG_SOLILOQUY_REPOSITORY_BLUEPRINT.md
git commit -m "Add Song Soliloquy repository blueprint, enrichment audit, and Supabase backend patch"
git push
```

If using this as the root README:

```txt
git add README.md
git commit -m "Add Song Soliloquy README, enrichment audit, and Supabase backend patch"
git push
```

---

---

# Song Soliloquy Supabase Backend Integration Patch

Version: 2.2
Patch type: Backend architecture, database schema, upload workflow, security, and GitHub implementation plan
Recommended file path: `docs/patches/song-soliloquy-supabase-backend-integration-patch.md`

---

## 1. Purpose

This patch adds Supabase as the live backend for the Song Soliloquy website.

GitHub remains the source of truth for:

- Website code
- Database migrations
- Schema documentation
- Parser logic
- Validation rules
- Design prompts
- Content templates
- Issue tracking
- Release history

Supabase becomes the live application backend for:

- Uploaded breakdown files
- Parsed song records
- Analysis pages
- Lyrics sections and lyric-line annotations
- Bar-by-bar analysis cards
- Key bars
- Hottest bar records
- NotebookLM source packs
- YouTube-ready angle data
- Context Cards / Did You Know cards
- Reference ledger
- Song connection graph
- Search indexes
- User accounts and editor/admin roles
- Review states and publishing workflow
- Public website reads
- Private admin/editor writes

Core architecture principle:

> GitHub controls how the product is built. Supabase controls the live content, users, publishing states, search, and backend data relationships.

---

## 2. Why Supabase Fits Song Soliloquy

Supabase is a strong fit because Song Soliloquy needs structured data, flexible JSON, uploads, authentication, editorial review states, and fast website reads.

Song Soliloquy content is part document, part database record, and part creator dashboard. A Markdown file is perfect as the master upload/export artifact, but once the website needs search, filtering, public/private states, relation maps, tags, uploads, and dashboards, the content should also be parsed into database tables.

Recommended model:

1. Keep Markdown as the human-readable master upload/export file.
2. Parse the Markdown into structured JSON.
3. Store the original upload in Supabase Storage.
4. Store the parsed content in Supabase Postgres.
5. Render public song pages from Supabase.
6. Keep database changes versioned in GitHub migrations.
7. Use Supabase Auth and Row Level Security for admin/editor protection.

---

## 3. Backend Responsibilities

### 3.1 GitHub Responsibilities

GitHub should contain:

```txt
README.md
docs/
  SONG_SOLILOQUY_REPOSITORY_BLUEPRINT.md
  patches/
    song-soliloquy-supabase-backend-integration-patch.md
  schemas/
    song-analysis.schema.json
    enrichment.schema.json
    supabase-record.schema.json
supabase/
  config.toml
  migrations/
    000001_initial_song_soliloquy_schema.sql
    000002_storage_policies.sql
    000003_search_indexes.sql
src/
  lib/
    supabase/
      client.ts
      server.ts
      admin.ts
    parser/
      parse-song-soliloquy-markdown.ts
      validate-analysis-payload.ts
    actions/
      import-analysis-file.ts
      publish-song-analysis.ts
      update-song-analysis.ts
.github/
  workflows/
    supabase-migrations.yml
    web-ci.yml
```

### 3.2 Supabase Responsibilities

Supabase should contain:

```txt
Postgres tables
Supabase Auth users
Storage buckets
Row Level Security policies
Database functions
Search indexes
Optional Edge Functions
Optional Realtime hooks
Optional Vector search tables
```

### 3.3 Website Responsibilities

The website should:

1. Allow authenticated creators/editors to upload files.
2. Store the original file in Supabase Storage.
3. Parse the file into structured sections.
4. Insert or update database records.
5. Show an admin preview.
6. Let an editor approve, revise, or publish.
7. Render public pages only when the record is published.
8. Keep drafts private.
9. Expose search, filters, and connection-web data from Supabase.

---

## 4. Song Submission Workflow With Supabase

### 4.1 Upload Flow

```txt
User uploads .md or .json file
        |
        v
Next.js upload route or server action receives file
        |
        v
Original file saved to Supabase Storage bucket: analysis-imports
        |
        v
analysis_uploads row created with status = uploaded
        |
        v
Parser extracts metadata, lyrics, bar analysis, key bars, hottest bar, raw notes, NotebookLM pack, YouTube angle, context cards, references, and connection data
        |
        v
Parsed payload validated against JSON schema
        |
        v
Database transaction creates/updates song, analysis sections, bars, tags, references, search records, and connection records
        |
        v
analysis_uploads status changes to parsed or needs_review
        |
        v
Editor reviews preview
        |
        v
Editor publishes
        |
        v
Public website reads published record from Supabase
```

### 4.2 Import Statuses

Use these statuses in `analysis_uploads`:

```txt
uploaded
parsing
parsed
needs_review
failed
approved
published
archived
```

### 4.3 Publishing Statuses

Use these statuses in `songs.publication_status`:

```txt
draft
needs_review
approved
published
hidden_until_verified
archived
rejected
```

### 4.4 Rights and Lyrics Visibility

Use a separate visibility field for lyrics because public lyric display can create copyright risk.

Recommended values:

```txt
private_full_lyrics = full lyrics visible only to editor/admin
excerpt_only = public page shows only short necessary excerpts attached to commentary
public_full_lyrics = only use when rights/permission allow it
hidden = no lyrics displayed publicly
```

Best practice:

> Store full lyrics privately for analysis workflow if needed. Public pages should default to excerpt-only commentary unless rights clearance allows more.

---

## 5. Recommended Supabase Tables

### 5.1 Core Identity Tables

```txt
profiles
workspaces
workspace_members
```

Purpose:

- Track users from Supabase Auth.
- Support single-user mode now.
- Allow team/editor roles later.

### 5.2 Core Song Tables

```txt
songs
song_credits
artists
producers
projects
```

Purpose:

- Store canonical song metadata.
- Support multiple artists, featured artists, producers, albums, projects, and credits.

### 5.3 Import Tables

```txt
analysis_uploads
analysis_import_errors
```

Purpose:

- Store original uploaded files.
- Track parsing status.
- Log validation problems.

### 5.4 Analysis Content Tables

```txt
lyrics_sections
lyrics_lines
bar_analyses
key_bars
hottest_bars
raw_notes
notebooklm_packs
notebooklm_questions
youtube_angles
```

Purpose:

- Power the interactive song page.
- Let each section be searched, filtered, copied, exported, and used in creator tools.

### 5.5 Entertainment and Context Tables

```txt
context_cards
what_you_might_have_missed
production_lens_notes
performance_notes
reference_ledger
rewind_moments
emotional_arc_points
first_listen_deep_listen_notes
viewer_engagement_prompts
```

Purpose:

- Add optional entertainment-value layers without forcing trivia.
- Make each song page feel richer when the material supports it.

### 5.6 Tagging and Connection Tables

```txt
tags
song_tags
bar_tags
song_connections
connection_evidence
viewer_suggestions
```

Purpose:

- Support filtering by mood, theme, bar type, reference type, and creator value.
- Build the Connection Web.
- Connect songs by BPM, sample lineage, references, producer, theme, mood, wordplay, rhyme architecture, and catalog callbacks.

### 5.7 Search and AI Tables

```txt
search_documents
analysis_embeddings optional
```

Purpose:

- Use Postgres full-text search for normal search.
- Optionally use vector embeddings for semantic search later.

---

## 6. Starter SQL Migration

Create this as:

```txt
supabase/migrations/000001_initial_song_soliloquy_schema.sql
```

```sql
create extension if not exists pgcrypto;

-- Optional, only enable when semantic/vector search is ready.
-- create extension if not exists vector;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'creator' check (role in ('creator', 'editor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.producers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references public.artists(id) on delete set null,
  title text not null,
  slug text not null,
  release_date date,
  project_type text default 'album' check (project_type in ('album', 'ep', 'mixtape', 'soundtrack', 'single', 'freestyle', 'unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (artist_id, slug)
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  primary_artist_id uuid references public.artists(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  slug text not null,
  artist_display text not null,
  producer_display text,
  project_display text,
  release_date date,
  track_number text,
  overall_mood text,
  main_themes text[] not null default '{}',
  narrative_perspective text,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'needs_review', 'approved', 'published', 'hidden_until_verified', 'archived', 'rejected')),
  lyrics_visibility text not null default 'excerpt_only' check (lyrics_visibility in ('private_full_lyrics', 'excerpt_only', 'public_full_lyrics', 'hidden')),
  canonical_analysis jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table if not exists public.song_credits (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  person_name text not null,
  role text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_uploads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  song_id uuid references public.songs(id) on delete set null,
  uploaded_by uuid references auth.users(id) on delete set null,
  original_filename text not null,
  storage_bucket text not null default 'analysis-imports',
  storage_path text not null,
  file_type text not null,
  file_size_bytes bigint,
  status text not null default 'uploaded' check (status in ('uploaded', 'parsing', 'parsed', 'needs_review', 'failed', 'approved', 'published', 'archived')),
  parsed_payload jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_import_errors (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.analysis_uploads(id) on delete cascade,
  severity text not null default 'error' check (severity in ('info', 'warning', 'error')),
  field_path text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lyrics_sections (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  section_label text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lyrics_lines (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  section_id uuid references public.lyrics_sections(id) on delete cascade,
  line_text text not null,
  line_number integer,
  display_order integer not null default 0,
  is_public_excerpt boolean not null default false,
  is_key_bar boolean not null default false,
  is_hottest_bar boolean not null default false,
  annotations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.bar_analyses (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  lyrics_line_id uuid references public.lyrics_lines(id) on delete set null,
  bar_quote text not null,
  breakdown text,
  deeper_read text,
  technical_notes text,
  why_it_hits text,
  bar_types text[] not null default '{}',
  themes text[] not null default '{}',
  references jsonb not null default '[]'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.key_bars (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  bar_analysis_id uuid references public.bar_analyses(id) on delete set null,
  bar_quote text not null,
  why_important text,
  theme_represented text,
  classification text[] not null default '{}',
  emotional_weight numeric,
  technical_craft numeric,
  discussion_value numeric,
  rank_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.hottest_bars (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade unique,
  bar_analysis_id uuid references public.bar_analyses(id) on delete set null,
  bar_quote text not null,
  score numeric,
  why_it_wins text,
  surface_meaning text,
  hidden_meaning text,
  technical_craft text,
  viewer_reaction_potential text,
  youtube_discussion_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.raw_notes (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade unique,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notebooklm_packs (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade unique,
  source_pack jsonb not null default '{}'::jsonb,
  markdown text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notebooklm_questions (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  category text not null default 'general',
  question text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.youtube_angles (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade unique,
  best_youtube_title text,
  hook_opening_line text,
  main_thesis text,
  strongest_talking_points jsonb not null default '[]'::jsonb,
  best_quote_to_open_with text,
  best_quote_to_end_with text,
  suggested_thumbnail_text text[] not null default '{}',
  creator_notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.context_cards (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  card_type text not null check (card_type in ('did_you_know', 'what_you_might_have_missed', 'production_lens', 'performance_note', 'catalog_callback', 'reference_context', 'rewind_moment', 'first_listen_vs_deep_listen')),
  title text not null,
  body text not null,
  related_bar_quote text,
  evidence_status text not null default 'needs_verification' check (evidence_status in ('verified', 'likely', 'interpretive', 'needs_verification', 'unverified')),
  source_label text,
  source_url text,
  display_order integer not null default 0,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reference_ledger (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  reference_type text not null,
  reference_label text not null,
  explanation text,
  related_bar_quote text,
  verification_status text not null default 'needs_verification' check (verification_status in ('verified', 'likely', 'interpretive', 'needs_verification', 'unverified')),
  source_label text,
  source_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  tag_type text not null,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (tag_type, slug)
);

create table if not exists public.song_tags (
  song_id uuid not null references public.songs(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (song_id, tag_id)
);

create table if not exists public.bar_tags (
  bar_analysis_id uuid not null references public.bar_analyses(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (bar_analysis_id, tag_id)
);

create table if not exists public.song_connections (
  id uuid primary key default gen_random_uuid(),
  source_song_id uuid not null references public.songs(id) on delete cascade,
  target_song_id uuid references public.songs(id) on delete cascade,
  external_song_title text,
  external_artist_name text,
  connection_type text not null,
  connection_label text not null,
  explanation text,
  strength numeric,
  evidence_status text not null default 'interpretive' check (evidence_status in ('verified', 'likely', 'interpretive', 'needs_verification', 'unverified')),
  evidence jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.viewer_suggestions (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,
  suggestion_type text not null default 'song_connection',
  suggestion_body text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'accepted', 'rejected', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.search_documents (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs(id) on delete cascade,
  document_type text not null,
  title text not null,
  search_text text not null,
  search_vector tsvector generated always as (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(search_text, ''))) stored,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_songs_publication_status on public.songs(publication_status);
create index if not exists idx_songs_slug on public.songs(slug);
create index if not exists idx_bar_analyses_song_id on public.bar_analyses(song_id);
create index if not exists idx_lyrics_lines_song_id on public.lyrics_lines(song_id);
create index if not exists idx_key_bars_song_id on public.key_bars(song_id);
create index if not exists idx_context_cards_song_id on public.context_cards(song_id);
create index if not exists idx_reference_ledger_song_id on public.reference_ledger(song_id);
create index if not exists idx_song_connections_source on public.song_connections(source_song_id);
create index if not exists idx_search_documents_vector on public.search_documents using gin(search_vector);
```

---

## 7. Row Level Security Patch

Create this as:

```txt
supabase/migrations/000002_rls_policies.sql
```

RLS rules should make the public site readable while keeping drafts, private lyrics, uploads, and admin edits protected.

```sql
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.artists enable row level security;
alter table public.producers enable row level security;
alter table public.projects enable row level security;
alter table public.songs enable row level security;
alter table public.song_credits enable row level security;
alter table public.analysis_uploads enable row level security;
alter table public.analysis_import_errors enable row level security;
alter table public.lyrics_sections enable row level security;
alter table public.lyrics_lines enable row level security;
alter table public.bar_analyses enable row level security;
alter table public.key_bars enable row level security;
alter table public.hottest_bars enable row level security;
alter table public.raw_notes enable row level security;
alter table public.notebooklm_packs enable row level security;
alter table public.notebooklm_questions enable row level security;
alter table public.youtube_angles enable row level security;
alter table public.context_cards enable row level security;
alter table public.reference_ledger enable row level security;
alter table public.tags enable row level security;
alter table public.song_tags enable row level security;
alter table public.bar_tags enable row level security;
alter table public.song_connections enable row level security;
alter table public.viewer_suggestions enable row level security;
alter table public.search_documents enable row level security;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_workspace_editor(target_workspace_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
      and wm.role in ('owner', 'admin', 'editor')
  );
$$;

create or replace function public.song_is_published(target_song_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.songs s
    where s.id = target_song_id
      and s.publication_status = 'published'
  );
$$;

create policy "profiles can read own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy "profiles can update own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "workspace members can read workspace"
on public.workspaces for select
to authenticated
using (public.is_workspace_member(id));

create policy "workspace owners can update workspace"
on public.workspaces for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "public can read published songs"
on public.songs for select
to anon, authenticated
using (publication_status = 'published');

create policy "workspace members can read songs"
on public.songs for select
to authenticated
using (public.is_workspace_member(workspace_id));

create policy "workspace editors can insert songs"
on public.songs for insert
to authenticated
with check (public.is_workspace_editor(workspace_id));

create policy "workspace editors can update songs"
on public.songs for update
to authenticated
using (public.is_workspace_editor(workspace_id))
with check (public.is_workspace_editor(workspace_id));

create policy "public can read published bar analysis"
on public.bar_analyses for select
to anon, authenticated
using (public.song_is_published(song_id));

create policy "public can read published key bars"
on public.key_bars for select
to anon, authenticated
using (public.song_is_published(song_id));

create policy "public can read published hottest bars"
on public.hottest_bars for select
to anon, authenticated
using (public.song_is_published(song_id));

create policy "public can read published notebook questions"
on public.notebooklm_questions for select
to anon, authenticated
using (public.song_is_published(song_id));

create policy "public can read public context cards for published songs"
on public.context_cards for select
to anon, authenticated
using (is_public = true and public.song_is_published(song_id));

create policy "public can read public song connections for published songs"
on public.song_connections for select
to anon, authenticated
using (is_public = true and public.song_is_published(source_song_id));

create policy "public can read public search documents"
on public.search_documents for select
to anon, authenticated
using (is_public = true);

create policy "public can read public lyric excerpts only"
on public.lyrics_lines for select
to anon, authenticated
using (
  is_public_excerpt = true
  and exists (
    select 1
    from public.songs s
    where s.id = lyrics_lines.song_id
      and s.publication_status = 'published'
      and s.lyrics_visibility in ('excerpt_only', 'public_full_lyrics')
  )
);

create policy "workspace members can read private song detail tables"
on public.lyrics_lines for select
to authenticated
using (
  exists (
    select 1
    from public.songs s
    where s.id = lyrics_lines.song_id
      and public.is_workspace_member(s.workspace_id)
  )
);

create policy "workspace editors can manage uploads"
on public.analysis_uploads for all
to authenticated
using (public.is_workspace_editor(workspace_id))
with check (public.is_workspace_editor(workspace_id));
```

Important note:

> Add equivalent workspace editor insert/update/delete policies for child tables as implementation continues. The first MVP can write child records only from trusted server routes using a secret key while public reads remain governed by RLS.

---

## 8. Supabase Storage Patch

Create this as:

```txt
supabase/migrations/000003_storage_buckets_and_policies.sql
```

Recommended buckets:

```txt
analysis-imports        private original uploaded Markdown/JSON files
analysis-exports        private generated Markdown/PDF/DOCX exports
public-assets           public thumbnails, quote cards, non-copyrighted visuals
private-assets          private admin-only source images or draft assets
```

Starter migration:

```sql
insert into storage.buckets (id, name, public)
values
  ('analysis-imports', 'analysis-imports', false),
  ('analysis-exports', 'analysis-exports', false),
  ('public-assets', 'public-assets', true),
  ('private-assets', 'private-assets', false)
on conflict (id) do nothing;

create policy "authenticated users can upload own imports"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'analysis-imports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "authenticated users can read own imports"
on storage.objects for select
to authenticated
using (
  bucket_id = 'analysis-imports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "authenticated users can upload own exports"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'analysis-exports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "authenticated users can read own exports"
on storage.objects for select
to authenticated
using (
  bucket_id = 'analysis-exports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "public can read public assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'public-assets');

create policy "authenticated users can upload own public assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'public-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
```

Storage path convention:

```txt
analysis-imports/{user_id}/{upload_id}/original.md
analysis-exports/{user_id}/{song_slug}/notebooklm-pack.md
analysis-exports/{user_id}/{song_slug}/youtube-outline.md
public-assets/{user_id}/{song_slug}/quote-card.png
public-assets/{user_id}/{song_slug}/thumbnail-concept.png
private-assets/{user_id}/{song_slug}/source/
```

---

## 9. Environment Variables

Add this to `.env.example`:

```bash
# Supabase public client variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# Server-only Supabase variables
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_ID=
SUPABASE_ACCESS_TOKEN=

# Storage buckets
SUPABASE_ANALYSIS_IMPORTS_BUCKET=analysis-imports
SUPABASE_ANALYSIS_EXPORTS_BUCKET=analysis-exports
SUPABASE_PUBLIC_ASSETS_BUCKET=public-assets
SUPABASE_PRIVATE_ASSETS_BUCKET=private-assets

# App configuration
SONG_SOLILOQUY_DEFAULT_WORKSPACE_SLUG=song-soliloquy
SONG_SOLILOQUY_PUBLIC_BASE_URL=
SONG_SOLILOQUY_ADMIN_EMAILS=

# Optional AI/search features
OPENAI_API_KEY=
ENABLE_VECTOR_SEARCH=false
```

Rules:

- Never expose `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or `SUPABASE_ACCESS_TOKEN` to browser code.
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` belong in browser-accessible code.
- Store production secrets in the hosting provider and GitHub Actions secrets.

---

## 10. Next.js Supabase Client Files

Add:

```txt
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
```

### 10.1 Browser Client

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

### 10.2 Server Client

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Components cannot always set cookies.
            // Middleware/proxy should handle session refresh.
          }
        },
      },
    }
  )
}
```

### 10.3 Admin Client

Use only in server-only import routes, admin actions, scripts, or trusted backend jobs.

```ts
// src/lib/supabase/admin.ts
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !key) {
    throw new Error('Missing Supabase admin environment variables')
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
```

---

## 11. Parser and Import Logic

Add parser files:

```txt
src/lib/parser/parse-song-soliloquy-markdown.ts
src/lib/parser/validate-analysis-payload.ts
src/lib/actions/import-analysis-file.ts
```

### 11.1 Parser Output Contract

The parser should produce this shape:

```ts
export type ParsedSongSoliloquyAnalysis = {
  metadata: {
    artist: string
    song: string
    producer?: string
    project?: string
    release_date?: string
    featured_artists?: string[]
    track_number?: string
    overall_mood?: string
    main_themes?: string[]
    narrative_perspective?: string
    suggested_url_slug?: string
    seo_title?: string
    seo_description?: string
    thumbnail_text?: string[]
  }
  lyrics_sections: Array<{
    section_label: string
    lines: Array<{
      text: string
      line_number?: number
      is_public_excerpt?: boolean
      is_key_bar?: boolean
      is_hottest_bar?: boolean
      annotations?: Record<string, unknown>
    }>
  }>
  bar_analysis: Array<{
    bar: string
    breakdown?: string
    deeper_read?: string
    technical_notes?: string
    why_it_hits?: string
    tags?: string[]
    themes?: string[]
    references?: unknown[]
    bar_type?: string[]
    scores?: Record<string, number>
  }>
  raw_notes?: Record<string, unknown>
  key_bars?: Array<Record<string, unknown>>
  hottest_bar?: Record<string, unknown>
  notebooklm_source_pack?: Record<string, unknown>
  notebooklm_questions?: Array<{ category?: string; question: string }>
  youtube_ready_angle?: Record<string, unknown>
  context_cards?: Array<Record<string, unknown>>
  reference_ledger?: Array<Record<string, unknown>>
  song_connections?: Array<Record<string, unknown>>
}
```

### 11.2 Import Function Responsibilities

The import action should:

1. Authenticate user.
2. Confirm user has workspace editor/admin permission.
3. Validate file type and size.
4. Upload original file to Storage.
5. Create `analysis_uploads` record.
6. Parse the file.
7. Validate parsed payload.
8. Upsert artist, producer, project, and song records.
9. Insert analysis child records.
10. Create search documents.
11. Create connection records.
12. Set status to `needs_review`.
13. Return preview URL.

### 11.3 Error Handling

Parsing errors should not destroy the upload. Store the original file and create `analysis_import_errors` rows.

Example errors:

```txt
missing_metadata.artist
missing_metadata.song
invalid_release_date
missing_bar_analysis
unmatched_key_bar
invalid_hottest_bar_structure
copyright_visibility_required
```

---

## 12. Search Plan

Start with Postgres full-text search.

Search should cover:

- Song title
- Artist
- Producer
- Project
- Themes
- Mood
- Bar quotes
- Breakdown text
- Deeper Read text
- Technical Notes
- Why It Hits
- Context Cards
- Reference Ledger
- NotebookLM questions
- YouTube title and thesis
- Tags

Add one `search_documents` row per searchable section.

Example document types:

```txt
song_metadata
bar_analysis
key_bar
hottest_bar
context_card
reference
notebooklm_question
youtube_angle
raw_note
connection
```

Optional later:

- Add `analysis_embeddings` with pgvector for semantic search.
- Use embeddings for queries like: "songs about betrayal and fatherhood" or "bars with religious survival imagery."

---

## 13. Connection Web With Supabase

The Connection Web should be powered by `song_connections` plus `connection_evidence` or JSON evidence.

Connection types:

```txt
same_artist
same_producer
same_project
similar_theme
similar_mood
similar_bpm
same_sample_source
sample_lineage
shared_pop_culture_reference
shared_religious_reference
shared_historical_reference
similar_wordplay
similar_rhyme_architecture
catalog_callback
viewer_suggested
manual_editor_connection
```

Connection evidence should store:

```json
{
  "related_bars": [],
  "bpm": null,
  "sample_source": null,
  "reference_label": null,
  "theme_overlap": [],
  "why_it_matters": "",
  "youtube_comparison_angle": ""
}
```

Connection public display rule:

> Only show connections publicly when `is_public = true` and `evidence_status` is not `unverified`.

---

## 14. Website Page Behavior With Supabase

### 14.1 Public Song Page

Route example:

```txt
/songs/[artist-slug]/[song-slug]
```

Data loaded from Supabase:

- `songs`
- `bar_analyses`
- `key_bars`
- `hottest_bars`
- public `context_cards`
- public `song_connections`
- public `search_documents` snippets where needed
- lyric excerpts only, unless full rights are cleared

### 14.2 Admin Preview Page

Route example:

```txt
/admin/songs/[song-id]/preview
```

Data loaded from Supabase:

- Full draft
- Full lyrics, if stored
- Upload file record
- Import errors
- Validation warnings
- Private notes
- Publishing checklist

### 14.3 Library Page

Route example:

```txt
/library
```

Data loaded from Supabase:

- Published songs for public visitors
- Draft + review + published songs for authenticated editors
- Filters from tags, artists, producers, projects, moods, and themes

### 14.4 Upload Page

Route example:

```txt
/admin/import
```

Flow:

- Auth required
- Editor/admin role required
- Upload file
- Show progress
- Run parser
- Show validation report
- Send to preview

---

## 15. Optional Supabase Edge Functions

The MVP can parse files in a Next.js route handler or server action.

Use Supabase Edge Functions later for:

```txt
process-analysis-import
regenerate-search-documents
create-song-connection-suggestions
build-notebooklm-export
generate-quote-card-metadata
send-publish-webhook
```

Recommended first Edge Function:

```txt
process-analysis-import
```

Responsibilities:

1. Receive upload ID.
2. Download original file from Storage.
3. Parse file.
4. Validate payload.
5. Write normalized records to Postgres.
6. Return import status.

Use this when parsing becomes too heavy for the website server route or when Homeland.ai needs the parsing workflow as a backend job.

---

## 16. GitHub Actions for Supabase

Add:

```txt
.github/workflows/supabase-migrations.yml
```

Starter workflow:

```yaml
name: Supabase Migrations

on:
  push:
    branches:
      - main
    paths:
      - 'supabase/migrations/**'
      - 'supabase/config.toml'
  workflow_dispatch:

jobs:
  deploy-migrations:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v2

      - name: Link Supabase project
        run: supabase link --project-ref "$SUPABASE_PROJECT_ID"
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}

      - name: Push database migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

GitHub Secrets needed:

```txt
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_ID
```

Optional separate environments:

```txt
staging Supabase project
production Supabase project
```

Recommended branch pattern:

```txt
develop -> staging Supabase project
main -> production Supabase project
```

---

## 17. Repository Issue Checklist

Create these GitHub issues:

### Backend Setup

```txt
[Backend] Create Supabase project for Song Soliloquy
[Backend] Add Supabase environment variables
[Backend] Add Supabase client/server/admin helpers
[Backend] Create initial database migration
[Backend] Add RLS policies for public reads and editor writes
[Backend] Add Storage buckets and policies
[Backend] Add GitHub Actions workflow for Supabase migrations
```

### Upload and Parser

```txt
[Import] Build Markdown upload route
[Import] Save original file to Supabase Storage
[Import] Parse Song Soliloquy Markdown into structured JSON
[Import] Validate parsed payload with schema
[Import] Insert normalized song analysis records
[Import] Add import error reporting
[Import] Add admin preview page
```

### Website Pages

```txt
[Web] Load public song page from Supabase
[Web] Build library search/filter page from Supabase
[Web] Build song detail query helpers
[Web] Build Key Bars and Hottest Bar Supabase components
[Web] Build Context Cards module
[Web] Build Connection Web query layer
```

### Security and Publishing

```txt
[Security] Add workspace role checks
[Security] Confirm full lyrics are private by default
[Security] Add publish checklist before public display
[Security] Add verified/interpretive/unverified reference status
[Security] Audit public policies before launch
```

---

## 18. MVP Order

Build in this order:

1. Supabase project setup.
2. Environment variables.
3. Database migration for core tables.
4. RLS public/draft rules.
5. Storage buckets.
6. Upload original file to Storage.
7. Parse one Markdown file.
8. Insert one full song analysis into Supabase.
9. Render one public song page from Supabase.
10. Render admin preview page.
11. Add publish workflow.
12. Add library search.
13. Add Context Cards.
14. Add Connection Web.
15. Add export/download tools.
16. Add optional Edge Functions or vector search.

Important product rule:

> Do not build every backend feature before proving that one uploaded Song Soliloquy file can become one beautiful, public, interactive song page.

---

## 19. Figma / Product Prompt Patch

Add this to the website design prompt:

```text
Add Supabase-backed admin and publishing states to the Song Soliloquy website.

The upload page should connect to Supabase Storage and show the original file, upload status, parser status, validation warnings, and publishing status. The admin preview page should show whether the song is Draft, Needs Review, Approved, Published, Hidden Until Verified, Archived, or Rejected.

Add an admin backend panel with modules for:
- Uploaded Files
- Parse Status
- Validation Warnings
- Song Metadata
- Lyrics Visibility
- Rights / Excerpt Mode
- Bar Analysis Records
- Key Bars
- Hottest Bar
- Context Cards
- Reference Ledger
- Connection Web Data
- SEO Metadata
- Publishing Checklist

Add clear UI badges for:
- Saved to Supabase
- Draft
- Needs Review
- Published
- Public Excerpt Only
- Private Full Lyrics
- Verified Reference
- Interpretive Reference
- Needs Verification

The public website should only show published records. Draft records should only be visible to authenticated editors/admins.
```

---

## 20. Definition of Done

The Supabase backend patch is complete when:

```txt
[ ] Supabase project exists
[ ] .env.example has Supabase variables
[ ] Supabase clients exist for browser, server, and admin contexts
[ ] Database migrations exist in GitHub
[ ] Core tables are created
[ ] RLS is enabled on all public tables
[ ] Storage buckets are created
[ ] Storage policies protect private imports
[ ] One Markdown file uploads successfully
[ ] Original upload is stored in Supabase Storage
[ ] Parsed song data is stored in Supabase Postgres
[ ] Admin preview displays parsed sections
[ ] Public page displays only published content
[ ] Full lyrics are private or excerpt-controlled by default
[ ] Key Bars and Hottest Bar render from Supabase
[ ] Context Cards render only when public and verified enough
[ ] Connection Web can query related song records
[ ] Search can find songs, bars, themes, artists, producers, and references
[ ] GitHub Actions can apply migrations
[ ] Secrets are not committed to GitHub
```

---

## 21. Final Backend Principle

The Supabase integration should not make Song Soliloquy feel like a database product.

It should make the website feel alive:

- Uploads become pages.
- Bars become cards.
- References become context.
- Themes become filters.
- Songs become a connection web.
- Creator notes become video assets.
- GitHub keeps the build disciplined.
- Supabase keeps the experience dynamic.


---

# Appendix: Version 2.3 Song Detail Route Import Stability Patch

## Problem

The Figma Make preview showed this runtime failure while opening a song detail URL:

```txt
Unexpected Application Error!
Failed to fetch dynamically imported module: /src/app/components/pages/SongDetail.tsx
```

This is a route module loading failure. It happens before the Song Detail page can render, so it should be handled as a routing/import stability issue rather than a content, Markdown parser, or Supabase issue.

## Required Fix

For the MVP and the Figma preview, core routes should use static imports:

- `/`
- `/library`
- `/upload`
- `/song/:slug`
- `*` / not-found

The `/song/:slug` route should statically import `SongDetail` and render it directly. Do not dynamically import `SongDetail.tsx` in the route definition while the app is being stabilized in preview.

## Required Route Error Handling

Add a branded `RouteErrorBoundary` and attach it to the root route and `/song/:slug` route through `errorElement`. The fallback should include:

- Song Soliloquy branded error copy;
- reload button;
- back-to-library button;
- diagnostic message;
- no default white React Router error page.

## Stability Rule

Core public pages must not depend on brittle dynamic imports in preview environments. After production hosting is stable, code splitting may be reintroduced only with:

- confirmed route module export shape;
- route-level `errorElement` coverage;
- lazy import retry handling;
- user-facing reload/recovery UI;
- no nested lazy chains inside core route pages.

## Acceptance Criteria

- `/song/:slug` no longer tries to dynamically fetch `/src/app/components/pages/SongDetail.tsx` in the Figma preview.
- Song pages render from static page imports.
- Bad slugs render a branded not-found state.
- Runtime failures render a branded route recovery screen.
- The default React Router white error page no longer appears during normal user testing.

---

## Appendix: Version 2.4 Upload Save and Slug Resolution Patch

### Problem

After upload, the app may route to a generated slug such as:

```txt
/song/ransom-tears-from-a-third-eye-song-soliloquy-breakdown-mz7hzhdw
```

and show:

```txt
Song Not Found
```

This is not a route import problem anymore. It is an upload persistence and slug-resolution problem.

### Cause

The upload flow is navigating to a filename/import slug before the parsed song-analysis record has been saved into a shared store, or `SongDetail` is searching only demo/static songs instead of uploaded records. The app may also be treating the export filename suffix `song-soliloquy-breakdown` and generated import ID as part of the public URL.

### Fix

1. Parse the uploaded Markdown file.
2. Derive the canonical slug from `metadata.slug`, `metadata.suggested_url_slug`, body field `Suggested URL slug`, or `artist + song title`.
3. Strip export suffixes from filename fallback slugs.
4. Save the parsed song record before navigation.
5. Save filename/import slugs as aliases.
6. Make `SongDetail` resolve both canonical slugs and aliases.
7. In Figma preview, persist uploaded songs to `localStorage` so records survive route changes and refreshes.
8. In production, save the original file to Supabase Storage and the parsed record to Supabase Postgres.
9. Add a `song_slug_aliases` table in Supabase for canonical URL resolution.
10. Make Library merge static/demo songs with uploaded songs.

### Canonical slug priority

```txt
metadata.slug
metadata.suggested_url_slug
seo.suggested_url_slug
body field: Suggested URL slug
artist + song title
cleaned filename fallback
```

### Supabase production addition

Add a `song_slug_aliases` table:

```sql
create table if not exists public.song_slug_aliases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  alias_slug text not null,
  alias_type text not null default 'upload_filename' check (
    alias_type in ('canonical', 'upload_filename', 'generated_import', 'legacy', 'manual')
  ),
  created_at timestamptz not null default now(),
  unique (workspace_id, alias_slug)
);
```

### Acceptance criteria

- Uploading `ransom-tears-from-a-third-eye-song-soliloquy-breakdown.md` creates a saved song record.
- The app redirects to `/song/ransom-tears-from-a-third-eye`.
- Refreshing that page still shows the song in Figma preview through `localStorage`.
- Visiting the generated upload slug resolves to the same record or redirects to the canonical slug.
- The uploaded song appears in Library immediately.
- `Song Not Found` appears only when no canonical slug or alias matches.

See also: `song-soliloquy-upload-slug-resolution-patch.md`.


---

# Addendum v2.5: Library-to-Detail Resolver Fix

## Problem

After uploads, files appear in the Library but opening the song page still shows `Song Not Found`.

## Diagnosis

The upload pipeline is saving a Library-visible object, but the `/song/:slug` page is not resolving that object into a full `SongAnalysis` record. The Library and SongDetail page are likely reading from separate stores or using different slug fields.

## Required Fix

Create a single shared song repository used by Upload, Library, and SongDetail. Upload must save a full `SongAnalysisRecord`. Library must link via `getSongHref(record)`. SongDetail must resolve by `canonicalSlug`, `slugAliases`, source filename slug, import/upload ID, and existing legacy Library records.

## Patch File

See `song-soliloquy-library-detail-resolver-patch.md` for the full v2.5 implementation plan, Figma Make prompt, helper code, repository contract, migration logic, and acceptance tests.

---

# Addendum: v2.6 — Library Click / Detail Resolver Contract Patch

Uploaded song files can appear in the Library while still opening `Song Not Found` when clicked. This means upload persistence is working but the Library-to-SongDetail resolver contract is broken.

## Required Fix

Use one shared resolver contract across Upload, Library, Search, and SongDetail:

```txt
getAllSongAnalyses()
resolveSongAnalysis(locator)
getSongDetailHref(song)
saveUploadedSongAnalysis(record)
```

Library must render and link songs from `getAllSongAnalyses()`. SongDetail must resolve only through `resolveSongAnalysis(useParams().slug)`. Upload must save first, then navigate to `getSongDetailHref(savedSong)`. All preview uploads must use the same localStorage key: `song-soliloquy.uploadedSongs.v1`.

## Debug Requirement

Until fixed, the Song Not Found state must show a temporary Resolver Debug panel with:

- requestedLocator
- normalizedTarget
- uploadedCount
- totalCount
- knownSongs
- each song's id, title, artist, slug, canonicalSlug, and locators

If the clicked song appears in the Library but not in `knownSongs`, the Library is reading a different data source than SongDetail. If the clicked song appears in `knownSongs` but not in `locators`, the Library link or slug aliases are wrong. If the locator is present but still shows not found, SongDetail is not using the shared resolver.

---

# Addendum v2.8 — Canonical Metadata Repair and Resolver Fix

## Problem
Uploaded songs appear in the Library, but clicking them can still show Song Not Found. Resolver debug confirmed upload persistence is working, but uploaded records may be stored with polluted titles and canonical slugs derived from Markdown headings or filenames.

Example malformed record:

```txt
title: ** Sing Comfortably - ** Skyzoo & Dumbo Station
canonicalSlug: skyzoo-dumbo-station-sing-comfortably-song-soliloquy-breakdown
```

## Fix
Before saving uploaded songs, extract clean song identity from Markdown metadata. Strip Markdown formatting, read explicit metadata fields first, parse H1 heading only as fallback, and use filename cleanup only as last fallback.

## Route Contract
Library links must use canonicalSlug only. SongDetail must resolve against all normalized locators: id, slug, canonicalSlug, sourceFilenameSlug, importSlug, slugAliases, and locators.

## Migration
Existing uploaded localStorage records must be repaired on first read by rerunning metadata extraction and normalization against rawMarkdown/sourceFilename.

## Debug Escape Hatch
During Figma preview testing, expose a temporary Clear Uploaded Preview Cache button that removes:

```txt
song-soliloquy.uploadedSongs.v1
ss_uploaded_analyses
```

Then re-upload the Markdown file after the fix.

---

# Addendum v2.9 — OBS Live Stream Integration

See the standalone patch file:

```txt
song-soliloquy-obs-live-stream-integration-patch-v2-9.md
```

Summary:

- Adds optional Live Studio routes for OBS control.
- Adds Browser Source overlay routes for Song Soliloquy analysis graphics.
- Keeps OBS integration isolated from upload, Library, SongDetail, Supabase song data, parser, and canonical resolver logic.
- Uses feature flags so live-stream tools are disabled by default.
- OBS remains the video encoder and streaming engine.
- Song Soliloquy controls scenes, overlays, recording, and streaming only after explicit confirmation.
- Twitch and YouTube keys are handled by OBS for MVP, not stored in the website.
- Stream keys, OBS passwords, and platform secrets must never be committed to GitHub or stored in public frontend state.



---

# Addendum v3.0 — Alternate Skin Toggle and Theme Customization System

See the standalone patch file:

```txt
song-soliloquy-theme-toggle-skin-system-patch-v3-0.md
```

## Summary

This update adds the alternate Song Soliloquy visual skin as a global toggle switch, similar to a dark/light mode system but customized for the project's branded interface.

Official themes:

1. **Theme 01 — Noir Gold Archive**
   - Near-black background
   - Charcoal cards
   - Burnished gold accents
   - Parchment text
   - Noir archive / rap scholar notebook mood

2. **Theme 02 — Midnight Matte / Rose Chrome**
   - Deep matte midnight-blue background
   - Matte navy panels
   - Rose-gold emotional accents
   - Chrome technical accents
   - Luxury studio cockpit / live-presentation mood

Default theme:

```txt
midnight-rose-chrome
```

## Theme Architecture

The theme system uses semantic CSS variables rather than hard-coded component colors. Components should read tokens such as:

```txt
--ss-bg-main
--ss-bg-panel
--ss-text-primary
--ss-accent-primary
--ss-accent-technical
--ss-border-subtle
--ss-glow-primary
```

Theme is applied at the root:

```html
<html data-theme="midnight-rose-chrome">
```

or:

```html
<html data-theme="noir-gold-archive">
```

## Preference Storage

Local preview preference key:

```txt
song-soliloquy.themePreference.v1
```

Theme preference is presentation state only. It must not be saved inside song records, uploaded Markdown analysis records, canonical slug data, or Library records.

## Theme Scopes

- App Theme: normal website pages.
- Presentation Theme: full-screen and live-presentation views.
- Overlay Theme: OBS Browser Source overlays.

OBS safety rule:

```txt
Changing the app theme must not unexpectedly change active live overlay themes.
```

Live Studio should support overlay theme locking during streams.

## Non-Interference Rule

This patch must not interfere with:

- Markdown upload parsing
- Canonical metadata extraction
- Library persistence
- SongDetail resolver
- Supabase schema
- OBS connection
- Live Studio controls
- Overlay routes
- Presentation Mode
- Motion layer settings
- NotebookLM export
- YouTube angle tools
- Connection Web data
- Research Vault data

Core rule:

```txt
Theme is presentation state, not song data.
```

## Build Order

1. Add theme tokens and two CSS theme files.
2. Add ThemeProvider and localStorage persistence.
3. Add ThemeToggle to top navigation.
4. Convert core components to semantic tokens.
5. Add Appearance settings page.
6. Add overlay theme support.
7. Add Presentation Mode theme support.
8. Add Supabase user preference sync later.
9. Add custom theme builder later.

## Definition of Done

Song Soliloquy can switch between **Midnight Matte / Rose Chrome** and **Noir Gold Archive** from a visible Skin toggle, while every existing page and feature continues to work exactly as before.

