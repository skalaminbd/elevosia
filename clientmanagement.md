# Elevosia Client Management System: Page and Feature Spec (v2)

## What changed in v2

v2 keeps every feature from v1. It adds what the website (copy v3) promises but v1 didn't cover, fixes places where the spec contradicted itself, and adds a path to every page.

| Area | Change |
| :---- | :---- |
| Website signup | Website short form now creates the client account and sends the portal login automatically |
| Blueprint deadline | Every submission gets a Blueprint due date of 5 business days, tracked on the dashboard |
| Weekly demo | Each week box can hold a recorded demo and a staging link, emailed to the client on Friday |
| Payment plans | Blueprints can use an installment schedule, not only deposit and milestones |
| NDA first | Clients can request and sign an NDA before submitting requirements |
| Care plans and warranty | SLA depends on care plan and priority. Projects carry a 30-day warranty end date |
| Handover | New Access and ownership tab and a required handover checklist before closing a project |
| Calls | Clients can book calls in the portal. Staff get a Calls page and dashboard widget |
| Request new work | Defined as its own portal page for retainer and care plan clients |
| Change requests | Clients approve or reject change requests on the Approvals page |
| Time zones | Week rollover, due dates and emails run in the client's time zone |
| Carried over | Only started tasks show as Carried over. Unstarted tasks move silently |
| Requirements review | Clients can reply to PM comments while In review without unlocking edits |
| Security | 2FA required for all staff. HIPAA mode per client turns off AI and adds upload warnings |
| Blueprint validity | Blueprints have a valid-until date and expire after it |
| Project health | Rules for On track, At risk and Late are defined |
| Privacy | Clients can export their data and request deletion |
| Paths | App structure section added, and every page lists its path and tabs |

## Overview

The system is two apps on one database: an **Admin panel** for staff and a **Client portal** for clients. Each client is a company account that can hold many projects, tickets, invoices and a retainer or care plan at the same time. The public website shares the same database, so website forms create records directly.

| Role | Uses | Main job |
| :---- | :---- | :---- |
| Admin | Admin panel | Runs the whole system: clients, billing, team, settings, permissions |
| Project manager (PM) | Admin panel | Turns requirements into Blueprints, runs projects, assigns tasks, talks to clients |
| Developer | Admin panel | Works assigned tasks, logs time, fixes escalated tickets |
| Marketing staff | Admin panel | Runs campaigns and marketing tasks, publishes SEO and social reports |
| Support agent | Admin panel | Answers tickets, escalates code issues to developers |
| Client owner | Client portal | Submits requirements, approves Blueprints, pays, invites their team |
| Client member | Client portal | Sees only the projects the client owner shares with them |

Rules that apply on every page:

- **No staff names for clients.** Tasks and the weekly board show only the task and its status. The only staff name a client sees is their PM, as their contact in Messages.
- **Client-visible switch.** Every task, file and update is internal by default. Only items switched to client-visible appear in the portal.
- **No project without approval.** Every project starts from submitted requirements and a Blueprint the client approved.
- **Scoped access.** Developers, marketing and support see only clients and projects they are assigned to.
- **Everything is logged.** Every create, edit, delete, approval and payment goes to the audit log with who, what and when.
- **Deletes are soft.** Deleted records go to an archive for 30 days, and only Admin can restore or purge them.
- **Client time zone.** Each client company has a time zone. Week boundaries, due dates, reminders and emails use it. Staff see times in their own time zone with the client's time shown beside it.
- **Staff 2FA required.** Every staff account must turn on 2FA before it can open the admin panel.
- **HIPAA mode.** A per-client switch for care providers. When on, AI features are off for that client (ticket categorization, briefings, summaries), file uploads show a "no patient data unless approved" warning, and the client's files and messages are excluded from any AI processing.

## App structure

One app, path-based, same domain as the website.

| Area | Base path | Who |
| :---- | :---- | :---- |
| Public website | `/` | Everyone |
| Auth | `/login`, `/invite`, `/forgot-password`, `/reset-password` | Everyone |
| Client portal | `/portal` | Client owner, client member |
| Admin panel | `/admin` | Staff (Admin, PM, Dev, Mkt, Sup) |

Auth pages:

| Page | Path |
| :---- | :---- |
| Log in | `/login` |
| Two-factor code | `/login/2fa` |
| Accept invite or website signup link | `/invite/[token]` |
| Forgot password | `/forgot-password` |
| Reset password | `/reset-password/[token]` |

Route rules:

- After login, clients go to `/portal` and staff go to `/admin`.
- Middleware checks the role on every request. `/portal/*` is for clients only, `/admin/*` is for staff only.
- Client members only reach projects shared with them. Any other project ID returns 404.
- Staff routes follow the Roles and permissions table. A route a role can't open returns 403 and is hidden from the sidebar.
- `/admin/settings/*` and `/admin/preview/*` are Admin only.
- Staff without 2FA are redirected to `/login/2fa` setup before any `/admin` route.
- Tabs open with `?tab=`, so every tab has a shareable link.
- Keep `/portal` and `/admin` as separate route groups so the portal can move to a subdomain or a client's custom domain later.

## Core flows

Every project follows one path: requirements, then an approved Blueprint, then a live project the client follows week by week.

\[embedded content: requirements to project · 7 steps, 1 approval loop\]

A change request sends the Blueprint back to the PM. Approval locks the requirements and the Blueprint becomes the project plan.

### 1\. Onboarding a new client

Two ways in:

**A. From the website (self-signup)**

