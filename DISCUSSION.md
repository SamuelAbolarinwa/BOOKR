# MyBookr — Product Design & Architecture Discussion

*This file tracks decisions, design thoughts, and open questions as we brainstorm the app concept before writing code.*

---

## Current Status
- **Phase:** Ideation, Requirements Definition & User Journey Design
- **Code Status:** No code written yet (strictly planning).
- **Core Documents:** [PROJECT_BLUEPRINT.md](file:///d:/dev/MyBookr/PROJECT_BLUEPRINT.md) | [RESEARCH_BENCHMARKS.md](file:///d:/dev/MyBookr/RESEARCH_BENCHMARKS.md)

---

## Round 2 Decisions & Architectural Invariants (Adopted from `Not-Venda`)

Following our review of `SamuelAbolarinwa/Not-Venda`:
1. **Integer Money Representation:** Currency is represented in its smallest integer unit (e.g. kobo or cents) via `BIGINT` to prevent floating-point rounding errors.
2. **Offline-First Outbox Pattern:** Invoices and expenses are written to a durable local queue (SQLite / AsyncStorage / IndexedDB) first, so the student can work completely offline in campus classrooms or basements.
3. **Immutable Append-Only Ledger:** Financial entries are never destructively overwritten or deleted. Reversals or personal/business reclassifications create transparent audit trails.
4. **WhatsApp & P2P Sharing Priority:** In emerging markets and campus settings, WhatsApp is the default communication rail. Invoices must be shareable to WhatsApp with 1 tap, including clickable payment deep links (Bank Transfer, Paystack/Flutterwave, Venmo, CashApp).

---

## Round 1 Discussion Topics

### Topic 1: Logging Expenses & Incomes
* **Question:** How do students actually enter their transactions without feeling like they are doing tedious homework?
* **Options to consider:**
  - **A (Recommended for MVP):** Ultra-quick 3-second manual entry with preset tags ("Software", "Inventory", "Client Lunch", "Equipment", "Transport") + camera receipt attachment. Zero API fee, 100% private, works offline.
  - **B:** Bank account sync (Plaid / Teller) — Higher setup friction, requires monthly API costs, might discourage students uncomfortable linking personal accounts.
  - **C:** Hybrid — Start with manual + OCR receipt scanning, add bank sync in v2.

### Topic 2: Multi-Hustle Capability
* **Question:** Can a student founder track more than one side hustle?
* **Context:** Many students don't have just one business; they might do freelance graphic design on weekdays and sell thrifted vintage clothes on weekends.
* **Proposal:** Provide a toggleable "Hustle Space" (e.g. "Maya's Photography" vs. "Campus Merch"), but with an aggregated "Total Net Worth & Cash Flow" view.

### Topic 3: Payment Links on Invoices
* **Question:** How should the payment flow work on invoices?
* **Proposal:** Since student clients frequently pay through peer-to-peer apps, the invoice view should have one-tap interactive buttons:
  - 🟣 **Pay via Venmo** (deep-links directly into Venmo app with amount and note pre-filled).
  - 🟢 **Pay via Cash App** (deep-links into Cash App with `$cashtag`).
  - 🔵 **Pay via Zelle** (copies recipient phone/email with 1 tap).
  - 💳 **Credit / Debit Card** (optional Stripe payment link if the student has Stripe setup).

### Topic 4: The "Pitch Deck & Grant Exporter" Design
* **Question:** What specific information do campus pitch judges and incubator directors want to see?
* **Proposal:**
  1. Monthly Recurring Revenue (MRR) or Total Gross Sales.
  2. Cost of Goods Sold (COGS) & Gross Margin %.
  3. Net Profit / Burn Rate.
  4. Number of paying customers & Average transaction size.
  5. Runway (how long $1,000–$5,000 grant money will last).

---

## Next Steps
- Gather feedback on Topics 1–4.
- Draft the User Journey & Screen Sitemap (wireframe flow).
- Define technical architecture for hybrid Play Store release (e.g. React Native / Expo vs. Capacitor).
