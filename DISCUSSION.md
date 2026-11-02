# BOOKR — Product Design & Architecture Discussion

*This file tracks decisions, design thoughts, and open questions as we brainstorm the app concept before writing code.*

---

## Current Status
- **Phase:** Ideation, Requirements Definition & User Journey Design
- **Code Status:** No application code written yet (strictly planning).
- **Core Documents:** 
  - [PROJECT_BLUEPRINT.md](file:///d:/dev/MyBookr/PROJECT_BLUEPRINT.md)
  - [DECISIONS_AND_ROADMAP.md](file:///d:/dev/MyBookr/DECISIONS_AND_ROADMAP.md)
  - [ARCHITECTURE.md](file:///d:/dev/MyBookr/ARCHITECTURE.md)
  - [RESEARCH_CAMPUS_ENTREPRENEURS.md](file:///d:/dev/MyBookr/RESEARCH_CAMPUS_ENTREPRENEURS.md)
  - [RESEARCH_BENCHMARKS.md](file:///d:/dev/MyBookr/RESEARCH_BENCHMARKS.md)

---

## Round 7: Final Pre-Build Consensus

All 6 critical decisions are officially locked:
1. **Local Database Engine:** Dexie.js (IndexedDB).
2. **Onboarding / Auth:** Hybrid choice screen: "Use Locally (Guest Mode)" vs. "Cloud Sync".
3. **Capital Guard Math:** Deferred to Phase 2; focus first on clear logging of Restock vs. Chop-Money.
4. **Debtors / Owing:** Basic Paid vs. Owing flag with Debtor Name + WhatsApp nudge; partial settlements deferred.
5. **Flexible Quick-Sales:** Unlinked doorway sales (`₦200 Garri`) allowed without requiring pre-existing inventory items.
6. **Top Summary Bar:** OFF by default (Minimalist Mode).
7. **Visual Identity:** Exact `ib1` squircle buttons (`rounded-[12px] md:rounded-[13px]`, 0.5px inner bevel highlight, micro-press `active:translate-y-[0.5px]`), zero glows, zero gradients, zero 1px harsh borders, warm hardware palette (`#FAF9F6`, `#111111`, `#DCDAD2`, `#E5E4DE`).

### 1. The 5 Immutable Design Rules
1. **ZERO 1px Borders:** Surface differentiation must be achieved strictly through subtle background tone shifts (`bg-[#f4f5f7]` vs `bg-white` or dark equivalents) and natural elevation, never harsh 1px borders.
2. **ZERO Gradients:** 100% solid, crisp, confident flat colors.
3. **Generous Spacing & Humanist Typography:** No cryptic monospace or "tech-bro" fonts. Use clean, highly legible grotesque/humanist sans-serif typography (e.g., Inter, Geist, Plus Jakarta Sans).
4. **Smooth Rounded Geometry:** Soft corner radii (`rounded-2xl`, `rounded-xl`) for a friendly, modern tactile feel.
5. **Aesthetic Reference:** Inspired by the modern **Cloudflare website (`cloudflare.com`)** and dashboard (**`dash.cloudflare.com`**).

### 2. The Official Tactile Squircle Button Standard (`ib1` Component)
Adopted directly from `ib1/components/ui/button.tsx`:
- **Curvature:** `rounded-[12px] md:rounded-[13px]` squircle radius.
- **Inner Bevel Highlight:** 
  - Primary (`#111111`): `shadow-[0_2px_6px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0.5px_rgba(255,255,255,0.22)]`
  - Secondary (`#FFFFFF`): `shadow-[0_2px_5px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_0.5px_rgba(255,255,255,0.9)]`
- **Micro-Press Physics:** `active:translate-y-[0.5px]` for tactile mechanical feedback on tap/click.
- **Warm Neutral Palette:** `#111111`, `#FAF9F6`, `#DCDAD2`, `#E5E4DE`, `#F2F1EC`.
- **Tactile ButtonGroup:** Built with `divide-x divide-[#E5E4DE]` for smooth 3-tab switching.

---

## Round 5: Technical Stack & Deployment Foundation

### 1. Platform Choice: Web-First SPA + Capacitor Hybrid
- **Web First:** Build as a responsive Single Page App (SPA) that runs on laptops, desktops, and phone browsers.
- **Hosted on Vercel:** Continuous deployment from GitHub to Vercel (free, high performance).
- **Hybrid Bridge via Capacitor:**
  - Uses Capacitor 6 to wrap the web build (`dist/`) into an Android project (`android/`).
  - Produces an Android App Bundle (`.aab`) for the Google Play Store.
  - Native plugins handle Camera, File Sharing, and Android Share Intent (receiving receipts from OPay/PalmPay).

### 2. Backend & Cloud Strategy (Supabase vs. Render)
- **Supabase (PostgreSQL + Auth + Storage + RLS):**
  - Handles database, user authentication, and receipt image storage.
  - Using direct client queries with Row Level Security (RLS) avoids cold starts.
- **Render Considerations:**
  - Render free tier spins down after 15 minutes of inactivity and suffers a 50-second cold start.
  - **Mitigation:** The app is **Offline-First**. The student writes to local storage (IndexedDB) in 0 milliseconds; background sync pushes to Supabase/Render without blocking the UI.

### 3. Database Invariants
- Integer smallest units (`BIGINT` kobo) for all money to prevent rounding errors.
- Clean separation between `restock` (business capital) and `chop_money` (personal upkeep).
- `owing` debt tracking directly on the `sales` table with debtor name and phone for WhatsApp nudges.

---

## Round 4: The Minna & Nigerian Campus Reality Check

### 1. Ground Truth Research: Where Generic Apps Fail
- **Target Persona:** Nigerian student entrepreneurs (e.g. FUTMinna, UNILAG, FUTA, ABU) selling foodstuffs (garri by mudu/cup, indomie, eggs, bread) and campus services from hostel rooms and lodges.
- **The #1 Business Killer:** **"Eating Capital"** (Consuming restock money to eat and survive).
  - Students sell in micro-trickles (₦200, ₦500). When hungry or needing transport fare, they take from the cash box.
  - At restock day, they cannot afford a new bag of garri because the capital was eaten invisibly.
- **The #2 Business Killer:** **"Owing / Gbese" (Campus Credit)**.
  - Roommates and coursemates buy on credit. The seller is shy to ask or forgets. Money is trapped in debtors' bellies.

### 2. Eliminating Top "Dashboard Card" Clutter
- **User Feedback:** Hates big summary cards ("Total Expenditure", "Monthly Profit") at the top that eat screen space.
- **Decision:** **Make top summary cards completely toggleable in Settings.**
  - **Minimalist Mode (Default):** Screen starts immediately at the transaction list with zero wasted vertical space.
  - **Capital Guard Mode (Optional):** A single compact status line: `Restock Capital: ₦32,000` (DO NOT TOUCH) | `Safe to Eat/Spend: ₦4,500`.

### 3. Dual Input Model (Cash + OPay)
- **Cash Micro-Sales:** 2-tap entry (Tap `+` $\rightarrow$ type `200` $\rightarrow$ tap `Garri` $\rightarrow$ Done in 1.5 seconds).
- **Bank Transfers:** Android Share Intent from OPay/PalmPay + On-Device OCR & Regex.

### 4. Next Milestone: Review & Alignment
- Review the updated [PROJECT_BLUEPRINT.md](file:///d:/dev/MyBookr/PROJECT_BLUEPRINT.md) and [RESEARCH_CAMPUS_ENTREPRENEURS.md](file:///d:/dev/MyBookr/RESEARCH_CAMPUS_ENTREPRENEURS.md).
- Once aligned on these foundational principles, we can map the exact UI screens and wireframe states.
