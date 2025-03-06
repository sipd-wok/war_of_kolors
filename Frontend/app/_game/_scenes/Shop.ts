import { Scene } from "phaser";
export class Shop extends Scene {
  private character: { color: string; luck: number; sprite: string; name: string };
  private characterBox!: Phaser.GameObjects.Rectangle;
  private characterText!: Phaser.GameObjects.Text;
  private currentCharacterSprite!: Phaser.GameObjects.Image;
  private characterNames: string[] = [
    // Death Gods
    "Red Death God", "Blue Death God", "Green Death God", "Pink Death God", "White Death God", "Yellow Death God", 
    // Knights
    "Red Knight", "Yellow Knight", "Blue Knight", "White Knight", "Pink Knight", "Green Knight", 
    // Spear Warriors
    "Blue Spear Warrior", "Green Spear Warrior", "Red Spear Warrior", "Pink Spear Warrior", "White Spear Warrior", "Yellow Spear Warrior", 
    // Monks
    "White Monk", "Red Monk", "Blue Monk", "Pink Monk", "Yellow Monk", "Green Monk",
    // Vanguard
    "Yellow Vanguard", "Red Vanguard", "Pink Vanguard", "Blue Vanguard", "White Vanguard", "Green Vanguard", 
    // Beast Riders
    "Green Beast Rider", "Blue Beast Rider", "Red Beast Rider", "Pink Beast Rider", "White Beast Rider", "Yellow Beast Rider",
    // Mages
    "Green Mage", "Red Mage", "Pink Mage", "White Mage", "Yellow Mage", "Blue Mage",
    // Warrior Princesses
    "Blue Warrior Princess", "White Warrior Princess", "Yellow Warrior Princess", "Red Warrior Princess", "Green Warrior Princess", "Pink Warrior Princess",
    // Ninjas
    "Red Ninja", "Pink Ninja", "Green Ninja", "Yellow Ninja", "Blue Ninja", "White Ninja",
    // Tribal Chief
    "Blue Tribal Chief", "Green Tribal Chief", "Yellow Tribal Chief", "White Tribal Chief", "Red Tribal Chief", "Pink Tribal Chief",
    // Great Elder
    "White Great Elder", "Pink Great Elder", "Yellow Great Elder", "Red Great Elder", "Green Great Elder", "Blue Great Elder",
  ];


  private buyCharacter!: (amount: string) => Promise<void>;

  constructor() {
    super("Shop");
    this.character = 
    { 
      color: "", 
      luck: 0,
      sprite: "",
      name : "",
    }; 
  }

