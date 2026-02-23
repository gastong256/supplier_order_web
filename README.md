# Supplier Order Web

A scalable, production-ready React SPA template built with Vite, TypeScript, and Tailwind CSS.

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI library |
| Vite | 6 | Build tool & dev server |
| TypeScript | 5.7 (strict) | Type safety |
| Tailwind CSS | 4 | Styling (CSS-first, no config file) |
| React Router | 7 | Client-side routing |
| Zustand | 5 | Client state management |
| TanStack Query | 5 | Server state & caching |
| React Hook Form + Zod | latest | Form handling & validation |
| Axios | latest | HTTP client |
| Vitest + RTL | latest | Unit testing |
| ESLint v9 + Prettier | latest | Linting & formatting |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local

# 3. Start the dev server
npm run dev          # http://localhost:3000
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Type-check + production build
npm run preview      # Preview production build locally

npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format all src files with Prettier
npm run format:check # Check formatting without writing

npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
```

## Project Structure

```
src/
├── assets/                    # Static assets (images, fonts, etc.)
├── components/
│   └── ui/                    # Reusable primitive components
│       ├── Button.tsx          # 6 variants, 4 sizes, isLoading state
│       ├── Input.tsx           # With label, error, and helperText
│       └── index.ts            # Barrel export
├── config/
│   └── env.ts                 # Centralized environment variable access
├── features/                  # Feature-based modules
│   └── auth/                  # Example — copy this for new features
│       ├── api/               # API call functions (no hooks, pure async)
│       ├── components/        # Feature-specific components
│       ├── hooks/             # TanStack Query mutations/queries
│       ├── pages/             # Route-level page components
│       ├── schemas/           # Zod validation schemas
│       ├── store/             # Feature-scoped Zustand store
│       └── types/             # TypeScript types & interfaces
├── hooks/                     # Shared custom hooks
│   └── useTheme.ts            # Syncs theme state → HTML [data-theme] attr
├── lib/
│   ├── axios.ts               # Axios instance + request/response interceptors
│   ├── queryClient.ts         # TanStack Query client configuration
│   └── utils.ts               # cn() utility (clsx + tailwind-merge)
├── pages/                     # Shared/global pages
│   └── NotFoundPage.tsx
├── providers/
│   └── AppProviders.tsx       # Composes all React context providers
├── router/
│   ├── ProtectedRoute.tsx     # Auth guard using Zustand auth store
│   └── router.tsx             # createBrowserRouter configuration
├── store/
│   └── index.ts               # Global Zustand store (theme, globalLoading)
├── styles/
│   └── globals.css            # Tailwind v4 @theme tokens + dark mode
├── test/
│   └── setup.ts               # Vitest global setup (@testing-library/jest-dom)
├── types/
│   └── index.ts               # Shared TypeScript types (ApiResponse, etc.)
└── main.tsx                   # Application entry point
```

## Adding a New Feature

All features follow the same structure. Copy `src/features/auth/` as a starting point:

```
src/features/my-feature/
├── api/          # myFeatureApi.ts — pure async functions using apiClient
├── components/   # UI components scoped to this feature
├── hooks/        # useMutation / useQuery hooks wrapping the API
├── pages/        # Page-level components registered in the router
├── schemas/      # Zod schemas (one per form or data shape)
├── store/        # Zustand store (only if the feature needs client state)
└── types/        # TypeScript interfaces for this feature's domain
```

Then register the page in [src/router/router.tsx](src/router/router.tsx).

## Environment Variables

All variables must be prefixed with `VITE_` to be accessible in the browser.

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (no trailing slash) |
| `VITE_APP_TITLE` | Application title for the browser tab |
| `VITE_ENABLE_DEVTOOLS` | `true` to show React Query Devtools in dev mode |

Never read `import.meta.env` directly. Use [src/config/env.ts](src/config/env.ts) instead.

## Dark Mode

Dark mode is handled via CSS variables defined in [src/styles/globals.css](src/styles/globals.css).

- **System preference**: automatic (via `prefers-color-scheme` media query)
- **Manual toggle**: use the `useTheme` hook to set `'light'`, `'dark'`, or `'system'`

```tsx
import { useTheme } from '@/hooks/useTheme'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  )
}
```

## Path Aliases

The `@/` alias maps to `src/`. It is configured in both `vite.config.ts` and `tsconfig.app.json`.

```ts
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/features/auth/store/authStore'
```

## State Management

| State type | Tool | Location |
|-----------|------|---------|
| Global UI (theme, loading) | Zustand | `src/store/index.ts` |
| Feature client state (auth) | Zustand + `persist` | `src/features/*/store/` |
| Server / async data | TanStack Query | `src/features/*/hooks/` |

## HTTP Client

The Axios instance in [src/lib/axios.ts](src/lib/axios.ts) handles:

- Attaches `Authorization: Bearer <token>` from `localStorage` on every request
- Clears credentials and redirects to `/login` on `401` responses

All feature API modules import from `@/lib/axios`, never from `axios` directly.