1. The visitor fills the short form on `/start-a-project`: what they need, full name, work email, company, team size, budget (optional).
2. The system creates a client account with status Lead, saves the form answers on the client record, and sets lead source to Start a project.
3. The system emails a portal login link right away. The website shows "Your account is ready."
4. Admin and PM are notified. The default PM rule assigns a PM, or Admin assigns one.
5. The client sets a password and lands on Submit requirements.

**B. Created by staff**

1. Admin or PM creates the client account, or converts a lead from another website form (checklist download, newsletter, call booking).
2. The system emails a portal invite to the client owner. The link expires in 7 days.

**Both paths then continue:**

3. The client owner sets a password, can turn on 2FA, sets the company time zone, and fills in the company profile.
4. The client can press **Request NDA**. The NDA is sent for e-sign before they share requirements. Submit requirements shows a note that the NDA is pending until it's signed.
5. The onboarding checklist for that service type is attached, and the client sees it on Portal home.
6. Missing steps trigger a reminder after 3 days, to the client and the PM.

### 2\. Requirements to project

1. The client opens **Submit requirements**, adds sections with feature points, or uploads a doc, then presses Submit.
2. Admin and PM get notified. The submission appears in **Requirements inbox** with status Submitted. The system sets **Blueprint due** to 5 business days after submission, in the client's time zone.
3. The PM comments on points and asks questions. Status: In review. The client can reply to comments while In review, but cannot edit or delete points. If the PM needs edits, they press Send back to client (status Changes needed) and the client edits and resubmits.
4. The PM opens **Create Blueprint**, which copies every section and point into milestones and tasks. The PM adds timeline, price, payment schedule (deposit and milestones, or installments) and a valid-until date (default 30 days).
5. The PM sends the Blueprint. Requirements lock. The client sees it in **Blueprints** with Approve and Request changes buttons.
6. Request changes sends it back to step 4 with the client's comments. Approve moves on. If the valid-until date passes with no answer, the Blueprint becomes Expired and the PM can reissue it.
7. Approval generates the contract for e-sign and the deposit invoice. When both are done, the project is created with status Planning and the PM assigns the team.

### 3\. The weekly board

1. The PM marks which tasks are client-visible and plans them into a week.
2. Monday to Sunday is one week, in the client's time zone. Each week is one box on the client's project page.
3. When a developer moves a task to In progress in the admin panel, the client sees it as In progress, with no name.
4. When the task is Done, it shows a green check and Completed in that week's box.
5. The PM can attach a **weekly demo** to any week box: a recorded video link and a staging or test link. On Friday the client gets an email with the demo.
6. On Sunday night (client time zone), tasks that started but aren't done (In progress or In review) move to next week's box, marked Carried over. Tasks that never started (To do) move to next week silently and stay hidden. Past weeks stay as a record.

### 4\. Support tickets

1. The client opens a ticket with a subject, project, description and files.
2. AI suggests category and priority (off for clients in HIPAA mode). The SLA timer is set by the client's care plan and the priority (see SLA rules in Settings).
3. If the project is inside its 30-day warranty, the ticket is marked **Under warranty** and no hours are charged.
4. The ticket goes to the support queue, and an agent claims it or Admin assigns it.
5. The agent replies and can add internal notes the client never sees.
6. A code issue becomes a linked developer task. The ticket shows Waiting on development to the client.
7. When fixed, the agent marks it Resolved. The client confirms, or it closes after 3 days. The client can reopen within 7 days.

### 5\. Payments

1. Invoices come from the Blueprint's payment schedule (deposit, milestones or installments), from retainers and care plans (monthly on the 1st), from approved change requests, or are created by hand.
2. The client gets an email and a portal notification, and pays by card or bank transfer.
3. A paid invoice sends a receipt, syncs to accounting, and can unlock the next milestone.
4. An overdue invoice sends reminders at 3, 7 and 14 days. After 14 days Admin gets an alert and can put the project On hold.
5. Installment plans create every invoice up front with its due date. Auto-pay can charge each one on its due date if the client turned it on.

### 6\. Existing client, new project

1. The client opens **Submit requirements** again from Portal home.
2. The flow starts at step 2 of Requirements to project. Onboarding is skipped.
3. Retainer and care plan clients can instead use **Request new work** for smaller items. The PM accepts it as tasks in an existing project (logged against monthly hours) or converts it to a full requirements submission if it's too big.

### 7\. Change requests

1. After a project starts, the PM creates a change request in Project detail with scope, price and timeline impact.
2. The client sees it on the **Approvals** page with Approve and Reject.
3. Approve adds the tasks to the project, updates the timeline, and creates an invoice if the change has a price. Reject keeps the plan as it is.
4. Nothing in a change request starts until it's approved.

### 8\. Launch, warranty and handover

1. When the project goes live, the PM sets the launch date. The system sets warranty end to launch date plus 30 days.
2. The PM fills the **Access and ownership** tab: hosting, domain, code repository, database, email services and other accounts, each with who owns it (should be the client) and whether access was handed over.
3. Before Close project works, the handover checklist must be complete: all accounts in the client's name, credentials handed over through a secure method, final files shared, final invoice paid, all milestones approved.
4. At warranty end, the client is offered a care plan. If they pick one, the retainer starts on the next 1st.

### 9\. Calls

1. Clients press **Book a call** in the portal. It opens the booking calendar (Google Calendar or Calendly) limited to live hours.
2. The booked call shows on the portal Calls page, the admin Calls page and the PM's dashboard.
3. After the call, the PM can attach notes and action items. Client-visible notes appear on the call record.

## Client portal pages

The portal has 15 pages. Client owners see everything for their company. Client members see only the projects shared with them and cannot pay invoices, approve, sign or invite people unless the owner allows it.

### 1\. Login and invite

