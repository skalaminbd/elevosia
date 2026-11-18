@AGENTS.md

# Elevosia App

Read this whole file before any UI work. If something is not covered here, ask before adding it.

## Design rules — read before building any page
These six are the client's standing rules and override anything else here. Check every page against them before writing code.

1. **One header, everywhere.** Every page renders the same `<SiteHeader />` — no per-page tone, variant or layout. It is transparent over the page and picks up the blur + border on scroll.
2. **The hero follows the theme.** Light mode gets a light hero (page background, light surfaces); dark mode gets a dark hero. Never force a dark hero in light mode, or the reverse.
3. **One type scale.** Headings are identical on every page — use the Typography table. Never tune a heading size for a single page.
4. **Every page has 2–3 dark sections**, even in light mode — feature bands and the closing band. They give the page its rhythm and contrast.
5. **Mobile is pixel-perfect.** Check 360, 390, 768 and 1440. No horizontal scroll, no clipped text, tap targets 44px+.
6. **One button system.** In light mode a button is either dark (`default`, forest) or light (`outline`, cream) — no lime, accent or coloured buttons anywhere. The same two styles on every page. On a dark band the pair inverts: a solid light button (`className="bg-background text-foreground"`) plus a light ghost button.

## Stack
- Next.js (App Router), TypeScript strict
- Tailwind CSS v4
- shadcn/ui (Radix base) for all primitives
- motion (`motion/react`) for animation
- lucide-react for icons
- react-hook-form + zod for forms
- sonner for toasts, next-themes for dark mode

## Component sources
Four sources are allowed. Each has one job. Pick in this order.

| Order | Source | Use it for | How to add |
|---|---|---|---|
| 1 | shadcn/ui | Every primitive: button, input, select, dialog, sheet, dropdown, tabs, table, badge, card, form fields | `npx shadcn@latest add <name>` |
| 2 | Watermelon UI (ui.watermelon.sh) | Dashboard layouts, landing blocks, animated sections | `npx shadcn@latest add https://registry.watermelon.sh/r/<name>.json` |
| 3 | OpenSourceUI (opensourceui.in) | Widgets, loaders, device mockups, social cards | Copy source by hand |
| 4 | OriginKit (originkit.dev) | Hero effects and showy marketing animation only | Copy source by hand |
| 5 | vengenceui

Rules:
- Never take a primitive (button, input, select, dialog) from sources 2 to 4. Use the shadcn one and keep the layout
- No other UI library. Not allowed: MUI, Chakra, Mantine, Ant Design, DaisyUI, Bootstrap, styled-components, emotion
- Do not install a package without asking. Each imported component lists its own dependencies. Tell me what it needs first

## Dashboard areas (admin + portal)
The product spec for these areas is `clientmanagement.md`. Read it before building any admin or portal screen.

The admin and client areas use a different source order from the marketing site. Pick in this order:

| Order | Source | Use it for |
|---|---|---|
| 1 | Watermelon UI animated components (ui.watermelon.sh/animated-components) | Every animated item: sidebars, activity feeds, task lists, status pickers, calendars, steppers, command search, onboarding, profile cards |
| 2 | Watermelon UI components (ui.watermelon.sh/components) | Anything animated components do not cover: data tables, calendar variants, badges, avatars, dropdowns, sheets, tabs |
| 3 | shadcn/ui (ui.shadcn.com/docs/components) | Primitives and anything missing from both: button, input, select, dialog, table, form fields |

Rules:
- Install Watermelon items with `npx shadcn@latest add https://registry.watermelon.sh/r/<name>.json` or copy the registry source into `components/kit/watermelon/`, then run the import checklist below. Always keep the source comment
- Watermelon items that pull `@hugeicons/*`, `react-icons`, `react-use-measure` or another new package are adapted to lucide + `motion/react` by hand. Never add a new icon or animation package
- Watermelon "base-ui" variants are adapted onto our existing `@/components/ui` primitives; do not add a second primitive system
- Admin and portal layouts: fixed sidebar on desktop, bottom tab bar on mobile, `p-4 sm:p-6` page padding, `gap-4` or `gap-6`
- Action buttons in admin and portal use `<Button>` or `<ButtonLink>` with the `default` or `outline` variant and the default size, the same as the marketing site. Use `size="sm"` only for dense table or toolbar utilities, and `size="icon"` with an `aria-label` for icon-only buttons. Never hand-style a primary or outline action button
- Every native select uses `<NativeSelect>` from `@/components/shared/NativeSelect` so the chevron keeps its gap from the border
- Every content popup uses `<AppDialog>` from `@/components/ui/app-dialog` (Radix Dialog, bottom sheet below 640px). Destructive confirmations use `useConfirm`; never use `window.confirm`. Large intake flows may use a full page instead of a dialog
- Dialog forms use `FormField` / `FormSelect` / `FormTextarea`, keep 3–4 fields per step, and use the dialog-scoped radii, 55% overlay, muted chrome, card body and `size="dialog"` buttons. The old shared `Dialog` is removed
- Any filter UI uses `<FilterDisclosure>` from `@/components/shared/FilterDisclosure`. Never hand-roll filter pills or a filter bar
- Boards (tasks, projects, onboarding) support drag and drop: native HTML5 drag on desktop, with a `NativeSelect` move fallback on mobile. Keep the board state in the client component
- Admin and portal sidebar footers hold only the theme toggle and the workspace/settings icon. Settings/Account is not a nav item; the icon opens `WorkspaceMenu` with profile, teams, security, wallets, settings and logout
- Fetch or install a component only when the screen you are building needs it. Do not bulk-download registry entries in advance
- Animated items must be purposeful (progress, status, lists, scheduling) and show their final state under reduced motion. No entrance animations on text or blocks

