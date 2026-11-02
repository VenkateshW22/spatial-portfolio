# Venkatesh K — Spatial & Systems Portfolio

A unique, interactive, hyper-modern portfolio engineered for **Venkatesh K** (Technical Trainer | Software Engineer), built with Next.js 15, React 19, TypeScript, Three.js / React Three Fiber, Rapier physics, and React Flow.

## ✨ Highlights & Creative Features

- **Interactive 3D Engineering Lanyard Badge** (`components/World.tsx`):
  - Procedural high-resolution canvas texture rendering real-time credentials, Oracle & Chandigarh University badges, status indicator, barcode, and micro-grid.
  - Rapier physics with dynamic rope and spherical joints responding to mouse drag, momentum, and scroll.
  - Graceful fallback badge for mobile, non-WebGL, and reduced-motion modes.
- **Flagship Project Architecture Sandboxes** (`components/Sandbox.tsx`):
  - **CodeSkill**: Scalable online coding & automated assessment platform. Interactive simulator tracing candidate code submissions across NestJS, Redis BullMQ queues, isolated Docker/Piston sandboxes, and 128 hash-based PostgreSQL partition shards. Includes interactive Anti-Cheat violation triggers and worker replica auto-scaling!
  - **SyncDeck**: Real-time virtual classroom. Interactive simulation demonstrating Socket.IO presentation sync, Redis pub/sub fanout, WebRTC screen-share meshes, and reconnection recovery from transient network drops.
- **The Explainer Lab** (`components/ExplainerLab.tsx`):
  - Interactive playable micro-lessons demonstrating pedagogical and architectural mastery:
    1. *Logical Database Sharding (128 Hash Buckets)*: Interactive input with live deterministic hash routing and animated 128-partition grid.
    2. *Resilience4j Circuit Breaker*: Live 3-state machine (Closed, Open, Half-Open) with fault injection and instant fallback mitigation.
    3. *BullMQ Asynchronous Job Queue*: Concurrency controls, container isolation, and test runner lifecycle.
    4. *WebSocket State Sync & Reconnection Recovery*: Monotonic sequence frames, offline ring buffers, and delta replay.
- **Multilingual Polyglot Educator Hub**:
  - Interactive language selector showcasing technical training fluency in **6 languages**: English, Hindi, Kannada, Tamil, Telugu, and Malayalam.
- **Interactive Career Journey Map**:
  - Vector SVG map of India tracking career milestones from Amrita Vishwa Vidyapeetham (Mysuru), Oracle (Bengaluru), VTS / NIET / Chitkara / LPU (Noida/Hybrid), to Chandigarh University (Punjab).
- **Awards & Accolades Showcase**:
  - 🏆 Teaching Titan Award (Chandigarh University)
  - 🥇 Best Teacher Award (Freelance Technical Training)
  - ⚡ Rockstar Award & Operational Excellence (Oracle)
  - ☁️ AWS Aurora RDS Migration Recognition (-20% cloud costs at Oracle)
- **Interactive Command Palette (`Cmd + K`)**:
  - Instant keyboard access to every project sandbox, explainer lesson, award, journey stop, and PDF download.
- **Modern Polish**:
  - System Dark/Light themes, smooth Lenis momentum scrolling, optional audio haptics (`click.wav`), and WCAG-compliant accessibility focus rings.

## 🚀 Running Locally

```bash
cd spatial-portfolio
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or `http://127.0.0.1:3000`).

## 📦 Static Export & Deployment

```bash
npm run typecheck
npm run build
```

The deployable static output is generated in `out/`, ready for hosting on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