Paths: `/login` · `/login/2fa` · `/invite/[token]` · `/forgot-password` · `/reset-password/[token]`

| Option | What happens |
| :---- | :---- |
| Accept invite link | Opens set-password screen. Link expires after 7 days, PM can resend |
| Login link from website signup | Sent right after the Start a Project form. Opens set-password screen, then Submit requirements |
| Log in | Email and password. Locks for 15 minutes after 5 wrong tries |
| Forgot password | Sends a reset link by email, valid 1 hour |
| Two-factor code | Asked after password if the client turned on 2FA |

### 2\. Portal home

Path: `/portal`

| Option | What happens |
| :---- | :---- |
| Project cards | One card per active project: name, progress %, current week's tasks count, next milestone date, health shown as On track or Needs attention. Click opens Project detail |
| Waiting for you | List of items needing the client: Blueprints to approve, milestones to approve, change requests, unpaid invoices, contracts to sign, onboarding steps. Each item links to its page |
| Onboarding checklist | Shown only until onboarding is complete. Ticks itself when each step is done |
| Latest updates | Last 5 completed tasks, weekly demos and published reports across all projects |
| Blueprint status | If a submission is in review, shows "Your Blueprint is due by [date]" |
| Start a new project | Opens Submit requirements |
| Request new work | Opens Request new work (retainer and care plan clients only) |
| Open a ticket | Opens New ticket form |
| Book a call | Opens the booking calendar |

### 3\. Submit requirements

Paths: `/portal/requirements/new` · `/portal/requirements/[id]`

| Option | What happens |
| :---- | :---- |
| Project name | Required. Becomes the draft project name |
| Add section | Adds a section with a title field, for example "Staff management" |
| Add point | Adds a feature point under that section. Points can be reordered by drag |
| Mark point as must-have or nice-to-have | Helps the PM split the Blueprint into phases |
| Attach files to a point | Screenshots, examples, sample spreadsheets |
| Delete section or point | Allowed only while status is Draft or Changes needed |
| Upload a doc instead | Accepts PDF, DOCX, Google Docs link. Sections become optional |
| Budget range and deadline | Optional fields at the bottom |
| Request NDA first | Sends an NDA for e-sign. A banner shows until it's signed |
| Help text | Short guide on writing requirements when you're not technical (from blog article 7) |
| Save draft | Saves without notifying anyone. Auto-saves every 30 seconds |
| Submit | Status becomes Submitted. Admin and PM are notified. Blueprint due date is set. Point editing locks |
| Answer PM comments | Comments appear next to each point. Client can reply while In review. Editing points opens again only when status is Changes needed, then client resubmits |

### 4\. Blueprints

Paths: `/portal/blueprints` · `/portal/blueprints/[id]`

| Option | What happens |
| :---- | :---- |
| Blueprint list | All Blueprints for the company with status: Waiting for approval, Changes requested, Approved, Expired |
| View Blueprint | Shows milestones, tasks per milestone, timeline, price, payment schedule (deposit, milestones or installments), terms and valid-until date |
| Comment on any item | Client leaves a note on a milestone or task |
| Request changes | Requires a comment. Sends the Blueprint back to the PM |
| Approve | Confirms the plan. Opens the contract for e-sign, then the deposit invoice. Not available after the valid-until date |
| Download PDF | Exports the Blueprint for the client's records |

### 5\. My projects

Path: `/portal/projects`

| Option | What happens |
| :---- | :---- |
| Project list | Every project with status, progress %, start and end dates |
| Filter | Active, Completed, On hold |
| Open project | Goes to Project detail |

### 6\. Project detail

Path: `/portal/projects/[id]` · Tabs: `?tab=board` (default), `milestones`, `files`, `messages`, `invoices`, `calls`, `access`

| Tab or option | What happens |
| :---- | :---- |
| Weekly board (default tab) | One box per week, newest first. Tasks show In progress, Completed with a green check, or Carried over. No staff names |
| Weekly demo | Inside each week box when the PM adds it: video link and staging link to try |
| Week picker | Jump to any past week of the project |
| Milestones | Each milestone with its tasks, status and due date. Approve milestone button appears when the PM requests approval |
| Files | Client-visible files and deliverables, with versions. Client can upload files here |
| Messages | The thread for this project. PM name shown, other staff appear as Elevosia team |
| Invoices | Invoices that belong to this project |
| Calls | Past and upcoming calls for this project with client-visible notes |
| Access and ownership | List of accounts (hosting, domain, repo, database, services), who owns each, handover status. Read only for the client |
| Warranty | After launch: launch date and warranty end date |
| Overall progress bar | Completed client-visible tasks divided by all client-visible tasks |

### 7\. Approvals

Path: `/portal/approvals`

| Option | What happens |
| :---- | :---- |
| Pending list | Every design, milestone, deliverable and change request waiting on the client |
| Preview | Opens the file, milestone summary or change request (scope, price, timeline impact) |
| Approve | Marks it approved, notifies the PM. Can unlock the milestone invoice. For change requests, adds the tasks and creates the change invoice |
| Request changes or Reject | Requires a comment. For designs and milestones, creates a revision task for the PM. For change requests, rejects it and keeps the current plan |
| History | Past approvals with date and who approved |

### 8\. Tickets

Paths: `/portal/tickets` · `/portal/tickets/new` · `/portal/tickets/[id]`