## Folder structure
```
app/(public)/              marketing site
app/(auth)/                login, signup
app/admin/                 staff area
app/portal/                client area
components/ui/             shadcn primitives only. Do not edit unless asked
components/kit/watermelon/
components/kit/opensourceui/
components/kit/originkit/
components/blocks/         our own sections built from the above
components/shared/         used in more than one area
lib/                       utils, data, auth, types
```

Every file in `components/kit/` starts with a source comment:
`// Source: <url> (adapted to Elevosia tokens)`

## Import checklist
Run this on every component from sources 2 to 4 before using it:
1. Colors: replace every Tailwind palette class (`neutral-*`, `zinc-*`, `gray-*`, `slate-*`, `blue-*` and so on), hex, rgb and arbitrary color with our tokens. The palette is disabled, so leftover classes render with no color
2. Remove hardcoded `dark:` color classes. Tokens already switch in dark mode
3. Fonts: remove any font import or `font-[...]`. Use `font-sans`, `font-heading` or `font-mono`
4. Radius: use `rounded-lg` (10px), or `rounded-full` for avatars, dots and pills. No `rounded-[...]`
5. Animation: change `framer-motion` imports to `motion/react`. Remove other animation libraries
6. Icons: swap any non-lucide icon for lucide-react
7. Buttons and inputs inside the component: replace with `@/components/ui/button` and `@/components/ui/input`
8. `cn` comes from `@/lib/utils`
9. Respect reduced motion (`useReducedMotion`)
10. Run `npm run check:design` and check light and dark mode

## Colors
All colors live in `app/globals.css`. The brand comes from three variables in `:root`:
`--brand-forest` (dark green), `--brand-lime` (lime), `--brand-cream` (page background).

Tokens:
- `background`, `foreground`: cream page, dark green text
- `card`, `popover` (+ `-foreground`): white surfaces
- `primary` (+ `-foreground`): main actions. Dark green in light mode, lime in dark mode
- `highlight` (+ `-foreground`): bold lime. Max one per section
- `secondary`, `muted`, `accent` (+ `-foreground`): soft backgrounds, subtext, hover
- `success`, `warning`, `info`, `destructive`: status. Badge pattern `bg-success/10 text-success`
- `border`, `input`, `ring`
- `chart-1` to `chart-5`: charts only
- `white`, `black`: overlays and text on images only

Rules:
- No hex, rgb, hsl, oklch or arbitrary colors in components
- No inline style colors
- In JS (charts, canvas, motion values) use CSS variables like `var(--primary)`
- New color needed: ask first, then add it to `:root`, `.dark` and `@theme inline`

## Typography
- Body and buttons: Inter (`font-sans`, the default)
- Headings: Geist (`font-heading`). h1 to h4 get it automatically
- Code, IDs, numbers in tables: Geist Mono (`font-mono`)
- Eyebrow: always `<Eyebrow>` from `@/components/shared/Eyebrow`, never hand-rolled markup. Style: tinted pill with `rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success` — no border, no icon or dot inside, same in light and dark mode, on every page. Inside dark sections use `<Eyebrow tone="inverse">` (`bg-highlight/10 text-highlight`)
- Fonts load only in `app/layout.tsx`

**The type scale is identical on every page.** Do not adjust a heading size per page or per section. If a new size is genuinely needed, change this table first and then apply it everywhere.

| Use | Classes |
|---|---|
| H1, page hero | `text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.96] tracking-[-0.04em] font-bold text-balance` |
| H2, section title | `text-4xl leading-[1.02] tracking-[-0.03em] font-bold sm:text-5xl` |
| H2, closing band | `text-4xl leading-[1.02] tracking-[-0.03em] font-bold sm:text-5xl lg:text-6xl` |
| H3, section sub-heading / large item | `text-2xl font-heading font-semibold tracking-tight sm:text-3xl` |
| List item title | `text-xl font-heading font-semibold tracking-tight sm:text-2xl` |
| Card title | `text-lg font-semibold` |
| Section intro | `text-base text-muted-foreground sm:text-lg` |
| Body | `text-base` |
| Small, labels | `text-sm` |
| Meta | `text-xs text-muted-foreground` |
| Price, IDs, numbers | `font-mono tabular-nums` |
| Eyebrow | `rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success` |

Rules:
- Never use `text-3xl` for a section heading; the section H2 is always `text-4xl … sm:text-5xl`.
- Headings are `font-heading` (Geist). `h1`–`h4` inherit it automatically, but keep it explicit on custom H1s.
- Auth screens are exempt from the hero scale; they use `text-2xl` page titles.

