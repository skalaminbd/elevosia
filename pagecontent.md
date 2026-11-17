# Elevosia Website v3: Full Build Prompt (Content + Animated Items)

> Build every page of elevosia.com with the final copy below, word for word. Every section has its own live animated item, like the current homepage at https://elevosia.vercel.app/. Reuse the existing buttons, colors, fonts and components. 100% mobile responsive.

---

## 0. Core rules (read first)

### 0.1 No entrance animations on text or blocks
- **Do NOT** fade in, slide in, blur in or stagger headings, paragraphs, cards, buttons or sections on scroll.
- Text and layout blocks are visible and static from the first paint.
- All motion lives inside **animated items**: live UI widgets inside each section (lists that stack, beams that flow, icons that orbit, numbers that tick, mockups with live data).
- Text motion is allowed only **inside** an item: typing inside a chat or terminal card, number tickers on KPIs and prices.

### 0.2 Every section gets at least one animated item
- Each item runs on its own (live or looping), like a real product running. Not a one-time reveal.
- Items start when they enter the viewport and pause when off screen (IntersectionObserver).
- No two adjacent sections use the same item type.


**Recolor every component to brand tokens.** Replace defaults like Animated Beam `#ffaa40` / `#9c40ff` with the site's existing brand colors. No new colors.

### 0.4 Buttons
- Use only the **current** solid (primary) and outline (secondary) buttons. Do NOT use Magic UI Shimmer, Rainbow, Ripple or Pulsating buttons.
- Mobile: button groups stack full width, primary on top.

### 0.5 Section spacing
- One shared `Section` wrapper with the homepage's exact top/bottom padding (for example `py-20 md:py-28 lg:py-32`, use the homepage's real values).
- Equal gap above and below every section on every page.

### 0.6 Layout
- Most sections: text column (eyebrow, H2, body, buttons) + animated item column. Alternate item left/right between sections on desktop.
- Items sit in a card frame matching the homepage card style.

### 0.7 Mobile (100% responsive)
- Test at 360, 390, 430, 768, 1024, 1280, 1440px. No horizontal scroll anywhere.
- Mobile: text first, item below, full width.
- Animated Beam diagrams switch to vertical on mobile (recompute refs on resize).
- Icon Cloud and Globe: smaller on mobile. If FPS drops on mid-range Android, swap to Marquee under 768px.
- Tables become stacked cards. Tabs become scrollable pill bars.
- Hover effects (Magic Card spotlight, Lens) off on touch.
- Tap targets 44px+. Inputs 16px font.

### 0.8 Performance, accessibility, SEO
- Lazy-load heavy items (Icon Cloud, Globe, demo, calculator).
- Custom items animate only transform and opacity.
- `prefers-reduced-motion`: every item shows its final static state.
- Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100.
- Exact SEO title and meta description per page. One H1 per page. Canonical + OG image. FAQ sections output FAQPage schema.
- All demo data is clearly fake.

### 0.9 Closing band rule
Every page ends with a closing band: a short line from the story, Start a project and Book a call (unless the page lists different buttons).

---

## 1. Navigation

- Links: Custom Dashboards · How It Works · Industries · Pricing · Blog · About
- Right side: **Live demo** (outline button) · **Start a project** (solid button)

**Behavior:** Static. After 80px scroll, background blur + border appear. Hides on scroll down, shows on scroll up. Mobile: full-screen menu, both buttons pinned at the bottom full width.

## 2. Footer

- Tagline: Custom dashboards for growing service businesses. Built around how you work. Owned by you.
- Product: Custom dashboards, Live demo, AI & automation, Pricing, Website projects
- Company: About, How it works, Work, Industries, Contact
- Resources: Blog, Why custom vs SaaS, Cost calculator, Dashboard Blueprint checklist
- Contact: hello@elevosia.com · Based in Dhaka, Bangladesh · Live hours 8 am to 12 pm US Eastern, Mon to Fri
- Bottom line: © 2026 Elevosia · Privacy · Terms

**Animated item:** `Dotted Map` strip with a pulsing dot on Dhaka and an Animated Beam arc to the US East Coast. Mobile: map hidden, pulsing dot next to "Based in Dhaka". Link columns become accordions on mobile.

---

## 3. Home

**SEO title:** Custom Business Dashboards for Service Companies | Elevosia
**Meta description:** We build custom dashboards that run your staff, clients, jobs and billing in one place. Free Blueprint, fixed price, and you own the code.

### 3.1 Hero
- Eyebrow: Custom dashboards for growing service businesses
- H1: Run your whole business from one screen.
- Subhead: We build the dashboard your team uses every day, around the way you already work. Staff, clients, jobs, invoices and numbers in one place, with a client portal and website connected to it.
- Primary button: Start a project → Start a Project page
- Secondary button: Try the live demo → Live Demo
- Trust line: Free Blueprint · Fixed price before we build · You own the code and data · Live in 6 to 10 weeks

**Animated item:** Live dashboard in a `Safari` mock (demo data). KPI tiles with `Number Ticker` (visits today, revenue this month, open shifts, overdue invoices). Bar chart bars smoothly re-randomize every 4s. `Animated List` activity feed stacking a new event every 2s: "New booking: Jane D.", "Invoice #1042 paid", "AI filled Tuesday 9am shift", "New lead from website". AI summary card with `Typing Animation` and a `Border Beam`. Background: `Flickering Grid` masked to fade at the edges.

### 3.2 The story
- Eyebrow: Sound familiar?
- H2: It's 7:40 on Monday morning.
- Body: You open the scheduling app to see who's working. Then a spreadsheet to check which clients are due. Then your inbox, because a customer emailed about an invoice that lives in another tool. A team member texts that a job was missed. Nobody updated the sheet.
- Body, line 2 (bold): You don't have a people problem. You have a system problem. Your tools don't talk to each other, so your team does the talking for them.
- Caption: Every tool does one job. None of them show you the whole business.
- Source line: Small businesses with 1 to 24 employees use 36 SaaS apps on average. Source: BetterCloud, 2025.

**Animated item: Chaos cloud (custom).** Tool chips: Scheduling app, Client spreadsheet v7 (final), Invoicing tool, CRM nobody updates, Email threads, Group texts, Paper forms, Payroll export, Sticky notes. Chips float in slow random drift. Red unread badges on chips tick up with `Number Ticker`. Every few seconds a text bubble pops on a random chip ("Did anyone update the sheet?", "Client asking about invoice"). A small analog clock ticking at 7:40.

### 3.3 The turn
- Eyebrow: Now picture this
- H2: One login. Every answer.
- Body: Your schedule, staff, clients, invoices and numbers live in one dashboard built around your business. A customer books on your website and the job appears for your team. A shift opens and AI suggests who can cover it. You want to know how the month is going, so you just look.
- Before (card): Five tabs to answer one question · Data typed two or three times · Reports built by hand every Friday · Paying for seats nobody uses
- After (card): One dashboard for the whole team · Website, dashboard and client portal share one database · Reports written for you · No per-user fees. Add people for free

**Animated item: `Animated Beam` hub.** Five tool icons (calendar, sheet, invoice, CRM, email) beam continuously into one Elevosia dashboard hub. Before card is muted and static. After card has `Shine Border`.

### 3.4 What we build
- Eyebrow: What we build
- H2: One system, built for your business
- Intro: A private dashboard for your team, a portal for your clients and a website for everyone else. One system, one login, one partner.
- Card 1 (large): **Custom dashboard.** Staff and scheduling, services and bookings, clients and CRM, invoices and reports. Built to your requirements, never a template. Button: Explore dashboards
- Card 2: **Client portal included.** Your clients book, pay, approve and message you in one place with your logo.
- Card 3: **AI built in.** Morning briefings, smart alerts and follow-ups that run without anyone pressing a button. Link: See what AI can do
- Card 4: **Website included.** A fast public website on the same system, so every form and booking lands in your dashboard. Link: Only need a website for now?

**Animated item: Watermelon bento (Bento 01 layout).** Each cell runs its own item. Dashboard cell: mini chart animating + rows updating. Portal cell: `Animated List` of client actions ("Booked a visit", "Paid $240", "Approved design"). AI cell: briefing with `Typing Animation`. Website cell: a form submission beams (`Animated Beam`) into a dashboard icon on loop. `Magic Card` spotlight on hover.

