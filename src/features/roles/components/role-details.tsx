"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Shield, Edit, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useRole } from "../hooks/use-roles";
import { StatusBadge } from "@/components/common/status-badge";
import { PermissionGuard } from "@/components/common/PermissionGuard";
import { Permission } from "@/lib/api/roles";

interface RoleDetailsProps {
  id: string;
}

export function RoleDetails({ id }: RoleDetailsProps) {
  const { t } = useTranslation(["common", "roles"]);
  const router = useRouter();
  const { data: role, isLoading } = useRole(id);

  // Group permissions by category then resource
  const groupedPermissions = useMemo(() => {
    if (!role?.permissions) return {};
    return role.permissions.reduce(
      (acc, permission) => {
        const category = permission.category || "General";
        const resource = permission.resource;
        if (!acc[category]) {
          acc[category] = {};
        }
        if (!acc[category][resource]) {
          acc[category][resource] = [];
        }
        acc[category][resource].push(permission);
        return acc;
      },
      {} as Record<string, Record<string, Permission[]>>,
    );
  }, [role]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-slate-100 shadow-sm">
        <Shield className="h-12 w-12 text-slate-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">
          {t("roles:roleNotFound", { defaultValue: "Role not found" })}
        </h2>
        <Button
          variant="link"
          onClick={() => router.push("/roles")}
          className="text-primary font-bold mt-2"
        >
          {t("common:backToList", { defaultValue: "Back to list" })}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title={role.name}
        description={t("roles:roleDetailsDesc", {
          defaultValue: "View detailed role capabilities and assignments",
        })}
        showBackButton
        actions={
          <PermissionGuard permissions={["roles:update"]} fallback={null}>
            <Button
              onClick={() => router.push(`/roles/${id}/update`)}
              className="bg-primary text-white font-bold h-10 px-6 rounded-md shadow-md shadow-primary/10 hover:bg-primary/90 transition-all"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("common:edit", { defaultValue: "Edit Role" })}
            </Button>
          </PermissionGuard>
        }
      />

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-50">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                {t("roles:roleInfo", { defaultValue: "Role Information" })}
              </h3>
              <StatusBadge active={role.isActive} />
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-50">
              <h3 className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t("roles:description", { defaultValue: "Description" })}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {role.description ||
                  t("common:noDescription", {
                    defaultValue: "No description provided for this role.",
                  })}
              </p>
            </div>
          </div>

          <div className="space-y-10 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight">
                  {t("roles:assignedPermissions", {
                    defaultValue: "Capabilities & Permissions",
                  })}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {role.permissions.length} individual permissions assigned to
                  this role
                </p>
              </div>
            </div>

            <div className="space-y-12">
              {Object.entries(groupedPermissions).map(
                ([category, resources]) => (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1.5 bg-primary rounded-full" />
                      <h4 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        {category}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4">
                      {Object.entries(resources).map(([resource, perms]) => (
                        <div
                          key={resource}
                          className="p-7 rounded-lg border border-slate-100 bg-slate-50/20 hover:bg-white transition-all shadow-none"
                        >
                          <h5 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-slate-100/60 pb-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            {resource}
                          </h5>
                          <div className="space-y-4">
                            {perms.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-start gap-3 group"
                              >
                                <div className="mt-0.5 p-0.5 bg-green-50 rounded-full">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-700 block">
                                    {permission.action}
                                  </span>
                                  {permission.description && (
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                      {permission.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-start">
              <Button
                variant="outline"
                onClick={() => router.push("/roles")}
                className="px-8 h-11 font-bold text-sm text-slate-500 border-slate-200 hover:bg-slate-50 rounded-md transition-all"
              >
                Back to Roles List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
