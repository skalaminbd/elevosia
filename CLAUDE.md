@AGENTS.md

# Elevosia App

Read this whole file before any UI work. If something is not covered here, ask before adding it.

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

Rules:
- Never take a primitive (button, input, select, dialog) from sources 2 to 4. Use the shadcn one and keep the layout
- No other UI library. Not allowed: MUI, Chakra, Mantine, Ant Design, DaisyUI, Bootstrap, Aceternity, Magic UI, styled-components, emotion
- Do not install a package without asking. Each imported component lists its own dependencies. Tell me what it needs first

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

| Use | Classes |
|---|---|
| Eyebrow | `rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success` |
| Hero title | `text-4xl sm:text-5xl lg:text-6xl font-bold` |
| Page title | `text-3xl font-semibold` |
| Section title | `text-2xl font-semibold` |
| Card title | `text-lg font-semibold` |
| Body | `text-base` |
| Small, labels | `text-sm` |
| Meta | `text-xs text-muted-foreground` |

## Layout
- Spacing on the 4px scale. No arbitrary spacing like `p-[13px]`
- Page container: `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`
- Marketing sections: `py-16 sm:py-24`
- Admin and portal pages: `p-4 sm:p-6`, gaps `gap-4` or `gap-6`
- Card padding: `p-6`
- Shadows: `shadow-sm` or `shadow-md` only
- Mobile first. Every page must work at 375px

## Animation
- Marketing site: animation is fine. Durations 0.2 to 0.6s, ease `easeOut`
- Admin and portal: no decorative animation. Only small transitions (hover, open and close, list changes)

## Buttons
- Always `<Button>` from `@/components/ui/button`
- Variants: default, highlight, secondary, outline, ghost, destructive, link
- Max one `default` button per section. For a single lime CTA on marketing pages use `variant="highlight"`
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
