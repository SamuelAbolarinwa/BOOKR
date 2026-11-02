# BOOKR — Architecture Decisions & Execution Plan

*Freezing all 6 core decisions before building the web application.*

---

## 1. The 6 Core Decisions (Resolved & Locked In)

| # | Decision Area | Locked Resolution |
|---|---|---|
| **1** | **Local Database** | **Dexie.js (IndexedDB)** — 100% async, zero size limit, works identically in Web & Capacitor Android WebViews. |
| **2** | **Onboarding & Auth** | **Hybrid Choice Screen**: Onboarding screen greets the user and lets them choose: **"Use Locally (Offline & Private)"** OR **"Sign in & Cloud Sync"**. |
| **3** | **Capital Guard Math** | **Deferred to Phase 2**: Focus first on clean recording and separation between Restock vs. Personal Chop-Money. |
| **4** | **Debtors ("Owing / Gbese")** | **Basic Paid / Owing Flag First**: Mark as Paid vs. Owing (with debtor name + WhatsApp nudge). Advanced partial repayment rules deferred to later phase. |
| **5** | **Sale Entry Flexibility** | **Unlinked Quick Sales Allowed**: A student can record `₦200 Garri` without needing a pre-existing inventory SKU. |
| **6** | **Top Summary Header** | **OFF by default (Minimalist)**: Screen opens directly into the 3-tab selector and transaction list with zero visual clutter. |

---

## 2. Visual & Design Standards (Locked In)

- **Button Standard:** Exact `ib1` tactile squircle component (`components/ui/button.tsx`) with `rounded-[12px] md:rounded-[13px]`, 0.5px inner bevel highlight (`inset 0 1px 0.5px`), and `active:translate-y-[0.5px]` micro-press.
- **Surface Differentiation:** Warm hardware neutrals (`#FAF9F6` background, `#FFFFFF` cards, `#E5E4DE` dividers).
- **Hard Constraints:**
  - **Zero 1px harsh borders.**
  - **Zero gradients.**
  - **Zero button glows.**
  - **Zero monospace / cryptic developer fonts.**

---

## 3. Web Application Build Roadmap

### Phase 1: Project Scaffolding
- Set up `package.json` with React 19, TypeScript, Vite, Tailwind CSS, Dexie.js, Lucide React, `clsx`, `tailwind-merge`.
- Configure `vite.config.ts`, `tsconfig.json`, `index.html`.
- Set up `src/lib/utils.ts` and `src/components/ui/button.tsx` (the exact tactile squircle hardware button + ButtonGroup).

### Phase 2: Database Layer (Dexie.js)
- `src/lib/db.ts`: IndexedDB database with tables:
  - `sales`: `id`, `amount`, `itemName`, `paymentStatus` ('paid' | 'owing'), `debtorName`, `debtorPhone`, `timestamp`, `paymentMethod`.
  - `expenses`: `id`, `amount`, `description`, `expenseType` ('restock' | 'chop_money'), `timestamp`.
  - `inventory`: `id`, `name`, `unit` ('mudu' | 'cup' | 'carton' | 'piece'), `quantity`, `costPrice`, `sellingPrice`.
  - `settings`: `inventoryEnabled`, `summaryEnabled`, `currency`, `onboarded`.

### Phase 3: Core Views & Navigation
- **Header:** Clean top bar with brand mark, 3-tab `ButtonGroup` (`📈 Sales`, `📉 Expenses`, `📦 Inventory`), and Settings icon.
- **Onboarding Modal:** First-run dialog to choose "Use Locally" vs "Cloud Account".
- **Sales View:** Chronological feed of sales with Paid vs. Owing badges, debtor name, and 1-tap WhatsApp nudge.
- **Expenses View:** Chronological feed with Restock vs. Personal Chop-Money tags.
- **Inventory View:** Stock list with unit counters and Add/Edit item forms.
- **Settings View:** Toggles for Inventory tab (ON/OFF) and Top Summary (ON/OFF).

### Phase 4: Doorway 2-Tap Logging Modals
- **Record Sale Modal:** Quick amount pills (`₦200`, `₦500`, `₦1,000`, `₦2,000`), preset quick chips (`Garri`, `Indomie`, `Eggs`, `Water`), Paid / Owing toggle.
- **Record Expense Modal:** Quick entry with `Restock Capital` vs. `Chop-Money` tag.
