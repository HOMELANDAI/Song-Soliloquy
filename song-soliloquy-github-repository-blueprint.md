# Song Soliloquy GitHub Repository Blueprint

Version: 2.1 — includes workflow audit, optional entertainment-value layers, Did You Know / Context Cards, production-performance notes, verification fields, and updated schema addendum.

Repository-ready project file for building, documenting, and maintaining the Song Soliloquy website, upload engine, analysis schema, design system, content archive, and creator workflow.


## Version 2.1 Change Note

This update audits the track-submission workflow and adds optional enrichment layers for entertainment value and deeper context. The core recommendation is to add **Context Cards / Did You Know Cards** supported by a **Reference Ledger**, **Production Lens**, **Performance Notes**, **Rewind Triggers**, **Emotional Arc**, **First Listen vs Deep Listen**, and **Verification Status**. These are optional modules, not mandatory filler.

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
git commit -m "Add Song Soliloquy repository blueprint and enrichment audit"
git push
```

If using this as the root README:

```txt
git add README.md
git commit -m "Add Song Soliloquy README and enrichment audit"
git push
```
