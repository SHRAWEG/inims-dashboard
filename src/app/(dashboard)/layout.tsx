"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const Sidebar = dynamic(
  () => import("@/components/layout/sidebar").then((mod) => mod.Sidebar),
  { ssr: false },
);
const Topbar = dynamic(
  () => import("@/components/layout/topbar").then((mod) => mod.Topbar),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If we don't have a user and we are still loading, show a full-page loader
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar isCollapsed={isCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 min-w-0 ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <Topbar
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          isCollapsed={isCollapsed}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
