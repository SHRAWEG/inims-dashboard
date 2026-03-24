"use client";

import { useTranslation } from "react-i18next";
import { MASTER_ITEMS } from "../constants";
import { MasterCard } from "./master-card";
import { usePermissions } from "@/hooks/use-permissions";

export function MastersGrid() {
  const { t } = useTranslation("masters");
  const { hasPermission } = usePermissions();

  const visibleMasters = MASTER_ITEMS.filter((item) => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {visibleMasters.map((item) => (
        <MasterCard
          key={item.href}
          title={t(`${item.title}.title`)}
          description={t(item.description)}
          href={item.href}
          icon={item.icon}
          color={item.color}
          bg={item.bg}
        />
      ))}
      
      {visibleMasters.length === 0 && (
        <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-100">
          <p className="text-slate-400 font-medium">
            {t("noMastersAvailable", { defaultValue: "You do not have permission to view any masters" })}
          </p>
        </div>
      )}
    </div>
  );
}
