// app/dashboard/layout.tsx
"use client";

import SessionWrapper from "@/components/sessionWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