### 3.5 Modules
- Eyebrow: Dashboard modules
- H2: Pick what you need. Add more as you grow.
- Button: See them in the live demo
- Staff & scheduling: Roles, shifts, availability, time off and tasks.
- Services & bookings: Service catalog, online booking, jobs and status.
- Clients & CRM: Client records, leads, follow-ups and full history.
- Invoices & payments: Quotes, invoices, online payments and QuickBooks sync.
- Reports & KPIs: Live numbers, custom reports and scheduled emails.
- Client portal: Clients log in to book, pay, approve and message.
- Operations: Inventory, vendors, documents, approvals and locations.
- AI assistant: Ask questions about your business in plain English.

**Animated item: `Orbiting Circles`.** Elevosia logo in the center. 8 module icons orbit in two rings (inner 4, outer 4, opposite directions). Hovering a module card highlights its orbiting icon.

### 3.6 See progress every week (new)
- Eyebrow: No more "how's it going?" emails
- H2: Watch your dashboard get built, week by week.
- Body: The moment your project starts, you get your own client portal. Every week has its own board. When we start a task, you see In progress. When it's done, it turns green. No chasing, no guessing, no waiting for a status call.
- Points: See every task the moment it starts · Approve designs and milestones with one click · Message your project manager in the same place · Every file, invoice and contract in one spot
- Link: See how it works

**Animated item: Live weekly board (custom).**
- Week 1: Project setup ✓, Database design ✓, Login and roles ✓
- Week 2: Staff profiles ✓, Shift calendar ✓
- This week: Booking form ✓, Client portal login (In progress), Payment setup (In progress)

Tasks in "This week" cycle: pending → In progress (amber pulsing dot) → Completed (green check), then reset. `Animated Circular Progress Bar` above shows project % rising.

### 3.7 How it works
- Eyebrow: How it works
- H2: From messy to managed in three steps
- Intro: No open-ended projects. You know the scope, price and timeline before a single line of code is written, and you don't pay anything to find out.
- Step 1. **Share your requirements.** Write what you need in our simple builder, section by section, or upload a doc. Not sure? Book a call and we'll write it with you.
- Step 2. **Approve your free Blueprint.** Within 5 business days you get a plan: milestones, timeline and a fixed price. Ask for changes until it's right.
- Step 3. **Watch it get built.** 6 to 10 weeks, with your weekly board updating as we work. Then we move your data, train your team and stay on as your tech partner.
- Button: Start a project

**Animated item: Three live step cards** joined by a dashed path with a traveling dot. Step 1: requirement doc lines typing (`Typing Animation`). Step 2: Blueprint card where milestones tick checked and price runs `Number Ticker` to $16,000. Step 3: mini progress bar filling week by week.

### 3.8 Your options, honestly
- Eyebrow: Your options, honestly
- H2: Why not just buy software or hire a freelancer?
- Intro: Sometimes you should. If off-the-shelf software fits your workflow and your team is small, keep it. Custom wins when you've outgrown your tools, or they never fit in the first place.

| | SaaS | Freelancer | Big agency | Elevosia |
|---|---|---|---|---|
| Fits your workflow | You adapt to it | Yes | Yes | Yes, mapped in your Blueprint |
| Upfront cost | Low | Low | $30k to $150k+ | Fixed, from $4,500 |
| Per-user fees | Every seat, every month | None | None | None |
| Who owns it | The vendor | Often unclear | You | You, in writing |
| Seeing progress | Not applicable | When they reply | Status meetings | Live weekly board |
| After launch | Support tickets | If they're still around | Expensive retainers | Monthly care plan |

- Link: See the full cost comparison and calculator

**Animated item:** Elevosia column has a `Border Beam` running around it continuously. Check icons in that column pulse once per loop. Mobile: one card per row, Elevosia value highlighted.

### 3.9 AI
- Eyebrow: AI that earns its place
- H2: Less busywork. Not more buzzwords.
- Body: We only add AI where it saves real time, and we measure it in hours saved.
- Cards: **Morning briefing** (what needs your attention today) · **Lead follow-up** (a personal reply in minutes, day or night) · **Smart scheduling** (open shifts matched to the right person) · **Ask your data** ("Which service grew most this quarter?")
- Button: Explore AI & automation

**Animated item: Four live AI cards.** Morning briefing: lines typing. Lead follow-up: `Animated List` chat bubbles (incoming lead, AI reply, "Sent ✓"). Smart scheduling: empty shift slot filled by an avatar from `Avatar Circles`. Ask your data: question types, then a mini bar chart grows.

### 3.10 Who we build for
- Eyebrow: Who we build for
- H2: Service businesses with 5 to 200 people
- Cards: Home & field services · Agencies & professional services · Nonprofits & associations · Care providers
- Button: See all industries

**Animated item: `Icon Cloud`** of industry icons (wrench, truck, briefcase, laptop, heart, hand-heart, calendar, clipboard, users, chart). Industry cards with `Magic Card` hover. "5 to 200" runs `Number Ticker`.

### 3.11 Pricing preview
- Eyebrow: Pricing
- H2: Fixed prices. No per-user fees. Ever.
- Cards: Single module from $4,500 · Launch from $8,500 · Operate from $16,000 (most popular) · Scale from $28,000
- Line under: Payment plans available. Your Blueprint is free.
- Button: See full pricing

**Animated item:** Prices `Number Ticker`. Operate card has `Border Beam` + "Most popular" badge. Mobile: snap carousel starting on Operate.

### 3.12 Working with a remote team
- Eyebrow: Working with a remote team
- H2: Built in Dhaka. Run on your hours.
- Body: We're a remote team based in Bangladesh, and we're upfront about it. You get senior work at fair prices, with the safeguards you'd expect from a US firm.
- Cards: **Live overlap every weekday** (4+ hours with US Eastern) · **You own everything** (code, data and designs, in the contract) · **NDA before you share anything** · **Your weekly board** (see progress without asking)

**Animated item: `Globe`** with Dhaka marker and an arc to US East (mobile: `Dotted Map`). Two live clocks showing real current time in Dhaka and New York, with the overlap window highlighted on a 24h bar.

### 3.13 Founder note
- Quote: "For years I built websites, SEO and automations for US nonprofits, care providers and service companies. The same story kept showing up. Great teams, losing hours every week to tools that didn't fit them. Elevosia exists to fix that. We build the one system your business actually needs, at a price that makes sense for a growing company."
- Name: Alamin, Founder, Elevosia (photo + LinkedIn link)

**Animated item:** Founder photo framed with `Shine Border`, `Ripple` behind it. Small LinkedIn badge.

### 3.14 FAQ
- **How much does a custom dashboard cost?** Most projects land between $8,500 and $28,000. A single module starts at $4,500. Your free Blueprint gives you a fixed price before you commit.
- **How long does it take?** Most dashboards go live in 6 to 10 weeks after you approve the Blueprint.
- **Do I pay for the Blueprint?** No. Share your requirements and we send a plan with a fixed price within 5 business days.
- **Why not just use off-the-shelf software?** If it fits and your team is small, use it. Custom makes sense when you pay for many tools that each do part of the job, or per-user fees keep climbing. Our calculator shows your break-even point.
- **How will I know the project is on track?** You get a client portal with a weekly board. Every task shows In progress or Completed the moment it changes.
- **Who owns the code and data?** You do, written into the contract. You're never locked in.
- **Can it connect to tools we already use?** Yes. Google Workspace, Microsoft 365, QuickBooks, Stripe, Slack and most tools with an API.
- **What happens after launch?** A 30-day warranty, then an optional monthly care plan. Or take the code and run it yourself.

**Animated item:** Accordion (functional open/close only). Beside it on desktop: a small "Ask us" chat card where sample questions cycle in an `Animated List`.

### 3.15 Closing band
- H2: Now picture next Monday.
- Body: 7:40. You open one screen. Today's jobs, who's working, what's unpaid and what needs you, already there. Your coffee's still hot.
- Buttons: Start a project · Book a call
- Small link: Not ready? Get the free Dashboard Blueprint checklist

**Animated item: Calm Monday.** Clock at 7:40, coffee cup with looping steam (SVG), one dashboard card "Today: 12 jobs, 0 open shifts, 2 unpaid" with `Number Ticker`. `Retro Grid` background.

---

## 4. Custom Dashboards

