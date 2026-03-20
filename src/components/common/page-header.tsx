"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  description,
  actions,
  showBreadcrumbs = true,
  showBackButton = false,
}: PageHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Format pathname to breadcrumbs
  const segments = pathname.split("/").filter(Boolean);

  const getBreadcrumbLabel = (segment: string) => {
    if (segment === "records") return "Nutrition Records";
    if (segment === "dashboard") return "Dashboard";
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // format label logic moved into render for dynamic mapping

  return (
    <div className="space-y-4 w-full">
      {showBreadcrumbs && (
        <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto no-scrollbar py-0.5">
          {segments.map((segment, index) => {
            const label = getBreadcrumbLabel(segment);
            const isLast = index === segments.length - 1;
            
            return (
              <div key={`${segment}-${index}`} className="flex items-center gap-1.5 shrink-0">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${
                  isLast ? "text-secondary font-extrabold" : "hover:text-slate-600 cursor-default"
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all rounded-md shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
