"use client";

import { Boot } from "./_scenes/Boot";
import { MainMenu } from "./_scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./_scenes/Preloader";
import { Room } from "./_scenes/Room";
import { RoomList } from "./_scenes/RoomList";
import { WaitingRoom } from "./_scenes/WaitingRoom";
import { Shop } from "./_scenes/Shop";
// impert ang mga scenes diri

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: window.visualViewport?.width || 1024,
  height: window.visualViewport?.height || 768,
  parent: "game-container",
  backgroundColor: "#028af8",
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Room,
    RoomList,
    WaitingRoom,
    Shop,
    // butang d ang scene mo
  ],
};

const StartGame = (
  parent: string,
  buyCharacter: (amount: string) => Promise<void>,
) => {
  const game = new Game({ ...config, parent });

  // Store buyCharacter in the game registry so scenes can access it
  game.registry.set("buyCharacter", buyCharacter);

  return game;
};

export default StartGame;
