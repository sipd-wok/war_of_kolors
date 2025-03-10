import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Profile extends Scene {
  background!: Phaser.GameObjects.Image;
  title!: Phaser.GameObjects.Text;
  userInfo!: Phaser.GameObjects.Text;
  userImage!: Phaser.GameObjects.Image;
  characterImage!: Phaser.GameObjects.Image;
  potionInfo!: Phaser.GameObjects.Text;
  backButton!: Phaser.GameObjects.Text;
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

  async init() {
      try {
        const response = await fetch("/api/getUser", { method: "GET" });
    
        if (!response.ok) {
          console.error("Failed to fetch user");
        } else {
          const data = await response.json();
          if (data.user) {
            this.user = data.user;
            console.log("User loaded:", this.user);
    
            // Emit event to notify that the user is loaded
            this.events.emit("user-loaded");
          }
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


  constructor() {
    super("Profile");
  }


  create() {
    const cameraX = this.cameras.main.width / 2;
    const cameraY = this.cameras.main.height / 2;
    console.log("Camera X: ", cameraX);
    console.log("Camera Y: ", cameraY);

    this.background = this.add.image(cameraX, cameraY, "background");
    
    this.title = this.add.text(cameraX, cameraY - 350, "Player Profile", {
      fontFamily: "Arial",
      fontSize: "32px",
      color: "#000000",
    }).setOrigin(0.5);
  
    // Placeholder text to avoid undefined error
    this.getUsername().then((username) => {
    this.userInfo = this.add.text(cameraX, cameraY - 150, `Username: ${username}` , {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#000000",
    }).setOrigin(0.5);
    });

    this.userImage = this.add.image(cameraX, cameraY, "profile").setDisplaySize(100, 100);
  
    this.backButton = this.add.text(cameraX, cameraY + 200, "Back", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#ff0000",
    }).setOrigin(0.5).setInteractive();
  
    this.backButton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  
    // Wait for user data to be loaded before updating UI
    this.events.on("user-loaded", () => {
      this.userInfo.setText(`Username: ${this.user.username}`);
    });
  
    EventBus.emit("current-scene-ready", this);
  }  
}