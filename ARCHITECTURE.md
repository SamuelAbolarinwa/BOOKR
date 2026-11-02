# BOOKR — Technical Architecture & Stack Specification

*Architecture Blueprint for Web + Capacitor Hybrid Mobile App*

---

## 1. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Cross-Platform)                   │
│                                                                        │
│   Web Browser (Desktop / Laptop)          Android Mobile (Capacitor)   │
│   - Vercel-hosted SPA                     - Google Play Store (.aab)   │
│   - Responsive Tailwind UI                - Android Native Share Intent│
│                                           - Camera & Local Storage     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    OFFLINE-FIRST LOCAL STORAGE (Client)                │
│                                                                        │
│   - Dexie.js (IndexedDB) on Web & Mobile / Capacitor SQLite            │
│   - Local OCR Engine (Tesseract.js) + Regex Receipt Parser             │
│   - Instant 0ms write latency for hostel doorway sales                 │
│   - Background Sync Queue (Pushes when internet is available)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Sync / Auth / Receipts
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND & CLOUD PERSISTENCE                        │
│                                                                        │
│   SUPABASE (Cloud PostgreSQL + Auth + Storage + RLS)                   │
│   - Auth: Email / Phone / Guest mode                                   │
│   - Database: PostgreSQL with Row-Level Security (RLS)                 │
│   - Storage: Encrypted bucket for compressed receipt images            │
│                                                                        │
│   OPTIONAL AUXILIARY API (Render Free Tier)                            │
│   - Fastify / Node.js (for heavy background tasks or scheduled jobs)   │
│   - *Note on Render:* Cold starts (50s) will NOT block the user because│
│     the client writes locally first and syncs with Supabase directly.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack Evaluation & Decisions

### A. Frontend: Vite + React 19 + TypeScript + Tailwind CSS
* **Why Vite over Next.js for this project?**
  - **Capacitor Compatibility:** Capacitor requires static asset compilation (`dist/`). Next.js with SSR/Server Components introduces routing complexity when exported as a static Android mobile bundle.
  - **Blazing Fast Performance:** Vite loads instantaneously on modest laptops and Android web views.
  - **Responsive Design:** Using Tailwind CSS, the UI adapts cleanly from a desktop widescreen monitor down to a 5.5-inch Android phone.

### B. Mobile Hybrid Bridge: Capacitor 6 (by Ionic)
* **How it works:**
  - Wraps the Vite React build inside a native Android Web Shell.
  - Generates an official `android/` directory that compiles to an Android App Bundle (`.aab`) ready for Google Play Store upload.
* **Key Native Plugins Needed:**
  1. `@capacitor/camera`: Snap receipt photos directly from the phone.
  2. `@capacitor/filesystem`: Cache offline receipt images.
  3. `capacitor-share-target` / Android Intent Filter: Registers BOOKR in the Android OS "Share" menu so sharing a receipt screenshot from OPay or PalmPay opens BOOKR automatically.
  4. `@capacitor/haptics`: Satisfying haptic feedback on recording a sale.

### C. Database & Cloud: Supabase (PostgreSQL + RLS)
* **Auth & Security:** Supabase Auth with Row Level Security (RLS). A user can only access records where `user_id = auth.uid()`.
* **Zero Cold-Starts:** Unlike a free-tier Render backend that sleeps after 15 minutes and takes 50 seconds to wake up, Supabase client-side queries with RLS connect directly, eliminating latency.
* **Receipt Storage:** Supabase Storage bucket (`receipts/`) with auto-compression before upload.

### D. Offline-First Sync Layer (Crucial for Nigerian Campus Life)
* In Minna or university hostels, internet cuts out without warning (NEPA/fuel generator down, bad weather, network congestion).
* **The Rule:** The app must NEVER show a loading spinner when a student taps "Record ₦200 Garri".
* **Architecture:**
  - Every write happens against the local client database (Dexie / IndexedDB) instantly ($0\text{ ms}$).
  - A background sync manager checks network status and syncs changes to Supabase in batches.

---

## 3. Database Schema (PostgreSQL via Supabase)

### Table 1: `profiles`
```sql
create table profiles (
  id uuid references auth.users primary key,
  display_name text,
  hustle_name text default 'My Side Hustle',
  currency text default 'NGN',
  inventory_enabled boolean default true,
  summary_cards_enabled boolean default false, -- Minimalist by default!
  created_at timestamptz default now()
);
```

### Table 2: `sales` (Money In & Debtors)
```sql
create table sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  amount bigint not null,              -- Stored in integer kobo (e.g. 20000 = ₦200.00)
  item_name text not null,             -- E.g., 'Garri 1 Mudu', 'Indomie x2'
  category text default 'General',
  payment_status text not null,        -- 'paid' or 'owing'
  payment_method text default 'cash',  -- 'cash', 'transfer', 'opay', 'other'
  debtor_name text,                    -- E.g. 'Emeka Room 14' (if payment_status = 'owing')
  debtor_phone text,                   -- Optional phone for WhatsApp nudge
  receipt_url text,                    -- Optional receipt image in Supabase Storage
  created_at timestamptz default now()
);
```

### Table 3: `expenses` (Money Out & Capital Guard)
```sql
create table expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  amount bigint not null,              -- In integer kobo
  description text not null,           -- E.g., 'Bought 1 Bag of Garri at Kure'
  expense_type text not null,          -- 'restock' (Business Seed) vs 'chop_money' (Personal Draw)
  receipt_url text,
  created_at timestamptz default now()
);
```

### Table 4: `inventory` (Togglable What You Have)
```sql
create table inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,                  -- E.g., 'Garri'
  unit text not null,                  -- 'mudu', 'cup', 'carton', 'piece'
  quantity_in_stock numeric default 0,
  cost_price_per_unit bigint,          -- In integer kobo
  selling_price_per_unit bigint,       -- In integer kobo
  is_active boolean default true,
  updated_at timestamptz default now()
);
```

---

## 4. On-Device Receipt Processing (OCR + Regex)

1. Image captured or received via Android Share Intent.
2. Compressed locally on-device.
3. Processed via local OCR (Tesseract.js / ML Kit).
4. Regex rules match amount, date, and sender/recipient.
5. Form auto-fills in < 1 second.