## Marketing page pattern (use on every page)
The Custom Dashboards page (`app/custom-dashboards/page.tsx`) sets the house pattern. Every marketing page uses this hero and this type scale — do not invent a new hero or a new heading size per page.

### Hero
**Heroes are always light**, exactly like the homepage: no brand band, the page background showing through, a default `<Eyebrow>` (not inverse), `text-muted-foreground` lead and `default` + `outline` buttons. The sticky header stays transparent over it. Two layouts are allowed — pick one per page, never invent a third:

- **Centered** (homepage, Custom Dashboards): text in `mx-auto max-w-5xl text-center`, visual below, bleeding off the bottom edge (`pb-0`).
- **Split** (About): `grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16`, content left-aligned in `lg:col-span-7`, visual in `lg:col-span-5`; stacks content-first on mobile.

| Part | Classes |
|---|---|
| Section | `relative overflow-hidden` — no band, page background shows through |
| Texture | optional; usually none on heroes |
| Container | `mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 md:pt-20 md:pb-20 lg:px-8 lg:pt-24 lg:pb-24`. Use `pb-0` when the visual bleeds off the bottom edge |
| Text block | Centered: `mx-auto max-w-5xl text-center`, lead `max-w-3xl`. Split: `lg:col-span-7`, left aligned, lead `max-w-2xl` |
| Eyebrow | `<Eyebrow>` (never inverse on a hero) |
| H1 | `mt-6 font-heading text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.96] font-bold tracking-[-0.04em] text-balance` |
| Lead | `mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg` |
| Buttons | `default` primary, `outline` secondary — no coloured buttons |
| Trust row | optional, `text-xs text-muted-foreground` with `text-success` `Check` icons |
| Visual | `mt-14 lg:mt-20`, lime glow `absolute bg-highlight/20 blur-3xl`, window `rounded-t-xl border border-b-0 border-primary-foreground/15 bg-card shadow-md`, `mx-auto max-w-5xl` |

### Section rules
- Headings, intros and card titles follow the type-scale table above exactly — every page uses the same sizes.
- **Bands are dark in both themes.** Hero bands, feature bands and closing bands use `bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground` — the page keeps its dark bookends in light mode too. Anything inside a band uses the `primary-foreground` / `dark:foreground` pair (e.g. `text-primary-foreground/70 dark:text-foreground/70`), lime (`highlight`) for accents, and `border-border` hairlines.
- **Content surfaces follow the theme.** Cards, screens, mockups and terminals are `bg-card` / `bg-background` — light in light mode, dark in dark mode. Charts and icons sitting on those surfaces use `primary` (forest in light, lime in dark), never lime on white.
- Menus dim and blur the page behind them; the header blur layer uses `bg-background/40 backdrop-blur-md`.
- Sections alternate layout (split, ruled list, full-width band, sticky sequence) and each carries one live item.

## Layout
- Spacing on the 4px scale. No arbitrary spacing like `p-[13px]`
- Page container: `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`
- Marketing sections: `py-15 md:py-20 lg:py-25` — 60px phone / 80px tablet / 100px desktop above and below, the same on every section. The hero is the exception: it uses the pattern below
- Admin and portal pages: `p-4 sm:p-6`, gaps `gap-4` or `gap-6`
- Never put `scroll-behavior: smooth` on `html`. Next's route-transition scroll reset calls `scrollIntoView` on the page fragments, so the page glides down to the footer after every navigation. Same-page anchors are smoothed by `components/shared/SmoothAnchors`, mounted in the root layout.
- Card padding: `p-6`
- Shadows: `shadow-sm` or `shadow-md` only
- Mobile first. Every page must work at 375px

## Animation
- Marketing site: animation is fine. Durations 0.2 to 0.6s, ease `easeOut`
- Admin and portal: one purposeful animated item per panel (Watermelon animated component), plus small transitions for hover, open/close and list changes. No entrance animations on text or blocks. Loops pause when off screen and freeze on their final state under reduced motion

## Buttons
- Always `<Button>` from `@/components/ui/button`
- Variants: default, highlight, secondary, outline, ghost, destructive, link
- Max one `default` button per section. CTAs are only `default` (dark) or `outline` (light) — never `highlight`, and never a lime/coloured button
- Icon-only buttons need `aria-label`

## Code conventions
- Server Components by default. `"use client"` only when needed
- Server Actions for mutations, in `actions.ts` next to the page
- Validate every input with zod
- No `any`
- One component per file, PascalCase names
- Empty state and loading skeleton for every list

## Working rules
- Do only what I ask in this message
- Before editing, list the files you will touch and wait for my OK
- Max 3 to 4 files per task unless I say otherwise
- Never install a package or delete a file without asking
- If something is unclear, ask one short question first
- After finishing, give a 3-line summary: what changed, how to test, what is next

## Verify before saying done
1. `npm run check:design`
2. `npm run lint`
3. `npm run build`
4. Check light and dark mode, at 375px and desktop
