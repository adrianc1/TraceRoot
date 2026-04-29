# Cannabis Inventory Management System

## Project Overview
A cannabis inventory management system for tracking package movements. This is the developer's flagship portfolio project, built to demonstrate full-stack skills for job applications as a full-stack engineer.

## Tech Stack

**Backend (stable)**
- Node.js + Express 5
- PostgreSQL via `pg`
- Passport.js (local strategy) for auth
- Express sessions with `connect-pg-simple`
- EJS (being phased out as frontend migrates)
- Stripe (billing)
- Jest for tests

**Frontend (in migration)**
- React + TypeScript (Vite-based, lives in `client/`)
- React Router DOM for client-side routing
- Tailwind CSS

## Project Structure
```
index.js              # Express entry point
routes/               # Express routers
controllers/          # Route handler logic
db/queries/           # PostgreSQL query functions
views/                # EJS templates (legacy, being replaced)
middleware/           # Auth/session middleware
client/src/
  App.tsx             # React router root
  pages/              # React page components (migrated pages)
  components/         # Shared React components
  types/              # TypeScript types
```

## React Migration Status (branch: react-migration)
The frontend is being migrated from EJS to React/TS page by page. The React app is served alongside the Express backend.

**Migrated to React:**
- Brands (list, create, edit)
- Categories (list, create, edit, products within category)
- Strains (list, create, edit)
- Locations (list, create, edit — with isActive state management)
- Products/Packages (list — `pages/products/Packages.tsx`)

**Still on EJS (views/):**
- Auth (login, register)
- Users
- Transfers
- Products detail pages
- Billing
- Static pages (index, features, pricing, contact, terms, privacy)

## Key Conventions
- Backend uses CommonJS (`"type": "commonjs"`)
- DB queries are in `db/queries/` — one file per domain
- Controllers call query functions and handle req/res
- React pages call the Express API directly (same origin)
- Run backend: `npm run dev` (uses `--env-file=.env`)
- Watch CSS: `npm run watch:css`
