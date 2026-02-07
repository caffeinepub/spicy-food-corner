# Specification

## Summary
**Goal:** Make Admin Panel login work reliably end-to-end using custom backend authentication and a token-based admin session.

**Planned changes:**
- Fix the /admin/login flow so the exact admin credentials (username "foodram corner", password "ram4792sa") successfully authenticate and route to /admin/dashboard, while incorrect credentials show a clear error.
- Add backend (Motoko) admin authentication endpoints: one to login with username/password and return a session token, and another to validate an admin token without requiring Internet Identity.
- Update frontend admin session handling to store the backend-issued token in sessionStorage, use token validation for admin route guarding, persist session across refresh (within the browser session), and support logout by clearing the token.
- Ensure admin-only product create/update/delete operations are authorized via the admin session token, with graceful failures and UI messaging when unauthenticated/invalid, while keeping customer browsing public.

**User-visible outcome:** Admin can log in with the provided username/password, stay logged in during the browser session, access /admin/dashboard and other /admin/* pages, and successfully create/update/delete products; non-admin users cannot perform admin actions and see clear errors.
