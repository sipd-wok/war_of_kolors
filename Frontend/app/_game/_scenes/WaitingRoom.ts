import { GameObjects, Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

export class WaitingRoom extends Scene {
  socket!: Socket;
  roomLabel!: GameObjects.Text;
  roomID!: string;

  constructor() {
    super("WaitingRoom");

    this.socket = io("http://localhost:3001");

    this.socket.on("connect", () => {
      console.log("Connected with ID:", this.socket.id);
    });
  }

  // Add this method after constructor
  init(data: { roomID: string }) {
    this.roomID = data.roomID;
  }

  create() {
    this.roomLabel = this.add.text(512, 460, "Waiting Room", {
      fontFamily: "Arial Black",
    });

    EventBus.emit("current-scene-ready", this);
  }
}
