# Crimson Luna — Progress Tracker

## Project Overview

**Crimson Luna** is a menstrual health app combining cycle tracking with e-commerce. Built with Next.js 16, TypeScript, React 19, Tailwind CSS v4, Zustand, NextAuth.js v5, and Supabase. Deployed on Vercel at `crimson-luna.vercel.app`.

---

## Completed Features

### 1. Authentication System
- [x] NextAuth v5 (beta) with JWT session strategy
- [x] Google OAuth provider (with forced account picker)
- [x] Demo credentials provider (hardcoded `demo-user-1`)
- [x] Edge-safe middleware (`middleware.ts` — never imports Supabase at top level)
- [x] Protected route group `(authenticated)/` with automatic redirect to `/`
- [x] Demo user cleanup on sign-out (profile + cascade delete cart & notifications)
- [x] Google user data persists across sign-out/sign-in
- [x] `ensureUserProfile()` — ID-first lookup with email fallback + row migration

### 2. Onboarding Flow
- [x] 4-step wizard: age, cycle length, period duration, last period date
- [x] Input validation with inline error messages
- [x] Progress indicator (step bars)
- [x] localStorage draft saving (survives page refresh)
- [x] Server-side redirect if not onboarded (no flash)
- [x] Hard navigate on completion (`window.location.href`) to bypass Router Cache
- [x] Blocks submission if session user ID is missing

### 3. Cycle Tracking Dashboard
- [x] 4-phase cycle model: menstrual, follicular, ovulation, luteal
- [x] Interactive month calendar with day-of-cycle labels and phase color coding
- [x] Month navigation (prev/next)
- [x] Today indicator with ring highlight
- [x] Current phase card with description and wellness tips
- [x] Countdown to next period
- [x] Phase-specific insights panel
- [x] Skeleton loading states

### 4. Product E-Commerce (Database-Backed)
- [x] 43 products stored in Supabase `products` table across 7 categories
- [x] Server-side filtering, sorting, search, and pagination (12 per page)
- [x] Product pages are Server Components passing data to Client Components
- [x] URL-driven state for search/sort/page (bookmarkable, back button works)
- [x] Category-filtered routes (`/products/[category]`)
- [x] Debounced search by name/description (server-side `ilike` query)
- [x] Sort: default, price asc/desc, rating, name (DB `ORDER BY`)
- [x] Pagination with Previous/Next controls
- [x] Subscription toggle per item (10-15% savings)
- [x] Product cards with image, price, rating, tags, and add-to-cart
- [x] Static category metadata in `src/data/categories.ts`

### 5. Shopping Cart
- [x] Add/remove items with optimistic UI ("Added!" feedback)
- [x] Quantity adjustment (auto-delete at 0)
- [x] Subscription toggle per item
- [x] Order summary: subtotal, subscription savings, free shipping, total
- [x] Clear cart
- [x] Cart badge in sidebar navigation
- [x] Cart fetches product data via Supabase join (`cart_items` + `products`)
- [x] Placeholder checkout button ("Coming soon")

### 6. Notifications
- [x] 10 mock notifications seeded on first access per user
- [x] 4 notification types: cycle, supply, wellness, promo
- [x] Read/unread state with unread count badge
- [x] Mark single as read / mark all as read
- [x] Relative timestamps ("2 hours ago")
- [x] Type-colored badges

### 7. User Profile
- [x] Editable cycle settings (cycle length, period duration, last period date, age)
- [x] Account info display (avatar from Google or fallback, name, email)
- [x] Save with success feedback ("Saved!" for 2 seconds)
- [x] Client-side validation with error display

### 8. Landing Page
- [x] Hero section with moon phases visual and sign-in CTAs
- [x] Features showcase section
- [x] User testimonials section
- [x] Call-to-action section
- [x] Footer

### 9. Layout & Navigation
- [x] Responsive authenticated layout (sidebar + header on desktop, mobile nav on mobile)
- [x] Sidebar: Dashboard, Products, Cart (with badge), Notifications, Profile
- [x] Header: user greeting, notification bell with unread badge, user menu
- [x] Mobile dropdown navigation
- [x] Sticky header with backdrop blur
- [x] Suspense streaming: shell renders instantly, data streams in via `AuthDataProvider`

### 10. Database (Supabase)
- [x] `user_profiles` table (no UNIQUE constraint on email — intentional)
- [x] `products` table with 43 seeded products, 7 categories, CHECK constraint on category
- [x] `cart_items` table with UNIQUE(user_id, product_id) and FK to `products`
- [x] `notifications` table with user-scoped IDs
- [x] ON DELETE CASCADE for all foreign keys
- [x] Server actions for all CRUD operations (fire-and-forget pattern)
- [x] Lazy Supabase client with `cache: "no-store"`

### 11. State Management
- [x] Three Zustand stores: user, cart, notifications
- [x] No persist middleware — DB is single source of truth
- [x] `DataInitializer` component hydrates stores from server-fetched data in `useEffect`
- [x] Optimistic UI updates with fire-and-forget server actions

