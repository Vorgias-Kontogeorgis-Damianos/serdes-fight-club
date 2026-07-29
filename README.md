# Serdes Fight Club

Marketing site for Serdes Fight Club, built with React and Vite.

## Local development

```powershell
npm install
npm run dev
```

Build a production version with `npm run build`.

## Media layout

- `public/` is production-only: it contains the files the browser can request.
- `public/media/` holds optimized photos used by the site.
- `public/videos/` holds the web-ready videos used by the site.
- `assets/original-images/` preserves the full-resolution originals.
- `assets/source-videos/` preserves the original videos, grouped by discipline.

Use `organize_videos.ps1` to copy and consistently rename source videos into `public/videos/`.
