# BOOKR — Product Design & Architecture Discussion

*This file tracks decisions, design thoughts, and open questions as we brainstorm the app concept before writing code.*

---

## Current Status
- **Phase:** Ideation, Requirements Definition & User Journey Design
- **Code Status:** No application code written yet (strictly planning).
- **Core Documents:** 
  - [PROJECT_BLUEPRINT.md](file:///d:/dev/MyBookr/PROJECT_BLUEPRINT.md)
  - [RESEARCH_CAMPUS_ENTREPRENEURS.md](file:///d:/dev/MyBookr/RESEARCH_CAMPUS_ENTREPRENEURS.md)
  - [RESEARCH_BENCHMARKS.md](file:///d:/dev/MyBookr/RESEARCH_BENCHMARKS.md)

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