**SEO title:** Custom Dashboard Development for Small Businesses | Elevosia
**Meta description:** A custom business dashboard built around your workflow: staff, scheduling, clients, invoices and reports, with a client portal and website included.

### 4.1 Hero
- Eyebrow: Custom dashboard development
- H1: Software that fits your business like it was made for it. Because it was.
- Subhead: Off-the-shelf tools ask you to change how you work. We do the opposite. We learn how your business runs, then build the dashboard, client portal and website around it.
- Buttons: Start a project · Try the live demo

**Animated item:** Device pair. `Safari` mock (owner dashboard, live chart) + `iPhone` mock (staff day plan with jobs checking off on loop). `Animated Grid Pattern` background.

### 4.2 The problem, told plainly
- H2: You've tried the tools. They each do 60% of the job.
- Body: The scheduling app doesn't know about invoices. The CRM doesn't know who's working today. So someone on your team becomes the human glue, copying, checking and chasing. That person is usually you.
- Four pain cards: Spreadsheets everywhere · Software that almost fits · No clear numbers without asking · Busywork that eats your evenings

**Animated item:** `Animated Circular Progress Bar` fills to 60%, stalls, shakes, resets, repeats. Each pain card has a micro item: spreadsheet cells flickering, a loader that never finishes, a "?" badge pinging, a clock moving into night.

### 4.3 Included in every build
- H2: The basics are never extras
- Cards: Client portal with your logo · Public website on the same system · Roles and permissions · Works on phone and desktop · Data moved in from your old tools · Team training · 30-day warranty · No per-user fees · You own the code

**Animated item:** Two `Marquee` rows in opposite directions with these 9 items as check chips. Pause on hover.

### 4.4 Module library
- H2: Built from proven modules. Shaped to your workflow.
- Intro: We don't start from a blank page, and we don't sell you a template. Each module is a tested starting point we shape to how you work. That's how we keep prices fixed and timelines short.
- **Staff & scheduling:** staff profiles, roles and certifications · drag-and-drop shift and job scheduling · availability, time off and swaps · timesheets and payroll export
- **Services & bookings:** service catalog with pricing · online booking from your website · job status from booked to done · email and SMS reminders
- **Clients & CRM:** full client history · lead pipeline from first contact to signed · follow-up reminders · tags and quick search
- **Invoices & payments:** quotes that turn into invoices · card and bank payments · recurring billing · QuickBooks or Xero sync
- **Reports & KPIs:** live owner dashboard · reports by team, service or location · weekly report emailed automatically · CSV and PDF export
- **Client portal:** secure client login · self-service booking and payment · messages, files and updates · your brand, your domain
- **Operations:** inventory and supplies · vendors and approvals · documents and e-signatures · multi-location
- **AI layer:** ask-your-data assistant · daily briefing and alerts · automated follow-ups · document data extraction

**Animated item: `File Tree`** of the 8 modules with their features as children. Folders auto-expand one by one on loop. Clicking a module shows its features in the right panel. Mobile: accordion.

### 4.5 One system, four views (interactive tabs)
- H2: Everyone gets the screen they need
- Intro: Owners see the whole business. Staff see their day. Clients see their account. Same data, different doors.
- **Owner tab:** The whole business on one screen. Revenue, bookings and margins live · team performance at a glance · AI briefing every morning · alerts when something needs you
- **Manager tab:** Run the team without group texts. Drag-and-drop scheduling · open shifts filled with AI suggestions · approve time off and expenses · team reports by location
- **Staff tab:** A clear day plan on their phone. Today's jobs with addresses and notes · clock in and out · checklists and photo uploads · swap shifts
- **Client tab:** Your clients help themselves. Book and reschedule online · pay by card or bank · see updates and documents · message your team

**Animated item:** Tabs with device mocks. Owner = `Safari`, Manager = laptop frame, Staff = `iPhone`, Client = portal in `Safari`. Each screen has live data (tickers, list updates). Auto-advance every 6s until clicked. Mobile: pill tabs.

### 4.6 Website + dashboard
- H2: Your website stops being a brochure
- Body: Your website and dashboard share one database, so every form, booking and payment lands where your team works. No copying. No "did anyone see this lead?"
- Four steps: Customer books online → Job appears in the dashboard → AI suggests the right person → Client gets updates and pays in the portal

**Animated item: `Animated Beam` chain:** Website → Dashboard → AI → Client portal. Beams flow in sequence and each node lights up as its beam arrives. Vertical on mobile.

### 4.7 Integrations
- H2: Keep the tools you love. Connect the rest.
- Body: Your dashboard talks to the tools you already rely on. Some clients cancel three or four subscriptions after launch. Others keep them and finally get them talking.
- Chips: Google Workspace, Microsoft 365, QuickBooks, Xero, Stripe, Square, Slack, Twilio SMS, Google Calendar, Outlook, Mailchimp, HubSpot, DocuSign, Zapier, any tool with an API

**Animated item: `Icon Cloud`** with these integration logos (simple-icons slugs). Chip list stays below as static text. Fallback `Marquee` on low-end mobile.

### 4.8 Built properly
- H2: Security and ownership you can explain to your accountant
- Cards: **Your accounts, your data** (hosting, database and code live in accounts you own) · **Secure by default** (encryption, two-factor login, role-based access, activity logs) · **Daily backups and uptime monitoring** · **A modern, standard stack any good developer can work on later**

**Animated item: `Terminal`** running checks line by line on loop: "✓ Hosting in client account", "✓ TLS encryption on", "✓ 2FA enforced", "✓ Role-based access active", "✓ Daily backup completed 03:00", "✓ Uptime 99.98%".

### 4.9 Closing band
- H2: Not sure which modules you need?
- Body: Write down what's painful today. That's enough to start. We'll turn it into a Blueprint with a fixed price, free.
- Buttons: Start a project · Book a call

**Animated item:** `Ripple` background behind a notepad card where a pain point types and turns into a blueprint icon.

---

## 5. How It Works

**SEO title:** How We Build Your Custom Dashboard | Elevosia
**Meta description:** Share your requirements, approve a free Blueprint with a fixed price, then watch your dashboard get built on a live weekly board.

### 5.1 Hero
- Eyebrow: How it works
- H1: No surprises. You see every step.
- Subhead: Hiring a team you've never met is a real risk. So we made the whole process visible: what you get before you pay, what happens each week, and what's written into the contract.
- Buttons: Start a project · Book a call

**Animated item:** Mini live weekly board (2 columns) with tasks flipping to green on loop. `Flickering Grid` background.

### 5.2 Your first 10 weeks (story timeline)
- H2: Here's what working with us actually looks like
- **Day 1. You share what you need.** Open our requirement builder and write it the way you'd explain it to a new manager: a section for each part of the business, a few points under each. Or upload a doc you already have. Stuck? Book a call and we'll write it together.
- **Days 2 to 5. We ask good questions.** Your project manager reads every point and leaves comments right beside them. You answer in the same place. No long email threads.
- **Day 5. Your free Blueprint arrives.** Milestones, the tasks inside each one, a timeline and a fixed price. Ask for changes as many times as you need. Nothing is charged until you approve.
- **Week 1. You approve and we start.** You e-sign the contract and pay the deposit in your portal. Your project manager plans the first weeks of work.
- **Weeks 2 to 9. You watch it get built.** Your weekly board fills up as we work. Every Friday you get a short recorded demo and a link to try it yourself.
- **Week 10. You go live.** We move your data in, train your team role by role, and stay close while everyone switches over.
- **After launch.** A 30-day warranty, then an optional care plan. New ideas go through the same simple path.

**Animated item:** Timeline line fills with scroll. Each milestone card has a live micro item: Day 1 doc typing, Days 2 to 5 comment bubbles (`Animated List`), Day 5 price `Number Ticker`, Week 1 signature drawing on loop, Weeks 2 to 9 tasks completing, Week 10 "Live" dot pulsing, After launch shield pulse. Mobile: line on the left.

### 5.3 Your client portal
- H2: One place for everything about your project
- Intro: From the day you sign up, you get your own portal. No more digging through email for the latest file or invoice.
- **Weekly board:** Each week has its own box. Tasks show In progress when we start and turn green when they're done. You see the work, not who's doing it, so you always talk to one person: your project manager.
- **Approvals:** Designs and milestones wait for your OK. Approve or ask for changes with one click.
- **Messages:** One thread per project, with your project manager.
- **Files and contracts:** Every deliverable, signed contract and invoice in one spot.
- **Tickets:** After launch, report anything and track the fix.
- **Invoices:** Pay by card or bank transfer, and download receipts.

