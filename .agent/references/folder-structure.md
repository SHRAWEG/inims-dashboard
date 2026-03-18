# Folder Structure

```
src/
  app/
    (auth)/
      login/page.tsx
      layout.tsx                  ← minimal layout, centered card
    (dashboard)/
      layout.tsx                  ← sidebar + topbar shell
      page.tsx                    ← redirects to /home
      home/page.tsx
      users/
        page.tsx                  ← list with DataTable
        [id]/page.tsx             ← detail / edit
      <domain>/
        page.tsx
        [id]/page.tsx
    api/
      auth/
        login/route.ts
        logout/route.ts
        refresh/route.ts
    layout.tsx                    ← root layout, all providers
    globals.css
    not-found.tsx
    error.tsx

  components/
    ui/                           ← shadcn/ui auto-generated, never edit manually
    layout/
      sidebar.tsx
      sidebar-nav-item.tsx
      topbar.tsx
      locale-switcher.tsx
      user-menu.tsx
    common/
      page-header.tsx
      status-badge.tsx
      confirm-dialog.tsx
      loading-spinner.tsx
      empty-state.tsx
      error-state.tsx
      data-table/
        data-table.tsx
        data-table-toolbar.tsx
        data-table-column-header.tsx
        data-table-pagination.tsx
      charts/
        line-chart.tsx
        bar-chart.tsx
        pie-chart.tsx
        chart-skeleton.tsx
        chart-empty.tsx
    <domain>/
      <domain>-columns.tsx        ← TanStack column definitions
      <domain>-table.tsx          ← DataTable wrapper with toolbar
      <domain>-form.tsx           ← RHF + Zod form
      <domain>-actions.tsx        ← row action dropdown

  hooks/
    use-auth.ts
    use-locale.ts
    use-<domain>.ts               ← queries + mutations per domain

  lib/
    api/
      client.ts                   ← axios instance
      endpoints.ts                ← all endpoint strings
      <domain>.api.ts             ← API functions per domain
    auth/
      session.ts
      refresh.ts
    utils/
      cn.ts                       ← shadcn className merger
      format.ts                   ← date, number formatters
      error.ts                    ← parseApiError, mapValidationErrors
    validations/
      <domain>.schema.ts          ← Zod schemas

  providers/
    query-provider.tsx
    auth-provider.tsx
    i18n-provider.tsx

  middleware.ts
  
  i18n/
    config.ts
    locales/
      en/
        common.json
        auth.json
        <domain>.json
      ne/
        common.json
        auth.json
        <domain>.json

  types/
    api.types.ts                  ← ApiResponse<T>, PaginatedResponse<T>
    auth.types.ts                 ← User, UserRole, Session
    i18n.types.ts                 ← SupportedLocale, LocalizedField
    <domain>.types.ts
```

### Folder rules
- `components/ui/` — never edit, only add via `npx shadcn@latest add`
- `components/common/` — only truly shared components used in 3+ domains
- `components/<domain>/` — domain-specific, never imported by other domains
- `hooks/` — only custom hooks, never utility functions
- `lib/api/` — pure API functions only, no React, no hooks
- `lib/validations/` — Zod schemas only, no other logic
