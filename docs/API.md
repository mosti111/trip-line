# API contract plan

Status: target contract, not a verified operational API. Controllers exist in backend
source; inspect them before changing contracts. Runtime/PostgreSQL integration and
CMS acceptance remain unfinished. The active public frontend uses typed local content
and prepares WhatsApp/email messages without calling the persisted-contact endpoint.
REST JSON under `/api/v1`; DTOs only, no persistence entities. Locale defaults to `en`.
All admin lists paginate with zero-based `page`, `size` default 20/max 100,
and allowlisted `sort` fields. Search and filters run server-side in the target contract.

## Public

| Method | Path after /api/v1 | Behavior |
| --- | --- | --- |
| GET | /public/site | Public global settings only |
| GET | /public/navigation | Enabled public navigation |
| GET | /public/pages/{slug} | Published localized page |
| GET | /public/services | Published enabled services; featured/category filters |
| GET | /public/services/{slug} | Published service detail |
| POST | /public/contact | Validate, rate limit, verify Turnstile, persist submission |

Unknown/unpublished pages and services return 404. Contact uses a client request identifier with a unique database constraint to prevent accidental duplicates. Do not echo private submission contents in public responses.

## Authentication

GET `/auth/csrf` returns the token and header name. POST `/auth/login` authenticates with Spring Security and rotates the session. POST `/auth/logout` invalidates it. GET `/auth/me` returns safe user identity and roles. POST `/auth/change-password` requires current password and revokes other sessions. Obtain a fresh CSRF token after login/logout; send it on unsafe requests, including login and contact submission.

## Administration

Pages: GET collection/detail, PATCH draft, POST `/{id}/publish`, and authenticated GET `/{id}/preview`. Services: GET collection/detail, POST create, PATCH draft, POST `/{id}/publish`, POST `/{id}/archive`, and authenticated preview. Updates include the expected aggregate version. Public slugs become immutable after initial publication in V1 to avoid silently breaking links.

Media: paginated GET, POST upload initiation, POST completion, PATCH metadata, and DELETE unused asset. Completion verifies actual uploaded bytes before marking media usable. Referenced assets return 409 on deletion, accounting for both draft and published usage.

Messages: paginated/filterable GET collection/detail and PATCH status (`NEW`, `READ`, `REPLIED`, `ARCHIVED`). Settings: GET and validated PATCH. Users: paginated GET, POST create, PATCH profile/roles/disabled state. Audit: paginated/filterable GET. Dashboard: GET aggregate counts. Fixed roles are returned from a read endpoint; arbitrary permission editing is outside V1.

## Errors and authorization

Errors contain `code`, safe `message`, `fieldErrors`, UTC `timestamp`, and `traceId`. Use 400 for invalid input, 401 for unauthenticated access, 403 for forbidden access/CSRF failure, 404 for missing resources, 409 for stale versions or protected references, 413 for oversized uploads, and 429 for throttling. Never expose SQL or stack traces.

EDITOR: pages/services/media. ADMIN: editor capabilities plus messages and ordinary site settings. SUPER_ADMIN: all capabilities, users/roles, audit access, and security-sensitive settings. Authorization is enforced on backend methods and HTTP boundaries. Admin and preview responses use private no-store caching.