| Option | What happens |
| :---- | :---- |
| New ticket | Subject, project, description, files. Priority suggested by AI (off in HIPAA mode), client can raise it |
| Ticket list | Open and closed tickets with status, last reply time and Under warranty badge where it applies |
| Ticket detail | Conversation with support. Shows expected response time from the care plan SLA. Internal notes are never shown |
| Reply | Adds a message and reopens the SLA clock for the team |
| Mark resolved | Client confirms the fix and the ticket closes |
| Reopen | Available for 7 days after closing |
| Rate | 1 to 5 stars after closing |

### 9\. Invoices and payments

Paths: `/portal/invoices` · `/portal/invoices/[id]`

| Option | What happens |
| :---- | :---- |
| Invoice list | Number, project, amount, due date, status: Unpaid, Paid, Overdue, Partly paid, Refunded |
| Pay now | Card or bank transfer through Stripe. Partial payment allowed if Admin enabled it |
| Installment plan | For projects on a payment plan: every installment with due date and status |
| Download invoice or receipt | PDF |
| Saved payment methods | Add, remove, set default. Used for retainers, installments and auto-pay |
| Auto-pay | Client owner turns on automatic charging for recurring invoices and installments |
| Retainer panel | Monthly hours bought, used and left, with a list of work logged against them. Shows care plan name and its response time |

### 10\. Files and contracts

Path: `/portal/files` · Tabs: `?tab=files` (default), `contracts`

| Option | What happens |
| :---- | :---- |
| Contracts | Signed NDA, contracts, Blueprints and change requests, read only |
| Sign pending | Contracts waiting for the client's e-signature |
| Shared files | Client-visible files from all projects, by folder |
| Upload | Client uploads go to the project's Client uploads folder and notify the PM. HIPAA mode clients see a patient data warning first |

### 11\. Messages

Paths: `/portal/messages` · `/portal/messages/[threadId]`

| Option | What happens |
| :---- | :---- |
| Thread list | One thread per project and per ticket |
| Send message | Text and files. PM is notified, response target is one business day |
| Search | Search across all threads |

### 12\. Reports

Paths: `/portal/reports` · `/portal/reports/[id]`

| Option | What happens |
| :---- | :---- |
| Report list | Monthly project reports, SEO and marketing reports published by the team |
| View and download | Opens the report, PDF download |

### 13\. Account and team

Path: `/portal/account` · Tabs: `?tab=profile` (default), `team`, `notifications`, `security`, `data`

| Option | What happens |
| :---- | :---- |
| Company profile | Name, address, logo, billing email, time zone |
| Team members | Client owner invites members, chooses which projects each sees, gives approve or pay rights, can remove them |
| Notifications | Choose email, in-app or both for each type |
| Security | Change password, turn on 2FA, see active sessions and log them out |
| Export data | Client owner downloads all company data (projects, files list, invoices, messages) as a ZIP |
| Request deletion | Client owner requests account deletion. Admin is notified and handles it per the privacy policy |

### 14\. Request new work

Paths: `/portal/requests` · `/portal/requests/[id]`

For retainer and care plan clients.

| Option | What happens |
| :---- | :---- |
| New request | Title, description, project, priority, files |
| Hours left | Shows remaining monthly hours before submitting |
| Request list | Status: Submitted, Accepted, Converted to project, Declined |
| Detail | PM's reply, estimate in hours, and linked tasks once accepted |

### 15\. Calls

Path: `/portal/calls`

| Option | What happens |
| :---- | :---- |
| Book a call | Booking calendar limited to live hours (8 am to 12 pm US Eastern, Mon to Fri), shown in the client's time zone |
| Upcoming calls | Date, time, project, join link |
| Past calls | Client-visible notes and action items |
| Reschedule or cancel | Up to 4 hours before the call |

## Admin panel pages

The admin panel has 17 pages. The sidebar shows only the pages a role can open. In the tables, **Who** uses these short names: Admin, PM, Dev (developer), Mkt (marketing), Sup (support). "Assigned" means only clients or projects that person is on.

### 1\. Dashboard

Path: `/admin`

Each role gets its own widgets on one page.

| Widget or option | What happens | Who |
| :---- | :---- | :---- |
| Revenue this month, unpaid total | Live totals from invoices | Admin |
| Active projects, health | Count plus On track, At risk, Late per project (rules in Settings) | Admin, PM |
| Waiting on clients | Blueprints, approvals, change requests and contracts the client hasn't answered, with days waiting | Admin, PM |
| Requirements inbox count | New submissions to review | Admin, PM |
| Blueprints due | Submissions with Blueprint due date in the next 2 business days, overdue ones in red | Admin, PM |
| New leads | Website signups in the last 7 days with source | Admin, PM |
| Upcoming calls | Today's and tomorrow's client calls | Admin, PM |
| My tasks this week | Tasks assigned to me, grouped by project | Dev, Mkt, PM |
| Open tickets and SLA | Tickets by priority, ones close to breach in red | Sup, Admin |
| Warranty ending | Projects whose warranty ends in the next 7 days, with care plan status | Admin, PM |
| Team workload | Hours planned vs capacity per person this week | Admin, PM |
| AI daily briefing | Plain-English summary of what needs attention today. Excludes HIPAA mode clients | Everyone, scoped to their work |
| Date range switch | This week, this month, this quarter | Everyone |

### 2\. Clients