  preload(): void {
    this.load.image('characterSprite1', 'assets/char_1.png');
    this.load.image('characterSprite2', 'assets/char_2.png');
    this.load.image('characterSprite3', 'assets/char_3.png');
    this.load.image('characterSprite4', 'assets/char_4.png');
    this.load.image('characterSprite5', 'assets/char_5.png');
    this.load.image('characterSprite6', 'assets/char_6.png');
    this.load.image('characterSprite7', 'assets/char_7.png');
    this.load.image('characterSprite8', 'assets/char_8.png');
    this.load.image('characterSprite9', 'assets/char_9.png');
    this.load.image('characterSprite10', 'assets/char_10.png');
    this.load.image('characterSprite11', 'assets/char_11.png');
    this.load.image('characterSprite12', 'assets/char_12.png');
    this.load.image('characterSprite13', 'assets/char_13.png');
    this.load.image('characterSprite14', 'assets/char_14.png');
    this.load.image('characterSprite15', 'assets/char_15.png');
    this.load.image('characterSprite16', 'assets/char_16.png');
    this.load.image('characterSprite17', 'assets/char_17.png');
    this.load.image('characterSprite18', 'assets/char_18.png');
    this.load.image('characterSprite19', 'assets/char_19.png');
    this.load.image('characterSprite20', 'assets/char_20.png');
    this.load.image('characterSprite21', 'assets/char_21.png');
    this.load.image('characterSprite22', 'assets/char_22.png');
    this.load.image('characterSprite23', 'assets/char_23.png');
    this.load.image('characterSprite24', 'assets/char_24.png');
    this.load.image('characterSprite25', 'assets/char_25.png');
    this.load.image('characterSprite26', 'assets/char_26.png');
    this.load.image('characterSprite27', 'assets/char_27.png');
    this.load.image('characterSprite28', 'assets/char_28.png');
    this.load.image('characterSprite29', 'assets/char_29.png');
    this.load.image('characterSprite30', 'assets/char_30.png');
    this.load.image('characterSprite31', 'assets/char_31.png');
    this.load.image('characterSprite32', 'assets/char_32.png');
    this.load.image('characterSprite33', 'assets/char_33.png');
    this.load.image('characterSprite34', 'assets/char_34.png');
    this.load.image('characterSprite35', 'assets/char_35.png');
    this.load.image('characterSprite36', 'assets/char_36.png');
    this.load.image('characterSprite37', 'assets/char_37.png');
    this.load.image('characterSprite38', 'assets/char_38.png');
    this.load.image('characterSprite39', 'assets/char_39.png');
    this.load.image('characterSprite40', 'assets/char_40.png');
    this.load.image('characterSprite41', 'assets/char_41.png');
    this.load.image('characterSprite42', 'assets/char_42.png');
    this.load.image('characterSprite43', 'assets/char_43.png');
    this.load.image('characterSprite44', 'assets/char_44.png');
    this.load.image('characterSprite45', 'assets/char_45.png');
    this.load.image('characterSprite46', 'assets/char_46.png');
    this.load.image('characterSprite47', 'assets/char_47.png');
    this.load.image('characterSprite48', 'assets/char_48.png');
    this.load.image('characterSprite49', 'assets/char_49.png');
    this.load.image('characterSprite50', 'assets/char_50.png');
    this.load.image('characterSprite51', 'assets/char_51.png');
    this.load.image('characterSprite52', 'assets/char_52.png');
    this.load.image('characterSprite53', 'assets/char_53.png');
    this.load.image('characterSprite54', 'assets/char_54.png');
    this.load.image('characterSprite55', 'assets/char_55.png');
    this.load.image('characterSprite56', 'assets/char_56.png');
    this.load.image('characterSprite57', 'assets/char_57.png');
    this.load.image('characterSprite58', 'assets/char_58.png');
    this.load.image('characterSprite59', 'assets/char_59.png');
    this.load.image('characterSprite60', 'assets/char_60.png');
    this.load.image('characterSprite61', 'assets/char_61.png');
    this.load.image('characterSprite62', 'assets/char_62.png');
    this.load.image('characterSprite63', 'assets/char_63.png');
    this.load.image('characterSprite64', 'assets/char_64.png');
    this.load.image('characterSprite65', 'assets/char_65.png');
    this.load.image('characterSprite66', 'assets/char_66.png');
  }

  create(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.buyCharacter = this.registry.get("buyCharacter");
    // Title
    this.add.text(centerX, 50, 
        "Choose a Door", 
        { 
          fontFamily: "Arial Black",
          fontSize: 64,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
        })
        .setOrigin(0.5);

    //Doors
    this.createDoor(centerX - 200, centerY - 100, "Bronze", 0.01, 0.05, 10000);
    this.createDoor(centerX, centerY - 100, "Silver", 0.05, 0.1, 20000);
    this.createDoor(centerX + 200, centerY - 100, "Gold", 0.1, 0.15, 30000);

    this.createCharacterBox(centerX, centerY + 200);
  }

  private createDoor(x: number, y: number, tier: "Bronze" | "Silver" | "Gold", minLuck: number, maxLuck: number, price: number): void {
    const door = this.add.rectangle(x, y, 100, 200, this.getDoorColor(tier)).setInteractive();
    this.add.text(x, y - 120, tier, 
      { 
        fontFamily: "Arial",
        fontSize: 24, 
        color: "#ffffff" 
      })
      .setOrigin(0.5);
    this.add.text(x, y + 130, `Price: ${price}`, 
      { 
        fontFamily: "Arial",
        fontSize: 20, 
        color: "#ffffff" 
      })
      .setOrigin(0.5);

    door.on("pointerdown", async() => {
      await this.buyCharacter(price.toString());
      this.assignCharacter(tier, minLuck, maxLuck);
    });
  }

