# Specification

## Summary
**Goal:** Ensure the Admin Dashboard always provides a reliable, discoverable “Add Product” action so admins can create multiple products in a row without refreshing, including on long lists and small screens.

**Planned changes:**
- Fix the Admin Dashboard state/UI so the “Add Product” action does not disappear after the first product is created and can reopen the create-product dialog immediately after a successful creation.
- Add an additional, in-context “Add Product” entry point near the product list (including an empty-state action when there are zero products) while keeping the existing top action button.
- Improve small-screen usability by ensuring there is a persistent/discoverable way to add a product when the list is long and the user has scrolled down.

**User-visible outcome:** Admins can add 3+ products consecutively in one session, and can always find an “Add Product” action (including from the empty state and while scrolled on mobile) that reliably opens and closes the create-product dialog for repeated use.
