"use client";

import { PageHeader } from "@/components/common/page-header";
import { MastersGrid } from "@/features/masters";

export default function MastersPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Masters Management"
        description="Manage all the master entities and configurations for the INIMS platform."
      />
      <MastersGrid />
    </div>
  );
}
