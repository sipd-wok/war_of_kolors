import { GameObjects, Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

export class WaitingRoom extends Scene {
  socket!: Socket;
  roomLabel!: GameObjects.Text;
  roomID!: string;
  player!: GameObjects.Rectangle;
  readyButton!: GameObjects.Rectangle;
  user_id!: string;
  opponents: GameObjects.Rectangle[] = [];
  playerText!: GameObjects.Text;
  connectTedPlayers!: number;
  playersReady: number = 0;
  playersReadyText!: GameObjects.Text;

  constructor() {
    super("WaitingRoom");
  }

  init(data: { roomID: string }) {
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Connected with ID:", this.socket.id);

      this.roomID = data.roomID;
      console.log("Joined room: " + this.roomID);

      this.socket.emit("joinRoom", this.roomID, this.socket.id);
    });
  }

  create() {
    const visualViewportWidth = window.visualViewport?.width;
    console.log("Viewport width: ", visualViewportWidth);

    const canvasWidth = this.sys.game.config.width as number;
    const canvasHeight = this.sys.game.config.height as number;
    const boxSize = 100;
    const spacing = 10;

    // Calculate the total width of the boxes and spacing
    const totalWidth = 5 * boxSize + 4 * spacing;

    // Center the boxes horizontally
    const startX = 50 + (canvasWidth - totalWidth) / 2;
    const startY = 150; // Adjusted Y position to match the image

    // Create Opponent boxes
    // Create Opponent boxes
    for (let j = 0; j < 5; j++) {
      const x = startX + 10 + j * (boxSize + spacing);
      const y = startY;

      // Store in array instead of dynamic properties
      this.opponents[j] = this.add
        .rectangle(x, y, boxSize, boxSize, 0x007bff, 0.2) // Semi-transparent blue fill
        .setStrokeStyle(4, 0xffffff)
        .setOrigin(0.5); // White outline
    }

    // Create Player box
    const playerBoxX = canvasWidth / 2;
    const playerBoxY = startY + boxSize + spacing + 50; // Position below Opponent boxes

    this.player = this.add
      .rectangle(playerBoxX, playerBoxY, boxSize, boxSize, 0x007bff, 0.2)
      .setStrokeStyle(4, 0xffffff);

    this.playerText = this.add
      .text(playerBoxX, playerBoxY, "Player", {
        fontFamily: "Arial",
        color: "#000000",
      })
      .setOrigin(0.5);

    // Create READY button (as a rectangle with text)
    this.readyButton = this.add
      .rectangle(
        canvasWidth / 2,
        playerBoxY + boxSize + spacing + 50,
        160,
        50,
        0x007bff,
        0.2,
      )
      .setStrokeStyle(2, 0xffffff)
      .setInteractive(
        new Phaser.Geom.Rectangle(0, 0, 160, 50),
        Phaser.Geom.Rectangle.Contains,
      ) // Make it clickable!
      .on("pointerdown", () => {
        console.log("Ready button clicked by: " + this.socket.id);

        this.socket.emit("playerReady", this.roomID, this.socket.id);

        this.readyButton.destroy();
        readyText.destroy();
      });

    const readyText = this.add
      .text(canvasWidth / 2, playerBoxY + boxSize + spacing + 50, "READY", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "20px",
      })
      .setOrigin(0.5);

    this.playersReady = 0;
    this.playersReadyText = this.add
      .text(
        canvasWidth / 2,
        canvasHeight - 200,
        `Players Ready: ${this.playersReady}`,
        {
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ffffff",
        },
      )
      .setOrigin(0.5, 0.5);

    const connectedPlayerText = this.add
      .text(
        canvasWidth / 2,
        canvasHeight - 100,
        `Connected players: ${this.connectTedPlayers}`,
        {
          fontFamily: "Arial",
          fontSize: "32px",
          color: "#ffffff",
        },
      )
      .setOrigin(0.5, 0.5);

    // Add "Waiting for other players..." text
    this.add
      .text(
        canvasWidth / 2,
        canvasHeight - 50,
        "Waiting for other players...",
        {
          fontFamily: "Arial",
          fontSize: "16px",
          color: "#ffffff",
        },
      )
      .setOrigin(0.5, 0.5);

    //
    // adjust and canvas ang ang objects para responsive
    //
    if (visualViewportWidth !== undefined && visualViewportWidth < 580) {
      // Adjust the layout of opponent boxes
      const startX =
        150 + ((this.sys.game.config.width as number) - (5 * 100 + 4 * 10)) / 2;
      const startY = 100;
      const boxSize = 100;
      const spacing = 10;
      const topRowY = startY;
      const bottomRowY = startY + boxSize + spacing;

      for (let j = 0; j < 3; j++) {
        const x = startX + 10 + j * (boxSize + spacing);
        this.opponents[j].setPosition(x, topRowY);
      }

      for (let j = 3; j < 5; j++) {
        const x = startX + 60 + (j - 3) * (boxSize + spacing);
        this.opponents[j].setPosition(x, bottomRowY);
      }

      this.player.setPosition(1024 / 2, 350);
      this.playerText.setPosition(1024 / 2, 350);
    } else {
      const canvasWidth = this.sys.game.config.width as number;
      const boxSize = 100;
      const spacing = 10;

      // Calculate the total width of the boxes and spacing
      const totalWidth = 5 * boxSize + 4 * spacing;

      // Center the boxes horizontally
      const startX = 50 + (canvasWidth - totalWidth) / 2;
      const startY = 150; // Adjusted Y position to match the image

      for (let j = 0; j < 5; j++) {
        const x = startX + 10 + j * (boxSize + spacing);
        const y = startY;

        // Set position of existing opponent boxes
        this.opponents[j].setPosition(x, y);
      }

      this.player.setPosition(canvasWidth / 2, startY + boxSize + spacing + 50);
      this.playerText.setPosition(
        canvasWidth / 2,
        startY + boxSize + spacing + 50,
      );
    }

    // +---------------------------+
    // +---------------------------+
    // |    🔊 SOCKET LISTERNS    |
    // +---------------------------+
    // +---------------------------+
    this.socket.on("aPlayerJoined", (roomID, socketID, numOfPlayers) => {
      // A function that runs when a player joins the room
      console.log("Player joined: " + socketID);

      if (roomID === this.roomID) {
        console.log("Player joined: " + socketID);
        console.log(`Room ${roomID} has ${numOfPlayers} players`);
        connectedPlayerText.setText(`Connected players: ${numOfPlayers}`);

        // if na max na ang players, proceed na sa gameroom
        // adjust sa 2 ang max anay for testing
        const maxPlayers = 2;
        if (numOfPlayers >= maxPlayers) {
          this.scene.start("Room", { roomID: this.roomID });
        }
      }
    });

    // Handle player disconnection
    this.socket.on("playerLeft", (roomID, socketID, numOfPlayers) => {
      if (roomID === this.roomID) {
        console.log("Player left: " + socketID);
        console.log(`Room ${roomID} has ${numOfPlayers} players remaining`);

        // Update the connected players count and is ready count
        this.playersReady--;
        connectedPlayerText.setText(`Connected players: ${numOfPlayers}`);

        // Find out if the disconnected player was ready
        // If they were, we need to update the ready players count
        this.socket.emit(
          "checkIfPlayerWasReady",
          roomID,
          socketID,
          (wasReady: boolean) => {
            if (wasReady && this.playersReady > 0) {
              this.playersReady--;
              this.playersReadyText.setText(
                `Players Ready: ${this.playersReady}`,
              );
            }
          },
        );

        // Reset opponent visualization
        // Since we don't know which exact box belongs to which player,
        // we'll rely on the server to send updated player information
        this.socket.emit("getUpdatedPlayers", roomID, (players: string[]) => {
          // Reset all opponent boxes
          this.opponents.forEach((box) => {
            box.setFillStyle(0x007bff, 0.2);
          });

          // Then highlight those who are still ready
          this.socket.emit(
            "getReadyPlayers",
            roomID,
            (readyPlayers: string[]) => {
              readyPlayers.forEach((player) => {
                const index = players.indexOf(player);
                if (index >= 0 && index < this.opponents.length) {
                  this.opponents[index].setFillStyle(0x00ff00);
                }
              });
            },
          );
        });
      }
    });

    // other web socket events
    // 1. update sng mga players nga ready
    this.socket.on("updatePlayersReady", (data) => {
      if (data.roomID === this.roomID) {
        console.log("Player ready: " + data.readyPlayerID);

        // Update the player box if it's the current player
        if (data.readyPlayerID === this.socket.id) {
          this.player.setFillStyle(0x00ff00);
        } else {
          // Find the index of this player in the opponents
          const index = data.allReadyPlayers.indexOf(data.readyPlayerID);
          if (index >= 0 && index < this.opponents.length) {
            this.opponents[index].setFillStyle(0x00ff00);
          }
        }

        this.playersReady++;
        this.playersReadyText.setText(`Players Ready: ${this.playersReady}`);
      }
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
