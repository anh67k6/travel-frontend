# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup
- Install dependencies: `npm install`

## Common commands
- Start dev server (Vite, port 5173): `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Type-check: `npm run typecheck`
- Run tests: `npm run test`
- Run a single test file: `npx vitest run src/lib/smoke.test.ts`

Notes:
- There is currently no lint script in `package.json`.
- API base URL is controlled by `VITE_API_BASE_URL`; default is `http://localhost:8080`.

## High-level architecture
- Stack: Vite + React 18 + TypeScript, React Router, TanStack Query.
- App bootstrapping lives in `src/main.tsx`: creates one `QueryClient`, wraps app in `QueryClientProvider`, and mounts `RouterProvider`.
- Route definitions are centralized in `src/app/router.tsx`:
  - `/login` and `/register` for auth
  - `/` for trip list
  - `/trips/:tripId` for trip detail workspace

## Data and state flow
- `src/pages/*` is the orchestration layer:
  - Performs data fetching/mutations with React Query
  - Handles route-level auth redirects (`Navigate` to `/login` when unauthenticated)
  - Coordinates feature forms and cache invalidation
- `src/features/*` contains form-focused UI units (`AuthForm`, `TripForm`, `ParticipantForm`, `TodoForm`, `ExpenseForm`, `ImageUploadForm`) that emit typed payloads upward via callbacks.

## API/auth boundaries
- `src/lib/api.ts` is the shared HTTP client:
  - Wraps `fetch` for `get/post/patch/delete`
  - Adds `Authorization: Bearer <token>` when `auth_token` exists in `localStorage`
  - Throws response text for non-2xx responses
- `src/lib/auth.ts` manages local auth persistence (`auth_token`, `auth_email`) and exposes `saveAuth`, `logout`, `getAuthEmail`, `isAuthenticated`.
- `src/lib/types.ts` defines core API/domain shapes used across pages and features.

## Query and mutation patterns
- Query keys are resource-scoped (`["trips"]`, `["trip", tripId]`, `["participants", tripId]`, etc.).
- Mutations generally refresh UI by invalidating related query keys instead of manually mutating cache.
- In `TripDetailPage`, image upload is a 3-step flow:
  1. Request presigned upload URL (`POST /api/trips/:tripId/images/presign`)
  2. Upload file directly via `PUT` to the presigned URL
  3. Finalize metadata (`POST /api/trips/:tripId/images/complete`)
