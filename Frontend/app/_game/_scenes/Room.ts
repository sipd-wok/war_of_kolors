// Frontend/Room.ts

import { Scene } from "phaser";
import { Socket } from "socket.io-client";
import { EventBus } from "../EventBus";
import { socketService } from "../SocketService";
import { WOKCharacter } from "@/lib/typescriptInterfaces";

export class Room extends Scene {
  //Responsive
  private cameraX: number = 0;
  private cameraY: number = 0;

  //Generated For Image
  private defaultColor: Array<{
    color: number;
    img: string;
  }> = [];
  private loadingText!: Phaser.GameObjects.Text;

  //Players Arrays
  private playersLogs: Array<{
    id: string | number;
    lifePoints: number;
    name: string;
    color: number;
    luck: number;
    bet: number;
    img: string;
    LM: number;
    dpotion: number;
    leppot: number;
    health_potion: number;
    walletBal: number;
    characterId?: string; // Added to store character ID for fetching details
    attackPower: number; // Will be set based on character data
    defense: number; // Will be set based on character data
    tier: string; // Default to Bronze tier
  }> = [];

  // Store fetched character details
  private characterDetails: Record<string, WOKCharacter> = {};

  //Game Effects
  private imageDead: Phaser.GameObjects.Image[] = [];
  private skull: Phaser.GameObjects.Image[] = [];
  private imageAttack: {
    image: Phaser.GameObjects.Image;
    originalX: number;
    originalY: number;
  }[] = [];
  private imageShake: {
    image: Phaser.GameObjects.Image;
    originalX: number;
    originalY: number;
  }[] = [];
  private imageAttack_ani: Phaser.GameObjects.Image[] = [];
  private container_countdown_respin: Phaser.GameObjects.Text = null!;
  private spinning: ReturnType<typeof setInterval> | null = null;
  private updatePlayer: ReturnType<typeof setInterval> | null = null;
  private bounceBox: boolean = true;
  private updateFunction: boolean = false;
  private activeTween: Phaser.Tweens.Tween | null = null;

  //For Every Players Info
  private dpotion: Phaser.GameObjects.Text = null!;
  private leppot: Phaser.GameObjects.Text = null!;
  private healthPotion: Phaser.GameObjects.Text = null!;
  private text_value: Phaser.GameObjects.Text[] = [];
  private player_info_p: { x: number; y: number }[] = [];
  private player_ar: { x: number; y: number }[] = [];
  private box1!: Phaser.GameObjects.Image;
  private box2!: Phaser.GameObjects.Image;
  private box3!: Phaser.GameObjects.Image;
  private box1h: Phaser.GameObjects.Image | null = null;
  private box2h: Phaser.GameObjects.Image | null = null;
  private box3h: Phaser.GameObjects.Image | null = null;
  private boxStart: Phaser.GameObjects.Image | null = null;
  private mainplayerinfo_text: Phaser.GameObjects.Text = null!;
  private boxResult: Array<{ color: number; img: string }> | null = null;

  //API Informations
  private tempRoom: Array<{ id: string & number }> | null = null;

  socket!: Socket;
  roomID!: string;
  room!: any; // Data received from the waiting room

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

  constructor() {
    super("Room");
  }

  preload() {
    this.load.setPath("assets");

    //Characters
    this.load.image("blue", "img/blue.png");
    this.load.image("yellow", "img/yellow.png");
    this.load.image("pink", "img/boky.png");
    this.load.image("white", "img/white.png");
    this.load.image("red", "img/red.png");
    this.load.image("green", "img/green.png");

    //Wok Accessories
    this.load.image("wok_coins", "img/WokCoin.png");
    this.load.image("dpotion", "img/dpotion.png");
    this.load.image("leppot", "img/leppot.png");
    this.load.image("bag1", "img/bag1.png");
    this.load.image("bag2", "img/bag2.png");
    this.load.image("skull", "img/dead_sign.png");
    this.load.image("sword", "img/sword-r.png");
    this.load.image("healthPotion", "img/healthPotion.png");

    //Wok Buttons
    this.load.image("whitesrc", "img/whitesqr.png");

    //Dice
    this.load.image("blueDice", "img/blueDice.png");
    this.load.image("greenDice", "img/greenDice.png");
    this.load.image("pinkDice", "img/pinkDice.png");
    this.load.image("redDice", "img/redDice.png");
    this.load.image("whiteDice", "img/whiteDice.png");
    this.load.image("yellowDice", "img/yellowDice.png");
    this.load.image("loadDice", "img/load.png");
  }

  init(data: any) {
    console.log("Room init with data:", data);

    if (data && data.room) {
      this.room = data.room;
      this.roomID = data.room.roomID;

      // If user data was passed, store it
      if (data.room.players) {
        // Find the current player in the players array
        const currentPlayer = data.room.players.find(
          (player: any) => player.socketID === socketService.getSocket().id,
        );

        if (currentPlayer) {
          console.log("Found current player in room data:", currentPlayer);
          this.user = currentPlayer.user;
          this.character = currentPlayer.character;
          this.potions = currentPlayer.potions;
        } else {
          console.warn("Current player not found in room data");
        }

        // Pre-populate playersLogs with complete info from the battle room
        this.playersLogs = data.room.players.map((player: any) => {
          // Extract color code from string color name
          const colorMap: Record<string, number> = {
            red: 0xff0000,
            blue: 0x0000ff,
            yellow: 0xffff00,
            green: 0x00ff00,
            pink: 0xff00ff,
            white: 0xffffff,
            default: 0xffffff,
          };

          const colorValue = colorMap[player.character?.color || "default"];

          // Use currentHP from server if available (stored health)
          const health =
            player.stats?.currentHP ?? player.stats?.lifepoints ?? 5;

          return {
            id: player.socketID,
            lifePoints: health,
            name: player.user ? player.user.username : "Unknown",
            color: colorValue,
            luck: player.character?.luck || 6,
            bet: 2000, // Default value
            img: player.character?.color || "white", // Use color as image name
            LM: 0, // Default value
            dpotion: player.potions?.devil || 2,
            leppot: player.potions?.leprechaun || 4,
            health_potion: player.potions?.hp || 3,
            walletBal: 999, // Default value
            characterId: player.character?.id?.toString(), // Store character ID
            attackPower: 0, // Will be set based on character data
            defense: 0, // Will be set based on character data
            tier: player.character?.tier || "Bronze", // Default to Bronze tier
          };
        });

        // Fetch detailed character data for each player
        this.fetchCharacterData();
      }
    }

    // Fetch player's stored health points if we have socket ID but no initial data
    if (!this.playersLogs.length && socketService.getSocket().connected) {
      const socketId = socketService.getSocket().id;
      if (socketId) {
        socketService
          .getSocket()
          .emit("getStoredHealthPoints", socketId, (storedHP: number) => {
            console.log(`Retrieved stored health points: ${storedHP}`);
            // Store for future use
            if (this.playersLogs[0]) {
              this.playersLogs[0].lifePoints = storedHP;
            }
          });
      }
    }
  }

