// aap/_game/main.ts
"use client";

import { Boot } from "./_scenes/Boot";
import { MainMenu } from "./_scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./_scenes/Preloader";
import { Room } from "./_scenes/Room";
import { RoomList } from "./_scenes/RoomList";
import { WaitingRoom } from "./_scenes/WaitingRoom";
import { Shop } from "./_scenes/Shop";
import { Profile } from "./_scenes/Profile";
// impert ang mga scenes diri

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
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
    Profile,
    // butang d ang scene mo
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const StartGame = (
  parent: string,
  shopPayment: (amount: string) => Promise<{ message: string }>,
  buyAndmint: (
    amount: string,
    walletAddress: string,
    metadataURI: string,
  ) =>Promise<{ message: string, tokenId: string }>,
  walletAddress: string | null,
  balance: string | null,
) => {
  if (!walletAddress) {
    console.error("Wallet address is missing.");
    return null; // Or handle this case appropriately
  }

  if (typeof shopPayment !== "function") {
    console.error("Shop payment function is missing or invalid.");
    return null;
  }

  const game = new Game({ ...config, parent });

  // Store shopPayment in the game registry so scenes can access it
  game.registry.set("shopPayment", shopPayment);
  game.registry.set("buyAndmint", buyAndmint);
  game.registry.set("walletAddress", walletAddress);
  game.registry.set("balance", balance);
  return game;
};

export default StartGame;