**Animated item:** Portal in a `Safari` mock with a live `Animated List` feed: "Task moved to Completed", "Design waiting for approval", "New message from PM", "Invoice #3 paid", "Ticket #12 resolved". Hovering a feature highlights the matching area in the mock.

### 5.4 A normal week
- H2: You'll always know where things stand
- Intro: You need about one hour a week from one person on your side. We handle the rest.
- **Monday:** The week's tasks appear on your weekly board.
- **Every day:** Tasks move to In progress and Completed as we work. Questions answered within one business day.
- **Wednesday:** Optional 30-minute live call in US morning hours.
- **Friday:** A short recorded demo of what's working, with a link to try it.

**Animated item:** Mon to Fri week strip with a "today" marker sliding across on loop. Each day shows a live mini card (Monday tasks appear, Wednesday call icon rings, Friday video thumbnail plays).

### 5.5 Time zones
- H2: Remote team. Your business hours.
- Body: We're based in Dhaka, Bangladesh, and we shift our day so your mornings overlap with our evenings. You get live answers when you need them and finished work waiting when you wake up.
- US Eastern: 8 am to 12 pm live, Monday to Friday
- US Central: 7 am to 11 am live
- US Pacific: 5 am to 9 am, plus messages any time
- While you sleep: we build, test and update your weekly board.

**Animated item: `Dotted Map`** with markers for Dhaka, New York, Chicago, Los Angeles and arcs from Dhaka. Live clocks for all four with real time and a live overlap bar.

### 5.6 In the contract
- H2: Promises in writing, not on a slide
- **You own everything:** code, designs, data and accounts are yours on payment. No license fees, no lock-in.
- **Fixed price:** the Blueprint price is the price. Changes need a written change request you approve first.
- **Confidentiality:** we sign an NDA before you share anything sensitive.
- **Pay as you see progress:** 40% to start, 30% at the mid-project demo, 30% at launch. Payment plans available.
- **30-day warranty:** anything that doesn't work as agreed, we fix free.
- **Clean handover:** if we ever part ways, you get every password, document and line of code.

**Animated item:** Contract card with `Shine Border`. Signature path draws and resets on loop. 40/30/30 bar fills in three segments on loop.

### 5.7 Security
- H2: How we handle your data
- Points: Code and hosting live in accounts you own, and our access can be removed any time · Encrypted connections and storage · Two-factor login for your team and ours · Role-based permissions and activity logs · Daily backups with tested restores · HIPAA requirements confirmed up front for care providers

**Animated item:** Shield icon with `Ripple` behind. Lock icons beside each point click shut in sequence on loop.

### 5.8 FAQ
- **What if I don't know exactly what I need?** Most clients don't. Write down what's painful today, or book a call. Your project manager turns it into requirements with you.
- **What if I don't like the Blueprint?** Ask for changes, or walk away. It costs you nothing.
- **What if the project slips?** You'll see it on your weekly board before we tell you. Your project manager explains why and what we're changing.
- **What if you disappear?** The code lives in your accounts from day one, and the contract gives you every password and document.

**Animated item:** Accordion only.

### 5.9 Closing band
- H2: The first step takes 15 minutes.
- Body: Write down what you need. We'll send a plan and a fixed price within 5 business days, free.
- Buttons: Start a project · Book a call

**Animated item:** `Animated Circular Progress Bar` labelled "15 min" filling on loop.

---

## 6. Live Demo

**SEO title:** Live Custom Dashboard Demo | Elevosia
**Meta description:** Click through a working custom dashboard: schedule, clients, invoices and an AI assistant, with sample data.

### 6.1 Hero
- Eyebrow: Live demo · sample data
- H1: Click around. This is what Monday could feel like.
- Subhead: A working dashboard for a made-up home care company called Brightline Care. Auto-fill open shifts, send invoice reminders, search clients or ask the AI a question. Yours would be built around your business.
- Button: I want one like this → Start a Project

**Animated item:** Custom animated cursor moving and clicking on a mini dashboard preview.

### 6.2 The demo (interactive)
- Sidebar: Overview · Schedule · Clients · Invoices · Ask AI · Client portal (new tab that shows the weekly board as a client sees it)
- **Overview:** "Good morning, Sarah", AI briefing, KPIs (visits today, revenue this month, open shifts, overdue invoices), weekly chart, today's jobs
- **Schedule:** list of next 7 days with three open shifts. Button: Auto-fill open shifts
- **Clients:** searchable list with status tags
- **Invoices:** paid and late invoices. Button: Send reminders to late clients
- **Ask AI:** four sample questions with answers
- **Client portal tab:** the same project from the client's side: week boxes with In progress and green Completed tasks, an approval waiting, an invoice to pay
- Small label on every screen: Demo data. Not a real company.

**Animated item (the demo itself):** Frame has a `Border Beam`. KPIs tick. Auto-fill shows a shimmer "AI matching" state, then avatars slide into slots and the Overview briefing updates. Send reminders shows paper planes + "Sent" badges. AI answers stream token by token. Client portal tab runs the live weekly board. State in memory. Mobile: bottom tab bar, tables as cards.

### 6.3 Guided prompts beside the demo
- Try this: Open Schedule and press Auto-fill. Then go back to Overview and watch the briefing change.
- Try this: Open Client portal to see exactly what your clients would see.
- Try this: Ask AI who is close to overtime.

**Animated item:** The next unfinished prompt has a pulsing ring. Completed prompts get a check. Mobile: collapsible "Try this" drawer.

### 6.4 Closing band
- H2: Every screen here is built from modules we customize.
- Body: Yours would use your services, your words and your numbers.
- Buttons: Start a project · See all modules

**Animated item:** `Marquee` of module chips.

---

## 7. Pricing

**SEO title:** Custom Dashboard Pricing | Fixed Price, No Per-User Fees | Elevosia
**Meta description:** Custom dashboards from $4,500. Free Blueprint, fixed price before we build, no per-user fees, and payment plans available.

### 7.1 Hero
- Eyebrow: Pricing
- H1: Know the price before you commit. For free.
- Subhead: No hourly meters and no surprise invoices. Share your requirements and get a fixed-price Blueprint in 5 business days. The price only changes if you change the scope.

**Animated item:** Price tag card where "$1,500" gets a strike line and flips to "Free" on loop. `Animated Grid Pattern` background.

### 7.2 Step 1: Free Blueprint
- Label: Step 1 for every project
- H3: Your Blueprint
- Body: We turn your requirements into a clear plan before any code is written. It's how we keep prices fixed and projects on time.
- Includes: Milestones and the tasks inside each one · Timeline week by week · Fixed price and payment schedule · Changes until you're happy
- Price: **Free.** Delivered in 5 business days.
- Button: Start a project

**Animated item:** Blueprint card with `Shine Border`. Includes list ticks checked one by one on loop. Mini calendar fills days 1 to 5.

### 7.3 Step 2: Build packages
- H2: Pick a starting point. We shape it to you.
- Intro: Every package includes your client portal with weekly board, roles and permissions, data migration, team training and a 30-day warranty. No per-user fees on any plan.
- **Single module**, from $4,500, about 3 to 4 weeks. Fix your biggest pain first. One module (for example scheduling, client portal or invoicing), up to 2 user roles, 1 integration. Add more modules later at module prices.
- **Launch**, from $8,500, about 6 weeks. For teams up to about 10 people replacing spreadsheets. Website + dashboard, up to 3 modules, 2 roles, 1 integration, weekly report email.
- **Operate**, from $16,000, about 8 weeks. Most popular. For growing teams running clients, staff and billing. Everything in Launch, up to 6 modules, client portal with payments, up to 4 roles, 3 integrations, 2 AI automations.
- **Scale**, from $28,000, about 10 to 12 weeks. For multi-location teams and complex workflows. Everything in Operate, all modules in scope, multi-location and advanced roles, custom integrations, AI assistant on your data.
- How you pay: 40% to start, 30% at the mid-project demo, 30% at launch. Prefer smaller payments? Ask about a monthly payment plan.
- Context line: Small business apps from US agencies are often quoted at $30,000 to $150,000 or more.