  // Enhanced method to fetch character data for all players
  async fetchCharacterData() {
    const fetchPromises = [];

    for (const player of this.playersLogs) {
      if (player.characterId) {
        const promise = fetch(
          `/api/WOKCharacter/getCharacterByID?characterID=${player.characterId}`,
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Failed to fetch character data for ID: ${player.characterId}`,
              );
            }
            return response.json();
          })
          .then((data) => {
            if (data.character && data.character[0]) {
              // Store character data
              this.characterDetails[player.characterId] = data.character[0];
              console.log(
                `Fetched character data for ${player.name}:`,
                data.character[0],
              );

              // Update player stats based on character attributes
              this.updatePlayerWithCharacterData(player, data.character[0]);

              // Broadcast this character data to all other players in the room
              if (this.socket && this.roomID) {
                this.socket.emit("shareCharacterData", {
                  roomID: this.roomID,
                  characterId: player.characterId,
                  characterData: data.character[0],
                });
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching character data:", error);
          });

        fetchPromises.push(promise);
      }
    }

    // Wait for all fetch requests to complete
    await Promise.all(fetchPromises);

    // Update the UI with the new character data
    this.updatePlayerDisplays();
  }

  // Method to update UI elements once character data has been loaded
  updatePlayerDisplays() {
    // If the UI has already been created, update it
    if (this.updateFunction) {
      // Force an update of all text displays
      for (let i = 1; i < this.playersLogs.length; i++) {
        if (this.text_value[i - 1]) {
          this.updatePlayerInfoText(i);
        }
      }

      // Update main player text
      if (this.mainplayerinfo_text) {
        this.updateMainPlayerInfoText();
      }
    }
  }

  // Enhanced method to update player stats based on character data
  updatePlayerWithCharacterData(player: any, character: WOKCharacter) {
    // Base stats from character data
    if (character.hp && character.hp > 0) {
      player.lifePoints = character.hp;
    }

    if (character.luck !== undefined) {
      // Use character luck directly from the database (0-0.15 range)
      player.luck = character.luck;

      // Set LM directly to the luck value from the database
      player.LM = character.luck;
    }

    // Update player appearance if image exists
    if (character.sprite && character.sprite !== "") {
      player.img = character.sprite;

      // Also preload the character sprite if it doesn't match our default colors
      if (
        !["red", "blue", "yellow", "green", "pink", "white"].includes(
          character.sprite,
        )
      ) {
        this.loadCharacterSprite(character.sprite);
      }
    }

    // Update combat stats directly from character data without multipliers
    if (character.atk) {
      player.attackPower = character.atk;
    }

    if (character.def) {
      player.defense = character.def;
    }

    // Store tier for reference (visual purposes only, no stat impact)
    player.tier = character.tier;
  }

  // Helper method to get tier-based bonuses
  getTierBonus(
    tier: string,
    bonusType: keyof typeof this.tierModifiers.Bronze,
  ): number {
    const normalizedTier =
      tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
    const tierData =
      this.tierModifiers[normalizedTier as keyof typeof this.tierModifiers] ||
      this.tierModifiers.Bronze;
    return tierData[bonusType];
  }

  // Method to dynamically load character sprites
  loadCharacterSprite(spriteName: string) {
    if (!this.textures.exists(spriteName)) {
      // Attempt to load from assets/img/characters/ first
      this.load.image(spriteName, `assets/img/characters/${spriteName}.png`);
      // If that fails, fall back to trying the exact name as the path
      this.load.image(spriteName, spriteName);

      // Start the load queue
      this.load.start();
    }
  }

  create() {
    this.scale.resize(1296, 926);

    // Use socketService instead of creating a new socket
    this.socket = socketService.getSocket();

    // Set up socket event listeners
    if (!this.socket.connected) {
      this.socket.connect();
    }

    this.socket.on("connect", () => {
      console.log("✅ Connected to server:", this.socket.id);

      // If we already have room data from init, skip the creation and directly load players
      if (this.room && this.playersLogs.length > 0) {
        console.log("Using existing battle room data");
        this.startGameWithExistingData();
      } else {
        // Otherwise, fall back to the old flow
        this.socket.emit("Create_BattleField", "Successfully Create Demo");
      }

      // Request stored health points for this player
      if (this.socket.id) {
        this.socket.emit(
          "getStoredHealthPoints",
          this.socket.id,
          (storedHP: number) => {
            console.log(
              `Retrieved stored health points on connection: ${storedHP}`,
            );
            if (this.playersLogs[0]) {
              this.playersLogs[0].lifePoints = storedHP;

              // Update UI if it exists
              if (this.updateFunction && this.mainplayerinfo_text) {
                this.updateMainPlayerInfoText();
              }
            }
          },
        );
      }
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
      alert("Connection Time Out Or Server Error");
    });

    //Responsive
    this.cameraX = this.cameras.main.width / 2;
    this.cameraY = this.cameras.main.height / 2;

    //Players Logs || Waiting Other Player Logs
    if (!this.playersLogs || this.playersLogs.length === 0) {
      this.playersLogs = [];
    }

    ///6 Collors
    this.defaultColor = [
      { color: 0xff0000, img: "redDice" },
      { color: 0xffff00, img: "yellowDice" },
      { color: 0x00ff00, img: "greenDice" },
      { color: 0xffffff, img: "whiteDice" },
      { color: 0x0000ff, img: "blueDice" },
      { color: 0xff00ff, img: "pinkDice" },
    ];

    this.tempRoom = [];

    // Setup the waiting message and room displays
    const waiting = this.add
      .text(this.cameraX, this.cameraY, "Connecting...", {
        font: "34px",
        color: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);

    const roomText = this.add
      .text(this.cameraX, this.cameraY - 440, "-----", {
        font: "23px",
        color: "#000",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);

    // If we have data from the waiting room, use it immediately
    if (this.room && this.playersLogs.length > 0) {
      roomText.setText(this.room.roomID);
      waiting.setText("Starting game...");

      // Start game with existing data after a brief delay
      setTimeout(() => {
        this.startGameWithExistingData();
        waiting.destroy();
      }, 1500);
    }

    // Still set up the socket listeners for normal flow or reconnections
    this.socket.on("SetCount", (data) => {
      waiting.setText("Waiting For Others Players " + data + "/6");
    });

    this.socket.on("roomAssign", (data) => {
      roomText.setText(data);
      this.socket.emit("GenerateColors", data);
    });

    this.socket.on("InputPlayer", (data) => {
      waiting.destroy();

      const players = this.socket.id;

      interface Player {
        id: string | number;
      }

      const index = data.findIndex((player: Player) => player.id === players);

      if (index !== -1) {
        const currentPlayer = data.splice(index, 1)[0];

        if (currentPlayer) {
          data.unshift(currentPlayer);
        }
      }

      this.playersLogs = data;

      setTimeout(this.loadPlayers.bind(this), 2000);

      setTimeout(() => {
        this.updateFunction = true;
      }, 5000);
    });

    this.updateFunction = false;

    // Set up event listeners for battle room updates
    this.setupBattleRoomListeners();
  }

  // New method to start the game with existing battle room data
  startGameWithExistingData() {
    console.log(
      "Starting game with existing data:",
      this.playersLogs.length,
      "players",
    );

    // Make sure current player is at index 0
    const socketId = socketService.getSocket().id;
    const currentPlayerIndex = this.playersLogs.findIndex(
      (player) => player.id === socketId,
    );

    if (currentPlayerIndex > 0) {
      const currentPlayer = this.playersLogs.splice(currentPlayerIndex, 1)[0];
      this.playersLogs.unshift(currentPlayer);
    }

    // Emit event to server to join the battle room
    if (this.room && this.room.roomID) {
      this.socket.emit("GenerateColors", this.room.roomID);
    }

    // Load the players and UI
    this.loadPlayers();

    // Enable updates after a delay
    setTimeout(() => {
      this.updateFunction = true;
    }, 3000);
  }

  // Setting up all battle-related socket listeners in one place
  setupBattleRoomListeners() {
    this.socket.on("ReceiveColor", (data) => {
      this.boxResult = data;

      // If game is closed (we're processing an existing roll), ignore new rolls
      if (this.closedGame) return;

      // Set closedGame to true to prevent multiple concurrent rolls being processed
      this.closedGame = true;

      // Stop spinning animation
      if (this.spinning !== null) {
        clearInterval(this.spinning);
        this.spinning = null;
      }

      // Set the final dice values
      this.box1?.setTexture(data[0].img);
      this.box2?.setTexture(data[1].img);
      this.box3?.setTexture(data[2].img);

      // Stop the bounce animations
      this.stopBounce(this.box1);
      this.stopBounce(this.box2);
      this.stopBounce(this.box3);

      // Update round counter
      let round = this.round || 0;
      const round_result = (round += 1);
      this.round = round;
      this.socket.emit("round", round_result);

      // Process the results and show effects
      for (let i = 0; i < this.playersLogs.length; i++) {
        const matchingColors =
          this.boxResult?.filter(
            (box) => box.color === this.playersLogs[i].color,
          ).length ?? 0;

        if (matchingColors > 0) {
          this.imageAttack_ani[i].setVisible(true);
          setTimeout(() => {
            this.imageAttack_ani[i].setVisible(false);
          }, 1000);

          this.rotateAttack(i);
        } else {
          setTimeout(() => {
            this.shakeDmg(i);
          }, 700);
        }
      }

      // Check for winners and losers based on server-stored health points
      this.checkPlayerStatus();

      // After a delay, restart the dice rolling animation for the next round
      setTimeout(() => {
        // Reset closedGame to allow new rolls
        this.closedGame = false;

        this.spinning = setInterval(() => {
          const Value1 = Phaser.Math.Between(0, this.defaultColor.length - 1);
          const Value2 = Phaser.Math.Between(0, this.defaultColor.length - 1);
          const Value3 = Phaser.Math.Between(0, this.defaultColor.length - 1);

          const color1 = this.defaultColor[Value1]?.img;
          const color2 = this.defaultColor[Value2]?.img;
          const color3 = this.defaultColor[Value3]?.img;

          if (color1) {
            this.box1?.setTexture(color1).setVisible(true);
          }
          if (color2) {
            this.box2?.setTexture(color2).setVisible(true);
          }
          if (color3) {
            this.box3?.setTexture(color3).setVisible(true);
          }
        }, 100);

        this.restartBounce(this.box1, this.bounceBox);
        this.restartBounce(this.box2, this.bounceBox);
        this.restartBounce(this.box3, this.bounceBox);
      }, 2000);
    });

    this.socket.on("round_result", (data) => {
      this.container_countdown_respin.setText("Round " + data);
    });

    this.socket.on("colorHistory", (data) => {
      this.box1h?.setTexture(data[0].img);
      this.box2h?.setTexture(data[1].img);
      this.box3h?.setTexture(data[2].img);
    });

    // Listen for character data shared by other players
    this.socket.on("receivedCharacterData", (data) => {
      if (data.characterId && data.characterData) {
        // Store the character data if we don't already have it
        if (!this.characterDetails[data.characterId]) {
          console.log(
            `Received character data for ID: ${data.characterId}`,
            data.characterData,
          );
          this.characterDetails[data.characterId] = data.characterData;

          // Find the player with this characterId and update their stats
          const playerWithCharacter = this.playersLogs.find(
            (player) => player.characterId === data.characterId,
          );

          if (playerWithCharacter) {
            this.updatePlayerWithCharacterData(
              playerWithCharacter,
              data.characterData,
            );
            this.updatePlayerDisplays();
          }
        }
      }
    });

    this.socket.on("Update_Life_P", (data) => {
      const players = this.socket.id;

      interface Player {
        id: string | number;
      }

      const index = data.findIndex((player: Player) => player.id === players);

      if (index !== -1) {
        const currentPlayer = data.splice(index, 1)[0];

        if (currentPlayer) {
          data.unshift(currentPlayer);
        }
      }

      this.playersLogs = data;

      // Also update server's stored health points when receiving updates
      if (this.playersLogs[0] && this.playersLogs[0].id) {
        this.socket.emit(
          "updateHealthPoints",
          this.playersLogs[0].id,
          this.playersLogs[0].lifePoints,
          (success: boolean) => {
            if (success) {
              console.log("Successfully updated stored health points");
            }
          },
        );
      }
    });

    this.socket.on("Update_Life_R", (data) => {
      const players = this.socket.id;

      interface Player {
        id: string | number;
      }

      const index = data.findIndex((player: Player) => player.id === players);

      if (index !== -1) {
        const currentPlayer = data.splice(index, 1)[0];

        if (currentPlayer) {
          data.unshift(currentPlayer);
        }
      }

      setTimeout(() => {
        this.playersLogs = data;

        // Update server's stored health points when receiving damage updates
        if (this.playersLogs[0] && this.playersLogs[0].id) {
          this.socket.emit(
            "updateHealthPoints",
            this.playersLogs[0].id,
            this.playersLogs[0].lifePoints,
            (success: boolean) => {
              if (success) {
                console.log(
                  "Successfully updated stored health points after damage",
                );
              }
            },
          );
        }
      }, 700);
    });
  }

  // Add closedGame as a class property
  private closedGame: boolean = false;
  private round: number = 0;

  // Modified loadPlayers method to display character data
  loadPlayers() {
    //Text, Elements, Colors, and prizes

    const totalBet = this.playersLogs.reduce(
      (sum, player) => sum + player.bet,
      0,
    );

    const prizeWOK = totalBet;

    const text_color = "#000";

    const walletBal = this.playersLogs[0].walletBal; //Wallets --  to Show Current Balances

    // Main Board && GamePlay System && Rules
    this.add.rectangle(
      this.cameraX + 450,
      this.cameraY - 430,
      450,
      90,
      0x693701,
    );

    this.add
      .text(
        this.cameraX + 450,
        this.cameraY - 430,
        " Wok Coins (" + walletBal + ")",
        {
          fontSize: "28px",
          color: "#fff",
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5);

    // Display main player's character information if available
    if (
      this.playersLogs[0].characterId &&
      this.characterDetails[this.playersLogs[0].characterId]
    ) {
      const charData = this.characterDetails[this.playersLogs[0].characterId];
      const tierColor = this.getTierColor(charData.tier);

      this.add
        .text(
          this.cameraX + 450,
          this.cameraY - 380,
          `${charData.name} (${charData.tier})`,
          {
            fontSize: "20px",
            color: tierColor,
            fontStyle: "bold",
          },
        )
        .setOrigin(0.5);

      // Add stats display
      this.add
        .text(
          this.cameraX + 450,
          this.cameraY - 350,
          `ATK: ${Math.round(charData.atk || 0)} | DEF: ${Math.round(
            charData.def || 0,
          )} | HP: ${charData.hp || 10}`,
          {
            fontSize: "16px",
            color: "#fff",
          },
        )
        .setOrigin(0.5);
    }

    this.add
      .image(this.cameraX + 300, this.cameraY - 430, "wok_coins")
      .setDisplaySize(50, 50);

    this.add.rectangle(this.cameraX, this.cameraY, 510, 360, 0x000000);

    this.add.rectangle(this.cameraX, this.cameraY, 500, 350, 0xb0c4de);
    this.add.rectangle(this.cameraX, this.cameraY, 450, 250, 0x4682b4);

    this.add
      .text(this.cameraX, this.cameraY - 100, ["TOTAL PRIZE = " + prizeWOK], {
        fontSize: "28px",
        color: text_color,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.container_countdown_respin = this.add
      .text(this.cameraX, this.cameraY + 90, "Re - rolling in ", {
        fontSize: "25px",
        color: "#000",
      })
      .setOrigin(0.5, 0.5);

    //Box Dice...
    this.box1 = this.add
      .image(this.cameraX - 130, this.cameraY, this.defaultColor[0].img)
      .setDisplaySize(120, 120)
      .setVisible(false);

    this.box2 = this.add
      .image(this.cameraX, this.cameraY, this.defaultColor[0].img)
      .setDisplaySize(120, 120)
      .setVisible(false);

    this.box3 = this.add
      .image(this.cameraX + 130, this.cameraY, this.defaultColor[0].img)
      .setDisplaySize(120, 120)
      .setVisible(false);

    //Dice History
    this.box1h = this.add
      .image(this.cameraX + 360, this.cameraY - 320, this.defaultColor[0].img)
      .setDisplaySize(90, 90)
      .setVisible(true);

    this.box2h = this.add
      .image(this.cameraX + 460, this.cameraY - 320, this.defaultColor[0].img)
      .setDisplaySize(90, 90);

    this.box3h = this.add
      .image(this.cameraX + 560, this.cameraY - 320, this.defaultColor[0].img)
      .setDisplaySize(90, 90);

    this.boxStart = this.add
      .image(this.cameraX, this.cameraY, "loadDice")
      .setDisplaySize(300, 280);

    setTimeout(() => {
      this.boxStart?.destroy();

      this.spinning = setInterval(() => {
        const Value1 = Phaser.Math.Between(0, this.defaultColor.length - 1);
        const Value2 = Phaser.Math.Between(0, this.defaultColor.length - 1);
        const Value3 = Phaser.Math.Between(0, this.defaultColor.length - 1);

        const color1 = this.defaultColor[Value1]?.img;
        const color2 = this.defaultColor[Value2]?.img;
        const color3 = this.defaultColor[Value3]?.img;

        if (color1) {
          this.box1?.setTexture(color1).setVisible(true);
        }
        if (color2) {
          this.box2?.setTexture(color2).setVisible(true);
        }
        if (color3) {
          this.box3?.setTexture(color3).setVisible(true);
        }
      }, 100);

      this.restartBounce(this.box1, this.bounceBox);

      this.restartBounce(this.box2, this.bounceBox);

      this.restartBounce(this.box3, this.bounceBox);
    }, 1800);

    //Arrays for Dmg Recieve

    this.imageDead = [];

    this.skull = [];

    this.imageAttack = [];

    this.imageShake = [];

    this.imageAttack_ani = [];

    // No longer need this code - moved to setupBattleRoomListeners
    // let round = 0;
    // let closedGame = false;
    // this.socket.on("ReceiveColor", ...

    //Other Player
    //Position
    this.player_info_p = [
      { x: this.cameraX - 590, y: this.cameraY - 70 },
      { x: this.cameraX - 570, y: this.cameraY + 70 },
      { x: this.cameraX - 300, y: this.cameraY + 220 },
      { x: this.cameraX + 190, y: this.cameraY + 220 },
      { x: this.cameraX + 460, y: this.cameraY + 70 },
      { x: this.cameraX + 460, y: this.cameraY - 140 },
    ];

    this.player_ar = [
      { x: this.cameraX - 360, y: this.cameraY - 100 },
      { x: this.cameraX - 360, y: this.cameraY + 100 },
      { x: this.cameraX - 90, y: this.cameraY + 260 },
      { x: this.cameraX + 90, y: this.cameraY + 260 },
      { x: this.cameraX + 360, y: this.cameraY + 100 },
      { x: this.cameraX + 360, y: this.cameraY - 100 },
    ];

    this.text_value = [];

    for (let i = 1; i < this.playersLogs.length; i++) {
      // Create player info text with enhanced formatting
      this.updatePlayerInfoText(i);
    }

    for (let i = 0; i < this.playersLogs.length; i++) {
      // Add tier-based border effect based on character data
      let borderColor = this.playersLogs[i].color;
      let borderWidth = 4;

      if (
        this.playersLogs[i].characterId &&
        this.characterDetails[this.playersLogs[i].characterId]
      ) {
        const charData = this.characterDetails[this.playersLogs[i].characterId];

        // Make higher tier characters have more impressive borders
        switch (charData.tier.toLowerCase()) {
          case "gold":
            borderWidth = 6;
            borderColor = 0xffd700;
            break;
          case "silver":
            borderWidth = 5;
            borderColor = 0xc0c0c0;
            break;
          case "rainbow":
            borderWidth = 8;
            borderColor = 0xff00ff;
            // Add animated rainbow effect for rainbow tier
            this.tweens.add({
              targets: this.add
                .rectangle(
                  this.player_ar[i].x,
                  this.player_ar[i].y,
                  160,
                  160,
                  0xffffff,
                  0,
                )
                .setStrokeStyle(borderWidth, borderColor),
              alpha: { from: 0.7, to: 1 },
              duration: 1000,
              repeat: -1,
              yoyo: true,
            });
            break;
        }
      }

      // Create the character display with appropriate styling
      this.add
        .rectangle(
          this.player_ar[i].x,
          this.player_ar[i].y,
          150,
          150,
          0xffffff,
          0,
        )
        .setStrokeStyle(borderWidth, borderColor);

      const dead = this.add
        .image(
          this.player_ar[i].x,
          this.player_ar[i].y,
          this.playersLogs[i].img,
        )
        .setDisplaySize(140, 140)
        .setVisible(false);

      const images = this.add
        .image(
          this.player_ar[i].x,
          this.player_ar[i].y,
          this.playersLogs[i].img,
        )
        .setDisplaySize(140, 140);

      const attack = this.add
        .image(this.player_ar[i].x, this.player_ar[i].y, "sword")
        .setDisplaySize(140, 140)
        .setVisible(false);

      this.imageShake.push({
        image: images,
        originalX: images.x,
        originalY: images.y,
      });

      this.imageAttack.push({
        image: attack,
        originalX: attack.x,
        originalY: attack.y,
      });

      this.imageAttack_ani.push(attack);

      this.imageDead.push(images);

      this.skull.push(dead);
    }

    //Player Main

    this.mainplayerinfo_text = this.add.text(
      this.cameraX - 430,
      this.cameraY - 420,
      [
        this.playersLogs[0].name +
          "\n - LUCK Multiplayer - " +
          this.playersLogs[0].lifePoints +
          " LIFE POINTS",
      ],
      {
        fontSize: "34px",
        color: text_color,
        fontStyle: "bold",
      },
    );

    this.add
      .rectangle(this.cameraX - 540, this.cameraY - 340, 190, 190, 0xffffff, 0)
      .setStrokeStyle(4, this.playersLogs[0].color);

    this.add
      .image(this.cameraX - 540, this.cameraY - 340, this.playersLogs[0].img)
      .setDisplaySize(180, 180);

    const potionsbg = this.add
      .rectangle(this.cameraX, this.cameraY + 340, 870, 370, 0x000000)
      .setVisible(false);

    const potions = this.add
      .rectangle(this.cameraX, this.cameraY + 340, 860, 360, 0xffffff)
      .setVisible(false);

    //Devil Potions
    const potion_img1 = this.add
      .image(this.cameraX, this.cameraY + 300, "dpotion")
      .setDisplaySize(140, 140)
      .setInteractive()
      .setVisible(false);

    potion_img1.on("pointerdown", () => {
      this.buttonClick1();
    });

    const potion_name_1 = this.add
      .text(this.cameraX, this.cameraY + 390, "Devil \n potion", {
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
      })
      .setVisible(false)
      .setOrigin(0.5, 0.5);

    this.dpotion = this.add
      .text(
        this.cameraX + 50,
        this.cameraY + 230,
        "" + this.playersLogs[0].dpotion + "x",
        {
          fontSize: "42px",
          color: "#000",
          fontStyle: "bold",
        },
      )
      .setVisible(false);

    //Leppot
    const potion_img2 = this.add
      .image(this.cameraX + 220, this.cameraY + 300, "leppot")
      .setDisplaySize(140, 140)
      .setInteractive()
      .setVisible(false);

    potion_img2.on("pointerdown", () => {
      potion_img2.disableInteractive();

      if (
        isNaN(this.playersLogs[0].lifePoints) ||
        this.playersLogs[0].lifePoints >= 15 ||
        this.playersLogs[1].lifePoints >= 15 ||
        this.playersLogs[2].lifePoints >= 15 ||
        this.playersLogs[3].lifePoints >= 15 ||
        this.playersLogs[4].lifePoints >= 15 ||
        this.playersLogs[5].lifePoints >= 15
      ) {
        potion_img2.disableInteractive();
      } else {
        this.buttonClick2();
      }
    });

    this.leppot = this.add
      .text(
        this.cameraX + 290,
        this.cameraY + 230,
        "" + this.playersLogs[0].leppot + "x",
        {
          fontSize: "42px",
          color: "#000",
          fontStyle: "bold",
        },
      )
      .setVisible(false);

    const potion_name_2 = this.add
      .text(this.cameraX + 220, this.cameraY + 390, "Leppot", {
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
      })
      .setVisible(false)
      .setOrigin(0.5, 0.5);

    const bag = this.add
      .image(this.cameraX + 540, this.cameraY + 370, "bag2")
      .setDisplaySize(110, 120)
      .setInteractive();

    //Health Potion
    const potion_img3 = this.add
      .image(this.cameraX - 220, this.cameraY + 300, "healthPotion")
      .setDisplaySize(140, 140)
      .setInteractive()
      .setVisible(false);

    potion_img3.on("pointerdown", () => {
      this.buttonClick3();
    });

    const potion_name_3 = this.add
      .text(this.cameraX - 220, this.cameraY + 390, "Health \n Potion", {
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
      })
      .setVisible(false)
      .setOrigin(0.5, 0.5);

    this.healthPotion = this.add
      .text(
        this.cameraX - 160,
        this.cameraY + 230,
        "" + this.playersLogs[0].health_potion + "x",
        {
          fontSize: "42px",
          color: "#000",
          fontStyle: "bold",
        },
      )
      .setVisible(false);

    let isOpen = false;

    bag.on("pointerdown", () => {
      if (isOpen) {
        bag.setTexture("bag2");
        potions.setVisible(false);
        potionsbg.setVisible(false);
        potion_img1.setVisible(false);
        potion_img2.setVisible(false);
        potion_img3.setVisible(false);
        potion_name_1.setVisible(false);
        potion_name_2.setVisible(false);
        potion_name_3.setVisible(false);
        this.leppot.setVisible(false);
        this.dpotion.setVisible(false);
        this.healthPotion.setVisible(false);
      } else {
        bag.setTexture("bag1");
        potions.setVisible(true);
        potionsbg.setVisible(true);
        potion_img1.setVisible(true);
        potion_img2.setVisible(true);
        potion_img3.setVisible(true);
        potion_name_1.setVisible(true);
        potion_name_2.setVisible(true);
        potion_name_3.setVisible(true);
        this.leppot.setVisible(true);
        this.dpotion.setVisible(true);
        this.healthPotion.setVisible(true);
      }

      isOpen = !isOpen;
    });
  }

  // Helper method to update player info text
  updatePlayerInfoText(playerIndex: number) {
    const player = this.playersLogs[playerIndex];
    let playerInfoText =
      player.name +
      "\n" +
      "LM - " +
      player.LM.toFixed(2) +
      "\n" +
      "LP - " +
      player.lifePoints;

    // Add character tier and stats if available
    if (player.characterId && this.characterDetails[player.characterId]) {
      const charData = this.characterDetails[player.characterId];

      // Show tier and important stats
      playerInfoText += `\nTier: ${charData.tier}`;

      if (charData.atk) {
        playerInfoText += ` | ATK: ${Math.round(charData.atk)}`;
      }

      if (charData.def) {
        playerInfoText += ` | DEF: ${Math.round(charData.def)}`;
      }
    }

    // Create or update the text object
    if (this.text_value[playerIndex - 1]) {
      this.text_value[playerIndex - 1].setText(playerInfoText);
    } else {
      const textColor = "#000";
      const info_text = this.add.text(
        this.player_info_p[playerIndex].x,
        this.player_info_p[playerIndex].y,
        playerInfoText,
        {
          fontSize: "24px",
          color: textColor,
          fontStyle: "bold",
        },
      );
      this.text_value.push(info_text);
    }
  }

  // Helper method to get color for tier
  getTierColor(tier: string): string {
    switch (tier.toLowerCase()) {
      case "rainbow":
        return "#ff00ff";
      case "gold":
        return "#ffd700";
      case "silver":
        return "#c0c0c0";
      case "bronze":
        return "#cd7f32";
      default:
        return "#ffffff";
    }
  }

  // Update the main player's info text
  updateMainPlayerInfoText() {
    let mainPlayerText =
      this.playersLogs[0].name +
      "\nLUCK - " +
      this.playersLogs[0].LM.toFixed(2) +
      "\nLIFE POINTS - " +
      this.playersLogs[0].lifePoints;

    // Add character info if available
    if (
      this.playersLogs[0].characterId &&
      this.characterDetails[this.playersLogs[0].characterId]
    ) {
      const charData = this.characterDetails[this.playersLogs[0].characterId];
      mainPlayerText += `\nTier: ${charData.tier} | Games Won: ${
        charData.games_won || 0
      }`;

      if (charData.atk && charData.def) {
        mainPlayerText += `\nATK: ${Math.round(charData.atk)} | DEF: ${Math.round(
          charData.def,
        )}`;
      }
    }

    this.mainplayerinfo_text.setText([mainPlayerText]);
  }

  buttonClick1() {
    // Devil potion effect based on character stats without tier multipliers
    if (
      this.playersLogs[0].characterId &&
      this.characterDetails[this.playersLogs[0].characterId]
    ) {
      const charData = this.characterDetails[this.playersLogs[0].characterId];
      console.log(`Devil potion used by ${charData.name} (${charData.tier})`);

      // Use base damage value - no tier multipliers
      const baseDamage = 2;

      // Apply damage to all other players
      for (let i = 1; i < this.playersLogs.length; i++) {
        // Skip players who are already eliminated
        if (isNaN(this.playersLogs[i].lifePoints)) continue;

        // Apply damage reduction based on target's defense if they have character data
        let damageReduction = 0;
        if (
          this.playersLogs[i].characterId &&
          this.characterDetails[this.playersLogs[i].characterId]
        ) {
          const targetCharData =
            this.characterDetails[this.playersLogs[i].characterId];
          if (targetCharData.def) {
            // Defense reduces damage by percentage based on raw defense value
            damageReduction = targetCharData.def / 50; // Max 50% damage reduction at 25 defense
          }
        }

        // Calculate final damage after reduction (minimum 1)
        const finalDamage = Math.max(
          1,
          Math.round(baseDamage * (1 - damageReduction)),
        );

        // Apply damage and show effect
        this.playersLogs[i].lifePoints -= finalDamage;

        // Apply visual feedback
        this.shakeDmg(i);

        // Update server health points for the damaged player
        if (this.socket && this.playersLogs[i].id) {
          this.socket.emit(
            "updateHealthPoints",
            this.playersLogs[i].id,
            this.playersLogs[i].lifePoints,
            (success: boolean) => {
              if (success) {
                console.log(
                  `Updated player ${this.playersLogs[i].name}'s health points on server`,
                );
              }
            },
          );
        }
      }

      // Emit updated player data
      if (this.socket && this.roomID) {
        this.socket.emit("Update_Life_R", this.playersLogs);
      }

      // Decrement potion count
      if (this.playersLogs[0].dpotion > 0) {
        this.playersLogs[0].dpotion--;
      }

      // Check if any player died from the damage
      this.checkPlayerStatus();
    }
  }

  buttonClick2() {
    // Leprechaun potion effect based on character luck without tier multipliers
    if (
      this.playersLogs[0].characterId &&
      this.characterDetails[this.playersLogs[0].characterId]
    ) {
      const charData = this.characterDetails[this.playersLogs[0].characterId];
      console.log(
        `Leprechaun potion used by ${charData.name} (${charData.tier})`,
      );

      // Fixed luck boost without tier modifiers
      const luckBoost = 0.03; // Boost luck by a fixed amount

      // Apply luck boost temporarily
      const originalLuck = this.playersLogs[0].luck;
      this.playersLogs[0].luck += luckBoost;
      this.playersLogs[0].LM = this.playersLogs[0].luck;

      // Visual feedback
      const luckText = this.add
        .text(this.cameraX, this.cameraY - 200, `LUCK BOOST: +${luckBoost}`, {
          fontSize: "32px",
          color: "#ffd700",
          fontStyle: "bold",
          stroke: "#000",
          strokeThickness: 4,
        })
        .setOrigin(0.5);

      // Make the text float up and fade out
      this.tweens.add({
        targets: luckText,
        y: this.cameraY - 300,
        alpha: 0,
        duration: 2000,
        onComplete: () => {
          luckText.destroy();

          // Remove luck boost after 3 rounds (15 seconds)
          setTimeout(() => {
            this.playersLogs[0].luck = originalLuck;
            this.playersLogs[0].LM = originalLuck;
          }, 15000);
        },
      });

      // Decrement potion count
      if (this.playersLogs[0].leppot > 0) {
        this.playersLogs[0].leppot--;
      }
    }
  }

  buttonClick3() {
    // Health potion effect without tier-based healing
    if (
      this.playersLogs[0].characterId &&
      this.characterDetails[this.playersLogs[0].characterId]
    ) {
      const charData = this.characterDetails[this.playersLogs[0].characterId];
      console.log(`Health potion used by ${charData.name} (${charData.tier})`);

      // Fixed healing amount without tier bonuses
      const healAmount = 2;

      // Update lifePoints with healing (cap at 15)
      this.playersLogs[0].lifePoints = Math.min(
        15,
        this.playersLogs[0].lifePoints + healAmount,
      );

      // Visual feedback - create healing effect
      this.createHealingEffect(0, healAmount);

      // Update server with new health points
      if (this.socket && this.playersLogs[0].id) {
        this.socket.emit(
          "updateHealthPoints",
          this.playersLogs[0].id,
          this.playersLogs[0].lifePoints,
          (success: boolean) => {
            if (success) {
              console.log(`Updated health points after healing on server`);
            }
          },
        );
      }

      // Socket emit to broadcast the healing
      if (this.socket && this.roomID) {
        this.socket.emit("Update_Life_P", this.playersLogs);
      }

      // Decrement potion count
      if (this.playersLogs[0].health_potion > 0) {
        this.playersLogs[0].health_potion--;
      }

      // Check if player won by healing to 15
      if (this.playersLogs[0].lifePoints >= 15) {
        this.handlePlayerWin(0);
      }
    }
  }

  // Create visual healing effect
  createHealingEffect(playerIndex: number, healAmount: number) {
    if (!this.player_ar[playerIndex]) return;

    // Create healing particles
    const x = this.player_ar[playerIndex].x;
    const y = this.player_ar[playerIndex].y;

    // Add healing text that floats up
    const healText = this.add
      .text(x, y, `+${healAmount} HP`, {
        fontSize: "24px",
        color: "#00ff00",
        fontStyle: "bold",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Make the text float up and fade out
    this.tweens.add({
      targets: healText,
      y: y - 80,
      alpha: 0,
      duration: 1500,
      onComplete: () => healText.destroy(),
    });

    // Add a green glow effect around the character
    const healGlow = this.add.circle(x, y, 75, 0x00ff00, 0.4);

    // Make the glow pulse and fade
    this.tweens.add({
      targets: healGlow,
      alpha: 0,
      scale: 1.5,
      duration: 1000,
      onComplete: () => healGlow.destroy(),
    });
  }

  rotateBounce(box: Phaser.GameObjects.Image | null, bounceBox: boolean) {
    if (!box || !bounceBox) return;

    this.activeTween = this.tweens.add({
      targets: box,
      y: box.y - 30,
      angle: 360,
      ease: "Sine.easeInOut",
      duration: 150,
      yoyo: true,
      repeat: -1,
    });
  }

  stopBounce(box: Phaser.GameObjects.Image) {
    if (!box) return;
    // Stop all tweens affecting this box
    if (this.activeTween) {
      this.activeTween.stop();
      this.activeTween = null; // Clear reference
    }
    this.tweens.killTweensOf(box);
    // Ensure all tweens related to the box are stopped
    (box as Phaser.GameObjects.Image).y = 450; // Reset the Y position (change if needed)
    (box as Phaser.GameObjects.Image).setAngle(0); // Reset rotation to default
  }

  restartBounce(box: Phaser.GameObjects.Image | null, bounceBox: boolean) {
    this.rotateBounce(box, bounceBox);
  }

  // Special Effect: Rotate Attack
  rotateAttack(index: number) {
    const imgData = this.imageAttack[index]; // Get stored image

    // Prevent error if index is out of range
    if (!imgData || !imgData.image) return;

    this.tweens.add({
      targets: imgData.image, // Apply tween to the image
      angle: 360, // Rotate 360 degrees
      duration: 500, // Duration of the full rotation
      ease: "easeInOut", // Constant rotation speed
    });
  }
  //Special Effects
  shakeDmg(index: number) {
    const imgData = this.imageShake[index]; // Get stored image and original position

    // Prevent error if index is out of range
    if (!imgData || !imgData.image) return;

    this.tweens.add({
      targets: imgData.image, // Fix: No "s"
      x: imgData.originalX + Phaser.Math.Between(-5, 5), // Random X shake
      y: imgData.originalY + Phaser.Math.Between(-5, 5), // Random Y shake
      angle: Phaser.Math.Between(-5, 5), // Small rotation shake
      alpha: 0.3,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        imgData.image.x = imgData.originalX; // Reset X
        imgData.image.y = imgData.originalY; // Reset Y
        imgData.image.setAngle(0); // Reset rotation
      },
    });

    EventBus.emit("current-scene-ready", this);
  }

  // New method to check player status for wins/losses
  checkPlayerStatus() {
    for (let i = 0; i < this.playersLogs.length; i++) {
      // Check for eliminated players (server health ≤ 0)
      if (this.playersLogs[i].lifePoints <= 1) {
        this.handlePlayerElimination(i);
      }
      // Check for winners (server health ≥ 15)
      else if (this.playersLogs[i].lifePoints >= 15) {
        this.handlePlayerWin(i);
      }
    }
  }

  // Handle player elimination
  handlePlayerElimination(playerIndex: number) {
    if (
      !this.imageDead[playerIndex] ||
      !this.skull[playerIndex] ||
      !this.imageAttack_ani[playerIndex]
    ) {
      return; // Safety check
    }

    this.imageDead[playerIndex].setVisible(false);
    this.skull[playerIndex].setTexture("skull").setVisible(true);
    this.imageAttack_ani[playerIndex].destroy();

    // Notify server about elimination
    if (this.socket && this.playersLogs[playerIndex].id) {
      this.socket.emit(
        "updateHealthPoints",
        this.playersLogs[playerIndex].id,
        0, // Store as 0 for dead players
        (success: boolean) => {
          if (success) {
            console.log(
              `Player ${this.playersLogs[playerIndex].name} marked as eliminated on server`,
            );
          }
        },
      );
    }

    // Update local state
    this.playersLogs[playerIndex].lifePoints = NaN;
    this.playersLogs[playerIndex].luck = 0;
  }

  // Handle player win
  handlePlayerWin(playerIndex: number) {
    const prizeWOK = this.playersLogs.reduce(
      (sum, player) => sum + player.bet,
      0,
    );
    const text_color = "#000";

    // Set the winning player's health points to exactly 15
    this.playersLogs[playerIndex].lifePoints = 15;

    // Notify server about win
    if (this.socket && this.playersLogs[playerIndex].id) {
      this.socket.emit(
        "updateHealthPoints",
        this.playersLogs[playerIndex].id,
        15, // Store as 15 for winning players
        (success: boolean) => {
          if (success) {
            console.log(
              `Player ${this.playersLogs[playerIndex].name} marked as winner on server`,
            );
          }
        },
      );
    }

    // Display win screen
    setTimeout(() => {
      // Create win screen
      this.add.rectangle(this.cameraX, this.cameraY, 560, 310, 0x000000);

      this.add.rectangle(this.cameraX, this.cameraY, 550, 300, 0xffffff);

      this.add
        .text(
          this.cameraX,
          this.cameraY - 100,
          ["TOTAL PRIZE = " + prizeWOK + " Wok"],
          {
            fontSize: "28px",
            color: text_color,
            fontStyle: "bold",
          },
        )
        .setOrigin(0.5);

      this.add
        .text(
          this.cameraX,
          this.cameraY + 100,
          ["The Winner is " + this.playersLogs[playerIndex].name],
          {
            fontSize: "28px",
            color: text_color,
            fontStyle: "bold",
          },
        )
        .setOrigin(0.5);

      this.add
        .image(this.cameraX, this.cameraY, this.playersLogs[playerIndex].img)
        .setDisplaySize(120, 120);
    }, 1000);
  }

  update() {
    if (!this.updateFunction) {
      return;
    }

    // Update main player info text
    this.updateMainPlayerInfoText();

    // Update potion counts
    this.dpotion.setText(this.playersLogs[0].dpotion + "x");
    this.leppot.setText(this.playersLogs[0].leppot + "x");
    this.healthPotion?.setText(this.playersLogs[0].health_potion + "x");

    // Update other players' info
    for (let i = 1; i < this.playersLogs.length; i++) {
      if (this.text_value[i - 1]) {
        this.updatePlayerInfoText(i);
      }
    }

    // Check for game over conditions using server-stored health points
    let alivePlayers = this.playersLogs.filter(
      (player) => !isNaN(player.lifePoints) && player.lifePoints > 0,
    );

    // If only one player left alive, they win
    if (alivePlayers.length === 1 && this.playersLogs.length > 1) {
      const winner = alivePlayers[0];

      // Only force win if they haven't already won
      if (winner.lifePoints < 15) {
        // Force win condition
        winner.lifePoints = 15;

        // Update server
        if (this.socket && winner.id) {
          this.socket.emit(
            "updateHealthPoints",
            winner.id,
            winner.lifePoints,
            (success: boolean) => {
              if (success) {
                console.log(
                  `Last player standing ${winner.name} marked as winner on server`,
                );
                // Show win screen
                const winnerIndex = this.playersLogs.findIndex(
                  (p) => p.id === winner.id,
                );
                if (winnerIndex !== -1) {
                  this.handlePlayerWin(winnerIndex);
                }
              }
            },
          );
        }
      }
    }
  }
}
