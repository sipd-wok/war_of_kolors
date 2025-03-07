import { EventBus } from "../EventBus";

// Interface for settings that can be modified by Leva GUI
export interface GameSettings {
  objectHeight: number;
  objectWidth: number;
  objectRotation: number;
}

// Function to update settings from Leva GUI
export function updateSettings(settings: Partial<GameSettings>) {
  // Emit events that the Phaser game can listen to
  if ("objectHeight" in settings) {
    EventBus.emit("leva-object-height-changed", settings.objectHeight);
  }

  if ("objectWidth" in settings) {
    EventBus.emit("leva-object-width-changed", settings.objectWidth);
  }

  if ("objectRotation" in settings) {
    EventBus.emit("leva-object-rotation-changed", settings.objectRotation);
  }
}

// Initialize Leva (called from React component)
export function initLevaControls() {
  // This is just a placeholder - actual Leva panel setup happens in React components
  console.log("Leva controls initialized");
}
