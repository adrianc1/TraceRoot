# TraceRoot

Inventory management platform built for cannabis operators in regulated markets.

**Live demo:** [traceroot.io](https://traceroot.io)

---

## The Problem

Cannabis operators in regulated states must maintain accurate, real-time inventory records in state track-and-trace systems (e.g., METRC). In practice, most operators manage inventory across paper logs, multiple spreadsheets, and manual data entry — a process that is error-prone and time-consuming. Discrepancies between internal records and the state system trigger compliance audits.

TraceRoot centralizes that workflow. Operators manage inventory in one place, with a complete audit trail that mirrors what regulators expect to see.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | Passport.js (local strategy, session-based) |
| Frontend | EJS (server-side rendering), Tailwind CSS v4 |
| Testing | Jest |

---

## Architecture Decisions

### Ledger-based inventory model
Inventory quantities are never mutated in place. Every change — receive, adjust, split, transfer — writes an immutable row to `inventory_movements` with `starting_quantity`, `quantity` (delta), and `ending_quantity`. This mirrors how financial and compliance systems track state over time and makes the audit trail a first-class feature rather than an afterthought.

### Package locking during transfers
When a transfer is created, the source package is immediately flagged `locked = true`. Any attempt to adjust, split, or re-transfer a locked package is blocked until the transfer is confirmed or cancelled. This prevents double-counting during pending transfers and preserves data integrity at the database level.

### Multi-tenancy via company_id scoping
Every table carries a `company_id` foreign key. All queries are scoped to the authenticated user's company at the middleware level, providing hard data isolation between tenants with no risk of cross-company data leakage.

### Composite foreign key on packages → locations
`packages` enforces `FOREIGN KEY (location_id, company_id) REFERENCES locations(id, company_id)` — a composite key that prevents a package from being assigned to a location belonging to a different company, even if the location ID is otherwise valid.

---

## Features

- **Multi-tenant auth** — company-scoped accounts, session-based login via Passport.js
- **Product catalog** — products linked to brands, strains, and categories
- **Package lifecycle** — receive, split, adjust, and archive packages with full movement history per package
- **Transfers** — internal (location-to-location) and external (company-to-company) with a pending → confirmed/cancelled state machine
- **Audit trail** — per-package transaction history with start qty, delta, end qty, and user attribution
- **Locations** — configurable storage locations per company

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
SESSION_SECRET=your_secret_here
PORT=3000
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

- [ ] **Variance checker** — upload a physical count CSV, compare against system quantities, AI-generated reconciliation summary via Claude API
- [ ] **Role-based permissions** — granular admin / manager / staff access controls
- [ ] **METRC integration** — sync package data directly to state track-and-trace via API
- [ ] **Reporting** — inventory valuation trends, movement exports, low-stock alerts
