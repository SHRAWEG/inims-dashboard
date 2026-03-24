"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Shield, User as UserIcon } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { cn } from "@/lib/utils/cn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { userSchema, UserSchema } from "../schemas/user.schema";
import { useCreateUser, useUpdateUser, useUser } from "../hooks/use-users";
import { useRoles } from "@/features/roles/hooks/use-roles";
import { SystemRole } from "@/types/auth.types";
import { useAuth } from "@/hooks/use-auth";

interface UserFormProps {
  mode: "create" | "update";
  id?: string;
}

export function UserForm({ mode, id }: UserFormProps) {
  const { t } = useTranslation(["users", "common"]);
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const isEditing = mode === "update";
  const isSuperAdmin = currentUser?.systemRole === SystemRole.SUPER_ADMIN;

  const { data: user, isLoading: isLoadingUser } = useUser(id!);
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const [roleType, setRoleType] = useState<"system" | "custom">("custom");
  const [open, setOpen] = useState(false);

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      systemRole: undefined,
      roleId: undefined,
    },
  });

  useEffect(() => {
    if (isEditing && user) {
      form.reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        systemRole: (user.systemRole as SystemRole) || undefined,
        roleId: user.roleId || undefined,
      });

      if (user.systemRole) {
        setRoleType("system");
      } else {
        setRoleType("custom");
      }
    }
  }, [user, isEditing, form]);

  const onSubmit = async (data: UserSchema) => {
    try {
      if (isEditing && id) {
        const { password, ...updateData } = data;
        await updateMutation.mutateAsync({ id, ...updateData });
        toast.success(t("common:updateSuccess", { defaultValue: "User updated successfully" }));
      } else {
        await createMutation.mutateAsync(data as any);
        toast.success(t("common:createSuccess", { defaultValue: "User created successfully" }));
      }
      router.push("/users");
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("common:error", { defaultValue: "An error occurred" }));
    }
  };

  if (isEditing && isLoadingUser) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={isEditing ? t("users:editUser", { defaultValue: "Edit User" }) : t("users:createUser", { defaultValue: "Create User" })}
        description={isEditing ? t("users:editUserDesc", { defaultValue: "Update user profile and account status" }) : t("users:createUserDesc", { defaultValue: "Add a new user to the system" })}
        showBackButton
      />

      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t("users:firstName", { defaultValue: "First Name" })} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} className="h-12 bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t("users:lastName", { defaultValue: "Last Name" })} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} className="h-12 bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {t("users:email", { defaultValue: "Email Address" })} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} className="h-12 bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {t("users:password", { defaultValue: "Password" })} <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-12 bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none" />
                      </FormControl>
                      <FormDescription className="text-[10px] font-medium text-slate-400 mt-1">
                        At least 8 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Role Configuration Section */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-md border border-slate-100">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">Assign System Role?</h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-none">
                      {isSuperAdmin 
                        ? "Switch to assign a built-in administrative role instead of an organizational role."
                        : "Only Super Admins can assign system-level roles."}
                    </p>
                  </div>
                  <Switch 
                    checked={roleType === "system"} 
                    onCheckedChange={(checked) => {
                      const newType = checked ? "system" : "custom";
                      setRoleType(newType);
                      // Clear the other field when switching
                      if (checked) {
                        form.setValue("roleId", undefined);
                      } else {
                        form.setValue("systemRole", undefined);
                      }
                    }}
                    disabled={!isSuperAdmin}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roleType === "system" ? (
                    <FormField
                      control={form.control}
                      name="systemRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            {t("users:systemRole", { defaultValue: "System Role" })}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!isSuperAdmin}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:border-secondary transition-all shadow-none">
                                <SelectValue placeholder={t("users:selectSystemRole", { defaultValue: "Select built-in role" })} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-slate-200">
                              <SelectItem value={SystemRole.SUPER_ADMIN}>Super Admin</SelectItem>
                              <SelectItem value={SystemRole.ADMIN}>Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            {t("users:customRole", { defaultValue: "Custom Role" })}
                          </FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className={cn(
                                    "h-12 px-3 justify-between font-normal bg-slate-50 border-slate-200 hover:bg-slate-50 transition-all",
                                    !field.value && "text-slate-400"
                                  )}
                                >
                                  {field.value
                                    ? roles.find((role) => role.id === field.value)?.name
                                    : t("users:selectCustomRole", { defaultValue: "Search organizational roles..." })}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0 bg-white border-slate-200" align="start">
                              <Command>
                                <CommandInput placeholder="Search roles..." className="h-10" />
                                <CommandList>
                                  <CommandEmpty>No role found.</CommandEmpty>
                                  <CommandGroup>
                                    {roles.map((role) => (
                                      <CommandItem
                                        key={role.id}
                                        value={role.name}
                                        onSelect={() => {
                                          form.setValue("roleId", role.id);
                                          setOpen(false);
                                        }}
                                        className="cursor-pointer"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            role.id === field.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium text-slate-700">{role.name}</span>
                                          {role.description && (
                                            <span className="text-[10px] text-slate-400">{role.description}</span>
                                          )}
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="hidden md:block p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-100 shadow-sm">
                        {roleType === "system" ? <Shield className="h-4 w-4 text-primary" /> : <UserIcon className="h-4 w-4 text-slate-400" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 lg:text-slate-900 uppercase tracking-widest leading-none">Selection Mode</p>
                        <p className="text-[10px] text-slate-500 font-medium">Currently assigning a {roleType === "system" ? "built-in system role" : "custom organizational role"}.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => router.back()} className="px-6 h-11 rounded-md text-slate-600 font-bold text-sm hover:bg-slate-50">
                {t("common:cancel", { defaultValue: "Cancel" })}
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-10 h-11 rounded-md bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-sans"
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? t("common:saving", { defaultValue: "Saving..." }) 
                  : isEditing 
                    ? t("common:save", { defaultValue: "Save Changes" }) 
                    : t("common:create", { defaultValue: "Create User" })}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
