# Song Soliloquy Patch v2.9
## OBS Live Stream Integration for Twitch + YouTube

**Patch name:** OBS Live Control Layer  
**Project:** Song Soliloquy / Homeland.ai  
**Status:** Additive integration patch  
**Primary goal:** Add OBS-powered live-stream support without interfering with upload, library, song detail, Supabase, parser, or resolver workflows.

---

## 1. Executive Summary

Add a dedicated **Live Studio** layer to Song Soliloquy that can control OBS scenes and help the creator stream Song Soliloquy breakdowns live to Twitch and/or YouTube.

This patch must be isolated from the core Song Soliloquy data engine:

- The upload/parser workflow stays unchanged.
- The Library and SongDetail resolver stay unchanged.
- Supabase remains the backend for saved analyses, metadata, uploads, and published song pages.
- OBS control is treated as an optional creator-side feature.
- Stream keys and broadcast secrets must never be stored in public frontend state, GitHub, browser localStorage, or public Supabase tables.

The correct architecture is:

```txt
Song Soliloquy Website
  -> reads song analysis data from Supabase / local preview store
  -> sends selected song segment state to Live Studio overlay
  -> optionally controls OBS through a local OBS bridge or direct localhost websocket
  -> never becomes the video encoder itself

OBS Studio
  -> owns scenes, sources, encoding, audio, and streaming output
  -> streams to Twitch / YouTube using user-configured RTMP or platform settings
```

---

## 2. Non-Interference Rule

The OBS feature must not touch, mutate, or refactor these core systems:

- Markdown parser
- Upload workflow
- Song metadata extractor
- Canonical slug resolver
- Library card routing
- SongDetail rendering
- Supabase song tables
- Supabase storage buckets
- Context Cards / Did You Know enrichment
- NotebookLM export
- YouTube-ready angle data
- Connection Web data model

OBS integration is a separate vertical slice:

```txt
src/live/
src/obs/
src/overlays/
src/components/live/
```

No OBS code should be imported by the default SongDetail route unless the user opens Live Studio or enables streaming tools.

---

## 3. Product Feature: Live Studio

Add a new creator-only page:

```txt
/live-studio
```

Optional song-specific entry:

```txt
/song/:slug/live
```

### Purpose

Live Studio lets the creator:

- Select a song analysis from the Library.
- Load a live breakdown rundown.
- Push bar quotes, key bars, hottest bar, Context Cards, and discussion prompts into OBS overlays.
- Switch OBS scenes.
- Start/stop recording.
- Start/stop streaming only after explicit confirmation.
- Monitor OBS connection status.
- Copy Twitch/YouTube stream setup instructions.
- Keep Song Soliloquy’s website engine separate from the broadcast encoder.

---

## 4. Recommended Live Pages

### 4.1 Live Studio Dashboard

Route:

```txt
/live-studio
```

Modules:

- OBS connection card
- Active song selector
- Rundown builder
- Scene control panel
- Overlay control panel
- Stream destination checklist
- Chat dock placeholders
- Safety confirmation modal
- Recording/stream status panel

### 4.2 Song Live Control Page

Route:

```txt
/song/:slug/live
```

Modules:

- Current song context
- Click-to-send lyric quote to overlay
- Key Bars carousel
- Hottest Bar spotlight overlay trigger
- NotebookLM question prompt trigger
- YouTube talking point trigger
- Context Card / Did You Know trigger
- Lower-third metadata trigger

### 4.3 OBS Overlay Preview Page

Route:

```txt
/overlay/song/:slug
```

This page is meant to be added to OBS as a **Browser Source**.

It should render transparent-background overlay graphics:

- Current quote
- Bar breakdown lower third
- Hottest Bar card
- Key Bar ranking card
- Context Nugget card
- Coming-up card
- Stream title card
- Break screen

This route should be read-only and presentation-only. It should not perform uploads, writes, parser operations, or Supabase mutations.

---

## 5. OBS Connection Architecture

There are two acceptable modes.

### Mode A: Direct Local OBS WebSocket

The website connects directly to:

```txt
ws://127.0.0.1:4455
```

or:

```txt
ws://localhost:4455
```

Use only when running locally or in an environment where browser access to localhost websocket is allowed.

Pros:

- Simpler setup
- Fewer moving parts
- Useful for local creator workflows