**Animated item:** Prices `Number Ticker`. Operate card `Border Beam` + "Most popular" badge. 40/30/30 segmented bar fills on loop. Context line range ticks up. Mobile: snap carousel starting on Operate, feature lists collapsible.

### 7.4 Step 3: Care plans
- H2: We don't disappear after launch
- Intro: Pick a plan, change it any month, or cancel and run it yourself. Hosting is billed to you directly by the provider.
- **Essential, $299 a month:** monitoring and daily backups · security updates · bug fixes · 2 hours of small changes · next-business-day support
- **Growth, $699 a month (recommended):** everything in Essential · 6 hours of changes and new features · one automation tune-up a month · same-business-day support · quarterly review call
- **Partner, $1,500 a month:** everything in Growth · 20 hours of development · new modules on a rolling roadmap · shared Slack channel · monthly strategy call

**Animated item:** Live uptime sparkline (heartbeat line scrolling) + "All systems operational" pulsing green dot. Growth card has `Border Beam`.

### 7.5 Add-ons
- Extra module: from $2,500
- AI automation: from $1,500
- Integration: from $1,000
- AI audit: $750, credited toward the work

**Animated item:** Four rows with `Magic Card` spotlight on hover. Prices `Number Ticker`.

### 7.6 Not ready for a dashboard? (small band)
- Body: Need a website first? Website projects start at $3,500 and are built so they can grow into a full dashboard later.
- Link: See website projects

**Animated item:** Mini `Animated Beam` from a website icon to a dashboard icon.

### 7.7 Pricing FAQ
- **Is the Blueprint really free?** Yes. You pay nothing until you approve the plan and sign.
- **What if our needs change during the build?** Small tweaks are included. Bigger changes get a written change request with a price, and nothing starts until you approve.
- **Are there per-user or license fees?** No. Add as many staff and clients as you like.
- **Do I have to buy a care plan?** No. You get a 30-day warranty. After that it's optional, and you can hire any developer since you own the code.
- **Can we start smaller?** Yes. Start with a single module and add more as you grow.
- **Can we pay monthly?** Ask about a payment plan. We'll find a schedule that works for your cash flow.

**Animated item:** Accordion only.

### 7.8 Closing band
- H2: Want a number for your business?
- Body: Share what you need and get a fixed price in 5 business days. Or try the calculator first.
- Buttons: Start a project · Try the cost calculator

**Animated item:** Small calculator preview card with numbers ticking.

---

## 8. Why Custom (with cost calculator)

**SEO title:** Custom Software vs SaaS for Small Business: Cost Calculator | Elevosia
**Meta description:** Should you build or buy? An honest comparison of custom software and SaaS, plus a calculator that shows your 3-year cost and break-even point.

### 8.1 Hero
- Eyebrow: Build or buy?
- H1: Should you build custom software? An honest answer.
- Subhead: We build custom dashboards, so you'd expect us to say "build." Sometimes we don't. Here's how to tell what's right for your business, plus a calculator to check the math.

**Animated item:** Custom SVG balance scale gently rocking between "Build" and "Buy" on loop.

### 8.2 Two honest lists
- **Stick with off-the-shelf if:** your team is under about 10 people · your process is standard and the tool fits it · you need something running this week · you use one or two tools and they work fine
- **Go custom if:** you pay for many tools that each do part of the job · per-user fees grow every time you hire · your team types the same data into several places · your way of working is what makes you different · you want to own your software and data

**Animated item:** Two cards. Check icons light up in sequence on loop in each list.

### 8.3 The costs nobody puts on the pricing page
- H2: SaaS looks cheap in month one
- Body: The sticker price is per user, per month. The real price includes everything around it.
- Cards: **Per-seat fees** (every hire adds a monthly cost to every tool) · **Yearly price increases** (often 5 to 12 percent) · **Paid add-ons** (AI, extra users and reports sold separately) · **Workaround time** (hours spent copying data between tools)
- Source line: Price increase range: Kolonell, Custom Software vs Off-the-Shelf SaaS, 2026.

**Animated item: Growing SaaS bill.** Invoice card with an `Animated List` of charges arriving ("+$45 new seat", "+7% yearly increase", "+$29 AI add-on", "+3 hrs workaround") and a total climbing with `Number Ticker`. Resets on loop.

### 8.4 Cost calculator (interactive)
- H2: Check the math for your business
- Intro: Move the sliders to match your team. We compare three years of subscriptions with a custom build plus our Essential care plan.
- Slider 1: People using software (3 to 100, default 20). Hint: staff who log into your tools.
- Slider 2: Software cost per person, per month ($20 to $400, default $120). Hint: add up scheduling, CRM, invoicing and forms tools, divided by people.
- Slider 3: Yearly price increase (0 to 15%, default 7%).
- Slider 4: Hours lost per person, per week (0 to 6, default 1.5). Hint: double entry and switching tools.
- Results: 3-year subscriptions total · 3-year custom total (package + care plan) · verdict line · hours lost per year
- Verdict lines: "Custom pays for itself in about N months." / "Custom breaks even in about N months. Close call." / "On software cost alone, SaaS is likely cheaper for you. Custom only makes sense if your tools don't fit."
- Button under results: Get a real fixed price → Start a Project
- Fine print: Estimates only. Custom total uses starting prices (Launch $8,500 up to 10 people, Operate $16,000 up to 40, Scale $28,000 above) plus Essential care at $299 a month. Your real price comes in your free Blueprint.

**Logic:**
- SaaS monthly = people × cost per person. Year 1 base, year 2 × (1+r), year 3 × (1+r)². 3-year SaaS = sum of 36 months.
- Package: ≤10 people $8,500, ≤40 $16,000, above $28,000. 3-year custom = package + 36 × $299.
- Break-even N = first month where cumulative SaaS ≥ package + N × $299. N ≤ 24 → verdict 1. 25 to 36 → verdict 2. Never within 36 → verdict 3.
- Hours lost per year = people × hours per week × 52.

**Animated item:** Results run `Number Ticker` on every change. Two-line 36-month cumulative cost chart morphs smoothly. Break-even point pulses. Mobile: results card sticky at bottom while sliding.

### 8.5 The middle path
- H2: You don't have to replace everything
- Body: Most clients keep a few tools they love, like QuickBooks or Google Workspace, and replace the rest.
- Keep: accounting, email, documents
- Replace: scheduling, CRM, forms, trackers
- Add: client portal, reports, AI

**Animated item: `Animated Beam`.** Keep tools beam into the Elevosia hub and stay connected. Replace tools slide into the hub and disappear. Add items beam out of the hub.

### 8.6 Closing band
- H2: Still not sure? We'll tell you straight.
- Body: On a call we'll look at your tools. If off-the-shelf is the better choice, we'll say so and point you to the right one.
- Buttons: Book a call · Start a project (Book a call is the primary button here)

**Animated item:** Call card with a live call timer ticking.

---

## 9. AI & Automation

**SEO title:** AI Automation for Service Businesses, Built Into Your Dashboard | Elevosia
**Meta description:** Practical AI inside your custom dashboard: daily briefings, lead follow-up, smart scheduling and payment reminders, measured in hours saved.

### 9.1 Hero
- Eyebrow: AI & automation, inside your dashboard
- H1: AI that does real work. Not a chatbot in the corner.
- Subhead: We build AI into the place your team already works: your dashboard. Every automation has one job, and we measure it in hours saved.
- Buttons: Start a project · Try the AI in our demo

**Animated item:** Dashboard in `Safari` mock with an `Animated List` of AI actions: "Filled 3 open shifts", "Sent 4 payment reminders", "Drafted weekly report", "Scored new lead: high intent". No chatbot bubble.

### 9.2 Four rules
- **01. Start with the job.** We find the task eating hours first, then pick the simplest tool that fixes it.
- **02. People approve what matters.** AI drafts and suggests. Your team approves anything that touches money or clients.
- **03. Measured, not promised.** We track time saved from day one and turn off what doesn't pay off.
- **04. Your data stays yours.** We use business-grade AI services that don't train public models on your data.

**Animated item:** 2×2 `Magic Card` grid. Each card has a live icon (target pulse, approval check, gauge needle swinging, lock).

### 9.3 What we automate
- **Inside your dashboard:** Morning briefing (replaces checking five screens) · Ask your data (no more waiting on reports) · Smart scheduling (gaps filled in minutes)
- **On your website and portal:** Website assistant that answers from your service info and books calls · Lead scoring and routing · Instant personal replies in your voice
- **Across operations:** Reading invoices, intake forms and PDFs into the system · Polite payment follow-ups that stop when the client pays · Weekly reports written and emailed every Monday

