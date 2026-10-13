# LUXE Atelier — Ultra-Premium E-Commerce Experience

A minimalist, editorial luxury e-commerce platform built with modern web technologies, refined typography, and seamless shopping interactions.

## Brand Identity & Aesthetic Direction

- **Palette**: Warm Ivory (`#F8F7F3`), Deep Noir (`#171717`), Soft Gray (`#777777`), Muted Champagne Gold (`#C6A879`).
- **Typography**: Editorial Serif (`Cormorant Garamond`) paired with crisp Modern Geometric Sans (`DM Sans`).
- **Design Principles**: Architectural layout, generous whitespace, restrained micro-interactions, responsive mobile fluidity, and accessible UI components.

## Architecture & Technology Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with file-based TanStack Router
- **Build System**: [Vite](https://vite.dev) & [Nitro](https://nitro.unjs.io)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with custom tokens and typography utilities
- **Components**: Radix UI primitives & Lucide Icons
- **State Management**: Browser-safe persistent shopping state (Bag, Wishlist, Order History, Customer Profile) via localStorage
- **Testing**: Vitest with React Testing Library

## Features

- **Editorial Homepage**: Hero showcase, category curation, iconic bestsellers, atelier storytelling, client accolades, and newsletter subscription.
- **Curated Catalog (`/shop`)**: Multi-category filtering, live search, sorting by price and rating, and view mode controls.
- **Product Details (`/product/:slug`)**: Multi-angle gallery, size & fit guide, colorway selectors, stock status, and add-to-bag drawers.
- **Shopping Bag & Quick Drawer (`/cart`)**: Real-time quantity adjustments, promotional coupon codes (`WELCOME10`, `LUXE20`), complimentary shipping progress, and gift options.
- **Simulated Luxury Checkout (`/checkout`)**: Multi-step checkout with form validation, express courier selection, demo payment simulation, and order confirmation (`/order-confirmation/:orderId`).
- **Wishlist (`/wishlist`)**: Persistent favorites collection with quick add-to-bag capabilities.
- **Client Portal (`/account`)**: Customer profile, tier status (_Luxe Privé_), demo order history tracking, and saved address book.
- **Concierge & Atelier Pages**: Story (`/about`), Client Service Concierge (`/contact`), and Knowledge Base (`/faq`).

## Local Development

```sh
npm install
npm run dev
```

### Verification & Testing

```sh
npm test       # Run Vitest test suite
npm run lint   # Run ESLint checks
npm run build  # Production build with Vite & Nitro
```