Cons:

- Browser security, hosted domains, mixed-content restrictions, and preview environments may block direct localhost websocket connections.
- Password handling must be carefully managed.

### Mode B: Local OBS Bridge App / Service

Recommended production creator workflow.

Create a local bridge process on the creator’s machine:

```txt
song-soliloquy-obs-bridge
```

The website talks to the local bridge. The bridge talks to OBS.

```txt
Song Soliloquy Website
  -> localhost bridge API
  -> OBS WebSocket
  -> OBS scenes/sources/stream controls
```

Pros:

- Better separation of secrets
- Easier retry logic
- Can support signed local sessions
- Can shield the frontend from raw OBS websocket auth details
- Easier to expand later for Stream Deck, hotkeys, and local media files

Cons:

- Requires installing/running a companion app or local Node service

For MVP, build Mode A first only if the platform allows it. Design the code so Mode B can replace the transport later without changing Live Studio UI.

---

## 6. OBS Setup Requirements

The Live Studio setup screen should instruct the creator to:

1. Install OBS Studio.
2. Enable OBS WebSocket.
3. Keep WebSocket authentication enabled.
4. Use a strong OBS WebSocket password.
5. Configure Twitch and/or YouTube stream destinations inside OBS.
6. Add the Song Soliloquy overlay URL as a Browser Source.
7. Test recording before going live.

Default OBS WebSocket connection fields:

```txt
Host: 127.0.0.1
Port: 4455
Password: user-provided
Secure WebSocket: off for local MVP
```

Do not hard-code the password.

Do not store the password in Supabase.

Do not commit OBS credentials into GitHub.

If persistence is needed, store only in session memory. If the user explicitly chooses “Remember on this device,” store encrypted/local-only where the platform supports it. For Figma preview, do not persist the OBS password at all.

---

## 7. Streaming Destination Strategy

### MVP Recommendation

Do not build Twitch or YouTube stream-key management into the Song Soliloquy website yet.

Instead:

- Let OBS handle Twitch/YouTube service login or RTMP stream keys.
- Song Soliloquy controls OBS scenes and overlays.
- Song Soliloquy can trigger OBS start/stop streaming after confirmation.

This avoids the most dangerous failure mode: leaking platform stream keys.

### Later Phase

Later, add platform integrations:

- YouTube Live API for scheduled broadcasts, stream metadata, broadcast titles, and live chat.
- Twitch API for channel metadata, stream title/category, chat, and moderation features.

But do not require Twitch/YouTube API integration for MVP OBS streaming.

---

## 8. Live Studio Safety Rules

### 8.1 Explicit Start Confirmation

Starting a stream must require a confirmation modal:

```txt
You are about to start streaming from OBS.
Destination: Configured in OBS
Scene: [Current Scene]
Recording: [On/Off]
Audio check: [Manual]
```

Buttons:

- Start Stream
- Cancel

### 8.2 Never Auto-Start Streaming

Do not start streaming automatically after upload, page load, song open, OBS connect, scene switch, or overlay activation.

### 8.3 OBS Status Must Be Visible

Always show:

- Connected / disconnected
- Current scene
- Streaming active / inactive
- Recording active / inactive
- Stream time if available
- Last OBS command result
- Last OBS error

### 8.4 Kill Switch

Add a prominent control:

```txt
Stop Stream
```

Require confirmation only if stopping could be accidental, but the Stop action should be immediately available.

---

## 9. Scene Design for Song Soliloquy OBS

Create a recommended OBS scene pack.

### Required Scenes

```txt
SS - Starting Soon
SS - Live Breakdown Main
SS - Lyrics Focus
SS - Hottest Bar Spotlight
SS - Key Bars Ranked
SS - Context Nugget
SS - NotebookLM Questions
SS - YouTube Angle
SS - Connection Web
SS - Be Right Back
SS - Ending Screen
```

### Recommended Sources

Each scene should contain one or more of:

```txt
Browser Source: Song Soliloquy Overlay
Browser Source: Song Soliloquy Lower Third
Browser Source: Chat Dock
Audio Input Capture: Microphone
Display Capture or Window Capture: Website / Browser
Media Source: Intro Sting
Image Source: Logo / Background
Text Source: Manual fallback title
```

