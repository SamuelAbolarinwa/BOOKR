# MyBookr — Product Blueprint & Discussion Notes
*A Finance & Bookkeeping App Tailored for Student Entrepreneurs*

---

## 1. Executive Summary & Vision

**What is MyBookr?**
MyBookr is a hybrid, mobile-first financial companion built specifically for university and college student founders, freelancers, and side-hustlers. 

Traditional accounting tools (QuickBooks, Xero, FreshBooks) are built for registered businesses with dedicated corporate bank accounts, complex charts of accounts, and hefty monthly subscription fees ($30–$70/mo). Most student entrepreneurs:
- Run their hustle out of a single personal checking account.
- Rely on peer-to-peer payments (Venmo, Cash App, Zelle, Stripe, Apple Pay, cash).
- Are not formal corporations yet (no LLC, no EIN, no separate corporate card).
- Struggle with knowing whether they are genuinely profitable or accidentally spending their tuition/grocery money on business expenses.
- Need clean numbers to pitch for campus incubator micro-grants and university competitions.

MyBookr bridges this gap with zero accounting jargon, friction-free tracking, fast mobile invoicing, and instant pitch-ready exports.

---

## 2. Target User Personas

| Persona | Example Hustle | Primary Pain Point | What MyBookr Solves |
|---|---|---|---|
| **The Campus Freelancer** | Photographer, videographer, tutor, resume reviewer, graphic designer | Getting paid late, sending messy text messages instead of professional invoices | Instant mobile invoice with QR codes for Venmo/CashApp/Zelle/Stripe |
| **The Physical Hustler** | Vintage clothing reseller, campus baker, custom merch printer | Mixing inventory costs with personal grocery spending | "Tinder-swipe" style expense sorter (Personal vs. Hustle) |
| **The Tech / SaaS Founder** | Mobile app developer, AI tool builder, campus marketplace | Tracking recurring subscriptions (AWS, OpenAI API, domains) and calculating runway | Simple Runway & Burn Rate tracker |
| **The Grant & Pitch Contender** | Student applying to university venture funds, incubator demo days | Judges asking: "What are your unit economics and monthly burn?" | 1-Click Pitch Deck Financial Summary Export |

---

## 3. Core MVP Feature Scope

### Feature 1: Personal vs. Hustle Cash Flow Separation
* **The Problem:** Students co-mingle funds. A $1,500 bank balance looks healthy until they realize $800 is committed to inventory/clients and $600 is rent.
* **The Experience:**
  - **"Safe-to-Spend" Dial:** At the top of the dashboard, shows two clear numbers:
    1. *Personal Safe-to-Spend* (groceries, leisure, rent).
    2. *Hustle Working Capital* (retained earnings for the business).
  - **Quick-Tag Logging:** Fast 3-second manual transaction logger or bank sync (optional future phase), with a swipe interface:
    - Swipe Left = Personal.
    - Swipe Right = Hustle.
    - Tap Split = E.g., a $60 dinner that was 50% client meeting, 50% personal food.

### Feature 2: 60-Second Mobile Invoicing & Payment Links
* **The Problem:** Students lose sales or get paid late because invoicing feels like desktop corporate work.
* **The Experience:**
  - Create an invoice in under 60 seconds directly from their phone.
  - Multi-rail payment options:
    - Direct payment deep links and QR codes: **Venmo (@handle)**, **Cash App ($cashtag)**, **Zelle (phone/email)**, and optional **Stripe Payment Link**.
  - Professional PDF generator with custom branding/logo.
  - Auto-generated shareable web link (client can open in mobile browser and click to pay).
  - Status tracking: *Draft* → *Sent* → *Viewed* → *Paid*.

### Feature 3: Student-Friendly P&L & Runway Forecasts
* **The Problem:** Terms like "EBITDA", "Double-entry debits/credits", and "Accounts Payable" intimidate non-business majors.
* **The Experience:**
  - **Plain English P&L:**
    - Money In (Revenue)
    - Money Out (Direct Costs & Subscriptions)
    - Net Hustle Profit ("What you actually took home")
  - **Survival Runway Calculator:**
    - "At your current spend rate, your hustle can survive **X months** without new sales."
    - Break-even indicator for projects with upfront investments (e.g. bought a $1,200 camera, how many shoots until break-even?).

### Feature 4: Pitch & Campus Grant Financial Exporter
* **The Problem:** University pitch competitions, campus incubators, and micro-grants ($500 - $10,000) demand clean financial exhibits, but students don't know how to format them.
* **The Experience:**
  - One-click export to:
    - Clean **PDF One-Pager** (Executive Summary + Monthly Cash Flow chart + Unit Economics).
    - Formatted **Excel/CSV** sheet tailored to common student grant application rubrics.
  - Highlights essential traction metrics:
    - Month-over-Month (MoM) Growth Rate.
    - Gross Margin percentage.
    - Customer count / Average Order Value (AOV).

---

## 4. Platform & Distribution Strategy

* **Target:** Android Google Play Store (as hybrid mobile app) + expandable to iOS / Web.
* **App Shell Architecture:**
  - Built as a cross-platform hybrid application suitable for Google Play deployment (via Android App Bundle `.aab`).
  - Offline-first capability: Local data cache ensures students can invoice clients and log expenses even in campus basements or spotty Wi-Fi.

---

## 5. Key Open Discussion Points

1. **Transaction Entry Method for MVP:**
   - Should MVP start with ultra-fast **Manual + Receipt Photo Snap** (100% free, zero banking API costs, privacy-friendly)?
   - Or do we plan for open banking / Plaid integration later?
2. **Multi-Hustle Support:**
   - Do we allow a student to manage multiple side projects under one account (e.g., "Photography" and "Tutoring")?
3. **Monetization & Free Tier for Students:**
   - How should MyBookr be positioned? (e.g., Free for up to 5 invoices/month, campus ambassador model, or freemium)?
4. **Visual Style & Tone:**
   - Gen-Z / collegiate aesthetic (clean, energetic, gamified like Duolingo/Bereal) vs. minimalist fintech (like Robinhood/Mercury).
