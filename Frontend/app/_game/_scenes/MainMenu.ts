import { GameObjects, Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  background!: GameObjects.Image;
  title!: GameObjects.Text;
  createRoomBttn!: GameObjects.Text;
  joinRoomBttn!: GameObjects.Text;
  openShop!: GameObjects.Text;
  socket!: Socket;

  constructor() {
    super("MainMenu");

    this.socket = io(`http://localhost:3000`);
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.title = this.add
      .text(512, 100, "War of Colors", {
        fontFamily: "Arial Black",
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    // --- Create Lobby Button ---
    this.createRoomBttn = this.add
      .text(512, 250, "Create Room", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.createRoomBttn.on("pointerover", () => {
      this.createRoomBttn.setStyle({ color: "#ffff00" }); // Change color on hover
    });

    this.createRoomBttn.on("pointerout", () => {
      this.createRoomBttn.setStyle({ color: "#ffffff" }); // Reset color on mouse out
    });

    this.createRoomBttn.on("pointerdown", () => {
      this.socket.emit("createGuestRoom", "testID", (roomID: string) => {
        console.log("Room created: " + roomID);
        this.scene.start("WaitingRoom", { roomID: roomID });
      });
    });

    // --- Join Lobby Button ---
    this.joinRoomBttn = this.add
      .text(512, 350, "Join Room", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.joinRoomBttn.on("pointerover", () => {
      this.joinRoomBttn.setStyle({ color: "#ffff00" });
    });

    this.joinRoomBttn.on("pointerout", () => {
      this.joinRoomBttn.setStyle({ color: "#ffffff" });
    });

    this.joinRoomBttn.on("pointerdown", () => {
      this.scene.start("RoomList", { socket: this.socket }); // Added changeScene() call for demo.
    });

    EventBus.emit("current-scene-ready", this);

    // --- Open Shop Button---
    this.openShop = this.add
      .text(512, 450, "Open Shop", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.openShop.on("pointerover", () => {
      this.openShop.setStyle({ color: "#ffff00" });
    });

    this.openShop.on("pointerout", () => {
      this.openShop.setStyle({ color: "#ffffff" });
    });

    this.openShop.on("pointerdown", () => {
      this.scene.start("Shop", { socket: this.openShop }); // Change to open the Shop scene
    });

    EventBus.emit("current-scene-ready", this);
  }


  changeScene(sceneName: string) {
    this.scene.start(sceneName);
  }
}
