# TraceRoot

Inventory management platform built for cannabis operators in regulated markets.

**Live demo:** [traceroot.io](https://traceroot.io)

---

## The Problem

Cannabis operators in regulated states must maintain accurate, real-time inventory records in state track-and-trace systems (e.g., METRC). In practice, most operators manage inventory across paper logs, multiple spreadsheets, and manual data entry — a process that is error-prone and time-consuming. Discrepancies between internal records and the state system trigger compliance audits.

TraceRoot centralizes that workflow. Operators manage inventory in one place, with a complete audit trail that mirrors what regulators expect to see.

---

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Backend  | Node.js, Express.js                          |
| Database | PostgreSQL (AWS RDS)                         |
| Auth     | Passport.js (local strategy, session-based)  |
| Frontend | React + TypeScript, Vite (migrating from EJS SSR), Tailwind CSS v4 |
| Billing  | Stripe (Checkout, webhooks, subscriptions)   |
| Hosting  | AWS EC2 + RDS, PM2                           |
| Testing  | Jest                                         |

---

## Architecture Decisions

### Ledger-based inventory model

Inventory quantities are never mutated in place. Every change — receive, adjust, split, transfer — writes an immutable row to `inventory_movements` with `starting_quantity`, `quantity` (delta), and `ending_quantity`. This mirrors how financial and compliance systems track state over time and makes the audit trail a first-class feature rather than an afterthought.

### Package locking during transfers

When a transfer is created, the source package is immediately flagged `locked = true`. Any attempt to adjust, split, or re-transfer a locked package is blocked until the transfer is confirmed or cancelled. This prevents double-counting during pending transfers and preserves data integrity at the database level.

### Multi-tenancy via company_id scoping

Every table carries a `company_id` foreign key. All queries are scoped to the authenticated user's company at the middleware level, providing hard data isolation between tenants with no risk of cross-company data leakage.

### Stripe billing with trial middleware

Subscriptions are managed via Stripe Checkout. On signup, companies receive a 14-day free trial tracked by a `trial_ends_at` timestamp in the `companies` table. A middleware layer (`trialMiddleware.js`) runs on every authenticated request and gates access to app routes if the trial has expired and no active Stripe subscription exists. Subscription state is updated in real-time via Stripe webhooks (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`), which write back to `stripe_subscription_status` on the company record. The webhook endpoint receives a raw body before Express JSON parsing to allow Stripe signature verification.

### Composite foreign key on packages → locations

`packages` enforces `FOREIGN KEY (location_id, company_id) REFERENCES locations(id, company_id)` — a composite key that prevents a package from being assigned to a location belonging to a different company, even if the location ID is otherwise valid.

---

## Features

- **Multi-tenant auth** — company-scoped accounts, session-based login via Passport.js
- **Role-based access control** — admin, manager, and staff roles with route-level enforcement
- **Product catalog** — products linked to brands, strains, and categories
- **Package lifecycle** — receive, split, adjust, and archive packages with full movement history per package
- **Transfers** — internal (location-to-location) and external (company-to-company) with a pending → confirmed/cancelled state machine
- **Audit trail** — per-package transaction history with start qty, delta, end qty, and user attribution
- **Locations** — configurable storage locations per company
- **Billing & subscriptions** — Stripe Checkout with 14-day free trial, webhook-driven subscription state, trial expiry gating, and subscription status visible in account settings

---

## Database Schema

```
companies ──► users
          ──► products ──► packages ──► inventory_movements
          ──► locations              ──► transfer_items
          ──► transfers ─────────────► transfer_items
```

See [`db/schema.sql`](db/schema.sql) for the full schema.

---

## Demo

A live demo is available at [traceroot.io](https://traceroot.io). Use the following credentials to log in, or click **Try Demo Account** on the login page.

| Field    | Value               |
| -------- | ------------------- |
| Email    | `demo@traceroot.io` |
| Password | `demo123`           |

> The demo account is read-only seeded data. Feel free to explore — any changes you make are scoped to the demo company.

---

## Getting Started

**Prerequisites:** Node.js 18+, PostgreSQL 14+

```bash
git clone https://github.com/yourusername/traceroot
cd traceroot
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://localhost/traceroot
COOKIE_SECRET=your_secret_here
PORT=3000

# Stripe (optional for local dev — required for billing features)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
```

Initialize the database:

```bash
psql -d traceroot -f db/schema.sql
psql -d traceroot -f db/seed.sql
```

Start the dev server:

```bash
npm run dev
```

---

## Roadmap

- [ ] **Frontend migration** — rewrite app views in React + TypeScript (Vite), keeping EJS for public marketing pages
- [ ] **Dashboard** — inventory summary, recent transfers, low-stock alerts at a glance
- [ ] **Variance checker** — upload a physical count CSV, compare against system quantities, AI-generated reconciliation summary via Claude API
- [ ] **METRC integration** — sync package data directly to state track-and-trace via API
- [ ] **Reporting** — inventory valuation trends, movement exports, low-stock alerts
