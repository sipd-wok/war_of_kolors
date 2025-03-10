import { GameObjects, Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

export class RoomList extends Scene {
  background!: GameObjects.Image;
  title!: GameObjects.Text;
  socket!: Socket;
  testBttn!: GameObjects.Text;
  availableRooms: string[] = [];
  testRooms: string[] = ["Room1", "Room2", "Room3"];

  constructor() {
    super("RoomList");

    this.socket = io("localhost:3000");

    this.socket.on("connect", () => {
      console.log("Connected with ID:", this.socket.id);
    });
  }

  init() {
    this.socket.emit("getRoomList", (rooms: []) => {
      console.log(rooms);
      rooms.forEach((room: { id: string }) => {
        this.availableRooms.push(room.id);
      });
      console.log("These are the available rooms: " + this.availableRooms);
    });
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.title = this.add
      .text(512, 100, "List of Rooms", {
        fontFamily: "Arial Black",
        fontSize: 40,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.testBttn = this.add
      .text(512, 250, "Test", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    EventBus.emit("current-scene-ready", this);
  }

  update(): void {
    if (this.availableRooms.length > 0) {
      this.availableRooms.forEach((roomID, index) => {
        console.log(`Adding room: ${roomID} in the Room list`);
        this.add
          .text(512, 350 + index * 60, roomID, {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#ffffff",
            backgroundColor: "#4e342e",
            padding: { x: 20, y: 10 },
          })
          .setOrigin(0.5)
          .setInteractive();
      });
      this.availableRooms = []; // Clear the rooms to prevent re-adding
    }
  }
}
