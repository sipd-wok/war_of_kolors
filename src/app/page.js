"use client";
import { useEffect } from "react";
import Phaser from "@/utils/phaser";
import { Start } from '../components/Start';

export default function Home() {

  useEffect(() => {

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!window.game) {
      const config = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: isMobile ? window.innerWidth : 1500, // Fullscreen only on mobile
        height: isMobile ? window.innerHeight : 926,
        scene: [Start],
        backgroundColor: '#87CEEB',
        scale: {
          mode: isMobile ? Phaser.Scale.RESIZE : Phaser.Scale.FIT,
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
