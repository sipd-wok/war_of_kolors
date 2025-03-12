import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    // diri ka create sprites or mga objects

    EventBus.emit("current-scene-ready", this);


    
  }

  update(): void {
    // live update sa game
  }
}

// kadtu ka sa main.ts para magamit ang scene nga gn himo mo
