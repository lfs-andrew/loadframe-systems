# LoadFrame Systems

## Overview

LoadFrame Systems is a single-page marketing and lead capture site for a creator business diagnostic service. It targets monetized creators plateaued in the ~$3k–$10k/month revenue range, offering a "structural stress test" of their business across revenue concentration, platform dependency, and offer architecture.

The application is a full-stack TypeScript project with a React frontend (Vite) and Express backend, using PostgreSQL via Drizzle ORM for data persistence. The primary functionality is a lead capture form that collects detailed business information from potential study participants.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework:** React 18 with TypeScript, bundled by Vite
- **Routing:** Wouter (lightweight client-side router) with three routes: Home (`/`), Privacy (`/privacy`), and a 404 catch-all
- **Styling:** Tailwind CSS with CSS variables for theming. Dark-mode only design using graphite backgrounds and muted gold accents. Fonts are Manrope (body) and Space Grotesk (headings) loaded from Google Fonts
- **UI Components:** shadcn/ui (new-york style) with Radix UI primitives. Components live in `client/src/components/ui/`
- **State Management:** TanStack React Query for server state. Form handling via react-hook-form with Zod resolver
- **Animations:** Framer Motion for scroll/entrance animations, react-scroll for smooth anchor scrolling
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend
- **Framework:** Express 5 running on Node.js with TypeScript (executed via tsx)
- **API Design:** Single REST endpoint `POST /api/leads` for lead submission. Route contracts are defined in `shared/routes.ts` using Zod schemas, shared between client and server
- **Validation:** Zod schemas generated from Drizzle table definitions via `drizzle-zod`. The `insertLeadSchema` is used both server-side for input validation and client-side for form validation
- **Storage Layer:** Abstracted through an `IStorage` interface in `server/storage.ts`, currently implemented as `DatabaseStorage` using Drizzle ORM

### Database
- **Database:** PostgreSQL, connected via `pg` Pool using `DATABASE_URL` environment variable
- **ORM:** Drizzle ORM with `drizzle-kit` for schema management
- **Schema:** Single `leads` table defined in `shared/schema.ts` with fields for contact info, platform data, revenue ranges, revenue mix (JSONB), monetization flags (JSONB), and consent tracking
- **Migrations:** Use `npm run db:push` (drizzle-kit push) to sync schema to database

### Build System
- **Development:** `npm run dev` runs tsx to start the Express server which sets up Vite dev server as middleware (HMR via `server/vite.ts`)
- **Production:** `npm run build` runs a custom build script (`script/build.ts`) that builds the client with Vite and bundles the server with esbuild. The server bundle externalizes most dependencies except a curated allowlist to optimize cold start times. Output goes to `dist/` with client assets in `dist/public/`
- **Production start:** `npm start` runs `node dist/index.cjs`

### Shared Code
- `shared/schema.ts` — Drizzle table definitions and Zod schemas, shared between frontend and backend
- `shared/routes.ts` — API route contracts (paths, methods, input/output schemas) used by both client hooks and server route handlers

### Key Design Decisions
1. **Monorepo structure with shared types** — Ensures type safety across the full stack without code duplication. The `shared/` directory is the single source of truth for data shapes
2. **Dark-mode only** — Intentional brand decision; no light mode toggle needed. All CSS variables are set for dark theme
3. **Single-page app with anchor scrolling** — The Home page is a long-form landing page with sections navigated via smooth scroll, not separate routes
4. **No authentication** — This is a public-facing lead capture site with no user accounts or admin panel currently

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection string must be provided via `DATABASE_URL` environment variable. Used with `pg` driver and Drizzle ORM

### Key npm Packages
- `express` v5 — HTTP server
- `drizzle-orm` + `drizzle-kit` — Database ORM and schema management
- `@tanstack/react-query` — Async state management on the client
- `react-hook-form` + `@hookform/resolvers` — Form state and validation
- `zod` + `drizzle-zod` — Schema validation and type generation
- `framer-motion` — Animations
- `react-scroll` — Smooth scrolling to page sections
- `wouter` — Client-side routing
- `shadcn/ui` components (Radix UI primitives) — UI component library
- `connect-pg-simple` — Listed as dependency (potentially for session storage, not actively used yet)

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay in development
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` — Dev-only Replit integrations, conditionally loaded

### External Services
- **Google Fonts** — Manrope, Space Grotesk (and several others loaded in index.html)
- No other third-party APIs or services are currently integrated