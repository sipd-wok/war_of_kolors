import { GameObjects, Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
  background!: GameObjects.Image;
  title!: GameObjects.Text;
  createRoomBttn!: GameObjects.Text;
  openShop!: GameObjects.Text;
  socket!: Socket;
  canvasFrame!: GameObjects.Image;
  characterFrame!: GameObjects.Image;
  characterImage!: GameObjects.Image;
  banner!: GameObjects.Image;
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

  constructor() {
    super("MainMenu");

    this.socket = io(`http://localhost:3000`);
  }

  private updateCharacterBasedUI() {
    console.log("Selected character: ", this.selectedCharacter);
    if (this.selectedCharacter) {
      this.characterNameText.setText(this.selectedCharacter.name);
      this.luckText.setText(
        "Luck: " + this.selectedCharacter.luck?.toString() || "0",
      );

      console.log("Selected character tier: ", this.selectedCharacter.tier);
      if (this.selectedCharacter.tier.toLowerCase() === "gold") {
        this.ui_frame = "toy-frame-gold";
        this.banner.setTexture("banner-gold");
        console.log("Current Frame: ", this.ui_frame);
      } else if (this.selectedCharacter.tier.toLowerCase() === "silver") {
        this.ui_frame = "toy-frame-silver";
        this.banner.setTexture("banner-silver");
        console.log("Current Frame: ", this.ui_frame);
      } else if (this.selectedCharacter.tier.toLowerCase() === "bronze") {
        this.ui_frame = "toy-frame-bronze";
        this.banner.setTexture("banner-bronze");
        console.log("Current Frame: ", this.ui_frame);
      }
      this.canvasFrame.setTexture(this.ui_frame);
      this.characterFrame.setTexture(this.ui_frame);
      this.characterImage.setTexture(this.selectedCharacter.sprite);

      // Get original dimensions of the sprite
      const texture = this.textures.get(this.selectedCharacter.sprite);
      const frame = texture.get();
      console.log(
        `Original sprite dimensions: ${frame.width} x ${frame.height}`,
      );
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
        console.log("Characters fetched successfully: ", data);
        this.characters = data.characters;
        console.log("These are the characters: ", this.characters);

        // Emit event to notify that characters are loaded
        this.events.emit("characters-loaded");
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  }

  create() {
    this.sound.add("ambiance", { loop: true }).play();

    const cameraX = this.cameras.main.width / 2;
    const cameraY = this.cameras.main.height / 2;
    console.log("Camera X: ", cameraX);
    console.log("Camera Y: ", cameraY);
    const visualViewportWidth = window.visualViewport?.width || 1024;
    const visualViewportHeight = window.visualViewport?.height || 768;

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

    if (visualViewportWidth !== undefined && visualViewportWidth < 1024) {
      canvasFrameConfig.width = visualViewportWidth + 80;
      bannerConfig.posX = (1024 - visualViewportWidth) / 2 + 150;
      this.canvasFrame.setDisplaySize(
        canvasFrameConfig.width,
        visualViewportHeight + 200,
      );
    }
    this.background = this.add.image(cameraX, cameraY, "background");

    this.title = this.add
      .text(cameraX, 100, "War of Colors", {
        fontFamily: "Arial Black",
        fontSize: 40,
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

        this.canvasFrame = this.add
          .image(cameraX, cameraY - 10, "toy-frame-silver")
          .setDisplaySize(canvasFrameConfig.width, visualViewportHeight + 200);
        this.characterFrame = this.add
          .image(cameraX, cameraY - 100, "")
          .setScale(0.21, 0.25)
          .setDepth(200);
        this.banner = this.add
          .image(bannerConfig.posX, 0, "banner-silver")
          .setScale(0.15)
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
        const texture = this.textures.get(this.characterImage.texture.key);
        const frame = texture.get();
        console.log(
          `Original character sprite dimensions: ${frame.width} x ${frame.height}`,
        );

        this.updateCharacterBasedUI();

        loader.destroy();

        nextCharacter
          .setInteractive(
            Phaser.Geom.Triangle.BuildEquilateral(0, 0, 100),
            Phaser.Geom.Triangle.Contains,
          )
          .on("pointerdown", () => {
            console.log("Next character");
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
            console.log("Previous character");
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
      }
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
      .setInteractive();

    this.createRoomBttn.on("pointerover", () => {
      this.createRoomBttn.setStyle({ color: "#ffff00" }); // Change color on hover
    });

    this.createRoomBttn.on("pointerout", () => {
      this.createRoomBttn.setStyle({ color: "#ffffff" }); // Reset color on mouse out
    });

    this.createRoomBttn.on("pointerdown", () => {
      let roomToJoin = "";

      this.socket.emit("createGuestRoom", (roomID: string) => {
        roomToJoin = roomID;

        console.log("Room created: " + roomToJoin);

        this.scene.start("WaitingRoom", {
          roomID: roomToJoin,
        });
      });
    });

    // --- Join Lobby Button ---
    const joinRoomBttn = this.add
      .text(cameraX, cameraY + 220, "Join Room", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#4e342e",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive();

    joinRoomBttn.on("pointerover", () => {
      joinRoomBttn.setStyle({ color: "#ffff00" });
    });

    joinRoomBttn.on("pointerout", () => {
      joinRoomBttn.setStyle({ color: "#ffffff" });
    });

    joinRoomBttn.on("pointerdown", () => {
      console.log("Joining room...");

      this.socket.emit("getAvailableRoom", (roomID: string) => {
        let roomtoJoin = "";
        roomtoJoin = roomID;
        console.log("Joining room: " + roomtoJoin);

        this.scene.start("WaitingRoom", { roomID: roomID });
      });
    });

    EventBus.emit("current-scene-ready", this);

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

    EventBus.emit("current-scene-ready", this);
  }

  changeScene(sceneName: string) {
    this.scene.start(sceneName);
  }
}
