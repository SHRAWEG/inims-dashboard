"use client";

import { Search, Menu, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LocaleSwitcher } from "./locale-switcher";
import { UserMenu } from "./user-menu";
import { SidebarContent } from "./sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Topbar({
  onToggleSidebar,
  isCollapsed = false,
}: {
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-4 sticky top-0 z-40 transition-all duration-300">
      {/* Mobile Menu & Sidebar Toggle */}
      <div className="flex items-center gap-1 lg:gap-2 text-slate-500 overflow-hidden min-w-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-1 lg:gap-4 overflow-hidden min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hidden lg:flex shrink-0 text-secondary hover:text-primary h-8 w-8 hover:bg-slate-50 transition-all border border-slate-100 shadow-sm rounded-md"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search and User Profile */}
      <div className="flex items-center gap-2 lg:gap-6">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-secondary transition-colors" />
          <Input
            className="w-40 lg:w-80 pl-10 pr-4 py-1.5 bg-slate-50 border-slate-200 rounded-lg focus:ring-secondary focus:border-secondary text-sm transition-all"
            placeholder="Search..."
          />
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
