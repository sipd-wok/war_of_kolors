// Frontend/WaitingRoom.ts

import { GameObjects, Scene } from "phaser";
import { Socket } from "socket.io-client";
import { EventBus } from "../EventBus";
import { socketService } from "../SocketService";

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
  skipButtonText!: GameObjects.Text;
  opponents: GameObjects.Rectangle[] = [];

  connectedPlayers!: number;
  playersReady: number = 0;
  playersReadyText!: GameObjects.Text;

  // Add flag to track if UI is ready
  private uiReady: boolean = false;
  // Store players data until UI is ready
  private pendingPlayersUpdate: Player[] | null = null;

  // Add property to track if current player has voted
  private hasVoted: boolean = false;
  private requiredVotes: number = 0;

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

    // Use the shared socket service
    this.socket = socketService.getSocket();

    // Join the waiting room when scene initializes
    if (this.socket.connected) {
      this.joinWaitingRoom();
    } else {
      this.socket.on("connect", () => {
        this.joinWaitingRoom();
      });
    }

    // Set up socket listeners in init to prevent duplication
    this.setupSocketListeners();
  }

  joinWaitingRoom() {
    console.log("Connected with ID:", this.socket.id);

    // Join the waiting room
    this.socket.emit(
      "joinWaitingRoom",
      this.roomID,
      this.socket.id,
      this.user,
      this.character,
      this.potions,
    );

    // Request current players immediately after joining
    // This ensures the joining player gets the current state
    setTimeout(() => {
      this.socket.emit(
        "getUpdatedPlayers",
        this.roomID,
        (playerIDs: string[]) => {
          console.log("Requested current players after joining:", playerIDs);

          // Update connectedPlayers count based on playerIDs
          this.connectedPlayers = playerIDs.length;
          console.log(
            "Updated connected players count:",
            this.connectedPlayers,
          );

          // If there are players in the room, request the full room state
          if (playerIDs.length > 0) {
            this.socket.emit("getCurrentRoomState", this.roomID);
          }
        },
      );
    }, 300); // Small delay to ensure join completes first
  }

  setupSocketListeners() {
    // Listen for playerJoinedWaitingRoom events
    this.socket.on("playerJoinedWaitingRoom", (players: Player[]) => {
      console.log("Players in the room updated: ", players);
      this.connectedPlayers = players.length;
      console.log("Connected players: ", this.connectedPlayers);
      console.log("players length: ", players.length);

      // Enable skip button if there are multiple players
      if (
        players.length > 1 &&
        this.uiReady &&
        this.skipButton &&
        !this.hasVoted
      ) {
        console.log("Enabling skip button for playerJoinedWaitingRoom event");
        this.skipButton.setInteractive();
        this.votesText.setAlpha(1);

        // Update required votes calculation to match server-side logic
        this.requiredVotes = Math.max(2, Math.ceil(players.length / 2));
        this.votesText.setText(
          `Need ${0}/${this.requiredVotes} votes to start game`,
        );
      }

      // Store players data or update UI if ready
      if (this.uiReady) {
        // Update current player information
        this.updatePlayerInfo(players);
        // Update opponents information
        this.updateOpponentInfo(players);

        // Double-check skip button state after updating UI
        if (players.length > 1 && this.skipButton) {
          console.log("Double checking skip button interactivity");
          this.skipButton.setInteractive();
          this.votesText.setAlpha(1);
        }
      } else {
        console.log("UI not ready yet, storing player data for later");
        this.pendingPlayersUpdate = players;
      }
    });

    // Listen for current room state (new event handler)
    // 1. Player joins a room
    // 2. Player requests the current state of the room
    // 3. Server responds with complete player information
    // 4. Client updates UI with all players
    this.socket.on("currentRoomState", (players: Player[]) => {
      console.log("Received current room state:", players);
      this.connectedPlayers = players.length;
      console.log("currentRoomState connected players:", this.connectedPlayers);

      // Enable skip button if enough players and UI is ready
      if (
        players.length > 1 &&
        this.uiReady &&
        this.skipButton &&
        !this.hasVoted
      ) {
        console.log("Enabling skip button for currentRoomState event");
        this.skipButton.setInteractive();
        this.votesText.setAlpha(1);

        // Update required votes calculation to match server-side logic
        this.requiredVotes = Math.max(2, Math.ceil(players.length / 2));
        this.votesText.setText(
          `Need ${0}/${this.requiredVotes} votes to start game`,
        );
      }

      // Update UI with current players
      if (this.uiReady) {
        this.updatePlayerInfo(players);
        this.updateOpponentInfo(players);

        // Double-check skip button state after updating UI
        if (players.length > 1 && this.skipButton) {
          console.log(
            "Double checking skip button interactivity after UI update",
          );
          this.skipButton.setInteractive();
          this.votesText.setAlpha(1);
        }
      } else {
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

    this.socket.on("proceedToGame", (room: any) => {
      console.log("Proceeding to game room...", room);

      // Show a "Starting Game..." message before transitioning
      const startingText = this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          "Starting Game...",
          {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 20, y: 10 },
          },
        )
        .setOrigin(0.5, 0.5)
        .setDepth(100); // Ensure it shows on top

      // Add a short delay for the message to be visible
      this.time.delayedCall(1000, () => {
        // Pass the complete room object with all player data to the Room scene
        this.scene.start("Room", { room });
      });
    });

    // Add handler for maxPlayersReached event
    this.socket.on("maxPlayersReached", () => {
      console.log(
        "Room has reached maximum capacity. Starting game automatically.",
      );

      // Update UI to show that game is starting due to max capacity
      if (this.skipButton && this.skipButtonText) {
        this.skipButton.disableInteractive();
        this.skipButton.fillColor = 0x28a745;
        this.skipButton.alpha = 0.6;
        this.skipButtonText.setText("Room Full");
      }

      // Update the vote text to indicate auto-start
      if (this.votesText) {
        this.votesText.setText("Maximum players reached! Starting game...");
        this.votesText.setColor("#00ff00");
        this.votesText.setAlpha(1);
      }

      // We don't need to start the Room scene here, as it will be handled by the proceedToGame event
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

      // Update required votes calculation to match server-side logic
      this.requiredVotes = Math.max(2, Math.ceil(this.connectedPlayers / 2));

      this.votesText.setText(
        `Need ${votes}/${this.requiredVotes} votes to start game`,
      );

      // Make sure vote count is visible
      this.votesText.setAlpha(1);

      // Change text color when getting close to required votes
      if (votes >= this.requiredVotes - 1) {
        this.votesText.setColor("#00ff00"); // Green when close or reached
      }
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

        // Mark as voted and disable button
        this.hasVoted = true;
        this.skipButton.disableInteractive();
        this.skipButton.fillColor = 0x28a745; // Change color to green to indicate voted
        this.skipButton.alpha = 0.6;

        if (this.skipButtonText) {
          this.skipButtonText.setText("Voted ✓");
        }

        this.socket.emit("playerVotedSkip", this.roomID, (votes: number) => {
          console.log("Votes to skip now: ", votes);
          // Update required votes calculation to match server-side logic
          this.requiredVotes = Math.max(
            2,
            Math.ceil(this.connectedPlayers / 2),
          );

          this.votesText.setText(
            `Need ${votes}/${this.requiredVotes} votes to start game`,
          );

          // Change text color when getting close to required votes
          if (votes >= this.requiredVotes - 1) {
            this.votesText.setColor("#00ff00"); // Green when close or reached
          }
        });

        // Do not destroy skip button, just visually indicate the vote
      })
      .on("pointerover", () => {
        if (!this.hasVoted) {
          this.skipButton.setFillStyle(0x007bff, 0.5);
        }
      })
      .on("pointerout", () => {
        if (!this.hasVoted) {
          this.skipButton.setFillStyle(0x007bff, 0.2);
        }
      });

    // Initially disable the button until we have multiple players
    console.log(
      "Initial button setup - disabling interaction until players join",
    );
    this.skipButton.disableInteractive();

    this.skipButtonText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height - 80,
        "Vote to Start",
        {
          fontFamily: "Arial",
          color: "#ffffff",
          fontSize: "18px",
        },
      )
      .setOrigin(0.5);

    const votesToSkip = 0;
    this.requiredVotes = Math.max(2, Math.ceil(this.connectedPlayers / 2));

    this.votesText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height - 120,
        `Need ${votesToSkip}/${this.requiredVotes} votes to start game`,
        {
          fontFamily: "Arial",
          fontSize: "16px",
          color: "#ffffff",
          fontStyle: "bold",
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

    // Add status text to indicate the max player count
    this.add
      .text(
        canvasWidth / 2,
        cameraY - 270,
        "Game starts automatically when 6 players join",
        {
          fontFamily: "Arial",
          fontSize: "16px",
          color: "#ADADAD",
        },
      )
      .setOrigin(0.5, 0.5);

    // Mark UI as ready
    this.uiReady = true;

    // If we have pending player updates, process them now
    if (this.pendingPlayersUpdate) {
      console.log("Processing pending player updates now that UI is ready");
      this.updatePlayerInfo(this.pendingPlayersUpdate);
      this.updateOpponentInfo(this.pendingPlayersUpdate);

      // Check if we should enable the skip button based on the pending player data
      if (this.pendingPlayersUpdate.length > 1 && this.skipButton) {
        console.log("Enabling skip button based on pending player data");
        this.skipButton.setInteractive();
        this.votesText.setAlpha(1);
      }

      this.pendingPlayersUpdate = null;
    }

    // Request current room state once UI is ready
    this.socket.emit("getCurrentRoomState", this.roomID);

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
