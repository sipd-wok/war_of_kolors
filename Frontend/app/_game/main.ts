import { Boot } from "./_scenes/Boot";
import { GameOver } from "./_scenes/GameOver";
import { GameOver2 } from "./_scenes/GameOver2";
import { Game as MainGame } from "./_scenes/Game";
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
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#028af8",
  scene: [
    Boot,
    Preloader,
    MainMenu,
    MainGame,
    GameOver,
    GameOver2,
    Room,
    RoomList,
    WaitingRoom,
    Shop,
    // butang d ang scene mo
  ],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
