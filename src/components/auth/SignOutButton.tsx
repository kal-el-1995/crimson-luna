"use client";

import { signOut } from "next-auth/react";
import { cleanupDemoUser } from "@/actions/user-actions";
import Button from "@/components/ui/Button";

export default function SignOutButton() {
  async function handleSignOut() {
    await cleanupDemoUser();
    signOut({ callbackUrl: "/" });
  }

  return (
    <Button onClick={handleSignOut} variant="ghost" size="sm">
      Sign Out
    </Button>
  );
}
