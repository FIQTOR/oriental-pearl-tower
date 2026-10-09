# 🗼 Oriental Pearl Tower — Interactive 3D Explorer

A real-time, interactive 3D explorer for the **Oriental Pearl Tower (东方明珠)** in Shanghai — a single-page WebGL experience built with **Three.js**. Orbit the 468 m tower, then **explode it into its component layers** (structure, facade, glass, lighting, plaza…) and reassemble it, with per-part detail, day/night lighting and a draggable sun.

> **Live demo:** open `index.html` through a local server (see below). The GLB model loads automatically.

---

## ✨ Features

- **Automatic GLB loading** — the model (`oriental-pearl-tower.glb`) is fetched on load, with a **Robust multi-stage fallback**: local Draco decoder → jsDelivr → gstatic → one retry → manual file picker. It no longer silently fails.
- **Exploded component view** — one tap separates the tower into labeled layers (structure, façade, glass, lighting, core, radome, visitors, greenery, paving) and animates them apart; tap again to reassemble.
- **Per-component detail** — click a marker number or list entry to see the layer's Chinese name, description, height, triangle count and material count.
- **Day / Night lighting** — a moon button swaps the whole scene between bright daylight and a lit-up night mode (exposure, environment, sun and emissive lights all adapt). **Defaults to day.**
- **Draggable sun** — azimuth and elevation sliders reposition the directional light and its real-time shadow map.
- **Bilingual labels** — Indonesian UI with Chinese (中文) component names.
- **Responsive** — a desktop 3-column layout on large screens and a compact, mobile-friendly layout on phones.
- **Self-contained & private** — the page ships **minified & obfuscated** with an anti-copy layer (see below).

## 🎮 Controls

| Action | Result |
| --- | --- |
| Drag | Orbit the camera |
| Scroll / pinch | Zoom in & out |
| **Pisahkan komponen** | Explode the tower into layers / reassemble |
| **Mode malam** | Toggle day ⇄ night lighting |
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
├── oriental-pearl-tower.glb   # Draco-compressed 3D model (16 MB, preloaded in parallel)
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

The published `index.html` is **minified & obfuscated** (control-flow flattening + base64 string encryption) with a lightweight anti-copy layer that blocks right-click, DevTools shortcuts (`F12`, `Ctrl+U`, `Ctrl+Shift+I/J/C`…) and iframe embedding.

```bash
# rebuild the obfuscated page from a readable source
NODE_PATH=./node_modules node obftool/obf-module.js src/index.original.html index.html
```

> The readable source is intentionally **not** published here — client-side code can never be fully hidden, and obfuscation raises the bar rather than making reverse-engineering impossible.

## 📄 License & Credits

Code © 2026 — **Designed & built by FIQTOR. All rights reserved.**

The 3D model is provided as a demo asset; Three.js remains under its own MIT license.