**Animated item: `Animated Beam` hub.** Inputs (website, email, PDF, form) → AI core → outputs (dashboard, calendar, client inbox, report). Beams flow continuously. Vertical on mobile.

### 9.4 Story: one night, no hands
- H2: From website enquiry to booked job, while you sleep
- 11:42 pm A visitor fills in your quote form.
- 11:42 pm AI reads it and scores it: high intent, in your area, good fit.
- 11:43 pm A lead appears in your dashboard with every detail filled in.
- 11:44 pm A personal reply goes out with a booking link, from a template you approved.
- 8:05 am A call is on your calendar before you open, with a summary ready.

**Animated item:** Digital clock ticks through each timestamp. Each event appears in an `Animated List` as the clock reaches it. Card background loops from night (stars twinkling) to morning.

### 9.5 How we roll it out
- **Audit:** we find your top three time sinks
- **Pilot:** one automation live in two to three weeks, with a human checking results
- **Measure:** hours saved, response times and errors against the old way
- **Scale:** roll out what works, drop what doesn't

**Animated item:** Four step cards, each with an `Animated Circular Progress Bar` (25, 50, 75, 100) filling on loop.

### 9.6 Already have a system?
- H3: The AI audit, $750
- Body: A focused week looking at how work flows, ending with a written plan for your three biggest automation wins, time saved and cost. The fee is credited if we build them.
- Button: Book an AI audit

**Animated item:** Workflow diagram with `Lens` zoom on hover (desktop). "$750" `Number Ticker`.

### 9.7 Closing band
- H2: Where is your team losing the most hours?
- Body: Tell us, and we'll show you the first thing worth automating.
- Buttons: Start a project · Book a call

**Animated item:** Custom SVG hourglass flipping on loop.

---

## 10. Industries

**SEO title:** Custom Dashboards by Industry: Field Services, Agencies, Nonprofits, Care | Elevosia
**Meta description:** See what a custom dashboard looks like for your kind of business: the modules, the numbers on your screen, and where AI helps.

### 10.1 Hero
- Eyebrow: Industries
- H1: Built for businesses that run on people, schedules and clients.
- Subhead: If your team goes out to do the work, juggles appointments and bills clients every month, you're who we build for. Pick your industry to see what your dashboard could look like.

**Animated item: `Orbiting Circles`.** Four main industry icons in the inner ring, six "also built for" icons in the outer ring.

### 10.2 Industry tabs (interactive)
Each tab: a one-line hook, a short story, modules, numbers on the owner dashboard, where AI helps, a button.

**Home & field services** (HVAC, plumbing, cleaning, landscaping, pest control)
- Hook: Less time in the truck on the phone. More jobs done.
- Story: Your crews are out all day, the office juggles calls, and quotes sit in someone's inbox. We put booking, dispatch, quotes and invoices in one place, with a simple phone view for the crew.
- Modules: online booking, crew dispatch, quotes to invoices, job checklists and photos, client portal, recurring service plans
- Numbers: jobs completed per crew, revenue per job and per tech, quote win rate, unpaid invoices
- AI: assigns jobs by skill and location, turns site photos into notes, follows up on quotes that went quiet
- Button: Plan a field service dashboard

**Agencies & professional services** (marketing, IT, consulting, accounting)
- Hook: Know which clients make you money, and which ones don't.
- Story: Projects live in one tool, hours in another, invoices in a third, and client reports take a day each month. We bring projects, time, retainers and reporting together.
- Modules: client projects, time tracking, retainers and billing, client reporting portal, resource planning
- Numbers: billable utilization, margin per client, retainer hours used, overdue tasks
- AI: drafts monthly client reports, flags projects heading over budget, summarizes long client threads
- Button: Plan an agency dashboard

**Nonprofits & associations** (foundations, member groups, scholarship programs)
- Hook: Spend your hours on the mission, not on spreadsheets.
- Story: Donors in one system, applications in email, volunteers in a sheet, and the board wants an impact report by Friday. We give your team one place to run programs and prove results.
- Modules: donor and member CRM, applications and reviews, volunteer scheduling, events, impact reporting
- Numbers: funds raised vs goal, applications in review, member renewals, people served
- AI: summarizes applications for reviewers, drafts donor thank-you notes, builds board-ready impact summaries
- Button: Plan a nonprofit dashboard

**Care providers** (home care, therapy practices, senior services)
- Hook: Every visit covered. Every family informed.
- Story: Caregiver schedules change daily, families call for updates, and paperwork never ends. We build scheduling, visit tracking and family updates around how your agency runs.
- Modules: caregiver scheduling, visit tracking, client intake, family portal, credential tracking
- Numbers: visits completed vs scheduled, open shifts, caregiver hours, expiring credentials
- AI: fills open shifts with qualified nearby caregivers, turns visit notes into clear family updates
- Note: Handling patient health information? We confirm HIPAA requirements in your Blueprint before any protected data is involved, and only build on hosting that supports a signed Business Associate Agreement.
- Button: Plan a care dashboard

**Animated item:** Each tab shows KPI tiles with `Number Ticker` + one industry item. Field services: `Dotted Map` with truck dots moving along routes. Agencies: utilization `Animated Circular Progress Bar` + margin bars. Nonprofits: fundraising bar filling toward goal + donor `Animated List`. Care: shift calendar where open slots fill with caregiver avatars. Auto-advance until clicked. Deep links like `/industries#care`. Mobile: pill tabs, KPIs 2×2.

### 10.3 Also built for
- Cleaning companies (recurring jobs, crews, checklists) · Training and education (enrollments, classes, student portals) · Property management (units, tenants, maintenance) · Staffing agencies (candidates, placements, timesheets) · Wellness studios (bookings, memberships, instructors) · Logistics and delivery (routes, drivers, proof of delivery)

**Animated item:** `Marquee` of the six industry cards. Pause on hover.

### 10.4 Closing band
- H2: Don't see your industry?
- Body: If your business has staff, clients and services, we can build for it. Tell us how your week runs.
- Buttons: Start a project · Try the live demo

**Animated item:** `Retro Grid` background with a small week calendar card filling with jobs.

---

## 11. About

**SEO title:** About Elevosia | Custom Dashboards for Growing Businesses
**Meta description:** A small senior team building custom dashboards for US service businesses. Founded by Alamin after years of web, SEO and automation work for US organizations.

### 11.1 Hero
- Eyebrow: About Elevosia
- H1: We started by building websites. We kept seeing the same problem behind them.

**Animated item:** Browser window card that flips on loop between a polished website and the messy spreadsheet behind it.

### 11.2 The story (three chapters)
- **The pattern.** For years, our work was websites, SEO and automation for US organizations: nonprofits, care providers, associations and service companies. The websites got better and the traffic went up. But behind the website, the same thing kept happening. Leads waited in an inbox. Schedules lived in a spreadsheet only one person understood. Reports took a full Friday. Smart, hard-working teams lost hours every week to tools that were never built for them.
- **The idea.** Growing businesses were stuck between two bad options: software that almost fits, priced per seat, or a custom build from a big agency, priced for companies ten times their size. We thought there should be a third option. Custom software built from proven modules, at a fixed price a growing business can plan around, with a client portal that shows progress every week.
- **Elevosia.** So we built it. Elevosia makes custom dashboards for service businesses that have outgrown their tools. One system for the team, the clients and the website, owned by the business that uses it. We're a small, senior, remote team in Dhaka, Bangladesh, working US hours. Small on purpose: you talk to the people building your software, not an account manager.

**Animated item:** One item per chapter. Pattern: inbox `Animated List` piling up unread leads. Idea: two option cards (SaaS / Big agency) pulling apart and a third card appearing between them. Elevosia: `Animated Beam` from team, clients and website into one dashboard.

### 11.3 What we believe
- **Honest over hype.** If off-the-shelf fits you better, we'll say so. If AI won't help, we won't sell it.
- **You own your tools.** Your software and data belong to you. No lock-in, ever.
- **Show, don't tell.** You see every week of work on your board, not in a status meeting.
- **Here after launch.** Launch is the start. We stick around to keep it working and growing.

**Animated item:** Four `Magic Card` cards with live icons.