Paths: `/admin/clients` · `/admin/clients/new` · `/admin/clients/[id]` · `/admin/clients/[id]/edit` · `/admin/clients/deletion-requests`
Profile tabs: `?tab=overview` (default), `projects`, `requirements`, `invoices`, `tickets`, `files`, `messages`, `calls`, `activity`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Client list | Company, status (Lead, Onboarding, Active, Paused, Former), lead source, active projects, care plan, balance due | Admin, PM, Sup (view) |
| Search and filter | By name, status, PM, industry, lead source, care plan, retainer yes or no, HIPAA mode | Same |
| Add client | Company name, contact, email, service type, time zone. Sends portal invite if ticked | Admin, PM |
| Client profile: Overview | Company info, contacts, assigned PM, time zone, website form answers, notes, tags | Admin, PM, assigned staff (view) |
| Client profile: tabs | Projects, Requirements, Invoices, Tickets, Files, Messages, Calls, Activity | Each tab follows that page's access |
| Edit client | Change details, assigned PM, status, time zone | Admin, PM |
| HIPAA mode switch | Turns off AI features for this client and adds upload warnings | Admin |
| Login as client (preview) | Opens the portal exactly as the client sees it, read only. Path: `/admin/preview/[clientId]` | Admin |
| Archive client | Moves to Former, revokes portal access, keeps data | Admin |
| Deletion requests | Handles client deletion requests, with export before purge | Admin |

### 3\. Onboarding

Paths: `/admin/onboarding` · `/admin/onboarding/templates`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Pipeline board | Columns: Invited, Profile done, NDA signed (optional), Requirements submitted, Blueprint approved, Contract signed, Deposit paid, Ready | Admin, PM |
| Drag card | Moves only if the step is really done, otherwise shows what is missing | Admin, PM |
| Checklist templates | One template per service type, with steps and due days | Admin |
| Resend invite | New link, old one stops working | Admin, PM |
| Send reminder | Emails the client the missing steps | Admin, PM |
| Default PM rule | Auto-assigns a PM to website signups by service type or round robin | Admin |

### 4\. Requirements inbox

Paths: `/admin/requirements` · `/admin/requirements/[id]`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Submission list | Client, project name, submitted date, Blueprint due date, status: Submitted, In review, Changes needed, Converted, Declined | Admin, PM |
| Sort by due | Oldest Blueprint due date first. Overdue in red | Admin, PM |
| Open submission | Shows every section and point, attachments, budget, deadline and NDA status | Admin, PM |
| Comment on a point | Client sees the comment next to that point and can reply | Admin, PM |
| Send back to client | Status becomes Changes needed, client can edit again | Admin, PM |
| Assign PM | Chooses who owns this request | Admin |
| Create Blueprint | Opens Blueprint editor with every point copied in | Admin, PM |
| Decline | Requires a reason, client is notified | Admin |

### 5\. Blueprints

Paths: `/admin/blueprints` · `/admin/blueprints/new?requirement=[id]` · `/admin/blueprints/[id]` · `/admin/blueprints/[id]/versions/[version]`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Blueprint list | All Blueprints with client, status, valid-until date, version | Admin, PM |
| Milestones | Add, rename, reorder, set target date | Admin, PM |
| Tasks under a milestone | Each requirement point becomes a task. Add estimate hours, role needed, client-visible switch | Admin, PM |
| Phases | Split must-haves into Phase 1, nice-to-haves into Phase 2 | Admin, PM |
| Price and payment schedule | Fixed price with one of: deposit % plus milestone payments (default 40/30/30), installment plan (number of months, amount, start date), or monthly retainer | Admin, PM (Admin approves discounts and installment plans) |
| Valid until | Date after which the Blueprint expires. Default 30 days | Admin, PM |
| Terms | Pick a terms template, edit if needed | Admin |
| Internal margin view | Estimated hours x cost rate vs price | Admin |
| Send to client | Locks requirements, notifies client. Status: Waiting for approval | Admin, PM |
| New version | After Request changes or Expired, creates v2 and keeps v1 for history | Admin, PM |

### 6\. Projects

Paths: `/admin/projects` · `/admin/projects/new`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Views | List, Kanban by status, timeline | Admin, PM, Dev and Mkt (assigned) |
| Filters | Client, status, PM, health, due this month, in warranty | Same |
| New project | Only from an approved Blueprint, or from a template for internal work | Admin, PM |
| Bulk actions | Change PM, put on hold, archive | Admin |

### 7\. Project detail

Paths: `/admin/projects/[id]` · `/admin/projects/[id]/changes/[changeId]` · `/admin/projects/[id]/handover`
Tabs: `?tab=overview` (default), `board`, `milestones`, `tasks`, `files`, `messages`, `calls`, `time`, `changes`, `access`, `settings`

| Tab or option | What happens | Who |
| :---- | :---- | :---- |
| Overview | Status, health, dates, launch date, warranty end, progress %, team, budget used vs price | Admin, PM, assigned (no budget for Dev, Mkt) |
| Weekly board | Same boxes the client sees, plus staff names and internal tasks | Admin, PM, assigned |
| Weekly demo | Add video link and staging link to a week box. Sends Friday email | Admin, PM |
| Plan this week | Drag tasks into the current or next week | Admin, PM |
| Milestones | Status, due date, Request approval button | Admin, PM |
| Tasks | All tasks of the project, filter by person, week, status | Admin, PM, assigned |
| Files | Folders, versions, client-visible switch per file | Admin, PM, assigned |
| Messages | Client thread and a separate internal thread | Client thread: Admin, PM, assigned. Internal: staff only |
| Calls | Booked calls, notes, action items, client-visible switch on notes | Admin, PM |
| Time and budget | Hours logged per person and per task vs estimate | Admin, PM |
| Change requests | New scope after approval, with its own price and timeline impact, sent to client to approve | Admin, PM |
| Access and ownership | Accounts list (hosting, domain, repo, database, services), owner, handover status, notes. No passwords stored here, only how they were handed over | Admin, PM. Dev view assigned |
| Handover checklist | All accounts in client's name, credentials handed over, final files shared, final invoice paid, milestones approved | Admin, PM |
| Project settings | Status, team members, retainer or care plan link, launch date, close project | Admin, PM |
| Close project | Requires the handover checklist complete, all milestones done and final invoice paid, then archives | Admin, PM |

