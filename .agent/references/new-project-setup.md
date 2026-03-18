# New Project Setup

## New project setup checklist

### Step 1 — Scaffold
- [ ] npx create-next-app@latest <project-name> --typescript --tailwind --app --src-dir --import-alias "@/*"
- [ ] Install all dependencies from references/dependencies.md
- [ ] npx shadcn@latest init — select: style Default, base color Neutral, CSS variables yes
- [ ] Add shadcn components: npx shadcn@latest add button input form table dialog alert-dialog dropdown-menu tabs badge skeleton toast card separator sheet switch

### Step 2 — Design system
- [ ] Replace globals.css with full design token CSS variables from references/design-system.md
- [ ] Update tailwind.config.ts with design token mappings
- [ ] Verify primary crimson color appears correctly on a test button

### Step 3 — Environment
- [ ] Create .env.local from .env.example
- [ ] Set NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
- [ ] Set API_URL=http://localhost:3000/api/v1
- [ ] Verify .env.local is in .gitignore — never commit

### Step 4 — Core infrastructure
- [ ] src/types/ — api.types.ts, auth.types.ts, i18n.types.ts
- [ ] src/lib/utils/cn.ts, error.ts, format.ts
- [ ] src/lib/api/client.ts — axios instance with interceptors
- [ ] src/lib/api/endpoints.ts — empty registry to fill per domain
- [ ] src/lib/auth/session.ts, refresh.ts
- [ ] src/middleware.ts
- [ ] src/i18n/config.ts + locale files (en/common.json, ne/common.json)
- [ ] src/providers/ — query-provider.tsx, auth-provider.tsx, i18n-provider.tsx
- [ ] src/app/layout.tsx — wrap with all providers in correct order:
      I18nProvider → QueryProvider → AuthProvider → {children}

### Step 5 — Layout shell
- [ ] src/components/layout/sidebar.tsx — dark bg, crimson active highlight
- [ ] src/components/layout/topbar.tsx — locale switcher, user menu
- [ ] src/app/(dashboard)/layout.tsx — sidebar + topbar + main content area
- [ ] src/app/(auth)/layout.tsx — centered card layout
- [ ] src/components/common/page-header.tsx
- [ ] src/components/common/status-badge.tsx
- [ ] src/components/common/empty-state.tsx
- [ ] src/components/common/error-state.tsx
- [ ] src/components/common/confirm-dialog.tsx
- [ ] src/components/common/data-table/ — full DataTable implementation

### Step 6 — Auth
- [ ] src/app/api/auth/login/route.ts
- [ ] src/app/api/auth/logout/route.ts
- [ ] src/app/api/auth/refresh/route.ts
- [ ] src/app/(auth)/login/page.tsx
- [ ] src/hooks/use-auth.ts
- [ ] src/lib/api/users.api.ts (getMe function)
- [ ] Test: login sets cookies, redirect works, middleware blocks unauthenticated access

### Step 7 — Home page
- [ ] src/app/(dashboard)/home/page.tsx — simple welcome page
- [ ] Verify locale switcher works — UI updates to Nepali and back
- [ ] Verify logout clears cookies and redirects to login

### Step 8 — Domain modules
For each domain follow references/new-module-checklist.md exactly
