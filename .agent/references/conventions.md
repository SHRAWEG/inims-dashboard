# Coding Conventions

**File naming:** `kebab-case` always
- Pages: `page.tsx` (Next.js convention)
- Components: `user-form.tsx`, `sector-table.tsx`
- Hooks: `use-auth.ts`, `use-sectors.ts`
- API files: `users.api.ts`, `sectors.api.ts`
- Types: `user.types.ts`, `auth.types.ts`
- Schemas: `user.schema.ts`, `sector.schema.ts`

**Component exports:**
- Pages: always `default export`
- All other components: always `named export`
- Hooks: always `named export`

**Type naming:** `PascalCase` — `User`, `ApiResponse`, `CreateUserDto`

**Schema naming:** `create<Entity>Schema`, `update<Entity>Schema` — e.g. `createUserSchema`

**API object naming:** `<domain>Api` — e.g. `usersApi`, `sectorsApi`

**Hook naming:** `use<Domain>` — e.g. `useUsers`, `useSectors`

**Query key factory — mandatory pattern for every domain:**
```ts
export const sectorKeys = {
  all: ['sectors'] as const,
  lists: () => [...sectorKeys.all, 'list'] as const,
  list: (filters: unknown) => [...sectorKeys.lists(), filters] as const,
  details: () => [...sectorKeys.all, 'detail'] as const,
  detail: (id: string) => [...sectorKeys.details(), id] as const,
};
```

**Route naming:** plural kebab-case matching backend — `/users`, `/msnp-indicators`

**i18n namespace per domain:** one JSON file per domain per locale — `sectors.json`, `users.json`

**TypeScript rules:**
- No `any` — use `unknown` and narrow
- No non-null assertion `!` without a comment explaining why
- All functions have explicit return types
- All props interfaces named `<Component>Props`
