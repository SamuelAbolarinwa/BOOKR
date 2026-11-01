# BOOKR — Product Design & Architecture Discussion

*This file tracks decisions, design thoughts, and open questions as we brainstorm the app concept before writing code.*

---

## Current Status
- **Phase:** Ideation, Requirements Definition & User Journey Design
- **Code Status:** No application code written yet (strictly planning).
- **Core Documents:** 
  - [PROJECT_BLUEPRINT.md](file:///d:/dev/MyBookr/PROJECT_BLUEPRINT.md)
  - [RESEARCH_BENCHMARKS.md](file:///d:/dev/MyBookr/RESEARCH_BENCHMARKS.md)

---

## Round 3: The Anti-Bloat Breakthrough & Core Workflows

### 1. Key Insight: Rejecting Feature Bloat
- **Observation:** Commercial apps like Bumpa, QuickBooks, etc., are bloated with features students never asked for (website builder, CRM, complex shipping, online storefronts).
- **Decision:** BOOKR is **not** an online store builder. BOOKR is the ultra-clean digital replacement for the student's notebook or paper ledger.

### 2. The "3-Tabs Only" Architecture
When the user opens BOOKR, there are just three main views:
1. **📉 Expenses:** Outgoing cash flow.
2. **📈 Sales:** Incoming cash flow.
3. **📦 Inventory (Togglable):** What products they hold.
   - *Setting Toggle:* Freelancers/service providers (coders, designers, tutors) can toggle Inventory **OFF** in Settings, streamlining the app down to a 2-tab view.

### 3. Native Android "Share to BOOKR" Flow (OPay / PalmPay / Banks)
- **The Workflow:**
  1. Student completes a payment or receives money in OPay, PalmPay, Moniepoint, Kuda, or bank app.
  2. They hit the Android system **Share** button on the receipt screenshot/image.
  3. They select **BOOKR**.
  4. BOOKR launches with an intent sheet: *"Is this a Sale (Money In), an Expense (Money Out), or attach to existing record?"*
  5. The receipt image is automatically linked to the transaction.

### 4. Local OCR + Regex Classifier (Zero Cloud LLM)
- **Why No LLMs:** LLMs require an active internet connection, have recurring token API costs, add latency (3–5 seconds), and introduce privacy risks for banking receipts.
- **The Solution:** On-device OCR (e.g. Google ML Kit / Tesseract) + deterministic Regex extraction rules:
  - **Amount Extraction:**
    ```regex
    /(?:₦|NGN|N|Amount[:\s]*)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i
    ```
  - **Date Extraction:**
    ```regex
    /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b)/i
    ```
  - **Sender / Recipient Extraction:**
    - OPay: Look for text following `"Sender Name"`, `"Recipient"`, or `"Beneficiary"`.
    - PalmPay: Look for text following `"Transfer to"` or `"Paid by"`.
    - Kuda: Look for `"Sent to"` or `"Received from"`.
  - **Transaction Ref / Session ID:**
    ```regex
    /(?:Session ID|Transaction ID|Ref(?:erence)?[:\s]*)([A-Z0-9_\-\.]+)/i
    ```

---

## Round 4 Discussion Points: Refining the UX

1. **Transaction Entry Screen:**
   - When entering a transaction manually (without sharing from OPay), what are the bare minimum fields required?
     - Proposal: *Amount*, *Title/Note*, *Category/Tag* (e.g., Inventory, Transport, Food, Gig, Equipment), and optional *Attach Photo*.
2. **Balance Overview Header:**
   - At the top of the 3 tabs, what high-level summary should be visible at a glance?
     - Option A: *Today's Net Profit* + *This Month's Net Profit*.
     - Option B: *Safe-to-Spend* (Personal) vs. *Hustle Working Capital*.
     - Option C: Clean total balance with a toggle for Today / This Week / This Month.
3. **Data Storage & Privacy:**
   - Because this uses local SQLite and on-device OCR, all user data can stay 100% on the student's phone with zero login required to start using it. (Offline-first, instant start).
