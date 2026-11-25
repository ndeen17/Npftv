# NPFTV design system (demo)

The approved look is in `design/npftv-design-v3.html` (open it in a browser). The HTML/CSS for each designed screen is in `design/src/`. Port those into React components; keep the measurements and colours.

**Direction:** the current NPFTV brand (indigo, logo yellow, Nigerian green, the emblem) with the page structure of the Sheriff's Office design in `reference/design-inspiration.pdf`. It should read as a serious national broadcaster: authoritative, video-led, calm.

## Colour tokens

| Token | Hex | Use |
|---|---|---|
| `indigo` | `#1c0d37` | Brand. Header bands, hero, footer, primary dark surfaces, primary text on light |
| `indigo-deep` | `#130826` | Alert bar, footer, darkest surfaces |
| `indigo-2` | `#2a1752` | Raised surfaces on dark |
| `indigo-3` | `#3d2873` | Hover on dark, strongest map tile |
| `violet` | `#5b44b0` | Glows and gradients only |
| `yellow` | `#f5c518` | From the logo. Primary buttons, accents, full stops in the tagline, focus ring |
| `yellow-deep` | `#d9a90a` | Yellow hover/borders, warning bars |
| `green` | `#0f7a3e` | Nigerian green. Category labels, stripes, success |
| `green-2` | `#13a356` | "Broadcasting" dot, available status |
| `red` | `#d01f2e` | **LIVE and urgent alerts only** (matches npftv.net's Watch Live red) |
| `paper` | `#f4f2f9` | Page background (cool off-white, deliberately not cream) |
| `white` | `#ffffff` | Cards, header |
| `ink` | `#1a1430` | Body text |
| `muted` | `#5d5674` | Secondary text |
| `line` | `#e1dcec` | Borders on light |
| `line-dark` | `rgba(255,255,255,.12)` | Borders on dark |

**Signature detail:** the green / yellow / green **flag stripe** (4px) on top of the footer and as a short bar before the hero kicker.

Stream (dark theme): page `#0f0720`, top bar `#130826`, cards `#1a0e33`, guide slots `#24153f`, secondary text `#a79dc7` / `#bdb3da`.
Control Room: page `#f3f1f8`, sidebar `indigo`, top bar white, panels white with `line` border and 10px radius.

## Typography

- **Zilla Slab** 600/700: all headings, programme titles, big numbers, date-block days, TV graphics.
- **Archivo** (variable, use the width axis): body and UI. Use `font-stretch: 75%` for broadcast labels: times, durations, timestamps.
- Scale (desktop): hero 96px (line-height .92, letter-spacing -0.025em), section h2 36px, director h2 40px, card h3 22px, body 16px (18px for lead paragraphs), small 13 to 14.5px.
- Scale (mobile): hero 60px, h2 28px, body 16px.
- Sentence case everywhere. Avoid all-caps labels, except the TV-graphic tag ("THE BEAT") and the LIVE badge.

## Layout

- Content max width 1200px, side padding 40px (20px on mobile). Sections 88px vertical padding (56px mobile).
- Breakpoint for the mobile layout: 760px. Test at 360, 390, 768, 1024, 1440.

### Homepage order (matches the inspiration's structure)
1. Prototype banner (pale yellow)
2. Alert bar (indigo-deep): shield icon, "Public safety alert: Police officers will never ask for your BVN, PIN or one-time password." + "How to spot a scam"; right side "Broadcasting live from Abuja, 19:12 WAT" with a green dot
3. Header (white, 84px): emblem + "Nigeria Police Force / Television Network", nav (News, Watch, Programmes, Public safety, State commands, About), search, red **Watch live** button with pulsing dot. Mobile: hamburger
4. Latest ticker (indigo): yellow "Latest" label, timestamped headlines (static, not scrolling)
5. **Hero: the NPFTV emblem** (see below)
6. Quick-access row: six 96px indigo circles with yellow icons, overlapping the hero by 62px, labels below. Scam checker has a small yellow "AI" tag. Mobile: 3 x 2 grid, 72px circles
7. **Live on NPFTV Stream** module: heading + "Open NPFTV Stream" link; an indigo panel (12px radius, flag stripe on top) with a 16:9 player (parade still, LIVE badge, emblem bug, yellow play button, TV graphic "THE BEAT" + headline) on the left and, on the right, the on-air card, the next three programmes and a yellow "Open NPFTV Stream" button with "Also at stream.npftv.net". Mobile: stacked
8. Message from the Network Director: framed emblem image left (caption "Network Director"), text right, "About NPFTV" button. **No portrait, no name**
9. News and press releases (3 story rows: thumbnail, green category, date, slab headline, summary, "Read story") beside Upcoming broadcasts (date blocks with a yellow right border, tags, "Remind me")
10. Programmes: horizontal rail of 3:4 typographic posters that bleeds off the right edge
11. Public Safety: indigo scam-checker panel (textarea, "Check message", result card with red top border) beside guides list and the "not an emergency line, call 112" note
12. Photo band (parade photo, 420px, gradient, "Telling the police story, from every state")
13. Social feed on indigo: four post cards (YouTube, X, Instagram, Facebook)
14. Footer (indigo-deep, flag stripe on top): brand + socials, Watch, News, Public safety, Stay informed sign-up; bottom row with "Not an emergency service: call 112"

### Hero (chosen: the NPFTV emblem)
- Plain indigo with a soft violet radial glow behind the emblem. No photo.
- Left: kicker with the flag-stripe bar ("Nigeria Police Force Television"), the stacked tagline "Inform. Educate. Inspire." (yellow full stops), one sentence, yellow **Watch live** + ghost **Today's schedule**, then one line: red "On air now" tag, **The Beat** in slab, "until 19:30, then Cyber Sense".
- Right: `emblem.webp` at about 640x480, edges faded with a radial mask so the plate melts into the background.
- Mobile: emblem on top (about 400px wide), text below, the on-air line wraps under the buttons.
- Source: `design/src/hero_emblem.html` + the hero styles in `home.html`.
- Not chosen (kept in the design file for reference): A, the live TV screen in the hero; B, the bomb disposal photo behind the headline. Hero A's TV-screen component is reused in the embedded Live module.

## Components

| Component | Spec |
|---|---|
| Button | 48px high, radius 6, 15px semibold. Variants: yellow (primary), red (live), ghost (on dark), line (indigo outline), indigo. Small: 36px |
| Tag | 12px bold, radius 4. Live (red), AI (yellow on indigo text), soft (paper), featured (pale yellow) |
| Live dot | 8px circle, 1.6s opacity pulse; static when reduced motion |
| Lower third / On-air card | Translucent indigo, 5px yellow left border, title in slab, progress bar in yellow, meta in condensed Archivo |
| TV graphic | Yellow slab tag ("THE BEAT") joined to an indigo slab headline box |
| Quick action | 96px indigo circle, yellow 36px icon, 6px paper ring + soft shadow |
| Date block | Month (green, small) over day (slab 42px), yellow 2px right border |
| Programme poster | 3:4, radius 6, name in slab at the bottom, strapline at the top; six colour treatments (yellow, green, indigo with dots, photo, grid, white) |
| Story row | 220px 16:10 thumbnail + text column |
| Scam result | White card, red 5px top border, verdict in slab red, warning list with alert icons, "What to do" line |
| Stream EPG | 30-minute columns, slots radius 6, current slot yellow, red now-line with "Now 19:12" label |
| Control Room sidebar | 248px indigo, role switcher card at the top, grouped nav, active item has yellow left bar and count badges |
| AI panel | Indigo header with yellow spark icon; blocks for summary, sensitivity (red), house style (yellow), headline options (radio), translations (dashed box, "Needs review") |
| KPI tile | White panel, label with icon, slab 32px number, small note |

Icons: the custom set in `design/src/icons.svg` (24px grid, 1.8 stroke, round caps). `lucide-react` at `strokeWidth={1.8}` is an acceptable drop-in.

## Images

Use **only** the files in `design/assets/` (copy them to `public/images/`):

| File | Shows | Used for |
|---|---|---|
| `logo.webp` | NPFTV emblem, transparent circle | Header, footer, player bug, avatars |
| `emblem.webp` | Emblem on an indigo plate (1000x750) | **The homepage hero**, Network Director section |
| `parade.webp` | Officers in UN blue helmets on parade | Live on NPFTV Stream module, Stream player still, photo band |
| `eod.webp` | Bomb disposal unit in protective suits | News thumbnail, The Force in Focus poster, on-demand thumbnail |

These were captured from npftv.net (owned by NPFTV). They are web-resolution; ask the client for originals before launch.

**Do not use:** the AI-generated crew image, YouTube thumbnails, or any photo of the IGP, the President or other identifiable senior officials. For anything else, use typographic artwork (like the programme posters and the "The Beat" social thumbnail) or ask the client for photos.

## Copy voice

Plain, active, specific. Buttons say what happens ("Check message", "Remind me", "Approve and publish"). Errors say what went wrong and what to do. Never sound like an emergency service. British spelling.
