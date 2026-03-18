# New Module Checklist

For every new domain module (e.g. sectors, users, msnp-indicators):

### Step 1 — Types
- [ ] Create src/types/<domain>.types.ts
- [ ] Define entity interface matching backend ResponseDto exactly
- [ ] Define CreateDto and UpdateDto interfaces

### Step 2 — API layer
- [ ] Add endpoints to src/lib/api/endpoints.ts
- [ ] Create src/lib/api/<domain>.api.ts following the pattern in api-client.md
- [ ] All functions explicitly typed — no inferred return types

### Step 3 — Validation
- [ ] Create src/lib/validations/<domain>.schema.ts
- [ ] create<Entity>Schema — both en and ne name fields required
- [ ] update<Entity>Schema — all fields optional
- [ ] Export FormValues types derived from schemas

### Step 4 — Hook
- [ ] Create src/hooks/use-<domain>.ts
- [ ] Define query key factory at top of file
- [ ] useQuery for list with pagination + search + locale in query key
- [ ] useQuery for single item
- [ ] useMutation for create — invalidates list on success
- [ ] useMutation for update — invalidates list and detail on success
- [ ] useMutation for delete — invalidates list on success

### Step 5 — Components
- [ ] src/components/<domain>/<domain>-columns.tsx — as a hook (useSectorColumns)
- [ ] src/components/<domain>/<domain>-table.tsx — full table with toolbar and sheet
- [ ] src/components/<domain>/<domain>-form.tsx — RHF form with bilingual tabs
- [ ] src/components/<domain>/<domain>-form.tsx — custom hook for columns maybe? (The prompt had useSectorColumns here)
- [ ] src/components/<domain>/<domain>-actions.tsx — edit sheet + delete confirm

### Step 6 — Page
- [ ] src/app/(dashboard)/<domain>/page.tsx
  - PageHeader with title and add button
  - <Domain>Table component
- [ ] Add route to sidebar navigation

### Step 7 — i18n
- [ ] Add src/i18n/locales/en/<domain>.json
- [ ] Add src/i18n/locales/ne/<domain>.json
- [ ] Both files must have identical keys
- [ ] Add common strings to common.json if any are missing

### Step 8 — Verify
- [ ] List loads with correct data in both en and ne locale
- [ ] Search works — filters results correctly
- [ ] Create form validates — both name fields required
- [ ] Create submits — list refreshes, toast appears
- [ ] Edit pre-fills both locale tabs correctly
- [ ] Update submits — list refreshes
- [ ] Delete shows confirm dialog — deletes on confirm, shows error if referenced
- [ ] Locale switch — table data refetches in new locale automatically
