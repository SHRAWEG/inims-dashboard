# INIMS Dashboard Design Patterns

## Page-Based Forms (CRUD)

All primary management entities (Masters, Users, Roles) follow a standardized page-based navigation pattern for Create, Read, Update, and Delete (CRUD) operations. This approach provides a cleaner user experience for complex forms and allows for deep-linking.

### Routing Structure

Entity management routes are organized as follows:

| Route Path | Description | Component Pattern |
| :--- | :--- | :--- |
| `/[feature]` | List view of all records | `[Feature]Table` or `[Feature]List` |
| `/[feature]/create` | Form to create a new record | `[Feature]Form` in `create` mode |
| `/[feature]/[id]` | Detailed view of a specific record | `[Feature]Details` |
| `/[feature]/[id]/update` | Form to edit an existing record | `[Feature]Form` in `update` mode |

## RBAC Enforcement (Permissions)

To maintain a secure dashboard, all user-facing actions (Create, Edit, Delete, View) must be protected using the `PermissionGuard` component. 

### Implementation Pattern

1. **Resource Identification**: Each module corresponds to a backend resource (e.g., `users`, `roles`, `sectors`).
2. **Permission Naming**: Follow the convention `resource:action` (e.g., `users:view`, `roles:create`).
3. **Button Protection**: Wrap actionable components with `PermissionGuard` and set the `fallback` to `null` to hide them if the user lacks the required permission.

### Example: Table Actions
```tsx
<PermissionGuard permissions={["users:update"]} fallback={null}>
  <Button onClick={onEdit}><Edit /></Button>
</PermissionGuard>
```

### Example: Page Header Actions
```tsx
<PageHeader
  actions={
    <PermissionGuard permissions={["users:create"]} fallback={null}>
      <Button onClick={onCreate}><Plus /> Add New</Button>
    </PermissionGuard>
  }
/>
```

## Visual Standards (Masters Parity)

To ensure a unified dashboard experience, follow these visual specifications:

- **Form Container**: `bg-white p-8 rounded-lg shadow-sm border border-slate-200`
- **Field Labels**: `block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2`
- **Spacing**: `space-y-8` for major sections, `grid-cols-2 gap-6` for field pairs.
- **Footer Action Bar**: `pt-8 border-t border-slate-100 flex items-center justify-between`
- **Buttons**:
  - Primary: `px-10 h-11 rounded-md bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20`
  - Ghost/Cancel: `px-6 h-11 rounded-md text-slate-600 font-bold text-sm hover:bg-slate-50`
  - Standard/Secondary: `px-8 h-10 font-bold rounded-md bg-secondary text-white`
- **Status Switches**: `flex items-center justify-between rounded-md border border-slate-100 p-4 bg-slate-50/50`
