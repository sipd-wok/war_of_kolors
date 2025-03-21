import { GameObjects, Scene } from "phaser";
import { Socket } from "socket.io-client";
import { EventBus } from "../EventBus";
import { socketService } from "../SocketService";

export class MainMenu extends Scene {
  background!: GameObjects.Image;
  title!: GameObjects.Text;
  createRoomBttn!: GameObjects.Text;
  getWok!: GameObjects.Text;
  openShop!: GameObjects.Text;
  socket!: Socket;
  showProfile!: GameObjects.Image;
  canvasFrame!: GameObjects.Image;
  characterFrame!: GameObjects.Image;
  characterImage!: GameObjects.Image;
  banner!: GameObjects.Image;
  user!: { id: string; user_id: string; username: string };
  potions!: {
    id: string;
    devil: number;
    leprechaun: number;
    hp: number;
  };
  characters: {
    id: number;
    name: string;
    sprite: string;
    created_at: string;
    tier: string;
    color: string;
  }[] = [];

  selectedIndex: number = 0;
  selectedCharacter: {
    id: number;
    name: string;
    sprite: string;
    created_at: string;
    tier: string;
    color: string;
    luck?: number;
  } | null = null;

  ui_frame!: string;
  characterNameText!: GameObjects.Text;
  luckText!: GameObjects.Text;
  joinRoomBttn!: GameObjects.Text;
  devilPottionText!: GameObjects.Text;
  hpPottionText!: GameObjects.Text;
  lePottionText!: GameObjects.Text;
  constructor() {
    super("MainMenu");

    // Use the shared socket service instead of creating a new connection
    this.socket = socketService.getSocket();
  }

  preload() {
    this.load.image("marketplace", "assets/shop-icon.png");
  }

  private shopPayment!: (amount: string) => Promise<void>;