### 11.4 The team
- **Alamin, Founder.** Web development, technical SEO and automation for US organizations. Photo, LinkedIn link, one personal line.
- Team cards: name, role, photo, one line each. Show only real people. Hide this block until photos are ready.

**Animated item:** Founder photo with `Shine Border`. Team in `Avatar Circles`. Hide the team block if the team array is empty.

### 11.5 Experience
- H2: Where our team has done the work
- Body: Before Elevosia, our team built and grew digital systems for organizations in these sectors across the US.
- Chips: Nonprofits · Hospice and home care · Member associations · Advocacy groups · Professional services · Sports and recreation · Financial services

**Animated item:** `Marquee` of sector chips. Sectors only, never client names.

### 11.6 Why Dhaka
- H2: Senior talent, fair prices, your hours
- Body: Bangladesh has a deep pool of skilled developers and designers. Working from here lets us offer senior work at prices growing businesses can afford, while shifting our day to overlap with yours.
- Link: See how we keep remote projects on track

**Animated item: `Globe`** with Dhaka marker and an arc to the US. Mobile: `Dotted Map`.

### 11.7 Closing band
- H2: Let's talk about your business.
- Body: Thirty minutes, no pitch deck. Just your workflow and our honest take.
- Buttons: Book a call · Start a project (Book a call is primary)

**Animated item:** Calendar slot card with a "30 min" badge pulsing.

---

## 12. Work

**SEO title:** Custom Dashboard Projects and Case Studies | Elevosia
**Meta description:** See how growing businesses replaced scattered tools with one custom dashboard, and what changed for their teams.

### 12.1 Hero
- Eyebrow: Our work
- H1: Real businesses. One system each.
- Subhead: Every story follows the same shape: what wasn't working, what we built, and what changed for the team.

**Animated item:** Three icons (broken chain → wrench → check) cycling with connecting beams.

### 12.2 Until case studies are live (show now)
- H2: See exactly what you'd get
- Card 1. **The live demo.** Click through a working dashboard and client portal. Button: Open the demo
- Card 2. **A sample Blueprint.** The real format your plan comes in: milestones, tasks, timeline and price, for a made-up company. Button: View sample Blueprint (PDF)
- Card 3. **A sample weekly board.** What your client portal shows during the build. Button: See the portal

**Animated item:** Each card has a `Safari` mock where the screenshot auto-scrolls on loop.

### 12.3 Founding clients
- H2: Be one of our first five dashboard clients
- Body: We're opening five founding-client spots. You get founding pricing and the founder on every weekly call. In return, we ask for an honest case study once you're live.
- What founding clients get: founding price on any package · founder on every weekly call · first access to new modules
- Button: Ask about a founding spot

**Animated item:** Five empty seat circles pulsing softly. Card has `Border Beam`.

### 12.4 Case study cards (when real ones exist)
- Filter: All · Dashboards · AI automation · Website projects
- Card fields: screenshot, service tag, client name, one-line result, industry and location

**Animated item:** Filter reflows cards with layout animation. **Hide the whole block when there are zero real case studies.**

### 12.5 Case study page template
- Headline: Client name: the result in one line
- Snapshot: industry, team size, modules built, timeline, location
- Before: what wasn't working, ideally in the client's own words
- Requirements: what they asked for (from their requirement submission)
- What we built: modules, portal, integrations, AI, with 3 to 5 screenshots
- The build: how the weeks went, using real weekly board snapshots
- Results: 3 numbers, only real ones (hours saved per week, tools replaced, a key business number)
- Client quote with name, title and photo
- Next project link and closing band

**Animated item:** Results `Number Ticker`. Weekly board snapshots in a `Marquee`. Screenshots in `Safari` mocks.

### 12.6 Closing band
- H2: Your project could be the next story.
- Buttons: Start a project · Open the live demo

**Animated item:** Empty case study card with a dashed `Border Beam` and "Your story here".

---

## 13. Blog

Purpose: bring business owners searching for dashboard and operations answers, then hand them one step closer to a project. Every post ends with the checklist and Start a project.

**SEO title:** Blog: Running a Smoother Service Business | Elevosia
**Meta description:** Practical guides on custom dashboards, build vs buy, client portals and AI automation for growing service businesses.

### 13.1 Blog index
- Eyebrow: The Elevosia blog
- H1: Run a smoother business.
- Subhead: Practical guides for owners who are tired of juggling tools. No jargon, no fluff.
- Search box placeholder: "Search articles"
- Category filters: All · Build vs buy · Operations · Client experience · AI & automation · Industry playbooks
- Featured post (large card): image, category, title, two-line summary, reading time, "Read the guide"
- Post grid: 3 columns, newest first, 9 per page. Card: image, category, title, one-line summary, date, reading time
- Mid-page band (after 6 cards): "Have you outgrown your tools? Take the 2-minute check." Button: Take the check
- Newsletter box: H3 "One useful email a month." Body "New guides and real numbers from our projects. No spam, unsubscribe any time." Fields: first name, work email. Button: Subscribe
- Closing band: standard (Start a project · Book a call)

**Animated items:** Hero: `Marquee` of category chips under the search. Featured card: `Magic Card` spotlight. Grid: static cards, image zoom on hover only. Mid-page band: checklist boxes ticking on loop. Newsletter: `Confetti` burst on successful submit. Mobile: 1 column grid, pill filters.

### 13.2 Blog post template
- Top: category tag, H1, one-sentence summary, author photo and name (Alamin, Founder), date, reading time
- Table of contents on the left on desktop, collapsed on mobile
- Body: short sections with H2s, screenshots and examples. Write for an owner, not a developer
- Inline CTA box about 40% down: "Not sure if custom is right for you? Try our cost calculator."
- FAQ at the end, 3 to 5 questions, with FAQ schema
- End CTA box: H3 "Want a plan for your business?" Body "Share what you need and get a free Blueprint with a fixed price in 5 business days." Buttons: Start a project · Get the checklist
- Author box: photo, two lines, LinkedIn link
- Related posts: 3 cards from the same category
- Schema: Article and FAQ. Canonical URL. Open Graph image per post

**Animated items:** `Scroll Progress` bar at the top. Sticky TOC with sliding active indicator. CTA boxes with `Shine Border`. No animation inside article text.

### 13.3 First 12 articles

| # | Title | Target keyword | Reader stage | Ends with |
|---|---|---|---|---|
| 1 | 9 Signs Your Business Has Outgrown Spreadsheets | outgrown spreadsheets | Feels the pain | Blueprint checklist |
| 2 | The Real Cost of Per-User Software as Your Team Grows | per user pricing software | Feels the pain | Cost calculator |
| 3 | Custom Software vs Off-the-Shelf: An Honest Guide for Small Business | custom software vs off the shelf | Comparing | Cost calculator |
| 4 | What Is a Client Portal, and Does Your Service Business Need One? | client portal for small business | Comparing | Live demo |
| 5 | 7 AI Automations That Save Service Businesses Hours Every Week | ai automation for small business | Comparing | AI audit |
| 6 | How Much Does a Custom Business Dashboard Cost? | custom dashboard cost | Ready to buy | Start a project |
| 7 | How to Write Software Requirements When You're Not Technical | how to write software requirements | Ready to buy | Start a project |
| 8 | How to Choose a Custom Software Partner (and the Red Flags) | hire custom software developer | Ready to buy | Book a call |
| 9 | Working With an Offshore Development Team: A Buyer's Checklist | offshore development team | Ready to buy | How it works |
| 10 | Field Service Scheduling Software: Build or Buy? | field service scheduling software | Industry | Field service dashboard |
| 11 | What a Home Care Agency Dashboard Should Include | home care agency software | Industry | Care dashboard |
| 12 | One Dashboard for Agency Projects, Time and Retainers | agency management software | Industry | Agency dashboard |

Posts come from MDX or the CMS. The "Ends with" value picks the end CTA variant. Article 7 doubles as help text inside the requirement builder.

---

## 14. Start a Project (contact)

**SEO title:** Start a Project | Free Blueprint for Your Custom Dashboard | Elevosia
**Meta description:** Share what your business needs and get a free Blueprint with milestones, timeline and a fixed price in 5 business days. Or book a 30-minute call.

### 14.1 Hero
- Eyebrow: Start a project
- H1: Tell us what slows you down. We'll send back a plan.
- Subhead: Two ways to start. Both are free, and neither commits you to anything.

