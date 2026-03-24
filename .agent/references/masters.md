# Managing Master Entities (Configuration)

Master entities (e.g., Sectors, Indicators, Types) are managed using a modular architecture to ensure type safety, granular validation, and a clean separation of concerns.

## Modular Structure

Each master entity is defined within `src/features/masters` with its own specialized components, types, and schemas:

- `src/features/masters/types/[master-name].ts`: Type definitions for the master.
- `src/features/masters/schemas/[master-name].schema.ts`: Zod validation schemas.
- `src/features/masters/components/columns/[master-name]-columns.tsx`: Specialized column definitions for the data table.

## `MasterRecordTable` Component

The `MasterRecordTable` is the central component for listing master records. It should be used in the page component as follows:

```tsx
import { MasterRecordTable } from "@/features/masters";
import { getSpecificColumns } from "@/features/masters/components/columns/specific-columns";

export default function MastersPage() {
  return (
    <MasterRecordTable 
      title="master_title" 
      endpoint="/api/v1/masters/specific" 
      basePath="/masters/specific" 
      columns={(handlers) => getSpecificColumns(handlers)}
    />
  );
}
```

## i18n for Masters

User-facing strings for masters (titles, column headers, form labels) are managed in `src/i18n/locales/[locale]/masters.json`.

- Use the `t('masters:...')` function from `react-i18next` to fetch translated strings.
- Key structure: `masters.[title].title`, `masters.[title].columns.[column_name]`, etc.

## Conventions

- Always use specialized Zod schemas for forms to ensure data integrity.
- Use `getCommonColumns` for standard masters and create specialized column functions for those with complex rendering requirements.
- Ensure that the `basePath` and `endpoint` match the backend routes.
- Use the dedicated Create and Update pages for each master instead of modals.
