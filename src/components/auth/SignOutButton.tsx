"use client";

import { signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function SignOutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost" size="sm">
      Sign Out
    </Button>
  );
}
