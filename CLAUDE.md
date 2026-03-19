# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Session start:** Always read `progress.md` at the beginning of every session to understand what has been built and what's pending. Update it when features are added or bugs are fixed.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

No test framework is configured — validation happens through build (`next build`).

## Architecture

**Crimson Luna** is a Next.js 16 (App Router) menstrual health app combining cycle tracking with e-commerce. TypeScript throughout, React 19, Tailwind CSS v4, Zustand for state, NextAuth.js v5 (beta) for auth.

### Route Structure

- `/` — Public landing page
- `(authenticated)/` — Route group protected by middleware; contains `dashboard/`, `products/`, `cart/`, `profile/`, `notifications/`
- `/onboarding/` — Multi-step wizard (protected); must be completed before dashboard access
- `/api/auth/[...nextauth]/` — NextAuth handlers
Unauthenticated users hitting protected routes are redirected to `/` via `middleware.ts`.

### Auth

NextAuth v5 with two providers: Google OAuth and demo credentials. JWT session strategy. Auth config lives in `src/lib/auth.ts`. Demo login works without Google credentials configured.

Environment variables needed in `.env.local`:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### State Management (Zustand)

Three stores in `src/stores/`, DB is source of truth (no persist middleware):

- `useUserStore` (`user-store.ts`) — User profile: name, email, cycle parameters (cycle length, period duration, last period date), onboarding completion status
- `useCartStore` (`cart-store.ts`) — Cart items, quantities, subscription toggles, totals
- `useNotificationStore` (`notification-store.ts`) — 10 mock notifications with read/unread state

### Cycle Logic

`src/lib/cycle-utils.ts` handles all menstrual cycle calculations:
- Current cycle day and phase derived from `lastPeriodDate` + `cycleLength` in user store
- Four phases: `menstrual | follicular | ovulation | luteal`
- Generates calendar data with per-day phase assignments
- Phase-specific wellness tips, colors, and icons

### Product Data

Products are stored in the Supabase `products` table (43 products across 7 categories). Server actions in `src/actions/product-actions.ts` handle all queries with server-side filtering, sorting, search, and pagination. Product pages are Server Components that pass fetched data to Client Components. Categories metadata lives in `src/data/categories.ts` (static).

### Styling

Tailwind CSS v4 with custom theme defined in `src/app/globals.css`:
- Primary: `crimson` (#DC143C), `deep-crimson` (#8B0000)
- Accent: `gold` (#D4AF37)
- Background: `dark` (#0D0D0D), `dark-surface` (#1A1A1A), `dark-card` (#242424)
- Text: `warm-white` (#F5F0EB), `warm-white-muted` (#B8B0A8)
- Fonts: Inter (sans-serif), Playfair Display (display/headings)

Path alias `@/*` maps to `src/*`.

### Component Organization

```
src/components/
├── auth/          # SessionProvider wrapper, RootErrorBoundary
├── dashboard/     # CycleCalendar, CyclePhaseCard, cycle-related UI
├── layout/        # Sidebar, Header (used inside authenticated layout)
├── home/          # Landing page sections (Hero, Features, etc.)
├── products/      # ProductGrid, ProductCard, CategoryFilter, Pagination
├── notifications/ # Notification list and items
└── ui/            # Primitive components: Button, Card, Badge, Input
```

The authenticated layout (`src/app/(authenticated)/layout.tsx`) renders Sidebar + Header around all protected pages.
