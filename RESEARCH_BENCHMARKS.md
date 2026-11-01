# BOOKR — Competitive Research, Repo Analysis & App Benchmarks

*Prepared to guide the product architecture and UX decisions for BOOKR.*

---

## 1. Deep Dive: What We Learned from `Not-Venda`

We inspected [SamuelAbolarinwa/Not-Venda](https://github.com/SamuelAbolarinwa/Not-Venda). It is a Smart Retail & Inventory Management System featuring a stock movement ledger, purchase orders, supplier management, and low-stock alerts.

### High-Value Architectural Patterns We Can Port to BOOKR:

| Not-Venda Architecture Pattern | How We Adapt It for BOOKR |
|---|---|
| **Zero Floating-Point Money Errors**<br>`BIGINT` storing smallest units (kobo/cents). | Never use JavaScript floating `Number` for money. Store prices and balances as integer cents/kobo to prevent rounding drift on invoices and totals. |
| **Offline-First Outbox Queue**<br>Durable local outbox (IndexedDB / SQLite). | Students frequently log expenses or create invoices with spotty campus Wi-Fi. Invoices and expenses save locally first, sync when connection resumes. |
| **Append-Only Financial Ledger**<br>Every movement has an immutable event row. | Never overwrite transactions. Personal vs. Hustle splits, sales, payments, and refunds create linked compensating entries. |
| **Idempotency Keys (`client_request_uuid`)**<br>Deduplication on poor network. | When a student taps "Send Invoice" or "Log Expense" twice on poor mobile data, the server recognizes the idempotent key and never double-bills or double-records. |
| **Multi-Entity Isolation**<br>Partitioned by `shop_id` / workspace. | Perfect foundation for **Multi-Hustle Support** (e.g. allowing one student to toggle between "Photography Hustle" and "Merch Store"). |

---

## 2. Open-Source Repositories to Benchmark & Leverage

### Invoicing & Mobile PDF Generation
1. **[ashishbhor/Invoice-Maker](https://github.com/ashishbhor/Invoice-Maker)** (React Native / Expo + TypeScript)
   - **What we can use:** Mobile PDF generation via `expo-print` and `expo-sharing`. Creates crisp, branded invoice PDFs directly on the device with zero server rendering lag.
   - **Standout Feature:** Dynamic QR code generation directly embedded in the PDF invoice so the customer can point their phone camera and pay immediately.

2. **[yasojha/rn-invoice-generator](https://github.com/YasoJha/rn-invoice-generator)** (React Native)
   - **What we can use:** Minimalist 3-step invoice creation wizard (Client Info → Line Items → Export/Share).

### Ledger & P2P Settlements
3. **[mukeshdhadhariya/hisab](https://github.com/mukeshdhadhariya/hisab)** (React Native / Expo SDK 53 + PostgreSQL)
   - **What we can use:** Offline sync queue architecture, P2P ledger ("Who owes who"), tracking unpaid balances from clients.

4. **[Okazakee/spendr](https://github.com/Okazakee/spendr)** (React Native / Expo + SQLite)
   - **What we can use:** Local-first SQLite data storage, multi-currency support, and biometric security (`expo-local-authentication`) to lock the app via fingerprint/FaceID.

---

## 3. Real Apps to Install & Test on Your Phone (Android / Google Play)

Here are the top real-world apps you should install to experience the benchmark user experience:

### A. African Commerce & Bookkeeping Benchmarks
* **[Bumpa](https://play.google.com/store/apps/details?id=com.getbumpa.bumpa)** ⭐ *(Highest Priority)*
  - **Why test it:** The gold standard in Nigeria for recording sales, generating digital receipts/invoices, and sharing them directly to WhatsApp.
  - **What to study:** How fast it takes to record an offline sale, how receipt links open in mobile browsers, and how simple customer debt tracking works.

### B. Mobile Invoicing & Receipt Benchmarks
* **[Invoice Simple](https://play.google.com/store/apps/details?id=com.invoicesimple.invoicesimpleapp)**
  - **Why test it:** The undisputed benchmark for 60-second mobile invoicing.
  - **What to study:** Notice how few taps it takes from tapping "+" to sending a PDF link.
* **[Zoho Invoice](https://play.google.com/store/apps/details?id=com.zoho.invoice)** (100% Free)
  - **Why test it:** Completely free professional invoicing with client portals, payment reminders, and multi-currency support.

### C. Student Financial UX & Separation of Funds
* **[Kuda Bank](https://play.google.com/store/apps/details?id=com.kudabank.app)**
  - **Why test it:** Nigeria's best collegiate mobile banking UX.
  - **What to study:** Look at their "Spend & Save" pockets and automated budgeting dials. BOOKR's "Safe-to-Spend vs. Hustle Capital" dial should feel just as intuitive.
* **[Splitwise](https://play.google.com/store/apps/details?id=com.Splitwise.SplitwiseMobile)**
  - **Why test it:** Masterclass in quick split expense calculations (e.g. 50% business / 50% personal).
* **[Cashew](https://play.google.com/store/apps/details?id=com.budget.tracker_app)**
  - **Why test it:** Beautiful Material You (Android) personal finance tracker with multi-account support (e.g., Personal Wallet vs. Business Pocket).
