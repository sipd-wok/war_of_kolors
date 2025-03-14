"use client";

import dynamic from "next/dynamic";
// import type { IRefPhaserGame } from "../_game/PhaserGame";
import { WalletProvider } from "@/context/WalletContext";
import { useState, useEffect } from "react";

// Memoize the PhaserGame component to prevent re-renders when parent state changes
const PhaserGame = dynamic(
  () => import("../_game/PhaserGame").then((mod) => mod.PhaserGame),
  {
    ssr: false,
  },
);

// Import the Marketplace component dynamically
const MarketplaceComponent = dynamic(
  () => import("../_components/marketplace/MarketplaceComponent"),
  {
    ssr: false,
  },
);

export default function GameClient() {
  const [currentView, setCurrentView] = useState("game");

  // Listen for Phaser events to switch to marketplace
  useEffect(() => {
    const handleSceneChange = (event: CustomEvent) => {
      if (event.detail === "Marketplace") {
        setCurrentView("marketplace");
      }
    };

    // Add event listener
    window.addEventListener(
      "go-to-marketplace",
      handleSceneChange as EventListener,
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "go-to-marketplace",
        handleSceneChange as EventListener,
      );
    };
  }, []);

  return (
    <WalletProvider>
      <div id="app" className="relative h-screen w-screen">
        {currentView === "game" ? (
          <PhaserGame />
        ) : (
          <div className="game-marketplace-container h-screen relative w-full">
            <button
              className="absolute top-4 left-4 z-10 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setCurrentView("game")}
            >
              Back to Game
            </button>
            <MarketplaceComponent />
          </div>
        )}
      </div>
    </WalletProvider>
  );
}
