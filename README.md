# Масштаб.AI

Landing page for **Масштаб.AI** — corporate AI-implementation training (RU/KZ bilingual, single-page, no build step).

## Stack

Plain HTML/CSS/JS. No frameworks (per project spec — dependency-light and fast). Fonts: IBM Plex Serif/Sans/Mono via Google Fonts.

## Structure

- `index.html` — markup + all styles (inline `<style>`)
- `i18n.js` — RU/KZ content dictionary
- `app.js` — language switching, sticky header, mobile drawer, hero video loading, scroll reveals
- `assets/video/hero.mp4` — hero background video
- `assets/img/` — placeholder imagery (temporary, to be replaced with real photography)

## Local development

```bash
node serve.mjs
```

Serves the project root at `http://localhost:4310`.

## Screenshots (QA)

```bash
node screenshot.mjs http://localhost:4310 [label] [width] [height]
```

Requires `puppeteer-core` (`npm install`) and a local Chrome install. Saves to `./temporary screenshots/` (gitignored).

## Notes

- The hero video is not compressed (25MB) — recommend running it through HandBrake/ffmpeg before production launch, or swapping in a hosted (e.g. YouTube) source.
- `assets/img/*` are temporary stock placeholders — swap for real photography when available.