### Browser Source URLs

Examples:

```txt
/overlay/live
/overlay/song/:slug
/overlay/song/:slug/hottest-bar
/overlay/song/:slug/key-bars
/overlay/song/:slug/context-card
/overlay/song/:slug/lower-third
```

Add query params for OBS browser source safety:

```txt
?transparent=true&mode=obs&theme=midnight-rose-chrome
```

---

## 10. Live Overlay Data Contract

Create a lightweight live overlay state object.

```ts
export type LiveOverlayMode =
  | 'idle'
  | 'title-card'
  | 'bar-quote'
  | 'bar-breakdown'
  | 'key-bar'
  | 'hottest-bar'
  | 'context-nugget'
  | 'notebook-question'
  | 'youtube-angle'
  | 'break'
  | 'ending';

export type LiveOverlayState = {
  mode: LiveOverlayMode;
  songId?: string;
  songSlug?: string;
  artist?: string;
  title?: string;
  producer?: string;
  project?: string;
  quote?: string;
  label?: string;
  breakdown?: string;
  deeperRead?: string;
  technicalNote?: string;
  whyItHits?: string;
  contextNugget?: string;
  question?: string;
  talkingPoint?: string;
  themeTags?: string[];
  barTypeTags?: string[];
  updatedAt: string;
};
```

For the Figma/local preview, store this in:

```txt
localStorage key: song-soliloquy.liveOverlayState.v1
```

For production, store live sessions in Supabase only if needed.

---

## 11. Supabase Additions

Do not modify existing song tables for the MVP unless necessary.

Add optional tables only for creator live sessions.

### 11.1 live_sessions

