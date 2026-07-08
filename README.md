# TraceRoot

Inventory management platform built for cannabis operators in regulated markets.

**Live demo:** [traceroot.io](https://traceroot.io)

---

## The Problem

Cannabis operators in regulated states must maintain accurate, real-time inventory records in state track-and-trace systems (e.g., METRC). In practice, most operators manage inventory across paper logs, multiple spreadsheets, and manual data entry — a process that is error-prone and time-consuming. Discrepancies between internal records and the state system trigger compliance audits.

TraceRoot centralizes that workflow. Operators manage inventory in one place, with a complete audit trail that mirrors what regulators expect to see.

---

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Node.js, Express 5, TypeScript                          |
| Database | PostgreSQL (AWS RDS)                                    |
| Auth     | Passport.js (local strategy, session-based)             |
| Frontend | React + TypeScript, Vite, Tailwind CSS                  |
| Billing  | Stripe (Checkout, webhooks, subscriptions)              |
| Hosting  | AWS EC2 + RDS, PM2                                      |
| Testing  | Jest                                                    |

### Codebase Evolution

TraceRoot has gone through two major migrations as the project matured:

1. **Frontend: EJS → React + TypeScript** *(complete)* — the core app views were rewritten as a Vite-based React + TypeScript single-page app, served alongside the Express backend. Auth, billing, and the static marketing pages are intentionally kept on server-rendered EJS, where SSR and simplicity are a better fit than a SPA.
2. **Backend: JavaScript → TypeScript** _(complete)_ — the Express backend was incrementally migrated to TypeScript one domain at a time (queries → controllers → routes), from reference data (brands, categories, strains, locations) outward through products, packages, transfers, and billing. All application code — routes, controllers, queries, middleware, and auth — is now TypeScript. The Jest test suite is being converted from JavaScript to TypeScript as an ongoing follow-up.

---

## Architecture Decisions

### Ledger-based inventory model

Inventory quantities are never mutated in place. Every change — receive, adjust, split, transfer — writes an immutable row to `inventory_movements` with `starting_quantity`, `quantity` (delta), and `ending_quantity`. This mirrors how financial and compliance systems track state over time and makes the audit trail a first-class feature rather than an afterthought.

### Package locking during transfers

When a transfer is created, the source package is immediately flagged `locked = true`. Any attempt to adjust, split, or re-transfer a locked package is blocked until the transfer is confirmed or cancelled. This prevents double-counting during pending transfers and preserves data integrity at the database level.

### Multi-tenancy via company_id scoping

Every table carries a `company_id` foreign key. All queries are scoped to the authenticated user's company at the middleware level, providing hard data isolation between tenants with no risk of cross-company data leakage.

### Stripe billing with trial middleware

Subscriptions are managed via Stripe Checkout. On signup, companies receive a 14-day free trial tracked by a `trial_ends_at` timestamp in the `companies` table. A middleware layer (`trialMiddleware.ts`) runs on every authenticated request and gates access to app routes if the trial has expired and no active Stripe subscription exists. Subscription state is updated in real-time via Stripe webhooks (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`), which write back to `stripe_subscription_status` on the company record. The webhook endpoint receives a raw body before Express JSON parsing to allow Stripe signature verification.

### Composite foreign key on packages → locations

`packages` enforces `FOREIGN KEY (location_id, company_id) REFERENCES locations(id, company_id)` — a composite key that prevents a package from being assigned to a location belonging to a different company, even if the location ID is otherwise valid.

### Dashboard aggregation in a single request

The operator dashboard is served by one endpoint (`GET /api/dashboard`) that runs its five aggregate queries concurrently with `Promise.all` rather than issuing a separate round-trip per widget. Metrics are computed in SQL — `SUM(quantity * cost_price)` for inventory value, and `generate_series` to bucket the 30-day activity timeline so days with no movements still return a zero row — keeping aggregation in the database instead of the application layer. Every query is company-scoped like the rest of the app. On the frontend, the charts (donut, bar, line) are hand-built SVG components with no charting dependency.

---

## Features

- **Operator dashboard** — post-login analytics overview with KPI tiles (inventory value, active packages, active products and locations, 30-day movement volume) and charts for inventory value by category, value by location, package status, and daily inventory activity
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


---

## Roadmap

- [x] **Frontend migration** — core app views rewritten in React + TypeScript (Vite); auth, billing, and static marketing pages intentionally kept on server-rendered EJS
- [ ] **Backend TypeScript migration** — incrementally migrating Express backend from JavaScript to TypeScript
- [ ] **Dashboard** — inventory summary, recent transfers, low-stock alerts at a glance
- [ ] **Variance checker** — upload a physical count CSV, compare against system quantities, AI-generated reconciliation summary via Claude API
- [ ] **METRC integration** — sync package data directly to state track-and-trace via API
- [ ] **Reporting** — inventory valuation trends, movement exports, low-stock alerts
