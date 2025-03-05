import { Scene } from "phaser";

export class Shop extends Scene {
  private character: { color: string; luck: number; sprite: string; name: string };
  private characterBox!: Phaser.GameObjects.Rectangle;
  private characterText!: Phaser.GameObjects.Text;
  private currentCharacterSprite!: Phaser.GameObjects.Image;
  private characterNames: string[] = [
    "Red Death God", "Blue Death God", "Green Death God", "Pink Death God",
    "White Death God", "Yellow Death God", "Red Knight", "Yellow Knight",
    "Blue Knight", "White Night", "Pink Knight", "Green Kalbo"
  ];

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
  }

  create(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

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

    door.on("pointerdown", () => {
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

    // Assign a random sprite based on the color
    switch (this.character.color) {
      case "Red":
        this.character.sprite = `characterSprite${this.getRandomInt(1, 2) === 1 ? 1 : 7}`;
        break;
      case "Blue":
        this.character.sprite = `characterSprite${this.getRandomInt(1, 2) === 1 ? 2 : 9}`;
        break;
      case "Yellow":
        this.character.sprite = `characterSprite${this.getRandomInt(1, 2) === 1 ? 6 : 8}`;
        break;
      case "Green":
        this.character.sprite = `characterSprite${this.getRandomInt(1, 2) === 1 ? 3 : 12}`;
        break;
      case "Pink":
        this.character.sprite = `characterSprite${this.getRandomInt(1, 2) === 1 ? 4 : 11}`;
        break;
      case "White":
        this.character.sprite = `characterSprite${this.getRandomInt(1, 2) === 1 ? 5 : 10}`;
        break;
    }

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
