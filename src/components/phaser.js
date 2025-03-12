
import { useEffect } from "react";
import Phaser from "phaser"; // ✅ Import Phaser directly
import { Start } from "../components/Start";

const PhaserComponent = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.game) {
      console.log("Initializing Phaser game...");

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
        console.log("Destroying Phaser game...");
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);

  return <div id="game-container" className="game-container" />;
};

export default PhaserComponent;
