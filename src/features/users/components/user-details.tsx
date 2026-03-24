"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { User as UserIcon, Edit, Mail, Shield, Calendar, Activity } from "lucide-react";
import { format } from "date-fns";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useUser } from "../hooks/use-users";
import { StatusBadge } from "@/components/common/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PermissionGuard } from "@/components/common/PermissionGuard";

interface UserDetailsProps {
  id: string;
}

export function UserDetails({ id }: UserDetailsProps) {
  const { t } = useTranslation(["common", "users", "roles"]);
  const router = useRouter();
  const { data: user, isLoading } = useUser(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-slate-100 shadow-sm">
        <UserIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          {t("users:userNotFound", { defaultValue: "User not found" })}
        </h2>
        <Button
          variant="link"
          onClick={() => router.push("/users")}
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
        title={`${user.firstName} ${user.lastName}`}
        description={t("users:userDetailsDesc", {
          defaultValue: "View and manage user profile and account status",
        })}
        showBackButton
        actions={
          <PermissionGuard permissions={["users:update"]} fallback={null}>
            <Button
              onClick={() => router.push(`/users/${id}/update`)}
              className="bg-primary text-white font-bold h-11 px-8 rounded-md shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t("common:edit", { defaultValue: "Edit User" })}
            </Button>
          </PermissionGuard>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-sm mb-6">
              <AvatarImage 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa9BLuaU__h8ejRBr0dq6k53SqR4oh7lsq3_4UJcdHUWthErnsr6nbqMPrrIo_lTr6JL-z3eQR106srfPsn--SyTejgfdtMs_575xf1iqeJDrtfpoFI6MK7CwzxprnkJp458CWqOzTmEMoMvKQ_1t8sSxX8WYzBubfCDhYR0KRvpjr8_o0v_QINFahshpoZ7E0O-FBdGCI8-H6RsbM-bK00vaXqRGCuZjVlZOLKEi3cOskJ5NgZds-Sh_iTmch1Oq6kJ2MlIFqgCE" 
                alt={`${user.firstName} ${user.lastName}`} 
              />
              <AvatarFallback className="text-2xl font-black bg-primary/5 text-primary">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">{user.email}</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
              {t("users:accountStatus", { defaultValue: "Account Status" })}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">{t("common:status")}</span>
                </div>
                <span className="text-xs font-bold text-green-600">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">{t("common:joinedDate", { defaultValue: "Joined Date" })}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {user.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Access Details Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 h-full">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {t("roles:roleAndPermissions", { defaultValue: "Role & Access Control" })}
            </h4>
            
            <div className="p-8 bg-slate-50/50 rounded-xl border border-slate-100 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    {user.roleName || user.systemRole?.toLowerCase().replace("_", " ") || "No Role Assigned"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {user.systemRole ? "Built-in System Role" : user.roleId ? "Custom Organizational Role" : "Basic Access Only"}
                  </p>
                </div>
                <div className="px-4 py-2 bg-white rounded-md border border-slate-200 shadow-sm self-start md:self-center">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {user.systemRole || "CUSTOM_ROLE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-50">
              <div className="flex items-start gap-4 p-5 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="p-2 bg-primary/5 rounded-md">
                   <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <h5 className="text-xs font-bold text-slate-800 mb-1">{t("users:contactInfo", { defaultValue: "Primary Contact" })}</h5>
                   <p className="text-sm text-slate-600 font-medium">{user.email}</p>
                </div>
              </div>

               <div className="flex items-start gap-4 p-5 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="p-2 bg-primary/5 rounded-md">
                   <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                   <h5 className="text-xs font-bold text-slate-800 mb-1">{t("users:fullName", { defaultValue: "Legal Name" })}</h5>
                   <p className="text-sm text-slate-600 font-medium">{user.firstName} {user.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-start">
        <Button
          variant="outline"
          onClick={() => router.push("/users")}
          className="px-8 h-11 font-bold text-sm text-slate-500 border-slate-200 hover:bg-slate-50 rounded-md transition-all"
        >
          Back to Users List
        </Button>
      </div>
    </div>
  );
}
