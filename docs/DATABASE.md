# Database plan

Status: conceptual schema, not executed migrations. PostgreSQL, UUID domain primary keys, UTC timestamptz, explicit foreign keys/check constraints, and optimistic version columns on concurrently edited aggregates. Spring Session tables follow its supported JDBC schema rather than imposing domain UUID conventions on framework internals.

## Ownership and records

| Module | Tables and constraints |
| --- | --- |
| users | users, roles, user_roles; normalized unique login, password hash, disabled state, fixed role names |
| auth | spring_session, spring_session_attributes; indexes and cleanup; bounded login-attempt tracking |
| content | pages, page_localizations, page_sections; unique page slug, locale and section keys |
| services | service_categories, services, service_localizations, service_media, service_relations; localized unique slugs, no self-relations |
| media | media_assets; unique randomized object key, upload state, verified type/size/dimensions, alt text |
| contacts | contact_submissions; unique request identifier, constrained status, bounded source/UTM fields |
| settings | site_settings, navigation_items; typed configuration, no public secrets |
| audit | audit_logs; actor, event, entity type/ID, UTC time, safe metadata |

## Content snapshots

Localized sections store draft_content/published_content JSONB, draft_enabled/published_enabled, and draft/published ordering. Page SEO and service data also have separate draft/published state. Typed backend DTO validation constrains JSON structure and maximum sizes. Media and service relationships must preserve independent draft/published references; editing a gallery must never mutate the live gallery.

Pages/services publish atomically after aggregate version and reference validation. Acquire aggregate locks/version checks consistently so a simultaneous save cannot produce a mixed snapshot. Draft preview reads only through authenticated APIs. Seed locale `en`; schema supports additional locales without changing domain ownership.

## Indexes and lifecycle

Index localized public slugs, publication/enabled ordering, featured services, contact status/created time, media creation/name search, and audit event/actor/time. Index foreign keys used in joins or deletion checks. Bound pagination and allowlist sorting. Reference checks cover drafts and published content before media deletion. Disable users instead of erasing audit identity; protect the last enabled super-admin from removal or demotion.

## Migrations

Flyway owns all schema changes under `backend/src/main/resources/db/migration`. Initial ordering: users/session, media, content, services, contacts, settings, audit, followed by narrowly scoped forward migrations. Disable runtime schema generation. Persistent-environment migrations are immutable; validate checksums in CI. Development seed content is profile-scoped application initialization or isolated dev migrations, never production default credentials.
