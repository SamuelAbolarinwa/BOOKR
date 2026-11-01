# BOOKR — Product Blueprint & Specifications
*The Capital-Protection Financial Ledger for Nigerian Student Entrepreneurs*

---

## 1. Ground Reality & Core Philosophy

**The Target User:**
A student entrepreneur at **FUTMinna, UNILAG, FUTA, UNIBEN, ABU Zaria**, or similar tertiary institutions selling:
- Raw foodstuffs (Garri by the mudu/paint rubber/cup, Indomie cartons, eggs, groundnut oil, spaghetti).
- Provisions, bread, snacks, pure water.
- Thrift clothes, hair braiding, campus services, data/airtime.

**The Fatal Problem to Solve:**
> *"Most student entrepreneurs are just trying to survive. The small money they make, they take out to eat or buy handouts. Because they mix business cash with personal chop-money, they accidentally eat their restock capital. Next market day, they cannot afford to restock, and the business dies."*

BOOKR exists for one specific mission: **To protect the student's restock capital, track who is owing them in the hostel, and replace the paper notebook with a 2-second offline tracker.**

---

## 2. Screen Layout & The "Zero-Clutter" Principle

### The Toggleable Header (No Annoying Dashboard Cards)
- **Problem:** Most finance apps force giant cards ("Total Expenditure", "Monthly Profit") at the top that consume 40% of the screen.
- **BOOKR Solution:**
  - **In Settings: Toggle "Summary Cards" ON or OFF.**
  - When **OFF (Default/Minimalist Mode):** The screen starts immediately with your records. Zero wasted pixels.
  - When **ON (Capital Guard Mode):** A compact single banner that answers only one critical question:
    > **Restock Capital:** `₦32,000` *(DO NOT TOUCH)* | **Safe to Eat/Spend:** `₦4,500`

---

## 3. The 3 Primary Tabs

```
┌────────────────────────────────────────────────────────┐
│                        BOOKR                           │
│  [ Optional Header: Restock: ₦32k  |  Chop-Money: ₦4.5k ]│
├───────────────────┬───────────────────┬────────────────┤
│     📈 SALES      │    📉 EXPENSES     │   📦 INVENTORY  │
│  (Money Coming In)│ (Money Going Out) │  (What You Have)│
└───────────────────┴───────────────────┴────────────────┘
```

### Tab 1: 📈 Sales (Money Coming In & Debt Tracking)
- **Fast 2-Tap Record:**
  - Designed for hostel doorway sales: Tap `+` $\rightarrow$ Type `200` $\rightarrow$ Tap `Garri` $\rightarrow$ Done.
- **Paid vs. "Owing / Gbese" (Campus Credit):**
  - Toggle between **"Paid (Cash/Transfer)"** and **"Owing (Credit)"**.
  - If marked "Owing", prompt for the friend's name (e.g., *"Emeka Room 14"*).
  - Keeps a live running total of **"Money Trapped in Debts"**.
  - Includes a 1-tap **"Nudge on WhatsApp"** button: generates a polite pre-written text (*"Bro, abeg remember the ₦800 for the noodles!"*).
- **OPay / PalmPay Share Ingest:** For bank transfers, share the receipt screenshot directly into BOOKR via Android Share.

### Tab 2: 📉 Expenses (Money Going Out & Capital Protection)
- Distinguishes between two types of money leaving the pocket:
  1. **Restock / Business Expense:** (e.g. Bought 1 bag of Garri at Kure market for ₦30,000 + ₦1,000 bike fare).
  2. **Personal Chop-Money (Owner Draw):** (e.g. Took ₦1,000 from sales to buy lunch or print lecture handouts).
- **Why this separation is vital:** It tells the student the truth without shaming them: *"You made ₦6,000 profit this week, and you have eaten ₦4,000 for personal upkeep. You have ₦2,000 real profit left."*

### Tab 3: 📦 Inventory (What You Have — TOGGLABLE)
- **Togglable in Settings:** Can be completely turned OFF for service freelancers (photographers, tutors, coders, hair braiders), reducing BOOKR to a 2-tab app.
- **Simplified Measurement Units for Campus Retail:**
  - Support for local Nigerian retail units: **Bag**, **Carton**, **Paint Rubber / Mudu**, **Cup**, **Piece / Sachet**.
  - Tracks basic count: e.g. *Garri: 4 mudu left* | *Indomie: 14 packs left*.

---

## 4. Input Channels: Both Cash & Digital

```
                    ┌─────────────────────────┐
                    │ How Did the Money Move? │
                    └────────────┬────────────┘
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [ Fast Cash / Micro-Sale ]               [ OPay / Bank Transfer ]
   - Tap +                                  - Tap "Share" on receipt in OPay
   - Type "300"                             - Select BOOKR
   - Tap "2 Eggs"                           - Local OCR + Regex pre-fills
   - Done in 1.5 seconds!                   - Done with receipt attached!
```

1. **Hostel Micro-Sales (Cash):** Zero-friction, preset quick-buttons (e.g., `Garri`, `Indomie`, `Egg`, `Water`).
2. **Bank Transfers (OPay / PalmPay):** Android Native Share Intent + Local On-Device OCR & Regex (100% offline, zero cloud LLM cost).

---

## 5. Technical Foundations (Play Store Ready)

- **Platform:** Cross-platform hybrid app (React Native + Expo) compiling to Android App Bundle (`.aab`).
- **Database:** Local SQLite database (`expo-sqlite`) — 100% offline, zero account creation required to start.
- **Privacy:** All financial data remains on the student's phone. No corporate tracking, no forced cloud accounts.
