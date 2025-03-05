"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import type { IRefPhaserGame } from "../_game/PhaserGame";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

// Dynamically import PhaserGame with SSR disabled
const PhaserGame = dynamic(
  () => import("../_game/PhaserGame").then((mod) => mod.PhaserGame),
  { ssr: false },
);

export default function GameClient(props: { username: string }) {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div id="app" className="relative">
      <div className="absolute top-0 left-0 z-50">
        <p>{props.username}</p>
        <Button className="w-full" variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      <PhaserGame ref={phaserRef} />
    </div>
  );
}
