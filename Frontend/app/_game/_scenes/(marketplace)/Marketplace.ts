import { Scene } from "phaser";
import { EventBus } from "../../EventBus";

export class Marketplace extends Scene {
  constructor() {
    super("Marketplace");
  }

  create() {
    // Notify that we've successfully reached this scene
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("scene-initialized", {
          detail: "Marketplace",
        }),
      );
    }

    // Create a back button to return to main menu
    this.add
      .text(100, 50, "Back to Menu", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainMenu");
      });

    this.add
      .text(300, 50, "Sell Characters", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("SellCharacters");
      });

    this.add
      .text(300, 200, "Open Modal", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        // Emit an event to open the modal in React
        EventBus.emit("open-modal", true);

        // Directly dispatch a browser event as a fallback mechanism
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("open-modal", {
              detail: true,
            }),
          );
        }
      });

    // Title for the marketplace
    this.add
      .text(this.cameras.main.width / 2, 100, "Marketplace", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Send notification that scene is ready
    EventBus.emit("current-scene-ready", this);
  }
}
