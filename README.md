# Diary — a static poetry site

No build step, no backend. Plain HTML/CSS/JS. Single-page app with hash routes
(`#/poems`, `#/poem/slug`, `#/moods`, `#/memories`, `#/unsent`, `#/fragments`, `#/about`, `#/write`).

## Deploy on GitHub Pages
1. Create a repo, upload everything in this folder to the root.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Visit `https://<you>.github.io/<repo>/` after a minute.
Local preview: `python -m http.server` then open http://localhost:8000 (opening index.html by double-click won't load content).

## Add a poem
1. Open **#/write**, compose, preview, add photos, click **Download .md** (or write the file by hand).
2. Put the file in `content/poems/`.
3. Add its filename to the list in `content/index.json` (GitHub has no folder listing, so this one line is the only "registration").
4. Commit. Done.

### File format
```
---
title: That Evening
date: 2026-08-12
mood: Nostalgia, Rain          # any custom mood works
category: Memories, Love
tags: rain, campus
location: Main Gate
subtitle: optional
type: poem                     # poem | unsent | fragment
note: optional personal memory
cover: images/x.jpg            # optional; defaults to first photo
---
Poem text. Blank line = new stanza.
==A highlighted line.==
![Caption](images/a.jpg)       # alone = full-width
```
Consecutive image lines (no blank line between) form a 2- or 3-photo grid. Add `{p}` after an image for a Polaroid look.

## Add photographs
Upload to `images/`, then reference as `![caption](images/name.jpg)` in the poem, between stanzas wherever you want. Resize to ~1800px wide JPEG (<400 KB) first. Missing images degrade to a quiet placeholder.

## Not included (yet)
Parallax, per-photo location, and a Markdown-library renderer: only the syntax above is supported.
