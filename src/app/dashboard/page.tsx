"use client";
import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
export default function DashboardPage() {
  return (
    <>
      <Button onClick={() => signOut({ callbackUrl: "/login" })}>
        Sign Out
      </Button>
    </>
  );
}