### 8\. Tasks

Paths: `/admin/tasks` · `/admin/tasks/mine` · `/admin/tasks/[id]`

| Option | What happens | Who |
| :---- | :---- | :---- |
| My tasks | Tasks assigned to me, this week first | Everyone on staff |
| Kanban board | To do, In progress, In review, Done | Admin, PM, assigned |
| Task detail | Title, description, project, milestone, week, assignee, due date, priority, estimate | Admin, PM edit. Assignee edits status and comments |
| Client-visible switch | On \= shows on the client's weekly board once started | Admin, PM |
| Start timer or log time | Adds hours to the task and the timesheet | Assignee |
| Move to In progress or Done | Updates the client's weekly board at once | Assignee, PM |
| Checklist and comments | Internal only, never shown to the client | Staff on the project |
| Linked ticket or work request | Shows the ticket or Request new work item this task came from | Dev, Sup, PM |

### 9\. Tickets

Paths: `/admin/tickets` · `/admin/tickets/[id]` · `/admin/tickets/canned-replies` · `/admin/tickets/requests` · `/admin/tickets/requests/[id]`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Queue | Unassigned, Mine, All, with SLA timer, priority, care plan and Under warranty badge | Sup, Admin. PM sees own clients |
| Claim or assign | Sets the agent | Sup claims, Admin assigns |
| Reply to client | Sends to the client's portal and email | Sup, Admin, PM |
| Internal note | Visible to staff only | All staff on the ticket |
| Canned replies | Insert saved answers | Sup, Admin |
| Escalate to developer | Creates a linked task in the project, client sees Waiting on development | Sup, PM |
| Change priority or category | Resets the SLA timer | Sup, Admin |
| Bill or warranty | Mark time as warranty (free) or against retainer hours | Sup, PM, Admin |
| Resolve | Asks the client to confirm, auto-closes in 3 days | Sup, Admin |
| Merge duplicates | Combines two tickets into one | Sup, Admin |
| Work requests | Queue of Request new work items: accept as tasks, convert to requirements, or decline | PM, Admin |

### 10\. Invoices and payments

Paths: `/admin/invoices` · `/admin/invoices/new` · `/admin/invoices/[id]` · `/admin/invoices/installments` · `/admin/invoices/retainers`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Invoice list | All invoices with status and due date | Admin. PM sees own projects. Sup sees status only |
| New invoice | One-time, from milestone, from Blueprint schedule, or from change request | Admin |
| Installment plans | View every plan, upcoming installments, missed payments | Admin |
| Retainers and care plans | Monthly plans (Essential, Growth, Partner or custom), hours bucket, auto-invoice on the 1st | Admin |
| Record manual payment | For checks or wire transfers | Admin |
| Refund | Full or partial, through Stripe | Admin |
| Send reminder now | Extra reminder outside the automatic ones | Admin |
| Put project on hold for non-payment | Pauses tasks, notifies PM and client | Admin |
| Accounting sync | Push invoices and payments to QuickBooks or Xero | Admin |

### 11\. Contracts

Paths: `/admin/contracts` · `/admin/contracts/[id]` · `/admin/contracts/templates` · `/admin/contracts/nda`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Templates | Service agreement, NDA, change request, care plan agreement | Admin |
| NDA requests | NDAs requested by clients before requirements, with status | Admin, PM |
| Generate from Blueprint | Fills client, scope, price, payment schedule and terms | Admin, PM |
| Send for e-sign | Client signs in the portal, staff countersigns | Admin |
| Renewal dates | Alert 30 days before a care plan or retainer ends | Admin |

### 12\. Files

Path: `/admin/files`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Folders by client and project | Auto-created with each project | Admin, PM, assigned |
| Upload and new version | Keeps all versions | Staff on the project |
| Client-visible switch | Shows the file in the portal | Admin, PM |
| Share link | Expiring link for outside people | Admin, PM |

### 13\. Messages

Paths: `/admin/messages` · `/admin/messages/[threadId]`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Client threads | One per project and ticket | Staff on that project or ticket |
| Internal threads | Staff-only discussion per project | Staff on the project |
| Mentions | @name notifies a teammate | Everyone on staff |

### 14\. Calls

Paths: `/admin/calls` · `/admin/calls/[id]`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Call list | Upcoming and past calls with client, project, date, PM | Admin, PM (own clients) |
| Call detail | Join link, agenda from the client's booking answers | Admin, PM |
| Notes and action items | Add notes, mark each as internal or client-visible, turn action items into tasks | Admin, PM |
| Reschedule or cancel | Notifies the client | Admin, PM |

### 15\. Marketing

Paths: `/admin/marketing` · `/admin/marketing/campaigns` · `/admin/marketing/campaigns/[id]` · `/admin/marketing/calendar` · `/admin/marketing/reports` · `/admin/marketing/reports/[id]` · `/admin/marketing/leads`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Campaigns | Per client: goal, channels, dates, status | Admin, Mkt. PM view |
| Content calendar | Planned posts and articles by date | Admin, Mkt |
| Reports builder | SEO and social reports, publish to the client's Reports page | Admin, Mkt |
| Website leads | Leads from checklist downloads and newsletter, with source and date. Convert to client | Admin, Mkt, PM |

### 16\. Team and timesheets

