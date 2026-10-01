# Trip Line product contract

Status: production product contract. A public-site demo has been implemented at the user's request; the complete V1 is unfinished. The supplied master specification is authoritative; see MASTER_SPECIFICATION.txt. This document describes target behavior rather than certifying delivered functionality.

## Scope

V1 delivers an English public website and an authenticated CMS. Public routes are `/`, `/about`, `/services`, `/services/[slug]`, and `/contact`, with branded loading, error, and not-found states. `/partners`, `/b2b`, and `/account` remain reserved and unimplemented.

The CMS includes login, dashboard, structured page editors, service management, media, contact inbox, global settings, SEO, users, fixed roles, and audit history. Dashboard counts come from stored records; visitor analytics are excluded.

Bookings, payments, accounts for travelers or partners, CRM, invoices, commissions, and future notification modules are excluded. No empty future modules will be created.

## Content behavior

Code controls composition; administrators control content. Pages have typed sections, allowed ordering, enabled states, media references, CTAs, and SEO. Save Draft, Preview Draft, and Publish are separate actions. Saving never changes public content. Publishing validates and copies a complete snapshot atomically. Preview requires an authorized session and is never publicly cached or indexed.

Home follows hero, philosophy, featured services, optional feature story, configured differentiators, optional metrics, final CTA, and footer. Metrics default to disabled and have no seeded numbers. About includes story, philosophy, approach, process, and optional values/team/partners. Empty optional sections never render. Services use an editorial index and content-driven detail pages with optional galleries, useful information, FAQs, and related services.

Contact requires name, email, and message. Configurable optional fields include phone, company, subject, and service interest. Store bounded source and UTM metadata. Submission validates on both client and server, verifies Turnstile, persists once, and then reports success.

## Editorial integrity

The specification's creative headlines and example services may be seeded as editable development drafts only. No invented statistics, reviews, awards, partners, or company claims. Production starts without development sample data. Asset provenance and placeholder status must be recorded.

## Completion

All acceptance items in master specification section 79 remain open. Completion requires implemented public and admin workflows, backend authorization, PostgreSQL integration tests, browser QA, deployment verification, external backups, and a documented successful restore. Written procedures alone do not satisfy operational acceptance.