  private async getUsername(): Promise<string> {
    try {
      const response = await fetch("/api/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.user.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown";
    }
  }

  private updateCharacterBasedUI() {
    if (this.selectedCharacter) {
      this.characterNameText.setText(this.selectedCharacter.name);
      this.luckText.setText(
        "Luck: " + this.selectedCharacter.luck?.toString() || "0",
      );
      if (this.selectedCharacter.tier.toLowerCase() === "gold") {
        this.ui_frame = "toy-frame-gold";
        this.banner.setTexture("banner-gold");
      } else if (this.selectedCharacter.tier.toLowerCase() === "silver") {
        this.ui_frame = "toy-frame-silver";
        this.banner.setTexture("banner-silver");
      } else if (this.selectedCharacter.tier.toLowerCase() === "bronze") {
        this.ui_frame = "toy-frame-bronze";
        this.banner.setTexture("banner-bronze");
      }
      this.canvasFrame.setTexture(this.ui_frame);
      this.characterFrame.setTexture(this.ui_frame);
      this.characterImage.setTexture(this.selectedCharacter.sprite);

      // Get original dimensions of the sprite
      const texture = this.textures.get(this.selectedCharacter.sprite);
      const frame = texture.get();
      if ((frame.width = 480)) {
        this.characterImage.setDisplaySize(200, 200);
      } else if ((frame.width = 1024)) {
        this.characterImage.setDisplaySize(100, 100);
      }

      if (this.selectedCharacter.color.toLowerCase() === "red") {
        this.characterNameText.setColor("#ff0000").setStroke("#ffffff", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "blue") {
        this.characterNameText.setColor("#0000ff").setStroke("#ffffff", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "green") {
        this.characterNameText.setColor("#00ff00").setStroke("#000000", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "yellow") {
        this.characterNameText.setColor("#ffff00").setStroke("#000000", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "purple") {
        this.characterNameText.setColor("#800080").setStroke("#ffffff", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "orange") {
        this.characterNameText.setColor("#ffa500").setStroke("#ffffff", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "pink") {
        this.characterNameText.setColor("#ffc0cb").setStroke("#000000", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "brown") {
        this.characterNameText.setColor("#a52a2a").setStroke("#ffffff", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "black") {
        this.characterNameText.setColor("#000000").setStroke("#ffffff", 4);
      } else if (this.selectedCharacter.color.toLowerCase() === "white") {
        this.characterNameText.setColor("#ffffff").setStroke("#000000", 4);
      } else {
        this.characterNameText.setColor("#000000").setStroke("#ffffff", 4);
      }
    }
  }

  async init() {
    try {
      const response = await fetch("/api/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch user:", errorData);
      } else {
        const data = await response.json();
        this.user = data.user;

        // Emit event to notify that characters are loaded
        this.events.emit("user-loaded");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }

    try {
      const response = await fetch("/api/getCharacters", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch characters:", errorData);
      } else {
        const data = await response.json();
        this.characters = data.characters;

        // Emit event to notify that characters are loaded
        this.events.emit("characters-loaded");
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }

    try {
      const response = await fetch("/api/inventory/getPotionInventory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to get inventory:", errorData);
      } else {
        const data = await response.json();
        this.potions = data.potions;

        // Emit event to notify that characters are loaded
        this.events.emit("potions-loaded");
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  }
  private async payRoom(price: string) {
    const payment = this.game.registry.get("shopPayment");
    try {
      await payment(price);
      return { message: "Success" };
    } catch (err) {
      console.log(err);
      return { message: "Failed" };
    }
  }
  create() {
    this.sound.add("ambiance", { loop: true }).play();

    const cameraX = this.cameras.main.width / 2;
    const cameraY = this.cameras.main.height / 2;

    const visualViewportWidth = window.visualViewport?.width || 1024;
    const visualViewportHeight = window.visualViewport?.height || 768;

    this.background = this.add.image(cameraX, cameraY, "background");

    const canvasFrameConfig = {
      width: visualViewportWidth + 300,
    };
    const bannerConfig = {
      posX: 0,
    };

    this.canvasFrame = this.add.image(
      cameraX,
      cameraY - 10,
      "toy-frame-silver",
    );

    this.add
      .image(75, 200, "marketplace")
      .setDisplaySize(50, 50) // Fix the display size
      .setInteractive()
      .on("pointerdown", () => {
        // Emit a browser event to navigate to marketplace
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("go-to-marketplace", {
              detail: "Marketplace",
            }),
          );
        }
      });

    if (visualViewportWidth !== undefined && visualViewportWidth < 1024) {
      canvasFrameConfig.width = visualViewportWidth + 80;
      this.canvasFrame.setDisplaySize(
        canvasFrameConfig.width,
        visualViewportHeight + 200,
      );
    }

    this.title = this.add
      .text(cameraX, 130, "War of Colors", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    if (this.characters && this.characters.length > 0) {
      // Use first available character if index 1 doesn't exist
      this.selectedIndex = this.characters.length > 1 ? 1 : 0;
      this.selectedCharacter = this.characters[this.selectedIndex];
    } else {
      // Set a placeholder until data is loaded
      this.selectedCharacter = {
        id: 0,
        name: "Loading...",
        sprite: "characterSprite1",
        created_at: "",
        tier: "silver",
        color: "none",
        luck: 0,
      };
    }

    const loader = this.add
      .image(cameraX, cameraY - 100, "loader")
      .setScale(0.25);
    this.tweens.add({
      targets: loader,
      angle: 360,
      duration: 500,
      ease: "Linear",
      repeat: -1,
    });

    this.characterNameText = this.add
      .text(cameraX, cameraY + 50, "No Characters Found...", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const nextCharacter = this.add.triangle(
      cameraX + 175,
      cameraY - 100,
      0,
      0,
      0,
      100,
      50,
      50,
      0xff0000,
    );

    const previousCharacter = this.add.triangle(
      cameraX - 125,
      cameraY - 100,
      0,
      0,
      0,
      100,
      -50,
      50,
      0xff0000,
    );

    this.time.addEvent({
      delay: 1200,
      callback: () => {
        this.tweens.add({
          targets: nextCharacter,
          x: nextCharacter.x + 12,
          duration: 600,
          ease: "Power2",
          yoyo: true,
        });
        this.tweens.add({
          targets: previousCharacter,
          x: previousCharacter.x - 12,
          duration: 600,
          ease: "Power2",
          yoyo: true,
        });
      },
      loop: true,
    });

    // When characters finally load, update the UI
    this.events.once("characters-loaded", () => {
      if (this.characters && this.characters.length > 0) {
        this.selectedIndex = this.characters.length > 0 ? 0 : 0;
        this.selectedCharacter = this.characters[this.selectedIndex];

        this.canvasFrame.setDisplaySize(
          canvasFrameConfig.width,
          visualViewportHeight + 200,
        );
        this.characterFrame = this.add
          .image(cameraX, cameraY - 100, "")
          .setScale(0.21, 0.25)
          .setDepth(200);
        this.banner = this.add
          .image(bannerConfig.posX, 0, "banner-silver")
          .setScale(0.1)
          .setOrigin(0)
          .setDepth(50);
        this.characterImage = this.add
          .image(cameraX, cameraY - 100, "characterSprite1")
          .setDisplaySize(100, 100);

        this.luckText = this.add
          .text(cameraX, cameraY + 80, "Luck: " + this.selectedCharacter.luck, {
            fontFamily: "Arial",
            fontSize: 24,
            color: "#000000", // Dark gray color
            strokeThickness: 4,
          })
          .setOrigin(0.5);

        // Get and log original sprite dimensions
        // const texture = this.textures.get(this.characterImage.texture.key);
        // const frame = texture.get();
        // console.log(
        //   `Original character sprite dimensions: ${frame.width} x ${frame.height}`,
        // );

        this.updateCharacterBasedUI();

        loader.destroy();

        nextCharacter
          .setInteractive(
            Phaser.Geom.Triangle.BuildEquilateral(0, 0, 100),
            Phaser.Geom.Triangle.Contains,
          )
          .on("pointerdown", () => {
            if (this.selectedIndex < this.characters.length - 1) {
              this.selectedIndex++;
              this.selectedCharacter = this.characters[this.selectedIndex];
              this.updateCharacterBasedUI();
            } else {
              this.selectedIndex = 0;
              this.selectedCharacter = this.characters[this.selectedIndex];
              this.updateCharacterBasedUI();
            }
          });

        previousCharacter
          .setInteractive(
            Phaser.Geom.Triangle.BuildEquilateral(0, 0, 100),
            Phaser.Geom.Triangle.Contains,
          )
          .on("pointerdown", () => {
            if (this.selectedIndex > 0) {
              this.selectedIndex--;
              this.selectedCharacter = this.characters[this.selectedIndex];
              this.updateCharacterBasedUI();
            } else {
              this.selectedIndex = this.characters.length - 1;
              this.selectedCharacter = this.characters[this.selectedIndex];
              this.updateCharacterBasedUI();
            }
          });

        this.createRoomBttn.setInteractive();
        this.joinRoomBttn.setInteractive();
        this.getWok.setInteractive();
      }
    });

    this.add
      .image(visualViewportWidth - 70, 50, "devilsPotion")
      .setDisplaySize(60, 60)
      .setAbove(this.canvasFrame);
    this.devilPottionText = this.add
      .text(visualViewportWidth - 70, 60, "0", {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#000000",
        strokeThickness: 4,
        stroke: "#ffffff",
        align: "center",
      })
      .setAbove(this.canvasFrame);
    this.add
      .image(visualViewportWidth - 125, 50, "healthPotion")
      .setDisplaySize(60, 60)
      .setAbove(this.canvasFrame);
    this.hpPottionText = this.add
      .text(visualViewportWidth - 125, 60, "0", {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#000000",
        strokeThickness: 4,
        stroke: "#ffffff",
        align: "center",
      })
      .setAbove(this.canvasFrame);
    this.add
      .image(visualViewportWidth - 180, 50, "leprechaunsPotion")
      .setDisplaySize(60, 60)
      .setAbove(this.canvasFrame);
    this.lePottionText = this.add
      .text(visualViewportWidth - 180, 60, "0", {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#000000",
        strokeThickness: 4,
        stroke: "#ffffff",
        align: "center",
      })
      .setAbove(this.canvasFrame);

    this.events.once("potions-loaded", () => {
      this.devilPottionText.setText(this.potions.devil.toString());
      this.hpPottionText.setText(this.potions.hp.toString());
      this.lePottionText.setText(this.potions.leprechaun.toString());
    });

    // --- Create Lobby Button ---
    this.createRoomBttn = this.add
      .text(cameraX, cameraY + 150, "Create Room", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .on("pointerover", () => {
        this.createRoomBttn.setStyle({ color: "#ffff00" }); // Change color on hover
      })
      .on("pointerout", () => {
        this.createRoomBttn.setStyle({ color: "#ffffff" }); // Reset color on mouse out
      })
      .on("pointerdown", () => {
        let roomToJoin = "";

        this.socket.emit("createPlayerRoom", (roomID: string) => {
          roomToJoin = roomID;

          this.scene.start("WaitingRoom", {
            roomID: roomToJoin,
            user: this.user,
            character: this.selectedCharacter,
            potions: this.potions,
          });
        });
      });

    // --- Join Lobby Button ---
    this.joinRoomBttn = this.add
      .text(cameraX, cameraY + 220, "Join Room", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .on("pointerover", () => {
        this.joinRoomBttn.setStyle({ color: "#ffff00" });
      })
      .on("pointerout", () => {
        this.joinRoomBttn.setStyle({ color: "#ffffff" });
      })
      .on("pointerdown", async () => {
        const payment = await this.payRoom("10");
        if (payment.message === "Failed") {
          return null;
        } else {
          console.log("Joining room...");
          this.socket.emit(
            "getAvailableRoom",
            this.selectedCharacter?.color.toLowerCase(),
            (roomID: string, colorRepresentativesIndex: string) => {
              let roomtoJoin = "";
              roomtoJoin = roomID;
              if (this.selectedCharacter) {
                this.selectedCharacter.color = colorRepresentativesIndex;
              }
              console.log("Joining room: " + roomtoJoin);

              this.scene.start("WaitingRoom", {
                roomID: roomID,
                user: this.user,
                character: this.selectedCharacter,
                potions: this.potions,
              });
            },
          );
        }
      });

    // --- Open Shop Button---
    this.openShop = this.add
      .text(cameraX, cameraY + 290, "Open Shop", {
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

    // GET WOK TOKEN BUTTON
    this.getWok = this.add.text(cameraX + 250, cameraY - 350, "Get Free Wok", {
      fontFamily: "Arial",
      fontSize: 32,
      color: "#ffffff",
      backgroundColor: "#4e342e",
      padding: { x: 10, y: 20 },
    });
    this.getWok.on("pointerdown", async () => {
      const walletAddress = this.game.registry.get("walletAddress");
      try {
        const response = await fetch(
          `/api/requestWok?address=${walletAddress}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        console.log(data);
        if (response.status == 429) {
          alert(data.error);
          return null;
        } else {
          alert(data.message);
          return null;
        }
      } catch (err) {
        console.log(err);
      }
    });
    // --- Open Profile Button ---
    this.add
      .image(cameraX - 480, cameraY - 310, "profile")
      .setDisplaySize(100, 100) // Fix the display size
      .setInteractive()
      .on("pointerdown", () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("go-to-profile", {
              detail: "profile",
            }),
          );
        }
      });

    this.getUsername().then((username) => {
      this.add.text(cameraX - 430, cameraY - 320, `${username}`, {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#000000",
      });
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {}
}