Paths: `/admin/team` · `/admin/team/[id]` · `/admin/team/timesheets` · `/admin/team/timesheets/mine`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Staff list | Name, role, skills, hourly cost, status, 2FA on or off | Admin. PM sees names and skills only |
| Invite staff | Email invite with a role. 2FA setup required on first login | Admin |
| Change role or deactivate | Takes effect on next page load | Admin |
| Capacity | Hours available per week per person | Admin, PM |
| Timesheets | Weekly hours per person, approve or send back | Admin, PM approves |
| My timesheet | Own hours, submit each Friday | Dev, Mkt, Sup, PM |

### 17\. Settings

Paths: `/admin/settings` (redirects to company) · `/admin/settings/company` · `/admin/settings/roles` · `/admin/settings/templates` · `/admin/settings/emails` · `/admin/settings/automations` · `/admin/settings/integrations` · `/admin/settings/sla` · `/admin/settings/care-plans` · `/admin/settings/blueprints` · `/admin/settings/health` · `/admin/settings/live-hours` · `/admin/settings/security` · `/admin/settings/audit` · `/admin/settings/archive`

| Option | What happens | Who |
| :---- | :---- | :---- |
| Company and branding | Logo, colors, portal domain, email sender name | Admin |
| Roles and permissions | Edit what each role can see and do, page by page | Admin |
| Service types and templates | Onboarding checklists, Blueprint templates, task templates | Admin |
| Email and notification templates | Text of every automatic email | Admin |
| Automations | Turn each automation on or off, change timings | Admin |
| Integrations | Stripe, QuickBooks or Xero, Google Workspace, Google Calendar or Calendly, Slack, website forms | Admin |
| SLA rules | Response and resolve times per care plan and priority. Example: Essential next business day, Growth same business day, Partner same business day plus Slack | Admin |
| Care plans | Plan names, monthly price, included hours, response times | Admin |
| Blueprint defaults | Due days (default 5 business days), valid-until days (default 30), default payment split | Admin |
| Project health rules | Thresholds for On track, At risk and Late | Admin |
| Live hours | Hours shown in the booking calendar (default 8 am to 12 pm US Eastern, Mon to Fri) | Admin |
| Security | Staff 2FA required (on by default), session timeout | Admin |
| Audit log | Every action with who, what, when, searchable | Admin |
| Archive and restore | Restore soft-deleted records within 30 days | Admin |

## Roles and permissions

Only Admin can delete, change billing or edit settings. Everyone else works inside the clients and projects they are assigned to.

Key: **Full** \= create, edit, delete. **Edit** \= create and change, no delete. **View** \= read only. **Assigned** \= only work given to them. **Own** \= only their own company's or their own records. **No** \= page hidden.

| Page | Admin | PM | Developer | Marketing | Support | Client |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Dashboard | Full | Team widgets | Own work | Own work | Ticket widgets | Portal home |
| Clients | Full | Edit | No | View assigned | View | Own profile |
| Onboarding | Full | Edit | No | No | No | Own checklist |
| Requirements | Full | Edit | No | No | No | Own: create, submit, reply |
| Blueprints | Full | Edit, send | No | No | No | Own: approve, request changes |
| Projects | Full | Edit own projects | View assigned | View assigned | View | Own: view |
| Weekly board and demos | Full | Edit, plan weeks, add demos | Update own tasks | Update own tasks | View | Own: view, no names |
| Tasks | Full | Full in own projects | Edit status, comment, log time | Edit status, comment, log time | Create from ticket | No |
| Approvals and change requests | Full | Request, create change requests | No | Request | No | Own: approve, reject |
| Tickets | Full | View own clients, assign | Assigned | Assigned | Full | Own: create, reply, reopen |
| Request new work | Full | Accept, convert, decline | No | No | View | Own: create |
| Calls | Full | Own clients | No | No | No | Own: book, view |
| Access and ownership | Full | Edit own projects | View assigned | No | No | Own: view |
| Invoices and payments | Full | View own projects, no totals | No | No | View status | Own: view, pay |
| Contracts | Full | Generate | No | No | No | Own: view, sign, request NDA |
| Files | Full | Edit | Assigned | Assigned | View | Own: view, upload |
| Messages | All threads | Own projects | Assigned threads | Assigned threads | Ticket threads | Own threads |
| Marketing | Full | View | No | Full | No | Own reports |
| Team and timesheets | Full | View, approve time | Own time | Own time | Own time | No |
| Settings and audit log | Full | No | No | No | No | Own account, export, deletion request |

Option-level rules the matrix doesn't show:

- **Delete** anything: Admin only. Everyone else can archive their own drafts.
- **Money**: only Admin sees company revenue, staff cost rates and margins. PMs see price and hours on their own projects.
- **Discounts** over the Blueprint template price and **installment plans** need Admin approval before sending.
- **Client-visible switch** on tasks, files, demos and call notes: Admin and PM only, so developers can't expose internal work by accident.
- **Staff names**: never shown in the portal, except the PM as the contact in Messages.
- **Client owner vs member**: owner can pay, approve Blueprints and change requests, sign contracts, request NDA, export data and invite people. Members can view shared projects, comment, open tickets, book calls and upload files. The owner can give a member approve or pay rights.
- **Login as client**: Admin only, read only, and logged in the audit log.
- **Role changes** take effect on the user's next page load and are logged.
- **HIPAA mode**: only Admin can turn it on or off, and every change is logged.
- **Credentials**: the system never stores client passwords. Access and ownership records only say who owns each account and how access was handed over.

## Statuses

Each record moves through a fixed set of statuses, and the client sometimes sees a simpler label than staff do.

