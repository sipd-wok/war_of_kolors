import { Scene } from "phaser";

export class Shop extends Scene {
  private character: { color: string; luck: number };
  private characterBox!: Phaser.GameObjects.Rectangle;
  private characterText!: Phaser.GameObjects.Text;

  constructor() {
    super("Shop");
    this.character = { color: "", luck: 0 }; 
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
    

    this.characterText.setText(`Tier: ${tier} \nColor: ${this.character.color}\nLuck Multiplier: ${this.character.luck}`);
  }
}
