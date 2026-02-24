# TechBook Hub (techbook-hub)

Frames-based static engineering bookstore site.

## Run locally
- Open `index.html` in a browser.

## GitHub
This repo is intended to be pushed to GitHub.

## Firebase Hosting
Prereq: install Firebase CLI: `npm i -g firebase-tools`

Deploy:
1) `firebase login`
2) `firebase init hosting` (choose the same folder; keep `public` as `.`)
3) `firebase deploy`

Notes:
- This is a static multi-page site (not SPA), so no rewrites are required.
