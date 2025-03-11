"use client";
import { useEffect } from "react";
import Phaser from "@/utils/phaser";
import { Start } from "../components/Start";

const socket = io("https://war-of-kolors.onrender.com");

export default function Home() {
  useEffect(() => {
    if (!window.game) {
      const config = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: 1296,
        height: 926,
        scene: [Start],
        backgroundColor: "#87CEEB",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      window.game = new Phaser.Game(config);
    }
    return () => {
      if (window.game) {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);

  return <div id="game-container" className="game-container" />;
}
