"use client";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { UserTable } from "./user-table";
import { PermissionGuard } from "@/components/common/PermissionGuard";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { Plus } from "lucide-react";

export function UserListWrapper() {
  const { t } = useTranslation(["users", "common"]);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("users:usersManagement", { defaultValue: "Users Management" })}
        description={t("users:usersManagementDesc", { defaultValue: "View and manage system users and their roles" })}
        actions={
          <PermissionGuard permissions={["users:create"]} fallback={null}>
            <Button
              onClick={() => router.push("/users/create")}
              className="bg-primary text-white font-bold h-10 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("users:addUser", { defaultValue: "Add User" })}
            </Button>
          </PermissionGuard>
        }
      />
      <UserTable />
    </div>
  );
}