### 12. UI Component Library
- [x] Button (4 variants: primary, secondary, outline, ghost; 3 sizes)
- [x] Card (with optional hover effect)
- [x] Badge (4 variants: crimson, gold, plum, default)
- [x] Input (with error display)
- [x] Logo component
- [x] Pagination component (Previous/Next with page indicator)

### 13. Security Hardening
- [x] Auth checks on all cart server actions (verify session user matches userId param)
- [x] Auth checks on all notification server actions (verify session + notification ownership)
- [x] Product validation in `addCartItem` — validates product ID exists in DB
- [x] Optimistic update rollback on server action failure in all Zustand stores (cart, user, notification)
- [x] Error state exposed in stores (`error` + `clearError`) with UI banners in cart and profile pages

### 14. Performance Optimizations
- [x] Suspense streaming in authenticated layout — sidebar/header render instantly, content streams
- [x] `AuthDataProvider` (async Server Component) wraps data fetching in `<Suspense>` boundary
- [x] Server-side product pagination — only 12 products per page, not all 43
- [x] Debounced search input (300ms) to avoid excessive server requests
- [x] `useTransition` for non-blocking URL updates on search/sort/page changes
- [x] Removed Amazon image proxy (was scraping full HTML pages per product)

---

## Bugs Fixed (Chronological)

| Commit | Issue | Fix |
|--------|-------|-----|
| `ad894ca` | Onboarding redirect loop on Vercel | Deployment config fixes |
| `66eb2da` | Demo user reset, onboarding redirect, Google callback issues | Multi-fix for auth flows |
| `d95af46` | Edge Runtime crash — top-level Supabase import in auth.ts | Dynamic `import()` for Supabase in callbacks |
| `7ee5e4d` | Demo user deletion firing on sign-in | Removed deletion on sign-in |
| `4785b34` | Demo user data lingering after sign-out | Added Supabase cleanup on sign-out |
| `6dc2d62` | Google account picker not shown | Added `prompt: "select_account"` to Google provider |
| `39d7881` | Onboarding redirect loop (persistent) | Error handling + prevent silent failures in layout |
| `e14ec44` | Google user profile deleted on sign-out | Scoped deletion to demo user only |
| `b1c9c13` | Duplicate email constraint error on returning user sign-in | Dropped UNIQUE on email, added email fallback lookup |
| `0afb96a` | Duplicate email constraint error in onboarding | `completeOnboarding` uses UPDATE-first, fallback INSERT |
| `67aac39` | Returning users forced into onboarding | Email fallback lookup + row migration in `ensureUserProfile` |
| `2735d2d` | Demo user data not cleaned up | Added `cleanupDemoUser()` with cascade delete |

---

## Architecture Decisions

1. **DB as source of truth** — Zustand stores have no persist middleware; server hydrates on every page load
2. **Optimistic updates** — UI updates immediately, server actions fire without await
3. **Edge Runtime safety** — `auth.ts` never imports Supabase at top level (dynamic import only)
4. **Email fallback lookup** — Handles OAuth session ID changes across logins
5. **No UNIQUE on email** — Prevents constraint errors when session IDs change
6. **Hard navigation after onboarding** — `window.location.href` bypasses Next.js Router Cache
7. **Suspense streaming** — Layout shell renders instantly; data fetching wrapped in `<Suspense>` via `AuthDataProvider`
8. **Server-side product queries** — DB handles filtering, sorting, search, pagination (not client-side JS)
9. **URL-driven product state** — Search/sort/page params in URL, not React state; shareable and back-button friendly
10. **Products in DB** — Proper `products` table with FK from `cart_items`; replaces static TypeScript array

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 |
| Auth | NextAuth.js v5 (beta) |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge, date-fns |
| Deployment | Vercel |

---

## Pending: Run SQL seed

**IMPORTANT:** The `products` table must be created and seeded in Supabase before the product pages work. Run `supabase-seed.sql` (in project root) in the Supabase SQL Editor. This creates the table, seeds 43 products, and adds the FK from `cart_items`.

---

## What's Next

- [ ] Checkout flow (payment integration or order placement)
- [ ] Product image hosting (replace Amazon CDN URLs with self-hosted images)
- [ ] Admin panel for product management (add/edit/remove products, update stock)
- [ ] Real-time cycle logging (log symptoms, moods, flow intensity per day)
- [ ] Push notifications / reminders (period approaching, take supplements)
- [ ] Community / social features
- [ ] Health insights / analytics over multiple cycles
- [ ] Wishlist / favorites for products
- [ ] Order history tracking
- [ ] Dark/light theme toggle
- [ ] Accessibility audit (ARIA labels, keyboard navigation, screen reader support)
- [ ] Unit and integration tests (Jest / Playwright)
- [ ] PWA support (offline, installable)
