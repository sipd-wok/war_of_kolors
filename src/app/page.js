"use client";
import { useEffect } from "react";
import Phaser from "@/utils/phaser";
import { Start } from '../components/Start';

export default function Home() {
  useEffect(() => {
    // Prevent multiple Phaser instances
    if (!window.game) {
      const config = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: 1296,
        height: 926,
        scene: [Start],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      window.game = new Phaser.Game(config); // ✅ Store game instance globally
    }

    return () => {
      if (window.game) {
        window.game.destroy(true); // ❌ Destroy game instance on unmount
        window.game = null;
      }
    };
  }, []);

  return <div id="game-container" className="game-container" />;
}
