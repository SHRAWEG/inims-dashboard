"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { navigationConfig, type NavItem } from "@/config/navigation";

export function SidebarContent({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useTranslation("navigation");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    masters: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const NavLink = ({
    item,
    isSubItem = false,
  }: {
    item: NavItem;
    isSubItem?: boolean;
  }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href));

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-secondary hover:bg-slate-50 hover:text-secondary",
          isCollapsed && isSubItem && "hidden",
        )}
        title={isCollapsed ? t(item.title) : undefined}
      >
        <item.icon
          className={cn(
            isSubItem ? "w-4 h-4" : "w-5 h-5",
            "transition-colors shrink-0",
            isActive
              ? "text-white"
              : isSubItem
                ? "text-slate-400 group-hover:text-secondary"
                : "text-secondary group-hover:text-secondary",
          )}
        />
        {!isCollapsed && (
          <span
            className={cn(
              "transition-all truncate",
              isSubItem ? "text-xs pl-0.5" : "text-sm",
              isActive ? "font-bold" : "font-semibold",
            )}
          >
            {t(item.title)}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Sidebar Header / Logo */}
      <div
        className={cn(
          "h-24 flex flex-col items-center justify-center px-4 gap-1 border-b border-slate-100 shrink-0 transition-all duration-300",
          isCollapsed ? "px-2" : "px-4",
        )}
      >
        <img
          alt="Nepal Government Logo"
          className={cn(
            "h-10 w-auto transition-all duration-300",
            isCollapsed ? "h-8" : "h-10",
          )}
          src="/images/emblem-of-nepal-seeklogo.svg"
        />
        {!isCollapsed && (
          <h1 className="font-bold text-[10px] text-center uppercase tracking-tight text-secondary leading-tight animate-in fade-in duration-500">
            Integrated Nutrition Information
            <br />
            Management System (INIMS)
          </h1>
        )}
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 py-6 space-y-6 overflow-y-auto no-scrollbar transition-all duration-300",
          isCollapsed ? "px-2" : "px-4",
        )}
      >
        {navigationConfig.map((group) => {
          const isCollapsible = !!group.iconComponent;
          const isOpen = openGroups[group.id] ?? false;
          const isGroupActive = group.items.some((item) =>
            pathname.startsWith(item.href),
          );
          const GroupIcon = group.iconComponent;

          return (
            <div key={group.id} className="space-y-2">
              {/* Group Header */}
              {isCollapsible ? (
                !isCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isGroupActive && !isOpen
                        ? "bg-slate-50 text-secondary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-secondary",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded bg-secondary/5 text-secondary group-hover:bg-secondary/10 transition-colors">
                        {GroupIcon && <GroupIcon className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {t(group.label)}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-300 opacity-60",
                        isOpen ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>
                ) : (
                  <div className="flex justify-center py-2">
                    {GroupIcon && (
                      <GroupIcon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          isGroupActive ? "text-secondary" : "text-secondary",
                        )}
                      />
                    )}
                  </div>
                )
              ) : (
                <p
                  className={cn(
                    "px-3 text-[10px] font-bold text-slate-400 mb-2 transition-all duration-300 uppercase tracking-widest",
                    isCollapsed
                      ? "opacity-0 h-0 overflow-hidden"
                      : "opacity-100",
                  )}
                >
                  {t(group.label)}
                </p>
              )}

              {/* Group Items */}
              <div
                className={cn(
                  "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                  isCollapsible
                    ? isOpen && !isCollapsed
                      ? "max-h-[500px] mt-1 opacity-100"
                      : "max-h-0 opacity-0"
                    : "max-h-none opacity-100",
                )}
              >
                {group.items.map((item: NavItem) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isSubItem={isCollapsible}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function Sidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <aside
      className={cn(
        "hidden lg:flex fixed inset-y-0 left-0 border-r border-slate-200 z-50 flex-col shadow-sm transition-all duration-300 ease-in-out bg-white",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <SidebarContent isCollapsed={isCollapsed} />
    </aside>
  );
}