```sql
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  song_id uuid,
  song_slug text,
  title text not null,
  status text not null default 'draft',
  platform_targets text[] not null default '{}',
  obs_profile_name text,
  obs_scene_collection text,
  current_scene text,
  overlay_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Allowed status values:

```txt
draft
rehearsal
ready
live
ended
archived
error
```

### 11.2 live_rundown_items

```sql
create table if not exists public.live_rundown_items (
  id uuid primary key default gen_random_uuid(),
  live_session_id uuid not null references public.live_sessions(id) on delete cascade,
  position integer not null,
  item_type text not null,
  title text,
  payload jsonb not null default '{}'::jsonb,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Item types:

```txt
intro
song-context
bar-quote
bar-breakdown
key-bar
hottest-bar
context-card
notebook-question
youtube-talking-point
connection-web
viewer-question
outro
```

### 11.3 obs_connection_profiles

Optional. Store non-secret OBS connection profiles.

```sql
create table if not exists public.obs_connection_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  profile_name text not null,
  host text not null default '127.0.0.1',
  port integer not null default 4455,
  use_secure_websocket boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Do not store OBS passwords in this table.

Do not store Twitch stream keys or YouTube stream keys in this table.

---

## 12. Row Level Security

Enable RLS on live tables.

```sql
alter table public.live_sessions enable row level security;
alter table public.live_rundown_items enable row level security;
alter table public.obs_connection_profiles enable row level security;
```

Policies should follow the existing Homeland.ai / Supabase pattern:

- Public users can never read creator OBS profiles.
- Public users can only read published/public overlay state if explicitly enabled.
- Authenticated owners can manage their own live sessions.
- Service role can run admin jobs only on the server.

No stream keys should be in database tables, so RLS is defense-in-depth, not the main secret-protection mechanism.

---

## 13. Frontend Folder Structure

Add:

```txt
src/
  live/
    liveTypes.ts
    liveOverlayStore.ts
    liveRundownBuilder.ts
    liveSessionStore.ts
  obs/
    obsTypes.ts
    obsClient.ts
    obsCommands.ts
    obsConnectionStore.ts
    obsSceneMap.ts
    obsSafety.ts
  overlays/
    OverlayRouter.tsx
    LiveOverlayFrame.tsx
    HottestBarOverlay.tsx
    KeyBarOverlay.tsx
    QuoteLowerThird.tsx
    ContextNuggetOverlay.tsx
    StartingSoonOverlay.tsx
    EndingOverlay.tsx
  components/
    live/
      LiveStudioPage.tsx
      OBSConnectionPanel.tsx
      OBSSceneControls.tsx
      OBSStreamControls.tsx
      LiveRundownPanel.tsx
      OverlayControlPanel.tsx
      StreamSafetyModal.tsx
      LiveStatusBar.tsx
```

---

## 14. OBS Client Interface

Abstract OBS control behind an interface so the UI does not depend on a specific library.

```ts
export type OBSConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export type OBSStatus = {
  connectionStatus: OBSConnectionStatus;
  currentScene?: string;
  isStreaming?: boolean;
  isRecording?: boolean;
  streamTimecode?: string;
  lastError?: string;
};

export interface SongSoliloquyOBSClient {
  connect(config: OBSConnectionConfig): Promise<void>;
  disconnect(): Promise<void>;
  getStatus(): Promise<OBSStatus>;
  getSceneList(): Promise<string[]>;
  setCurrentScene(sceneName: string): Promise<void>;
  startRecording(): Promise<void>;
  stopRecording(): Promise<void>;
  startStreaming(): Promise<void>;
  stopStreaming(): Promise<void>;
  refreshBrowserSource(sourceName: string): Promise<void>;
}
```

All UI actions should call this interface, not raw OBS websocket calls directly.

---

## 15. OBS Commands Needed for MVP

MVP commands:

```txt
Connect
Disconnect
GetVersion
GetSceneList
GetCurrentProgramScene
SetCurrentProgramScene
GetStreamStatus
StartStream
StopStream
StartRecord
StopRecord
RefreshBrowserSource
```

Optional later commands:

```txt
SetInputSettings
SetInputMute
GetInputMute
SetSceneItemEnabled
SetSceneItemTransform
TriggerStudioModeTransition
SaveReplayBuffer
```

---

## 16. Live Rundown Builder

For any SongAnalysis record, generate a default livestream rundown:

```txt
1. Starting Soon
2. Intro / thesis
3. Song Context
4. First Listen framing
5. Key Bar 1
6. Key Bar 2
7. Hottest Bar Spotlight
8. What You Might Have Missed
9. Production Lens
10. Performance and Delivery Notes
11. NotebookLM Questions
12. YouTube-ready takeaway
13. Viewer Q&A
14. Ending Screen
```

Map existing Song Soliloquy data fields into rundown items:

- Song context -> Intro and metadata lower third
- Key bars -> Key Bar overlays
- Hottest bar -> Spotlight scene
- Context Cards -> Did You Know cards
- Raw notes -> Creator prompts
- NotebookLM questions -> discussion cards
- YouTube-ready angle -> thesis and outro
- Connection Web -> comparison segment

---

## 17. UI/UX Patch: Midnight Matte / Rose Chrome Live Mode

The OBS layer must match the current Song Soliloquy aesthetic.

### Live Studio Visual Language

Use:

- Deep midnight blue background
- Matte navy cards
- Chrome status indicators
- Rose-gold live accents
- Red only for actual live/recording danger states
- Audio-meter inspired controls
- Scene buttons styled like studio hardware

### Status Colors

```txt
Disconnected: muted chrome
Connecting: blue chrome pulse
Connected: rose-gold accent
Recording: muted red dot
Live: stronger red dot with label
Error: muted error red
```

### Required UI Copy

- “OBS is connected.”
- “OBS is not connected.”
- “Overlay is ready as a Browser Source.”
- “Streaming is controlled by OBS. Song Soliloquy only sends scene and overlay commands.”
- “Never share your stream key.”
- “Test recording before going live.”

---

## 18. GitHub Environment Variables

Add to `.env.example`:

```bash
# OBS Local Control - Client-side/local only
VITE_OBS_DEFAULT_HOST=127.0.0.1
VITE_OBS_DEFAULT_PORT=4455
VITE_OBS_ENABLE_DIRECT_WEBSOCKET=false

# Live Studio Feature Flag
VITE_ENABLE_LIVE_STUDIO=false

# Optional future platform API integrations
VITE_ENABLE_TWITCH_INTEGRATION=false
VITE_ENABLE_YOUTUBE_LIVE_INTEGRATION=false
```

Do not add:

```bash
TWITCH_STREAM_KEY=
YOUTUBE_STREAM_KEY=
OBS_PASSWORD=
```

Those must not be committed or stored in GitHub.

---

## 19. Feature Flags

Wrap the entire feature behind feature flags:

```txt
VITE_ENABLE_LIVE_STUDIO
VITE_OBS_ENABLE_DIRECT_WEBSOCKET
VITE_ENABLE_TWITCH_INTEGRATION
VITE_ENABLE_YOUTUBE_LIVE_INTEGRATION
```

Default all live streaming flags to false until the base SongDetail/Library system is stable.

This ensures OBS work does not interfere with the app’s core song page workflow.

---

## 20. Twitch + YouTube Notes

### Twitch MVP

OBS streams to Twitch through Twitch’s normal service configuration or RTMP ingest settings.

Song Soliloquy should not manage Twitch stream keys during MVP.

Later features:

- Update Twitch stream title/category.
- Read Twitch chat.
- Add viewer suggestion cards.
- Add poll prompts.
- Save stream notes to Song Soliloquy.

### YouTube MVP

OBS streams to YouTube through YouTube’s normal OBS service configuration or RTMP stream setup.

Song Soliloquy should not create YouTube broadcasts during MVP.

Later features:

- Schedule YouTube Live broadcast.
- Update stream title/description.
- Pull live chat.
- Create timestamped post-stream notes.
- Convert live rundown into YouTube chapter markers.

---

## 21. Stream Key Security

Strict rules:

- Never expose stream keys in frontend code.
- Never save stream keys to localStorage.
- Never save stream keys to Supabase public tables.
- Never commit stream keys to GitHub.
- Never display full stream keys after initial entry.
- Prefer OBS native account/service configuration.
- If future backend storage is needed, use server-only encrypted secrets and never return them to the browser.

---

## 22. Copyright / Rights Safety

Song Soliloquy live streams are commentary and analysis, but live streams have higher takedown risk than written analysis.

Live Studio should include a rights reminder:

```txt
Use short clips only when necessary for commentary. Avoid playing full songs or long uninterrupted copyrighted audio. Keep the stream centered on criticism, commentary, education, and transformation.
```

For the overlay system, prioritize text analysis, quote snippets, creator commentary, and visual breakdowns over raw song playback.

---

## 23. Acceptance Criteria

### Core Non-Interference

- Upload still works.
- Library still opens song pages.
- SongDetail still resolves uploaded songs.
- Supabase schema remains compatible with existing song pages.
- OBS code is feature-flagged off by default.
- OBS code is not loaded on normal song pages unless Live Studio is opened.

### OBS Control

- User can open `/live-studio`.
- User can enter OBS host/port/password.
- User can connect to OBS.
- User can see current OBS scene.
- User can switch scenes.
- User can start/stop recording after confirmation.
- User can start/stop streaming after confirmation.
- User can trigger overlay states from Song Soliloquy content.

### Overlay

- OBS Browser Source can load `/overlay/song/:slug?transparent=true&mode=obs`.
- Overlay displays selected quote/key bar/hottest bar/context card.
- Overlay does not mutate song data.
- Overlay works without breaking if OBS is disconnected.

### Security

- No stream keys in GitHub.
- No OBS password in Supabase.
- No Twitch/YouTube secrets in frontend code.
- Start Stream requires explicit user confirmation.

---

## 24. Figma / App Builder Patch Prompt

```text
Add an optional OBS Live Studio integration to Song Soliloquy without interfering with the existing upload, Library, SongDetail, Supabase, parser, metadata, slug resolver, or song page workflows.

Create a feature-flagged Live Studio system for controlling OBS Studio and displaying Song Soliloquy analysis overlays during live streams to Twitch and YouTube.

Important: Do not make the website itself the video encoder. OBS remains responsible for scenes, audio, encoding, and streaming output. Song Soliloquy only controls OBS and feeds Browser Source overlays.

Add new routes:
- /live-studio
- /song/:slug/live
- /overlay/song/:slug
- /overlay/live

Keep all OBS code isolated under src/live, src/obs, src/overlays, and src/components/live. Do not import OBS code into the normal SongDetail page unless the user enters Live Studio.

Add an OBS connection panel with host, port, password, connect, disconnect, and status controls. Default host should be 127.0.0.1 and default port should be 4455. Do not store the OBS password in Supabase, GitHub, or localStorage by default.

Add Live Studio modules:
- OBS connection status
- current scene
- scene list
- stream status
- recording status
- active song selector
- live rundown panel
- overlay control panel
- safety modal before Start Stream
- Stop Stream control
- Browser Source setup instructions

Create overlay modes for:
- title card
- bar quote
- bar breakdown
- key bar
- hottest bar
- context nugget
- NotebookLM question
- YouTube angle
- break screen
- ending screen

Use a LiveOverlayState object stored locally in song-soliloquy.liveOverlayState.v1 for preview. Production may later store live sessions in Supabase.

Add optional Supabase tables for live_sessions, live_rundown_items, and obs_connection_profiles. Do not store stream keys or OBS passwords in these tables.

Add feature flags:
- VITE_ENABLE_LIVE_STUDIO=false
- VITE_OBS_ENABLE_DIRECT_WEBSOCKET=false
- VITE_ENABLE_TWITCH_INTEGRATION=false
- VITE_ENABLE_YOUTUBE_LIVE_INTEGRATION=false

For MVP, do not manage Twitch or YouTube stream keys through the website. Let OBS handle Twitch/YouTube account connection or RTMP stream configuration. Song Soliloquy can control OBS scenes, overlays, recording, and streaming only after the user explicitly confirms.

Add a rights reminder in Live Studio: Use short clips only when necessary for commentary. Avoid playing full songs or long uninterrupted copyrighted audio. Keep streams centered on criticism, commentary, education, and transformation.

Match the Midnight Matte / Rose Chrome aesthetic: deep midnight blue, matte navy cards, chrome controls, rose-gold creator accents, and red only for recording/live danger states.

Acceptance criteria:
1. Normal upload, Library, and SongDetail pages still work with no OBS connection.
2. OBS code is disabled by default through feature flags.
3. Opening /live-studio shows the OBS control dashboard.
4. Connecting to OBS does not mutate song data.
5. Start Stream requires explicit confirmation.
6. Overlay pages render read-only Browser Source graphics.
7. No stream keys or OBS passwords are saved in GitHub, Supabase, or public frontend state.
8. Twitch and YouTube streaming are handled through OBS MVP setup, not website-stored stream keys.
```

---

## 25. Suggested GitHub Issues

### Issue: Add Live Studio Feature Flag

Create `VITE_ENABLE_LIVE_STUDIO` and hide all Live Studio routes and nav links unless enabled.

### Issue: Add OBS Client Abstraction

Create `SongSoliloquyOBSClient` interface and a first direct-websocket implementation.

### Issue: Add Live Overlay State Store

Create local overlay state store for Browser Source overlays.

### Issue: Add OBS Browser Source Overlay Routes

Create `/overlay/song/:slug` and overlay components for quote, key bar, hottest bar, and context nugget.

### Issue: Add Live Rundown Builder

Generate a default livestream rundown from a SongAnalysis record.

### Issue: Add Stream Safety Modal

Require explicit confirmation before `StartStream` and clear status display while live.

### Issue: Add Supabase Live Session Tables

Add optional tables for live sessions and rundown items. Exclude secrets.

### Issue: Add Local OBS Bridge Spike

Research whether direct browser-to-OBS websocket is reliable in production. If not, build a local Node/Tauri/Electron bridge.

---

## 26. Definition of Done

This patch is complete when:

- The Song Soliloquy website still works with Live Studio disabled.
- Live Studio can be enabled without impacting upload/library/song pages.
- OBS connection status can be displayed.
- OBS scene list can be loaded.
- Scenes can be switched from Live Studio.
- Song analysis content can be pushed into a Browser Source overlay.
- Start/stop stream controls are protected by safety confirmations.
- Stream credentials are never stored in unsafe locations.
- A creator can run a test recording using OBS with Song Soliloquy overlays.

---

## 27. Build Order

1. Add feature flags.
2. Add `/live-studio` placeholder page.
3. Add `/overlay/song/:slug` read-only overlay page.
4. Add local overlay state store.
5. Add Live Rundown Builder from existing SongAnalysis data.
6. Add OBS client interface.
7. Add OBS direct websocket spike.
8. Add OBS connection panel.
9. Add scene controls.
10. Add overlay trigger controls.
11. Add recording controls.
12. Add streaming controls with confirmation.
13. Add optional Supabase live session tables.
14. Add Twitch/YouTube API planning only after OBS MVP works.

