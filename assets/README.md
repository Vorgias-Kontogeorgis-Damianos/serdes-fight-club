# Media source folders

- `original-images/` contains the full-size original photos. Keep these for future edits.
- `source-videos/` contains the original, descriptively named videos grouped by discipline.

The website only serves files under `public/`:

- `public/media/` contains the optimized production photos.
- `public/videos/` contains the web-ready video filenames used by the site.

Run `organize_videos.ps1` after adding source videos to rebuild the `public/videos/` naming set.
