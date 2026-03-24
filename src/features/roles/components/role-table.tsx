"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getRoleColumns } from "./role-columns";
import { useRoles, useDeleteRole } from "../hooks/use-roles";
import { Role } from "../types/role.types";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PermissionGuard } from "@/components/common/PermissionGuard";

export function RoleTable() {
  const { t } = useTranslation(["common", "roles"]);
  const router = useRouter();
  const { data: roles = [], isLoading } = useRoles();
  const { mutateAsync: deleteRole } = useDeleteRole();

  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const columns = getRoleColumns({
    onView: (id) => router.push(`/roles/${id}`),
    onEdit: (id) => router.push(`/roles/${id}/update`),
    onDelete: (role) => setRoleToDelete(role),
    t,
  });

  const handleDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete.id);
        toast.success(t("roles:deleteSuccess", { defaultValue: "Role deleted successfully" }));
        setRoleToDelete(null);
      } catch (error) {
        toast.error(t("common:error", { defaultValue: "An error occurred" }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("roles:rolesManagement", { defaultValue: "Roles Management" })}
        description={t("roles:rolesManagementDesc", { defaultValue: "View and manage system roles and permissions" })}
        actions={
          <PermissionGuard permissions={["roles:create"]} fallback={null}>
            <Button onClick={() => router.push("/roles/create")} className="bg-primary text-white font-bold h-10 px-6">
              <Plus className="h-4 w-4 mr-2" />
              {t("roles:addRole", { defaultValue: "Add Role" })}
            </Button>
          </PermissionGuard>
        }
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns as any} 
          data={roles as any} 
          isLoading={isLoading} 
          pageCount={Math.ceil(roles.length / pagination.pageSize)}
          pagination={pagination}
          onPaginationChange={setPagination}
          rowCount={roles.length}
        />
      </div>

      <ConfirmDialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        onConfirm={handleDelete}
        title={t("roles:deleteRoleTitle", { defaultValue: "Delete Role" })}
        description={t("roles:deleteRoleDesc", {
          defaultValue: "Are you sure you want to delete this role? This action cannot be undone.",
        })}
      />
    </div>
  );
}
