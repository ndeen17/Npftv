# Design files

- `npftv-design-v3.html`: open in any browser. Shows the homepage (desktop and mobile) with the chosen emblem hero and the embedded Live on NPFTV Stream module, the NPFTV Stream live page, the Control Room AI copy desk, the Network Director's ERP overview, and the two hero options that weren't chosen. Images are embedded, so it works offline.
- `src/`: the HTML fragments those screens are built from. Each one assumes `shared.css` and the icon sprite in `icons.svg` are loaded first; `control.html` and `erp.html` also need `control-room.css`. `home.html` has a marker where `hero_emblem.html` (the chosen hero) goes.
- Image URLs inside `src/` point at npftv.net. In the app, use the files in `assets/` instead (copy them to `public/images/`).
- If the design and `docs/mock-data.md` ever disagree, follow `docs/mock-data.md`.