**Animated item:** Paper plane looping along a dashed path.

### 14.2 Two doors (side by side)
- **Door 1. Get a free Blueprint.** Best if you can describe what you need. Answer 5 quick questions, then write your requirements in our simple builder, or upload a doc. You'll get milestones, a timeline and a fixed price within 5 business days. Button: Start my Blueprint
- **Door 2. Book a 30-minute call.** Best if you'd rather talk it through. We ask a lot of questions and give you an honest take, even if the answer is "you don't need us." Button: Pick a time

**Animated item:** Two `Magic Card` cards. Door 1: blueprint unrolling on loop. Door 2: calendar page flipping. Hovered door gets `Border Beam`. Door 1 scrolls to the form. Door 2 opens the booking embed in a modal.

### 14.3 Short form (Door 1, step 1)
- What do you need? Custom dashboard · Add AI to what we have · A website for now · Not sure yet
- Full name
- Work email
- Company
- Team size: 1 to 10 · 11 to 40 · 41 to 200 · 200+
- Rough budget (optional): Under $5,000 · $5,000 to $10,000 · $10,000 to $20,000 · $20,000+ · Not sure yet
- Button: Continue to requirements
- Under the button: We'll never share your details. Happy to sign an NDA first.

**Animated item:** `Animated Circular Progress Bar` beside the form showing completion as fields fill. Selected options get a check pop. Mobile: inputs full width, 16px font, correct `inputmode` and `autocomplete`.

### 14.4 Step 2 (after the short form)
- H2: Your account is ready. Now tell us what you need.
- Body: We've emailed you a login to your client portal. Write your requirements now, or come back any time. Your draft saves itself.
- Builder hint text: Start with a section for each part of your business, like "Scheduling" or "Client billing". Under each, write what you want it to do in plain words. Example: "Clients can book a visit online and get a text reminder the day before."
- Buttons: Open the requirement builder · Upload a doc instead

**Animated item:** `Confetti` once on success. Hint example types in a card (`Typing Animation`).

### 14.5 Side column
- **What happens next:** 1. We read your requirements within one business day. 2. Your project manager asks questions beside your points. 3. Your free Blueprint arrives within 5 business days. 4. Approve it, or ask for changes. No pressure.
- **Not ready yet?** Take the 2-minute check to see if you've outgrown your tools. Link: Take the check
- **Other ways to reach us:** hello@elevosia.com · Based in Dhaka, Bangladesh · Live 8 am to 12 pm US Eastern, Mon to Fri

**Animated item:** "What happens next" as an `Animated List` cycling through the 4 steps. Sticky on desktop, below the form on mobile.

### 14.6 Small reassurance strip
- Free Blueprint · No per-user fees · You own the code · NDA on request

**Animated item:** `Marquee` on mobile, static row on desktop.

---

## 15. Smaller pages

### 15.1 Website projects (footer link only)

**SEO title:** Website Projects for Service Businesses | Elevosia

- Eyebrow: Website projects
- H1: Not ready for a dashboard? Start with a website that's ready for one.
- Subhead: We build fast, search-friendly websites on the same foundation as our dashboards. When you're ready for booking, a client portal or a full dashboard, nothing gets thrown away.
- Path visual: Today: a website that brings in leads → Next: online booking into a dashboard → Later: your whole business in one system
- What you get: Designed to turn visitors into enquiries · Fast on every device · Built to be found on Google and AI search · Easy for you to edit · Tracking set up properly · Ready to connect a dashboard
- Pricing: **Starter website** from $3,500 (up to 6 pages, about 3 to 4 weeks) · **Growth website** from $6,500 (up to 15 pages, booking or quote forms, about 5 to 6 weeks)
- Add-on line: Want ongoing SEO? Ask us. It's available as an add-on for website and dashboard clients.
- Note: Upgrading to a dashboard later? What you paid for the website counts toward your build.
- Closing band buttons: Start a project · See custom dashboards

**Animated items:** Hero: website in a `Safari` mock with a form submission beaming into a dashboard. Path: `Animated Beam` Today → Next → Later with nodes lighting up. What you get: icon grid with live micro icons (speed needle, search ping, pencil, chart). Pricing: `Number Ticker`.

### 15.2 Dashboard Blueprint checklist (free resource)

**SEO title:** Have You Outgrown Your Tools? Free 2-Minute Check | Elevosia

- Eyebrow: Free resource
- H1: Have you outgrown your tools? Find out in two minutes.
- Subhead: Tick what's true for your business. You'll see whether a custom dashboard makes sense, and you can take the full checklist with you.
- **Tools:** We pay for 5 or more tools to run daily work · Our tools don't share data · Per-user fees grow every time we hire · We've bent our process to fit software that almost works
- **Time:** People type the same data into more than one place · Reports take hours every week or month · Leads sometimes wait a day for a reply · Only one person really understands the spreadsheet
- **Growth:** We plan to grow the team in the next 12 months · Clients ask for a portal or online booking we can't offer · We can't see how the business is doing without asking someone · Our way of working is part of what makes us different
- **Results:**
  - 0 to 3: "Your tools are probably fine. Keep this checklist for when that changes."
  - 4 to 7: "You're starting to outgrow them. A single module could remove your biggest pain."
  - 8 to 12: "You've outgrown your tools. A custom dashboard will likely pay for itself."
- Download box: H3 "Get the full Blueprint checklist." Body "A 4-page PDF to map your workflow, roles and must-have features before you talk to any developer, us included." Fields: first name, work email. Button: Send me the checklist
- After result: Button "Turn this into a free Blueprint" → Start a Project

**Animated item:** Live score gauge (`Animated Circular Progress Bar`) updating as boxes are ticked. Result text swaps at 4 and 8. Sticky on desktop, bottom bar on mobile.

### 15.3 Thank you (after the short form)
- H1: Thanks, [first name]. You're in.
- Body: Check your inbox for your client portal login. Write your requirements whenever you're ready, and your draft saves itself.
- Buttons: Open the requirement builder · Book a call instead
- Small line: While you wait, try the live demo.

**Animated item:** `Confetti` once. Envelope flying into an inbox icon on loop.

### 15.4 Thank you (after booking a call)
- H1: You're booked.
- Body: We'll send a calendar invite and two or three short questions so we can make the most of your 30 minutes.
- Link: Try the live demo before we talk

**Animated item:** Calendar card with a check stamping on the booked date.

### 15.5 404
- H1: This page wandered off.
- Body: Unlike your data in an Elevosia dashboard, which always stays where you left it.
- Buttons: Go home · Try the live demo

**Animated item:** A small dashboard card drifting around the screen. `Flickering Grid` background.

### 15.6 Privacy and Terms
Placeholder pages with this structure. Real legal text comes later.
- **Privacy:** what the website and portal collect, why, how long it's kept, which services process it (hosting, Stripe, email, analytics, AI providers), cookies, how to ask for deletion, contact email
- **Terms:** use of the website and portal, quotes and Blueprints are not binding until a contract is signed, payment terms, intellectual property transfer on payment, limits of liability, governing law

**Animated item:** None except sticky TOC with a sliding active indicator.

---

## 16. Final QA

- [ ] No text, heading, card or section fades, slides or blurs in on scroll
- [ ] Every section has a live animated item
- [ ] No two adjacent sections use the same item type
- [ ] All components recolored to brand tokens, no default Magic UI purple/orange
- [ ] Only existing buttons used
- [ ] Section padding matches the homepage on every page
- [ ] Items pause when off screen
- [ ] Reduced motion shows static final states
- [ ] No horizontal scroll from 360 to 1440px
- [ ] Beams recompute on resize and go vertical on mobile
- [ ] Calculator matches the logic in 8.4
- [ ] Empty case study and team blocks hidden
- [ ] Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100
- [ ] SEO title, meta, canonical, OG and schema on every page

## 17. Open items (use placeholders, flag them)

- Final prices: Single module $4,500, Launch $8,500, Operate $16,000, Scale $28,000, care plans $299 / $699 / $1,500, add-ons, website projects
- Payment plan terms
- Sample Blueprint PDF and checklist PDF
- Founder photo, LinkedIn URL, team cards
- Calendar booking link and hello@elevosia.com mailbox
- Privacy and Terms legal text
- HIPAA note on Care providers: keep only if a BAA and compliant hosting are confirmed (wrap in a config flag)