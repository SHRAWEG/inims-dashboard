# Role-Based Access Control (RBAC)

The project uses a custom RBAC system to manage user permissions and restrict access to certain features and UI elements.

## Core Concepts

### System Roles
Roles are defined in `SystemRole` enum (e.g., `SUPER_ADMIN`, `ADMIN`, `USER`). 
- `SUPER_ADMIN` and `ADMIN` roles typically bypass all permission checks.

### Permissions
Permissions are granular strings (e.g., `masters.create`, `users.view`) assigned to roles or users.

## Frontend Implementation

### `usePermissions` Hook
The `usePermissions` hook is the primary way to check permissions in components.

```tsx
import { usePermissions } from '@/hooks/use-permissions';

const { isAdmin, hasPermission, hasAnyPermission } = usePermissions();

if (hasPermission('masters.create')) {
  // Show create button
}
```

### `PermissionGuard` Component
Use `PermissionGuard` to conditionally render sections of the UI based on permissions.

```tsx
import { PermissionGuard } from '@/components/common/PermissionGuard';

<PermissionGuard permission="users.manage" fallback={<p>No access</p>}>
  <UserManagementSection />
</PermissionGuard>
```

#### Props:
- `permission?: string`: A single permission required.
- `permissions?: string[]`: A list of permissions.
- `requireAll?: boolean`: If true, requires all permissions in the list; otherwise, any one will suffice.
- `fallback?: React.ReactNode`: What to render if the user lacks permissions.

## Backend Integration

The backend uses a `@Permissions` decorator and a `PermissionsGuard` to secure endpoints.

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  @Get()
  @Permissions('users.view')
  findAll() {
    return this.usersService.findAll();
  }
}
```

> [!IMPORTANT]
> Always ensure that frontend permission checks match the backend requirements for a consistent user experience.
