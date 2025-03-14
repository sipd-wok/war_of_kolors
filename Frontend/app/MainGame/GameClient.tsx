// GameClient.tsx
"use client";

import dynamic from "next/dynamic";
// import type { IRefPhaserGame } from "../_game/PhaserGame";
import { WalletProvider } from "@/context/WalletContext";

// Memoize the PhaserGame component to prevent re-renders when parent state changes
const PhaserGame = dynamic(
  () => import("../_game/PhaserGame").then((mod) => mod.PhaserGame),
  {
    ssr: false,
  },
);

export default function GameClient() {
  return (
    <WalletProvider>
      <div id="app" className="relative">
        <PhaserGame />
      </div>
    </WalletProvider>
  );
}
