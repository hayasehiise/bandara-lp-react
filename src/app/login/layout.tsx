// app/login/layout.tsx
import SessionWrapper from "@/components/sessionWrapper";
import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
