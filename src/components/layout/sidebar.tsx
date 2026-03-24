"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { navigationConfig, type NavItem } from "@/config/navigation";
import { usePermissions } from "@/hooks/use-permissions";

export function SidebarContent({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useTranslation("navigation");
  const { hasPermission } = usePermissions();
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    main: true,
  });
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Auto-expand submenus if a child is active
    const newOpenSubMenus: Record<string, boolean> = { ...openSubMenus };
    let changed = false;

    navigationConfig.forEach(group => {
      group.items.forEach(item => {
        if (item.isSubMenu && item.items) {
          const hasActiveChild = item.items.some(subItem => 
            pathname === subItem.href || (subItem.href !== "/" && pathname.startsWith(subItem.href))
          );
          if (hasActiveChild && !newOpenSubMenus[item.title]) {
            newOpenSubMenus[item.title] = true;
            changed = true;
          }
        }
      });
    });

    if (changed) {
      setOpenSubMenus(newOpenSubMenus);
    }
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev: Record<string, boolean>) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev: Record<string, boolean>) => ({ ...prev, [title]: !prev[title] }));
  };

  const NavLink = ({
    item,
    isSubItem = false,
  }: {
    item: NavItem;
    isSubItem?: boolean;
  }) => {
    // Permission Check
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    // Submenu filtering: Check if ANY child is visible
    if (item.isSubMenu && item.items) {
      const visibleChildren = item.items.filter(sub => !sub.permission || hasPermission(sub.permission));
      if (visibleChildren.length === 0) return null;
    }

    const isSubMenuActive = item.items?.some(subItem => 
      pathname === subItem.href || (subItem.href !== "/" && pathname.startsWith(subItem.href))
    );
    const isActive =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href)) ||
      isSubMenuActive;

    const isOpen = openSubMenus[item.title] ?? false;

    if (item.isSubMenu && item.items) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleSubMenu(item.title)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 group",
              isActive && !isOpen
                ? "bg-primary text-white shadow-md"
                : "text-secondary hover:bg-slate-50 hover:text-secondary",
            )}
            title={isCollapsed ? t(item.title) : undefined}
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors shrink-0",
                  isActive && !isOpen ? "text-white" : "text-secondary group-hover:text-secondary",
                )}
              />
              {!isCollapsed && (
                <span className={cn("text-sm truncate", isActive ? "font-bold" : "font-semibold")}>
                  {t(item.title)}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-300 opacity-60",
                  isOpen ? "rotate-180" : "rotate-0",
                )}
              />
            )}
          </button>
          
          <div
            className={cn(
              "space-y-1 overflow-hidden transition-all duration-300 ease-in-out pl-4",
              isOpen && !isCollapsed ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {item.items.map((subItem) => (
              <NavLink key={subItem.href} item={subItem} isSubItem={true} />
            ))}
          </div>
        </div>
      );
    }

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
          const isOpen = openGroups[group.id] ?? false;
          
          // Filter group items by permission
          const visibleItems = group.items.filter(item => {
             if (item.permission && !hasPermission(item.permission)) return false;
             if (item.isSubMenu && item.items) {
               return item.items.some(sub => !sub.permission || hasPermission(sub.permission));
             }
             return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.id} className="space-y-2">
              {/* Group Header (if multiple groups or label needed) */}
              {!isCollapsed && group.label !== "main" && (
                <p className="px-3 text-[10px] font-bold text-slate-400 mb-2 transition-all duration-300 uppercase tracking-widest">
                  {t(group.label)}
                </p>
              )}

              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map((item: NavItem) => (
                  <NavLink
                    key={item.href}
                    item={item}
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
