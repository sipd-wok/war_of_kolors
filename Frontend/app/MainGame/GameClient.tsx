"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { IRefPhaserGame } from "../_game/PhaserGame";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { setGlobalState } from "../_game/globalState";
import { WalletProvider } from "@/context/WalletContext";

// Dynamically import PhaserGame with SSR disabled
const PhaserGame = dynamic(
  () => import("../_game/PhaserGame").then((mod) => mod.PhaserGame),
  { ssr: false },
);

export default function GameClient(props: {
  username: string;
  user_id: string;
}) {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  // const globalState = getGlobalState();

  useEffect(() => {
    // Sync React context to Phaser-accessible state
    // middleware sng react kag phaser ang globalState
    setGlobalState({
      user_id: props.user_id,
      username: props.username,
    });
  }, [props.user_id, props.username]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <WalletProvider>
      <div id="app" className="relative">
        <div className="absolute top-0 left-0 z-50">
          <p>{props.username}</p>
          <Button className="w-full" variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        <PhaserGame ref={phaserRef} />
      </div>
    </WalletProvider>
  );
}
