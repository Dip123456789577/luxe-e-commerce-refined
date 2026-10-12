# LUXE storefront

Build the requested LUXE shopping experience as a polished, responsive storefront with warm editorial styling and real interactions.

## User-facing work
- Replace the starter page with a branded homepage, product catalog, product details, cart, checkout, order confirmation, wishlist, login/signup, account history, and About, Contact, FAQ, and not-found views.
- Add realistic product content and imagery, responsive navigation, search/filter/sort, size and color selections, cart quantities, wishlist actions, coupon validation, form validation, and clear demo-only order handling.
- Keep cart, wishlist, and demo account/order state available between visits without implying payment was processed.

## Technical approach
- Use separate TanStack routes with shared browser-safe product and persisted storefront state modules.
- Define the premium editorial visual language with semantic tokens in `src/styles.css`; keep interactive controls accessible and use the existing UI conventions.
- Give each content route unique metadata, and verify the shopping flow, key controls, responsive rendering, tests, and preview diagnostics.