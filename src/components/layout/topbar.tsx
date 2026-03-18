"use client";

import { usePathname } from "next/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const pathname = usePathname();

  // Format pathname to title (e.g. /msnp-indicators -> MSNP Indicators)
  const title =
    pathname
      .split("/")
      .filter(Boolean)[0]
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Overview";

  return (
    <div className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-text-primary capitalize">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <UserMenu />
      </div>
    </div>
  );
}