  private createCharacterBox(centerX: number, centerY: number): void {
    this.characterBox = this.add.rectangle(centerX, centerY, 300, 150, 0x333333).setOrigin(0.5);
    this.characterBox.setStrokeStyle(2, 0xffffff);

    this.characterText = this.add.text(centerX - 130, centerY - 40, "Tier: \nColor: \nLuck Multiplier: ", {
      fontFamily: "Arial",
      fontSize: 20,
      color: "#ffffff",
    });
  }

  private getDoorColor(tier: "Bronze" | "Silver" | "Gold"): number {
    return { Bronze: 0x8B4513, Silver: 0xC0C0C0, Gold: 0xFFD700 }[tier];
  }

  private getRandomColor(): string {
    const colors = ["White", "Green", "Pink", "Yellow", "Blue", "Red"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private assignCharacter(tier: "Bronze" | "Silver" | "Gold", minLuck: number, maxLuck: number): void {
    if (!this.characterText) this.createCharacterBox(this.cameras.main.centerX, this.cameras.main.centerY + 200); 

    this.character.color = this.getRandomColor();
    this.character.luck = parseFloat((Math.random() * (maxLuck - minLuck) + minLuck).toFixed(2));

    // Define sprite options based on color
    const spriteOptions: Record<string, number[]> = {
      "Red": [1, 7, 15, 20, 26, 33, 38, 46, 49, 59, 64],
      "Blue": [2, 9, 13, 21, 28, 32, 42, 43, 53, 55, 66],
      "Yellow": [6, 8, 18, 23, 25, 36, 41, 45, 52, 57, 63],
      "Green": [3, 12, 14, 24, 30, 31, 37, 47, 51, 56, 65],
      "Pink": [4, 11, 16, 22, 27, 34, 39, 48, 50, 60, 62],
      "White": [5, 10, 17, 19, 29, 35, 40, 44, 54, 54, 61],
    };

    
    const possibleSprites = spriteOptions[this.character.color];
    
    const randomIndex = this.getRandomInt(0, possibleSprites.length - 1);
    this.character.sprite = `characterSprite${possibleSprites[randomIndex]}`;

    this.character.name = this.characterNames[parseInt(this.character.sprite.replace('characterSprite', '')) - 1];

    this.characterText.setText(`Tier: ${tier} \nColor: ${this.character.color}\nLuck Multiplier: ${this.character.luck}\nName: ${this.character.name}`);

    // Remove the previous character sprite if it exists
    if (this.currentCharacterSprite) {
      this.currentCharacterSprite.destroy();
    }

    // Display the new character image with size 100x100 pixels
    this.currentCharacterSprite = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 100, this.character.sprite)
      .setOrigin(0.5)
      .setDisplaySize(100, 100);

    // Show the modal to display the character details
    this.showCharacterModal();
  }

  // Helper function to get a random integer between min and max (inclusive)
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private showCharacterModal(): void {
    const modalBackground = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 520, 320, 0x000000, 0.8).setOrigin(0.5);
    const modalBox = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 500, 300, 0xffffff).setOrigin(0.5);
    const modalText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, `Congratulations! You Got ${this.character.name}`, {
      fontFamily: "Arial",
      fontSize: 24,
      color: "#000000",
    }).setOrigin(0.5);
  
    const characterImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, this.character.sprite)
      .setOrigin(0.5)
      .setDisplaySize(100, 100);
  
    const closeButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, "Close", {
      fontFamily: "Arial",
      fontSize: 24,
      color: "#ffffff",
      backgroundColor: "#4e342e",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive();
  
    closeButton.on("pointerdown", () => {
      modalBackground.destroy();
      modalBox.destroy();
      modalText.destroy();
      characterImage.destroy();
      closeButton.destroy();
    });
  }
}
