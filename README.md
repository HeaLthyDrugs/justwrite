# JustWrite

Minimal, distraction-free writing app built with Next.js.

## Run Locally

```bash
npm install
npm run dev
```

App: `http://localhost:3000`

## Docker Setup

```bash
# build image
docker build -t justwrite .

# run container
docker run --name justwrite -p 3000:3000 justwrite
```

Open `http://localhost:3000`

With Docker Compose:

```bash
docker compose up --build
```

## Features (Changelog Style)

### May 10, 2026 - Launch Build

- Local-first notes with autosave and offline-aware status.
- Multi-note workflow: create, pin/unpin, delete, and updated timestamps.
- Focus Mode for distraction-free writing.
- Markdown shortcuts: `Ctrl/Cmd+B`, `Ctrl/Cmd+I`, `Ctrl/Cmd+K`, and `Tab` indent.
- Export to TXT, Markdown, and JSON.
- Settings: notebook lines, font size, word count, spell check, typing sound.
- Ambient Mode: rain, cafe, library, night, forest, and lo-fi room loops with volume control.
- Scene-aware visuals: Cloudflare-hosted ambient video backdrops switch the app background.
- Theme toggle (light/dark) and font switching (sans, mono, pixel).
- Legal pages: Privacy Policy, Terms of Service, Cookie Policy, Disclaimer.
- Cookie/local-storage consent: essential storage always on, optional preferences by consent.
- Ambient audio sources and license details are tracked in `ASSETS_LICENSE.md`.
