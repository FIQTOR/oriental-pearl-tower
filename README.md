# 🗼 Oriental Pearl Tower — Interactive 3D Explorer

A real-time, interactive 3D explorer for the **Oriental Pearl Tower (东方明珠)** in Shanghai — a single-page WebGL experience built with **Three.js**. Orbit the 468 m tower, then **explode it into its component layers** (structure, facade, glass, lighting, plaza…) and reassemble it, with per-part detail, day/night lighting and a draggable sun.

> **Live demo:** open `index.html` through a local server (see below). The GLB model loads automatically.

---

## ✨ Features

- **Automatic GLB loading** — the model (`oriental-pearl-tower-core.glb`) is fetched on load, with a **Robust multi-stage fallback**: local Draco decoder → jsDelivr → gstatic → one retry → manual file picker. It no longer silently fails.
- **Exploded component view** — one tap separates the tower into labeled layers (structure, façade, glass, lighting, core, radome, visitors, greenery, paving) and animates them apart; tap again to reassemble.
- **Per-component detail** — click a marker number or list entry to see the layer's Chinese name, description, height, triangle count and material count.
- **Day / Night lighting** — a moon button swaps the whole scene between bright daylight and a lit-up night mode (exposure, environment, sun and emissive lights all adapt). **Defaults to day.**
- **Draggable sun** — azimuth and elevation sliders reposition the directional light and its real-time shadow map.
- **Bilingual labels** — English UI with Chinese (中文) component names.
- **Responsive** — a desktop 3-column layout on large screens and a compact, mobile-friendly layout on phones.
- **Self-contained & private** — the page ships **minified & obfuscated** with an anti-copy layer (see below).

## 🎮 Controls

| Action | Result |
| --- | --- |
| Drag | Orbit the camera |
| Scroll / pinch | Zoom in & out |
| **Explode components** | Explode the tower into layers / reassemble |
| **Night mode** | Toggle day ⇄ night lighting |
| Sun sliders | Move the sun (azimuth & elevation) |
| Click a marker / list row | Show that component's details |

## 🛠️ Tech Stack

- **[Three.js](https://threejs.org/) r164** (ES modules via import map) — `WebGLRenderer`, `OrbitControls`, `GLTFLoader`, `DRACOLoader`, `RoomEnvironment` (PMREM), `ACESFilmicToneMapping`.
- **Draco mesh compression** — the GLB is Draco-compressed; decoders are bundled **locally** in `draco/` with CDN fallbacks.
- **Vanilla JS + CSS** — no framework, no build step, one HTML file.
- **Instrument Sans** & **Noto Serif SC** (Google Fonts).

## 📂 Project Structure

```
.
├── index.html                 # The whole experience (obfuscated, production build)
├── src/index.original.html    # Readable source (kept in repo)
├── oriental-pearl-tower-core.glb   # Draco model — tower + plaza (9.7 MB, preloaded in parallel)
├── oriental-pearl-tower-trees.glb  # Draco model — trees only (6.4 MB, lazy-loaded after the tower)
├── draco/                     # Local Draco decoder (js + wasm) with CDN fallbacks
│   ├── draco_decoder.js
│   ├── draco_decoder.wasm
│   └── draco_wasm_wrapper.js
├── favicon.ico / favicon.svg / apple-touch-icon.png / icon-*.png
├── manifest.webmanifest       # PWA manifest
├── og-image.png               # Social preview image
├── robots.txt / sitemap.xml   # SEO
├── vercel.json                # Deploy headers (GLB + Draco caching, security)
├── obftool/
│   └── obf-module.js          # Build tool: obfuscates inline <script> blocks
└── README.md
```

## 🚀 Getting Started

The model is fetched over HTTP, so **serve the folder** (opening via `file://` will be blocked by the browser):

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

or any static host / Vercel / Netlify / GitHub Pages.

## 🔒 Source & Build

The published `index.html` is **minified & obfuscated** (control-flow flattening + base64 string encryption) with a lightweight anti-copy layer that blocks right-click, DevTools / View-Source shortcuts (`F12`, `Ctrl+U`, `Ctrl+Shift+I/J/C`, `Ctrl+S/P`…), print/save, drag-save and iframe embedding.

```bash
# rebuild the obfuscated page from the readable source
NODE_PATH=./node_modules node obftool/obf-module.js src/index.original.html index.html
```

### Loading experience

The model is split into **two Draco GLBs** so the tower appears as early as possible:

1. **`oriental-pearl-tower-core.glb` (9.7 MB)** — tower + plaza. Fetched from a tiny inline
   `<script>` in `<head>` — **before** Three.js loads — so the download starts immediately
   and in parallel with the engine. It is read through a `ReadableStream` reader so the
   progress bar reflects **real bytes received** (`x MB / 9.7 MB`) instead of jumping from
   0% → 100% at the end. Progress is buffered before the DOM exists and applied on
   `DOMContentLoaded`.
2. **`oriental-pearl-tower-trees.glb` (6.4 MB)** — trees are **lazy-loaded in the background
   after the tower is interactive** (skipped entirely when `navigator.connection.saveData`).

The local **Draco decoder** (`/draco/`) is preloaded and used first, with jsDelivr and
gstatic CDN fallbacks. The GLBs are Brotli-compressed by Vercel (~13 MB total transfer).

> The readable source (`src/index.original.html`) is kept in-repo for maintenance; the
> published `index.html` is the obfuscated build. Client-side code can never be fully
> hidden — obfuscation raises the bar rather than making reverse-engineering impossible.
> An anti-copy layer blocks right-click, DevTools/View-Source shortcuts, print/save,
> drag-save and iframe embedding.

## 📄 License & Credits

Code © 2026 — **Designed & built by FIQTOR. All rights reserved.**

The 3D model is provided as a demo asset; Three.js remains under its own MIT license.