| Record | Statuses, in order | Who moves it | What the client sees |
| :---- | :---- | :---- | :---- |
| Client | Lead, Onboarding, Active, Paused, Former | System (website signup), Admin, PM | Nothing |
| NDA | Requested, Sent, Signed | Client requests, Admin sends | Same labels |
| Requirement | Draft, Submitted, In review, Changes needed, Converted, Declined | Client submits, PM reviews | Same labels |
| Blueprint | Draft, Waiting for approval, Changes requested, Approved, Expired, Superseded | PM sends, client approves, system expires | Waiting for approval, Changes requested, Approved, Expired |
| Project | Planning, In progress, Client review, Live (in warranty), On hold, Completed, Archived | PM, Admin | Same, except Archived shows as Completed |
| Milestone | Not started, In progress, Waiting for approval, Approved | PM, client approves | Same labels |
| Task | To do, In progress, In review, Done | Assignee, PM | Hidden while To do. In progress (for In progress and In review), Completed with green check, Carried over (only for started tasks) |
| Change request | Draft, Sent, Approved, Rejected | PM, client | Same labels |
| Work request | Submitted, Accepted, Converted to project, Declined | Client, PM | Same labels |
| Ticket | New, Open, Waiting on client, Waiting on development, Resolved, Closed | Support, Dev, client | Same labels |
| Call | Booked, Rescheduled, Completed, Cancelled | Client, PM | Same labels |
| Invoice | Draft, Sent, Partly paid, Paid, Overdue, Void, Refunded | Admin, Stripe | Unpaid, Partly paid, Paid, Overdue, Refunded |

To do tasks never show on the weekly board until they start, so clients see progress, not a long backlog.

Project health rules (defaults, editable in Settings):

- **On track**: no milestone past due, fewer than 2 client-visible tasks carried over this week.
- **At risk**: 2 or more tasks carried over this week, or a milestone due within 5 days with less than half its tasks done, or a client approval waiting more than 5 days.
- **Late**: any milestone past its due date and not approved.

The client sees On track for On track, and Needs attention for At risk or Late, with the PM's note.

## Notifications and automations

Every automation can be turned off or retimed in Settings, and every notification goes in-app plus email unless the person changes it. All times use the client's time zone.

| Trigger | What happens | Who is notified |
| :---- | :---- | :---- |
| Website Start a Project form submitted | Client account created as Lead, portal login emailed, PM assigned by rule | Client owner, Admin, PM |
| Website checklist or newsletter form | Lead saved in Marketing with source | Admin, Mkt |
| Client account created by staff | Portal invite email with 7-day link | Client owner |
| NDA requested | NDA generated and sent for e-sign | Client owner, Admin |
| Onboarding step missing for 3 days | Reminder listing the missing steps | Client owner, PM |
| Requirements submitted | Item added to Requirements inbox, Blueprint due date set | Admin, PM |
| PM comments on a requirement | Client sees the comment beside the point | Client owner |
| Client replies to a comment | Reply shows beside the point | PM |
| Blueprint due in 1 business day | Warning | PM, Admin |
| Blueprint overdue | Alert | PM, Admin |
| Blueprint sent | Approval request with link | Client owner |
| Blueprint waiting 3 days | Gentle reminder | Client owner, PM |
| Blueprint 3 days from expiry | Reminder with valid-until date | Client owner, PM |
| Blueprint expired | Status set to Expired | Client owner, PM |
| Blueprint approved | Contract sent for e-sign, deposit invoice created | Client owner, Admin, PM |
| Contract signed and deposit paid | Project created from Blueprint, status Planning | PM, Admin |
| Task moved to In progress or Done | Client's weekly board updates at once, no email | Nobody, board only |
| Weekly demo added | Friday email with video and staging link | Client owner and members on that project |
| End of week (Sunday night) | Started but unfinished client-visible tasks move to next week as Carried over. Unstarted tasks move silently. Weekly summary email of completed tasks | Client owner and members on that project |
| Milestone ready | Approval request | Client owner |
| Change request sent | Approval request with price and timeline impact | Client owner |
| Change request approved | Tasks added, invoice created if priced | PM, Admin |
| Task overdue | Alert | Assignee, PM |
| Project health changes to At risk or Late | Alert | PM, Admin |
| New ticket | AI sets category and priority (skipped in HIPAA mode), SLA timer starts from care plan and priority | Support queue |
| SLA close to breach (80% of time used) | Warning | Assigned agent, PM |
| Ticket escalated | Linked task created | Assigned developer, PM |
| Request new work submitted | Added to Work requests queue | PM |
| Call booked | Calendar invite with join link | Client, PM |
| Call in 1 hour | Reminder | Client, PM |
| Invoice sent | Email with pay link | Client owner |
| Installment due in 3 days | Reminder (or auto-charge notice if auto-pay is on) | Client owner |
| Invoice overdue | Reminders at 3, 7 and 14 days | Client owner |
| Invoice 14 days overdue | Alert with On hold option | Admin |
| Payment received | Receipt, accounting sync | Client owner, Admin |
| Project launched | Warranty end date set to launch plus 30 days | Client owner, PM |
| Warranty ends in 7 days | Care plan offer | Client owner, PM |
| Retainer cycle (1st of month) | Invoice created, hours bucket resets | Client owner, Admin |
| Retainer hours 80% used | Warning with option to buy more | Client owner, PM |
| Contract or care plan ends in 30 days | Renewal alert | Admin, PM |
| Close project pressed with checklist incomplete | Blocked, shows missing handover items | PM |
| Client sends a message | New message alert | PM, plus staff on that thread |
| Data export requested | ZIP generated and emailed as a download link | Client owner |
| Deletion requested | Request added to Clients, Deletion requests | Admin |
| Staff account without 2FA | Blocked from admin panel until 2FA is set up | That staff member |