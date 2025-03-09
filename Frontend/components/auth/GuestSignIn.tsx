"use client";

import { Button } from "@/components/ui/button";
import { guestSignInAction } from "@/lib/auth/gusetSignInAction";

const GuestSignIn = () => {
  return (
    <Button
      className="w-full"
      variant="default"
      onClick={() => {
        console.log("Guest sign in");
        guestSignInAction();
      }}
    >
      Continue as Guest
    </Button>
  );
};

export { GuestSignIn };
