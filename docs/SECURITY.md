# Security implementation plan

Status: requirements and design; controls are not yet implemented or tested.

## Identity

Use Spring Security sessions persisted through Spring Session JDBC. Production cookies are Secure, HttpOnly, SameSite=Lax, path `/`, and host-only where possible. Rotate the session at login, invalidate on logout, enforce idle expiration, and revoke sessions when disabling users or changing security-sensitive identity state. Use a Spring-supported adaptive password encoder. No public signup or production default password.

Keep CSRF protection enabled. The frontend fetches a token and sends the specified header on every unsafe request, refreshing after authentication changes. Same-origin API routing is preferred. Any CORS deployment uses explicit origins and credentials, never wildcard credentialed access.

Rate-limit login by normalized username and trusted client IP, with generic failures and safe audit events. Limit contact submissions separately. Only trust forwarded IP headers from the configured reverse proxy. For the initial single backend instance a bounded in-process limiter is acceptable; document restart behavior and revisit shared persistence before horizontal scaling.

## Permissions

Enforce the role matrix in API.md on the backend, including preview, media reads, messages, and audit. Prevent self-lockout and removal/demotion of the last active super-admin. UI visibility is an aid, never an authorization boundary. Session identity must not preserve obsolete permissions after a role change.

## Untrusted content

Validate DTO fields, lengths, URLs, slugs, references, and allowed state transitions. Render restricted rich-text nodes; do not accept arbitrary HTML, scripts, or iframes. Allowlist link protocols. Validate uploaded byte signatures and decode image dimensions with resource limits; MIME headers and filenames alone are insufficient. Start with JPEG/PNG/WebP/AVIF, reject SVG/HTML/executables, use randomized keys, capped upload size, and staging keys until verification completes. Never expose R2 credentials to the browser.

Verify Turnstile server-side with configured hostname/action expectations and timeouts; fail closed on unavailable/invalid verification. Development testing must use an explicit isolated configuration, never a production bypass.

## Browser and operational controls

Use a CSP with per-response nonces where framework scripts require them; avoid broad unsafe-inline. Allow only configured media and Turnstile origins. Include frame-ancestors, nosniff, restrictive referrer and permissions policies, and HSTS in production after HTTPS configuration. Preview/admin use no-store and noindex. Public APIs expose published fields only.

Secrets stay outside git and public environment variables. Logs exclude passwords, tokens, cookies, and message bodies. Return safe errors with trace IDs. Audit login success/failure, logout, page/service writes and publication, media mutation, settings changes, and user mutation. Public Actuator exposure is limited to safe health status. Backups are private with separate least-privilege credentials.
