import { Scene, GameObjects } from "phaser";
import { EventBus } from "../../EventBus";

export class SellCharacters extends Scene {
  characterNameText!: GameObjects.Text;
  luckText!: GameObjects.Text;
  banner!: GameObjects.Image;
  ui_frame!: string;
  canvasFrame!: GameObjects.Image;
  characterFrame!: GameObjects.Image;
  characterImage!: GameObjects.Image;

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

  constructor() {
    super("SellCharacters");
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
        this.characters = data.characters;

        // Emit event to notify that characters are loaded
        this.events.emit("characters-loaded");
      }
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  }

  create() {
    const cameraX = this.cameras.main.width / 2;
    const cameraY = this.cameras.main.height / 2;

    const visualViewportWidth = window.visualViewport?.width || 1024;
    const visualViewportHeight = window.visualViewport?.height || 768;

    this.add.image(cameraX, cameraY, "background");
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
      .image(75, 75, "marketplace")
      .setDisplaySize(50, 50)
      .setInteractive()
      .on("pointerdown", () => {
        // Emit a browser event for testing
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("phaser-scene-change", {
              detail: "Marketplace",
            }),
          );
        }
        this.scene.start("Marketplace");
      });

    if (visualViewportWidth !== undefined && visualViewportWidth < 1024) {
      canvasFrameConfig.width = visualViewportWidth + 80;
      this.canvasFrame.setDisplaySize(
        canvasFrameConfig.width,
        visualViewportHeight + 200,
      );
    }

    this.add
      .text(cameraX, 130, "Sell Characters", {
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

    this.add
      .text(cameraX, cameraY + 150, "Sell Character", {
        fontFamily: "Arial",
        padding: { x: 10, y: 5 },
        color: "#ffffff",
        backgroundColor: "#4e342e",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", async () => {
        // Show loading indicator
        const loadingText = this.add
          .text(cameraX, cameraY + 180, "Processing...", {
            fontFamily: "Arial",
            fontSize: 16,
            color: "#000000",
          })
          .setOrigin(0.5);

        try {
          if (!this.selectedCharacter) {
            this.showError("No character selected");
            loadingText.destroy();
            return;
          }

          const response = await fetch("/api/marketplace/sellCharacter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              character_id: this.selectedCharacter.id,
              price: 100,
              currency: "wok",
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            this.showError(data.error || "Failed to sell character");
          } else {
            this.showSuccess("Character listed for sale!");
            // Refresh character list
            await this.init();
            if (this.characters.length > 0) {
              // Character was sold, adjust selection
              this.selectedIndex = Math.min(
                this.selectedIndex,
                this.characters.length - 1,
              );
              this.selectedCharacter = this.characters[this.selectedIndex];
              this.updateCharacterBasedUI();
            }
          }
        } catch (error) {
          console.error("Error selling character:", error);
          this.showError("Network error, please try again");
        } finally {
          // Remove loading indicator
          loadingText.destroy();
        }
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
      }
    });

    EventBus.emit("current-scene-ready", this);
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

  // Add new helper methods for feedback
  private showError(message: string) {
    const errorText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 210,
        message,
        {
          fontFamily: "Arial",
          fontSize: 16,
          color: "#ffffff",
          backgroundColor: "#ff0000",
          padding: { x: 10, y: 5 },
        },
      )
      .setOrigin(0.5)
      .setDepth(1000);

    // Auto-destroy after a few seconds
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: errorText,
        alpha: 0,
        duration: 500,
        onComplete: () => errorText.destroy(),
      });
    });
  }

  private showSuccess(message: string) {
    const successText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 210,
        message,
        {
          fontFamily: "Arial",
          fontSize: 16,
          color: "#ffffff",
          backgroundColor: "#008000",
          padding: { x: 10, y: 5 },
        },
      )
      .setOrigin(0.5)
      .setDepth(1000);

    // Auto-destroy after a few seconds
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: successText,
        alpha: 0,
        duration: 500,
        onComplete: () => successText.destroy(),
      });
    });
  }
}
