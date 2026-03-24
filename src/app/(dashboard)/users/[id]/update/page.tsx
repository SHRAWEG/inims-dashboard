"use client";

import { UserForm } from "@/features/users";
import { use } from "react";

interface UpdateUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UpdateUserPage({ params }: UpdateUserPageProps) {
  const { id } = use(params);
  return <UserForm mode="update" id={id} />;
}
