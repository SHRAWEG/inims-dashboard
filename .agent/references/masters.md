# Masters Feature Guide

The Masters feature handles the management of core system entities used for configuration and data classification across the INIMS platform.

## Folder Structure

```
src/features/masters/
  components/
    master-card.tsx    ← individual entity card
    masters-grid.tsx   ← grid layout for all master entities
  constants.ts         ← definitions of all master entities (title, href, icon, colors)
  index.ts             ← public API (MastersGrid, MASTER_ITEMS)
```

## Adding a New Master Entity

To add a new master entity (e.g., "Disability Types"):

1. Create the new page at `src/app/(dashboard)/disability-types/page.tsx`.
2. Update `src/features/masters/constants.ts` to include the new entity in `MASTER_ITEMS`:

```typescript
{
  title: "Disability Types",
  description: "Manage classification of disability types",
  href: "/masters/disability-types",
  icon: Accessibility, // from lucide-react
  color: "text-amber-600",
  bg: "bg-amber-50",
}
```

3. The new entity will automatically appear on the `/masters` landing page.

## Use Cases

- Providing a central hub for all system configurations.
- Simplifying the sidebar by grouping configuration items under a single "Master" link.
- Maintaining consistent styling for all master entity cards.

## Components

### MastersGrid
The main component used on the `/masters` page. It renders all items defined in `MASTER_ITEMS` in a responsive 4-column grid (on large screens).

### MasterCard
A presentational component that renders an icon, title, description, and link for a specific master entity.
