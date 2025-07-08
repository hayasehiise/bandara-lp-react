// components/SessionWrapper.tsx
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SpinnerLoading from "./spinnerLoading";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "loading") {
    return <SpinnerLoading />;
  } else {
    return <>{children}</>;
  }
}

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthGate>{children}</AuthGate>
    </SessionProvider>
  );
}
