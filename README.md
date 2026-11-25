# NPFTV demo: starter kit

Everything decided so far for the NPFTV demo, packaged for Claude Code. The app itself hasn't been built yet; this folder becomes the project.

## Set up (VS Code + Claude Code)

1. Unzip this folder somewhere sensible, e.g. `~/projects/npftv-demo`.
2. Open the folder in VS Code (**File → Open Folder**).
3. Optional but recommended: `git init` and make a first commit, so every change Claude makes is easy to review and undo.
4. Open Claude Code (the Claude Code panel in VS Code, or run `claude` in the VS Code terminal from this folder). It reads `CLAUDE.md` automatically at the start of every session.
5. Copy `.env.example` to `.env.local` and add your OpenAI API key when you reach the AI milestone. Never commit `.env.local`.

## First message to send Claude Code

> Read CLAUDE.md and everything in docs/, then open design/npftv-design-v3.html to see the approved design. Summarise the plan back to me in a few lines, list anything that's unclear, then start Milestone 1 (Foundation): scaffold the Next.js + TypeScript + Tailwind app in this folder, set up the design tokens and fonts, the mock-data store with cross-tab sync, the three area shells (/, /stream, /control), the role picker, the presenter panel and the prototype banner. Stop when Milestone 1 runs and show me what's done.

Then go milestone by milestone (the list is in `CLAUDE.md`). After each one, check the result in the browser against `design/npftv-design-v3.html`.

## What's in here

```
CLAUDE.md                    Project memory: what we're building, stack, rules, build order
docs/
  demo-plan.md               Decisions, architecture, demo script, every screen, ERP modules
  design-system.md           Colours, type, components, homepage layout, hero options, image rules
  ai-features.md             OpenAI proxy, each AI feature, guardrails, scripted fallbacks
  mock-data.md               The fake data and the figures that must stay consistent
  open-questions.md          What's still undecided, with working assumptions
  reference/
    prd-v0.1-draft.md        The earlier PRD draft (full future product)
    npftv-website-audit.pdf  Website audit and IGP ICT recommendations
    design-inspiration.pdf   The Sheriff's Office design used for layout ideas
design/
  npftv-design-v3.html       The approved design: open in a browser
  src/                       HTML/CSS for each designed screen (homepage, hero options, Stream, Control Room, ERP)
  assets/                    The approved images: logo, emblem (hero), parade, bomb disposal unit
```

Planning whiteboard (claude.ai): https://claude.ai/artifact/3hTSW4HpS2u2jFVWWKZr3A
