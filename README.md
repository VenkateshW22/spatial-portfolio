# Venkatesh K — Spatial portfolio

A Next.js App Router portfolio built from Venkatesh's supplied résumé.

## Run

```sh
npm install
npm run dev
```

## Verify and export

```sh
npm run typecheck
npm run build
```

The deployable static website is generated in `out/`.

## Interaction architecture

- One React Three Fiber canvas with a procedurally textured badge and Rapier rope/spherical joints.
- Lenis supplies normalized scroll progress; the GSAP ticker drives the shared animation clock.
- Motion handles the constrained draggable note and project/modal transitions.
- React Flow diagrams support dragging, zoom, request animation, and illustrative API scaling.
- cmdk powers Cmd/Ctrl+K navigation. use-sound plays a locally generated click after opt-in.
- Small screens, reduced-motion preferences, and missing WebGL use a lightweight identity badge.
- Career milestones, project claims, and performance numbers are drawn from the résumé. Diagram traffic is explicitly simulated. Explainers are interactive lessons, not claimed video recordings.

## Edit content

Update biography, milestones, projects, and lessons in `app/page.tsx`. Styles live in `app/globals.css`; the 3D scene and architecture sandbox are in `components/`. The downloadable résumé is in `public/`.

## References

- https://nextjs.org/docs/app/guides/static-exports
- https://reactflow.dev/examples/edges/animating-edges
- https://r3f.docs.pmnd.rs/next/api/events
