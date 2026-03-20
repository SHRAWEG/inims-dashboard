"use client";

import { useTranslation } from "react-i18next";
import { MASTER_ITEMS } from "../constants";
import { MasterCard } from "./master-card";

export function MastersGrid() {
  const { t } = useTranslation("masters");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {MASTER_ITEMS.map((item) => (
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
    </div>
  );
}
