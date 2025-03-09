import { GameObjects, Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

// Define player interface to replace 'any' types
interface Player {
  socketID: string;
  user: {
    id: string;
    user_id: string;
    username: string;
  } | null;
  potions: {
    id: string;
    devil: number;
    leprechaun: number;
  } | null;
  character: {
    id: number;
    name: string;
    sprite: string;
    created_at: string;
    tier: string;
    color: string;
    luck?: number;
  } | null;
}

export class WaitingRoom extends Scene {
  socket!: Socket;
  roomLabel!: GameObjects.Text;
  roomID!: string;

  skipButton!: GameObjects.Rectangle;
  opponents: GameObjects.Rectangle[] = [];

  connectedPlayers!: number;
  playersReady: number = 0;
  playersReadyText!: GameObjects.Text;

  // Add flag to track if UI is ready
  private uiReady: boolean = false;
  // Store players data until UI is ready
  private pendingPlayersUpdate: Player[] | null = null;

  // players
  characterName!: GameObjects.Text;
  playerName!: GameObjects.Text;
  playerBox!: GameObjects.Rectangle;
  opponentBox1!: GameObjects.Rectangle;
  opponentBox2!: GameObjects.Rectangle;
  opponentBox3!: GameObjects.Rectangle;
  opponentBox4!: GameObjects.Rectangle;
  opponentBox5!: GameObjects.Rectangle;
  opponentName1!: GameObjects.Text;
  opponentName2!: GameObjects.Text;
  opponentName3!: GameObjects.Text;
  opponentName4!: GameObjects.Text;
  opponentName5!: GameObjects.Text;
  oppCharacterName1!: GameObjects.Text;
  oppCharacterName2!: GameObjects.Text;
  oppCharacterName3!: GameObjects.Text;
  oppCharacterName4!: GameObjects.Text;
  oppCharacterName5!: GameObjects.Text;
  characterImage1!: GameObjects.Image;
  characterImage2!: GameObjects.Image;
  characterImage3!: GameObjects.Image;
  characterImage4!: GameObjects.Image;
  characterImage5!: GameObjects.Image;
  characterImage6!: GameObjects.Image;

  //  player information
  user!: { id: string; user_id: string; username: string };
  potions!: {
    id: string;
    devil: number;
    leprechaun: number;
    hp: number;
  };
  character!: {
    id: number;
    name: string;
    sprite: string;
    created_at: string;
    tier: string;
    color: string;
    luck?: number;
  };
  votesText!: GameObjects.Text;
  neededVotes!: number;

  constructor() {
    super("WaitingRoom");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("campfire", "/waitingRoom/campfire.jpg");
    this.load.image("logo", "logo.png");
  }

  async init(data: {
    roomID: string;
    user: { id: string; user_id: string; username: string };
    character: {
      id: number;
      name: string;
      sprite: string;
      created_at: string;
      tier: string;
      color: string;
      luck?: number;
    };
    potions: { id: string; devil: number; leprechaun: number; hp: number };
  }) {
    this.roomID = data.roomID;
    this.user = data.user;
    this.character = data.character;
    this.potions = data.potions;

    this.socket = io("localhost:3000");

    this.socket.on("connect", () => {
      console.log("Connected with ID:", this.socket.id);

      // Join the waiting room when socket connects
      this.socket.emit(
        "joinWaitingRoom",
        this.roomID,
        this.socket.id,
        this.user,
        this.character,
        this.potions,
      );
    });

    // Set up socket listeners in init to prevent duplication
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    // Listen for playerJoinedWaitingRoom events
    this.socket.on("playerJoinedWaitingRoom", (players: Player[]) => {
      console.log("Players in the room updated: ", players);
      this.connectedPlayers = players.length;

      // Enable skip button if enough players
      if (players.length > 1 && this.uiReady && this.skipButton) {
        this.skipButton.setInteractive();
        this.votesText.setAlpha(1);
      }

      // Store players data or update UI if ready
      if (this.uiReady) {
        // Update current player information
        this.updatePlayerInfo(players);
        // Update opponents information
        this.updateOpponentInfo(players);
      } else {
        console.log("UI not ready yet, storing player data for later");
        this.pendingPlayersUpdate = players;
      }
    });

    // Listen for player left events
    this.socket.on(
      "playerLeft",
      (roomID: string, playerID: string, numPlayers: number) => {
        console.log(
          `Player ${playerID} left room ${roomID}. ${numPlayers} players remaining.`,
        );

        // Request updated players list after someone leaves
        this.socket.emit(
          "getUpdatedPlayers",
          this.roomID,
          (playerIDs: string[]) => {
            console.log("Updated players after leave:", playerIDs);

            // If needed, request full player data after receiving IDs
            if (playerIDs.length > 0) {
              console.log("Players still in room: ", playerIDs.length);
            }
          },
        );
      },
    );

    this.socket.on("proceedToGame", (room: string) => {
      console.log("Proceeding to game room...");
      this.scene.start("Room", { room });
    });

    this.socket.on("updateVotes", (votes: number) => {
      console.log("Votes to skip now: ", votes);
      this.neededVotes = this.connectedPlayers || 2;
      this.votesText.setText(
        `Need ${votes}/${this.neededVotes} to skip waiting.`,
      );
    });

    // Add listener for playerVotedSkip event from server
    this.socket.on("playerVotedSkip", (votes: number) => {
      console.log("Received playerVotedSkip event with votes: ", votes);
      this.neededVotes = this.connectedPlayers || 2;
      this.votesText.setText(
        `Need ${votes}/${this.neededVotes} to skip waiting.`,
      );
    });
  }

  updatePlayerInfo(players: Player[]) {
    // Only update if UI is ready
    if (!this.uiReady) {
      console.log("UI not ready, can't update player info yet");
      return;
    }

    // Find the current player in the players array
    const currentPlayer = players.find(
      (player) => player.socketID === this.socket.id,
    );

    if (currentPlayer) {
      console.log("Current player information:", currentPlayer);

      // Add null checks for all properties
      if (currentPlayer.character && this.characterName) {
        this.characterName.setText(currentPlayer.character.name || "Unknown");

        // Set character texture if sprite exists
        if (currentPlayer.character.sprite && this.characterImage1) {
          this.characterImage1
            .setTexture(currentPlayer.character.sprite)
            .setAlpha(1);
        }

        // Update box color if color exists
        if (currentPlayer.character.color && this.playerBox) {
          this.updateBoxColor(this.playerBox, currentPlayer.character.color);
        }
      }

      // Set username with null check
      if (
        currentPlayer.user &&
        currentPlayer.user.username &&
        this.playerName
      ) {
        this.playerName.setText(currentPlayer.user.username);
      } else if (this.playerName) {
        this.playerName.setText("(Unknown Player)");
      }
    }
  }

  updateOpponentInfo(players: Player[]) {
    // Only update if UI is ready
    if (!this.uiReady) {
      console.log("UI not ready, can't update opponent info yet");
      return;
    }

    // Filter out the current player to get opponents
    const otherPlayers = players.filter(
      (player) => player.socketID !== this.socket.id,
    );
    console.log("Other players in room:", otherPlayers);

    // Arrays of opponent UI elements
    const opponentBoxes = [
      this.opponentBox1,
      this.opponentBox2,
      this.opponentBox3,
      this.opponentBox4,
      this.opponentBox5,
    ];
    const opponentNames = [
      this.opponentName1,
      this.opponentName2,
      this.opponentName3,
      this.opponentName4,
      this.opponentName5,
    ];
    const oppCharacterNames = [
      this.oppCharacterName1,
      this.oppCharacterName2,
      this.oppCharacterName3,
      this.oppCharacterName4,
      this.oppCharacterName5,
    ];
    const characterImages = [
      this.characterImage2,
      this.characterImage3,
      this.characterImage4,
      this.characterImage5,
      this.characterImage6,
    ];

    // Reset all opponent slots first
    for (let i = 0; i < opponentBoxes.length; i++) {
      if (
        opponentNames[i] &&
        oppCharacterNames[i] &&
        characterImages[i] &&
        opponentBoxes[i]
      ) {
        opponentNames[i].setText("(Player Name)");
        oppCharacterNames[i].setText("Character Name");
        characterImages[i].setAlpha(0);
        opponentBoxes[i].setStrokeStyle(4, 0xa9a9a9);
      }
    }

    // Update with new opponent information
    otherPlayers.forEach((player, index) => {
      if (index < opponentBoxes.length) {
        // Add null checks for all properties
        if (player.user && opponentNames[index]) {
          opponentNames[index].setText(player.user.username || "(Player Name)");
        }

        if (player.character) {
          if (oppCharacterNames[index]) {
            oppCharacterNames[index].setText(
              player.character.name || "Character Name",
            );
          }

          if (player.character.sprite && characterImages[index]) {
            characterImages[index]
              .setTexture(player.character.sprite)
              .setAlpha(1);
          }

          if (player.character.color && opponentBoxes[index]) {
            this.updateBoxColor(opponentBoxes[index], player.character.color);
          }
        }
      }
    });
  }

  updateBoxColor(box: GameObjects.Rectangle, color: string) {
    switch (color.toLowerCase()) {
      case "red":
        box.setStrokeStyle(4, 0xff0000);
        break;
      case "blue":
        box.setStrokeStyle(4, 0x0000ff);
        break;
      case "green":
        box.setStrokeStyle(4, 0x00ff00);
        break;
      case "yellow":
        box.setStrokeStyle(4, 0xffff00);
        break;
      case "purple":
        box.setStrokeStyle(4, 0x800080);
        break;
      case "orange":
        box.setStrokeStyle(4, 0xffa500);
        break;
      case "pink":
        box.setStrokeStyle(4, 0xffc0cb);
        break;
      case "brown":
        box.setStrokeStyle(4, 0xa52a2a);
        break;
      case "black":
        box.setStrokeStyle(4, 0x000000);
        break;
      case "white":
        box.setStrokeStyle(4, 0xffffff);
        break;
      default:
        box.setStrokeStyle(4, 0x000000);
    }
  }

  create() {
    const cameraX = this.cameras.main.width / 2;
    const cameraY = this.cameras.main.height / 2;
    const canvasWidth = this.sys.game.config.width as number;
    const canvasHeight = this.sys.game.config.height as number;
    const visualViewportWidth = window.visualViewport?.width;

    console.log("Viewport width: ", visualViewportWidth);

    this.add.image(cameraX - 3, cameraY, "campfire").setScale(0.2);
    this.cameras.main.setBackgroundColor(0x000000);

    const boxSize = 100;

    this.playerBox = this.add
      .rectangle(cameraX, cameraY + 135, boxSize, boxSize, 0x007bff, 0.2)
      .setStrokeStyle(4, 0xa9a9a9);
    this.characterImage1 = this.add
      .image(cameraX, cameraY + 135, "logo")
      .setDisplaySize(200 - 4, 200 - 4)
      .setAlpha(0);
    this.characterName = this.add
      // cameray + 135 +69
      .text(cameraX, cameraY + 204, "Character Name", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.playerName = this.add
      //// cameray + 204 + 16
      .text(cameraX, cameraY + 220, "(Player Name)", {
        fontFamily: "Arial",
        color: "#ADADAD",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.opponentBox1 = this.add
      .rectangle(
        cameraX - 130,
        cameraY + 60,
        boxSize - 5,
        boxSize - 5,
        0x007bff,
        0.2,
      )
      .setStrokeStyle(4, 0xa9a9a9);
    this.characterImage2 = this.add
      .image(cameraX - 130, cameraY + 60, "logo")
      .setDisplaySize(200 - 4 - 5, 200 - 4 - 5)
      .setAlpha(0);
    this.oppCharacterName1 = this.add
      .text(cameraX - 130, cameraY + 129, "Character Name", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.opponentName1 = this.add
      .text(cameraX - 130, cameraY + 145, "(Player Name)", {
        fontFamily: "Arial",
        color: "#ADADAD",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.opponentBox2 = this.add
      .rectangle(
        cameraX + 130,
        cameraY + 60,
        boxSize - 5,
        boxSize - 5,
        0x007bff,
        0.2,
      )
      .setStrokeStyle(4, 0xa9a9a9);
    this.characterImage3 = this.add
      .image(cameraX + 130, cameraY + 60, "logo")
      .setDisplaySize(200 - 4 - 5, 200 - 4 - 5)
      .setAlpha(0);
    this.oppCharacterName2 = this.add
      .text(cameraX + 130, cameraY + 129, "Character Name", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.opponentName2 = this.add
      .text(cameraX + 130, cameraY + 145, "(Player Name)", {
        fontFamily: "Arial",
        color: "#ADADAD",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.opponentBox3 = this.add
      .rectangle(
        cameraX - 125,
        cameraY - 100,
        boxSize - 10,
        boxSize - 10,
        0x007bff,
        0.2,
      )
      .setStrokeStyle(4, 0xa9a9a9);
    this.characterImage4 = this.add
      .image(cameraX - 125, cameraY - 100, "logo")
      .setDisplaySize(200 - 4 - 10, 200 - 4 - 10)
      .setAlpha(0);
    this.oppCharacterName3 = this.add
      .text(cameraX - 125, cameraY - 31, "Character Name", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.opponentName3 = this.add
      .text(cameraX - 125, cameraY - 15, "(Player Name)", {
        fontFamily: "Arial",
        color: "#ADADAD",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.opponentBox4 = this.add
      .rectangle(
        cameraX + 125,
        cameraY - 100,
        boxSize - 10,
        boxSize - 10,
        0x007bff,
        0.2,
      )
      .setStrokeStyle(4, 0xa9a9a9);
    this.characterImage5 = this.add
      .image(cameraX + 125, cameraY - 100, "logo")
      .setDisplaySize(200 - 4 - 10, 200 - 4 - 10)
      .setAlpha(0);
    this.oppCharacterName4 = this.add
      .text(cameraX + 125, cameraY - 31, "Character Name", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.opponentName4 = this.add
      .text(cameraX + 125, cameraY - 15, "(Player Name)", {
        fontFamily: "Arial",
        color: "#ADADAD",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.opponentBox5 = this.add
      .rectangle(
        cameraX,
        cameraY - 125,
        boxSize - 15,
        boxSize - 15,
        0x007bff,
        0.2,
      )
      .setStrokeStyle(4, 0xa9a9a9);
    this.characterImage6 = this.add
      .image(cameraX, cameraY - 125, "logo")
      .setDisplaySize(200 - 4 - 15, 200 - 4 - 15)
      .setAlpha(0);
    this.oppCharacterName5 = this.add
      .text(cameraX, cameraY - 205, "Character Name", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.opponentName5 = this.add
      .text(cameraX, cameraY - 189, "(Player Name)", {
        fontFamily: "Arial",
        color: "#ADADAD",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    // Create READY button (as a rectangle with text)
    this.skipButton = this.add
      .rectangle(cameraX, this.cameras.main.height - 80, 160, 50, 0x007bff, 0.2)
      .setStrokeStyle(2, 0xffffff)
      .on("pointerdown", () => {
        console.log("Ready button clicked by: " + this.socket.id);

        this.socket.emit("playerVotedSkip", this.roomID, (votes: number) => {
          console.log("Votes to skip now: ", votes);
          this.neededVotes = this.connectedPlayers || 2;
          this.votesText.setText(
            `Need ${votes}/${this.neededVotes} to skip waiting.`,
          );
        });

        this.skipButton.destroy();
        skipText.destroy();
      })
      .on("pointerover", () => {
        this.skipButton.setFillStyle(0x007bff, 0.5);
      })
      .on("pointerout", () => {
        this.skipButton.setFillStyle(0x007bff, 0.2);
      });
    const skipText = this.add
      .text(cameraX, this.cameras.main.height - 80, "Skip Waiting", {
        fontFamily: "Arial",
        color: "#ffffff",
        fontSize: "18px",
      })
      .setOrigin(0.5);
    const votesToSkip = 0;
    const neededVotes = this.connectedPlayers || 2;
    this.votesText = this.add
      .text(
        canvasWidth / 2,
        canvasHeight - 120,
        `Need ${votesToSkip}/${neededVotes} to skip waiting.`,
        {
          fontFamily: "Arial",
          fontSize: "14px",
          color: "#ffffff",
        },
      )
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    this.add
      .text(canvasWidth / 2, cameraY - 300, "Waiting for other players...", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    // Mark UI as ready
    this.uiReady = true;

    // If we have pending player updates, process them now
    if (this.pendingPlayersUpdate) {
      console.log("Processing pending player updates now that UI is ready");
      this.updatePlayerInfo(this.pendingPlayersUpdate);
      this.updateOpponentInfo(this.pendingPlayersUpdate);
      this.pendingPlayersUpdate = null;
    }

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
