"use client";

import { useState } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { User } from "@/types/auth.types";
import { createUserColumns } from "./user-columns";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useUsers, useDeleteUser } from "../hooks/use-users";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/navigation";

export function UserTable() {
  const { t } = useTranslation(["common", "users"]);
  const router = useRouter();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: users = [], isLoading } = useUsers();
  const deleteMutation = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteMutation.mutateAsync(userToDelete.id);
      toast.success(t("users:deleteSuccess", { defaultValue: "User deleted successfully" }));
      setUserToDelete(null);
    } catch (error) {
      toast.error(t("common:error", { defaultValue: "Failed to delete user" }));
    }
  };

  const columns = createUserColumns(
    (user) => router.push(`/users/${user.id}`),
    (user) => router.push(`/users/${user.id}/update`),
    (user) => setUserToDelete(user)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <DataTable
        columns={columns as any}
        data={users}
        isLoading={isLoading}
        pageCount={Math.ceil(users.length / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        rowCount={users.length}
      />

      <ConfirmDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={handleDelete}
        title={t("users:deleteTitle", { defaultValue: "Delete User" })}
        description={t("users:deleteDescription", {
          defaultValue: "Are you sure you want to delete this user? This action cannot be undone.",
        })}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
