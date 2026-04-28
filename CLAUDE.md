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
- App bootstrapping lives in `src/main.tsx`: creates one `QueryClient`, wraps app in `QueryClientProvider` and `AuthProvider`, and mounts `RouterProvider`.
- Route definitions are centralized in `src/app/router.tsx`:
  - `/login` and `/register` for auth
  - `/` for trip list
  - `/trips/:tripId` for trip detail workspace

## Project structure standards
- Use alias imports with `@/*` (maps to `src/*`) instead of deep relative paths.
- Route/page modules live under `src/components/*Page` folders:
  - `src/components/LoginPage/LoginPage.tsx` + `src/components/LoginPage/index.tsx`
  - `src/components/RegisterPage/RegisterPage.tsx` + `src/components/RegisterPage/index.tsx`
  - `src/components/TripListPage/TripListPage.tsx` + `src/components/TripListPage/index.tsx`
  - `src/components/TripDetailPage/TripDetailPage.tsx` + `src/components/TripDetailPage/index.tsx`
- Page-specific UI must be top-level shared components under `src/components/<ViewName>/<ViewName>.tsx` (no nested `components/` folder inside `*Page` folders):
  - `src/components/LoginView/LoginView.tsx`
  - `src/components/RegisterView/RegisterView.tsx`
  - `src/components/TripListView/TripListView.tsx`
  - `src/components/TripDetailView/TripDetailView.tsx`
- Shared UI/form units use folders named the same as their main component file:
  - `src/components/AuthForm/AuthForm.tsx`
  - `src/components/TripForm/TripForm.tsx`
  - `src/components/ParticipantForm/ParticipantForm.tsx`
  - `src/components/TodoForm/TodoForm.tsx`
  - `src/components/ExpenseForm/ExpenseForm.tsx`
  - `src/components/ImageUploadForm/ImageUploadForm.tsx`
- All logic hooks are centralized under `src/hooks`.
  - Page hooks pattern: `src/hooks/<PageName>/use<PageName>.ts`.
  - Shared component hooks pattern: `src/hooks/<ComponentName>/use<ComponentName>.ts` (for example `src/hooks/AuthForm/useAuthForm.ts`).

## Data and state flow
- `src/components/*Page/*` is the route orchestration layer:
  - Performs data fetching/mutations with React Query
  - Handles route-level auth redirects (`Navigate` to `/login` when unauthenticated)
  - Coordinates shared component forms and cache invalidation
- Shared presentational/form units in `src/components/*` emit typed payloads upward via callbacks.
- `src/hooks/*` contains state/business logic hooks that page or shared UI components consume.
- Each component folder must include an `index.tsx` barrel file so imports use `@/components/<FolderName>` instead of deep file paths.

## API/auth boundaries
- `src/lib/api.ts` is the shared HTTP client:
  - Wraps `fetch` for `get/post/patch/delete`
  - Adds `Authorization: Bearer <token>` when `auth_token` exists in `localStorage`
  - Throws response text for non-2xx responses
- `src/context/AuthContext.tsx` is the shared auth state source for app-wide user/session access.
- `src/lib/auth.ts` manages local auth persistence (`auth_token`, `auth_email`, `auth_user_id`) and exposes `saveAuth`, `clearAuth`, `getStoredAuthUser`, `isAuthenticated`.
- `src/lib/types.ts` defines core API/domain shapes used across page modules and shared components.

## Query and mutation patterns
- Query keys are resource-scoped (`["trips"]`, `["trip", tripId]`, `["participants", tripId]`, etc.).
- Mutations generally refresh UI by invalidating related query keys instead of manually mutating cache.
- In `TripDetailPage`, image upload is a 3-step flow:
  1. Request presigned upload URL (`POST /api/trips/:tripId/images/presign`)
  2. Upload file directly via `PUT` to the presigned URL
  3. Finalize metadata (`POST /api/trips/:tripId/images/complete`)
