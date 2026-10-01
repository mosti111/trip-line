# Architecture

Status: public demo and initial backend source exist. The design below remains the production target; backend runtime/integration verification and the admin UI are unfinished. See DEMO_QA.md and TODO.md for delivered scope.

## System

Use a monorepo with `frontend`, `backend`, `infra`, `docs`, and `.github/workflows`. Frontend is Next.js App Router with strict TypeScript and primarily Server Components. Backend is a Java 21 Spring Boot modular monolith. PostgreSQL holds content, identity, JDBC sessions, audit events, and contact submissions. Cloudflare R2 holds media binaries. Cloudflare Turnstile protects contact submission. Separate Coolify resources host frontend, backend, and database.

The requested Spring Boot 4.1.x and React 19.3+ stable availability and mutual compatibility must be verified against official sources before pinning dependencies. Use Spring dependency management and lock frontend dependencies; do not silently substitute prereleases or change the requested stack.

## Backend ownership

Under `com.tripline.platform`, modules are `auth`, `users`, `content`, `services`, `media`, `contacts`, `settings`, and `audit`. Each owns its domain, repositories, application services, and controllers. `shared` contains only narrowly scoped infrastructure contracts and configuration. Cross-module work goes through explicit interfaces or domain events, never another module's repository. Spring Modulith verification enforces boundaries. Keep audit writes in the same transaction as successful business mutations where practical.

## Frontend boundaries

Server Components own public page shells, content fetches, metadata, static navigation structure, and footer. Client islands own menus, forms, motion, hover previews, 3D, and admin interaction. Admin server state uses TanStack Query; forms use React Hook Form and Zod. Use TanStack Table where tabular behavior warrants it and restricted TipTap only for formatted long text.

## Routing and sessions

Prefer same-origin `/api/v1` reverse proxy routing to Spring, with an internal backend URL for server fetches. This keeps browser session and CSRF behavior straightforward. Forward authenticated cookies only for explicit admin/preview requests. Public cached fetches never include session credentials. If an API subdomain is selected at deployment, document and test its explicit CORS, credentials, and cookie configuration.

## Publishing and concurrency

Maintain separate draft and published snapshots, including visibility, ordering, localization, relations, and SEO. Check optimistic versions on edits and publication; conflicts return 409. Publish a complete aggregate in one database transaction. Public reads use published snapshots exclusively. Preview uses no-store authenticated reads. Use a short public cache window and authenticated targeted invalidation after publishing; invalidation failure must not roll back committed content or leave content stale indefinitely.

## Enhancement strategy

JourneyLine is reusable SVG. Hero aircraft is a dynamically imported R3F enhancement with static fallback, bounded DPR, demand rendering, reduced motion, and graceful WebGL failure. Only use supported stable transition APIs. Core content and navigation remain functional without these enhancements.
