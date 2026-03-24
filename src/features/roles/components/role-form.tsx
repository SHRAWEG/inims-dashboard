"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { Shield, Plus, Minus } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { roleSchema, RoleSchema } from "../schemas/role.schema";
import { useCreateRole, useUpdateRole, useRole } from "../hooks/use-roles";
import { useAllPermissions } from "../hooks/use-permissions";
import { Permission } from "@/lib/api/roles";

interface RoleFormProps {
  mode: "create" | "update";
  id?: string;
}

export function RoleForm({ mode, id }: RoleFormProps) {
  const { t } = useTranslation(["common", "roles"]);
  const router = useRouter();

  const { data: permissions = [] } = useAllPermissions();
  const { data: role, isLoading: isFetching } = useRole(id!);
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole(id!);

  // Group permissions by category then resource
  const groupedPermissions = useMemo(() => {
    return permissions.reduce(
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
  }, [permissions]);

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      permissionIds: [],
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || "",
        isActive: role.isActive,
        permissionIds: role.permissions.map((p) => p.id),
      });
    }
  }, [role, form]);

  const onSubmit: SubmitHandler<RoleSchema> = async (data) => {
    try {
      if (mode === "update" && id) {
        await updateMutation.mutateAsync(data);
        toast.success(
          t("roles:updateSuccess", {
            defaultValue: "Role updated successfully",
          }),
        );
      } else {
        await createMutation.mutateAsync(data);
        toast.success(
          t("roles:createSuccess", {
            defaultValue: "Role created successfully",
          }),
        );
      }
      router.push("/roles");
    } catch (error) {
      toast.error(t("common:error", { defaultValue: "An error occurred" }));
    }
  };

  if (mode === "update" && isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={
          mode === "create"
            ? t("roles:createRole", { defaultValue: "Create Role" })
            : t("roles:editRole", { defaultValue: "Edit Role" })
        }
        description={
          mode === "create"
            ? t("roles:createRoleDesc", {
                defaultValue: "Define a new role and assign permissions",
              })
            : t("roles:editRoleDesc", {
                defaultValue: "Modify role details and permissions",
              })
        }
        showBackButton
      />

      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {t("roles:roleName", { defaultValue: "Role Name" })}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Content Moderator"
                            {...field}
                            className="h-12 bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border border-slate-100 p-4 bg-slate-50/50">
                        <div className="space-y-0.5">
                          <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {t("common:status", { defaultValue: "Status" })}
                          </FormLabel>
                          <FormDescription className="text-[10px] text-slate-400 font-medium">
                            {field.value
                              ? t("roles:activeDesc", {
                                  defaultValue:
                                    "This role is active and assignable",
                                })
                              : t("roles:inactiveDesc", {
                                  defaultValue: "This role is inactive",
                                })}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col h-full">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col">
                        <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          {t("roles:description", {
                            defaultValue: "Description",
                          })}
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Textarea
                            placeholder="Describe the purpose of this role"
                            {...field}
                            className="resize-none h-full bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-8 pt-4">
                <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                      {t("roles:permissions", { defaultValue: "Permissions" })}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {t("roles:permissionsDesc", {
                        defaultValue:
                          "Select the actions this role is allowed to perform",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold hover:bg-slate-50 transition-colors"
                      onClick={() =>
                        form.setValue(
                          "permissionIds",
                          permissions.map((p) => p.id),
                        )
                      }
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold hover:bg-slate-50 transition-colors"
                      onClick={() => form.setValue("permissionIds", [])}
                    >
                      <Minus className="h-3 w-3 mr-2" />
                      Clear All
                    </Button>
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
                          {Object.entries(resources).map(
                            ([resource, perms]) => (
                              <div
                                key={resource}
                                className="group space-y-5 p-7 rounded-lg border border-slate-100 bg-slate-50/20 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-300"
                              >
                                <h5 className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100/60 pb-3">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                                  {resource}
                                </h5>
                                <div className="space-y-4">
                                  {perms.map((permission) => (
                                    <FormField
                                      key={permission.id}
                                      control={form.control}
                                      name="permissionIds"
                                      render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3.5 space-y-0 group/item">
                                          <FormControl>
                                            <Checkbox
                                              className="mt-1 h-4 w-4 border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all shadow-sm rounded-md"
                                              checked={field.value?.includes(
                                                permission.id,
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      permission.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !==
                                                          permission.id,
                                                      ),
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none select-none">
                                            <FormLabel className="text-xs font-bold text-slate-700 cursor-pointer group-hover/item:text-primary transition-colors">
                                              {permission.action}
                                            </FormLabel>
                                            {permission.description && (
                                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-xs">
                                                {permission.description}
                                              </p>
                                            )}
                                          </div>
                                        </FormItem>
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
                {form.formState.errors.permissionIds && (
                  <p className="text-sm font-medium text-destructive mt-6 bg-red-50 p-4 rounded-md border border-red-100">
                    {form.formState.errors.permissionIds.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="px-6 h-11 rounded-md text-slate-600 font-bold text-sm hover:bg-slate-50"
              >
                {t("common:cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-10 h-11 rounded-md bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-sans"
              >
                {t("common:save", { defaultValue: "Save" })}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
