import { Scene } from "phaser";
export class Shop extends Scene {
  imageURI!: string;

  private character: {
    tier: string;
    color: string;
    hp: number;
    atk: number;
    def: number;
    luck: number;
    sprite: string;
    name: string;
  };
  private characterNames: string[] = [
    // Death Gods
    "Red Death God",
    "Blue Death God",
    "Yellow Death God",
    "Green Death God",
    "Pink Death God",
    "White Death God",
    "Rainbow Death God",
    
    // Knights
    "Red Knight",
    "Blue Knight",
    "Yellow Knight",
    "Green Knight",
    "Pink Knight",
    "White Knight",
    "Rainbow Knight",
    
    // Spear Warriors
    "Red Spear Warrior",
    "Blue Spear Warrior",
    "Yellow Spear Warrior",
    "Green Spear Warrior",
    "Pink Spear Warrior",
    "White Spear Warrior",
    "Rainbow Spear Warrior",
    
    // Monks
    "Red Monk",
    "Blue Monk",
    "Yellow Monk",
    "Green Monk",
    "Pink Monk",
    "White Monk",
    "Rainbow Monk",
    
    // Vanguard
    "Red Vanguard",
    "Blue Vanguard",
    "Yellow Vanguard",
    "Green Vanguard",
    "Pink Vanguard",
    "White Vanguard",
    "Rainbow Vanguard",
    
    // Beast Riders
    "Red Beast Rider",
    "Blue Beast Rider",
    "Yellow Beast Rider",
    "Green Beast Rider",
    "Pink Beast Rider",
    "White Beast Rider",
    "Rainbow Beast Rider",
    
    // Mages
    "Red Mage",
    "Blue Mage",
    "Yellow Mage",
    "Green Mage",
    "Pink Mage",
    "White Mage",
    "Rainbow Mage",
    
    // Warrior Princesses
    "Red Warrior Princess",
    "Blue Warrior Princess",
    "Yellow Warrior Princess",
    "Green Warrior Princess",
    "Pink Warrior Princess",
    "White Warrior Princess",
    "Rainbow Warrior Princess",
    
    // Ninjas
    "Red Ninja",
    "Blue Ninja",
    "Yellow Ninja",
    "Green Ninja",
    "Pink Ninja",
    "White Ninja",
    "Rainbow Ninja",
    
    // Tribal Chiefs
    "Red Tribal Chief",
    "Blue Tribal Chief",
    "Yellow Tribal Chief",
    "Green Tribal Chief",
    "Pink Tribal Chief",
    "White Tribal Chief",
    "Rainbow Tribal Chief",
    
    // Great Elders
    "Red Great Elder",
    "Blue Great Elder",
    "Yellow Great Elder",
    "Green Great Elder",
    "Pink Great Elder",
    "White Great Elder",
    "Rainbow Great Elder",
    
    // Sumo Wrestlers
    "Red Sumo Wrestler",
    "Blue Sumo Wrestler",
    "Yellow Sumo Wrestler",
    "Green Sumo Wrestler",
    "Pink Sumo Wrestler",
    "White Sumo Wrestler",
    "Rainbow Sumo Wrestler",
    
    // Zombies
    "Red Zombie",
    "Blue Zombie",
    "Yellow Zombie",
    "Green Zombie",
    "Pink Zombie",
    "White Zombie",
    "Rainbow Zombie",
    
    // Vikings
    "Red Viking",
    "Blue Viking",
    "Yellow Viking",
    "Green Viking",
    "Pink Viking",
    "White Viking",
    "Rainbow Viking",
    
    // Valkyries
    "Red Valkyrie",
    "Blue Valkyrie",
    "Yellow Valkyrie",
    "Green Valkyrie",
    "Pink Valkyrie",
    "White Valkyrie",
    "Rainbow Valkyrie",
    
    // Mecha Warriors
    "Red Mecha Warrior",
    "Blue Mecha Warrior",
    "Yellow Mecha Warrior",
    "Green Mecha Warrior",
    "Pink Mecha Warrior",
    "White Mecha Warrior",
    "Rainbow Mecha Warrior",
    
    // Elementalists
    "Red Elementalist",
    "Blue Elementalist",
    "Yellow Elementalist",
    "Green Elementalist",
    "Pink Elementalist",
    "White Elementalist",
    "Rainbow Elementalist",
    
    // Dragon Tamers
    "Red Dragon Tamer",
    "Blue Dragon Tamer",
    "Yellow Dragon Tamer",
    "Green Dragon Tamer",
    "Pink Dragon Tamer",
    "White Dragon Tamer",
    "Rainbow Dragon Tamer",
    
    // Medusas
    "Red Medusa",
    "Blue Medusa",
    "Yellow Medusa",
    "Green Medusa",
    "Pink Medusa",
    "White Medusa",
    "Rainbow Medusa",
    
    // Snipers
    "Red Sniper",
    "Blue Sniper",
    "Yellow Sniper",
    "Green Sniper",
    "Pink Sniper",
    "White Sniper",
    "Rainbow Sniper",
    
    // Wrestlers
    "Red Wrestler",
    "Blue Wrestler",
    "Yellow Wrestler",
    "Green Wrestler",
    "Pink Wrestler",
    "White Wrestler",
    "Rainbow Wrestler",
    
    // Master Chefs
    "Red Master Chef",
    "Blue Master Chef",
    "Yellow Master Chef",
    "Green Master Chef",
    "Pink Master Chef",
    "White Master Chef",
    "Rainbow Master Chef",
    
    // Mafia Bosses
    "Red Mafia Boss",
    "Blue Mafia Boss",
    "Yellow Mafia Boss",
    "Green Mafia Boss",
    "Pink Mafia Boss",
    "White Mafia Boss",
    "Rainbow Mafia Boss",
    
    // Farmers
    "Red Farmer",
    "Blue Farmer",
    "Yellow Farmer",
    "Green Farmer",
    "Pink Farmer",
    "White Farmer",
    "Rainbow Farmer",
    
    // Capt Dobers
    "Red Capt Dober",
    "Blue Capt Dober",
    "Yellow Capt Dober",
    "Green Capt Dober",
    "Pink Capt Dober",
    "White Capt Dober",
    "Rainbow Capt Dober",
    
    // Spider Queens
    "Red Spider Queen",
    "Blue Spider Queen",
    "Yellow Spider Queen",
    "Green Spider Queen",
    "Pink Spider Queen",
    "White Spider Queen",
    "Rainbow Spider Queen",
    
    // Dark Archers
    "Dark Red Archer",
    "Dark Blue Archer",
    "Dark Yellow Archer",
    "Dark Green Archer",
    "Dark Pink Archer",
    "Dark White Archer",
    "Dark Rainbow Archer",
    
    // Drag Queens
    "Red Drag Queen",
    "Blue Drag Queen",
    "Yellow Drag Queen",
    "Green Drag Queen",
    "Pink Drag Queen",
    "White Drag Queen",
    "Rainbow Drag Queen",
  ];

  private shopPayment!: (amount: string) => Promise<void>;
  constructor() {
    super("Shop");
    this.character = {
      tier: "",
      color: "",
      hp: 0,
      atk: 0,
      def: 0,
      luck: 0,
      sprite: "",
      name: "",
    };
  }

  preload(): void {
    // Doors
    this.load.image("BronzeDoor", "assets/bronzedoor.png");
    this.load.image("SilverDoor", "assets/silverdoor.png");
    this.load.image("GoldDoor", "assets/golddoor.png");
    this.load.image("RainbowDoor", "assets/rainbowdoor.png");

    // Characters
    // 💬[vincent]: gn move ko sa preloader.ts
    //   for (let i = 1; i <= 104; i++) {
    //     this.load.image(`characterSprite${i}`, `assets/char_${i}.png`);
    // }
  }

  create(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.image(centerX, centerY, "background");

    this.add
      .text(centerX, centerY + 300, "Back", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainMenu");
      });

    this.shopPayment = this.registry.get("shopPayment");
    // Title
    this.add
      .text(centerX, 50, "WOK Shop", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    // Potions
    this.createPotion(
      centerX - 200,
      centerY + 160,
      "Devil's Potion",
      "devilsPotion",
      5000,
      -0.2,
      25,
      this.buyDevilsPotion.bind(this),
    );
    this.createPotion(
      centerX + 20,
      centerY + 160,
      "Leprechaun's Potion",
      "leprechaunsPotion",
      2000,
      2,
      2,
      this.buyLeprechaunsPotion.bind(this),
    );

    this.createPotion(
      centerX + 240,
      centerY + 160,
      "Health Potion",
      "healthPotion",
      2000,
      2,
      2,
      this.buyHealthPotion.bind(this),
    );

    // Doors
    this.createDoor(centerX - 300, centerY - 100, "Bronze", 0.01, 0.05, 10000);
    this.createDoor(centerX - 100, centerY - 100, "Silver", 0.05, 0.1, 20000);
    this.createDoor(centerX + 100, centerY - 100, "Gold", 0.1, 0.15, 30000);
    this.createDoor(centerX + 300, centerY - 100, "Rainbow", 0.1, 0.15, 50000);

    // this.createCharacterBox(centerX, centerY + 200);
  }

  private createPotion(
    x: number,
    y: number,
    name: string,
    sprite: string,
    price: number,
    min: number,
    max: number,
    buyPotion: () => void,
  ): void {
    const potion = this.add
      .image(x, y, sprite)
      .setInteractive()
      .setDisplaySize(100, 100);

    this.add
      .text(x, y - 80, name, {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#000000",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 80, `Price: ${price}`, {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#000000",
      })
      .setOrigin(0.5);

    // Assign click event to purchase function
    potion.on("pointerdown", async () => {
      await this.buyPotion(price, buyPotion, name, sprite);
    });
  }

  private async buyPotion(
    price: number,
    buyPotion: () => void,
    potionName: string,
    potionSprite: string,
  ): Promise<void> {
    try {
      await this.shopPayment(price.toString()); // Reusing the shopPayment method for purchasing potions
      buyPotion();
      this.showPotionModal(potionName, potionSprite);
      try {
        await fetch("/api/inventory/addPotion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            potionName,
            quantity: 1,
          }),
        });
      } catch (error) {
        console.error("Error adding potion:", error);
      }
    } catch (error) {
      console.error(`Failed to purchase ${potionName}:`, error);
    }
  }

  private showPotionModal(potionName: string, potionSprite: string): void {
    const modalBackground = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        520,
        320,
        0x000000,
        0.8,
      )
      .setOrigin(0.5);
    const modalBox = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        500,
        300,
        0xffffff,
      )
      .setOrigin(0.5);
    const modalText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        `You purchased ${potionName}!`,
        {
          fontFamily: "Arial",
          fontSize: 24,
          color: "#000000",
        },
      )
      .setOrigin(0.5);

    const potionImage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 20,
        potionSprite,
      )
      .setOrigin(0.5)
      .setDisplaySize(100, 100);

    const luckText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 60,
        potionName === "Devil's Potion" || potionName === "Leprechaun's Potion"
          ? `Luck Multiplier: ${this.character.luck}`
          : `Health Points: ${this.character.hp}`,
        {
          fontFamily: "Arial",
          fontSize: 20,
          color: "#000000",
        },
      )
      .setOrigin(0.5);

    const closeButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 110,
        "Close",
        {
          fontFamily: "Arial",
          fontSize: 24,
          color: "#000000",
          backgroundColor: "#4e342e",
          padding: { x: 20, y: 10 },
        },
      )
      .setOrigin(0.5)
      .setInteractive();

    closeButton.on("pointerdown", () => {
      modalBackground.destroy();
      modalBox.destroy();
      modalText.destroy();
      luckText.destroy();
      potionImage.destroy();
      closeButton.destroy();
    });
  }

  private buyDevilsPotion(): void {
    let luckBonus: number;
    const rand = Math.random();

    if (rand < 0.25) {
      // 25% chance: Negative range (-0.20 to -0.01)
      luckBonus = parseFloat((Math.random() * (0.0 + 0.2) - 0.2).toFixed(2));
    } else if (rand < 0.75) {
      // 50% chance: Neutral range (0.00 to 0.10)
      luckBonus = parseFloat((Math.random() * 0.1).toFixed(2));
    } else {
      // 25% chance: Positive range (0.11 to 0.25)
      luckBonus = parseFloat((Math.random() * (0.25 - 0.11) + 0.11).toFixed(2));
    }

    this.character.luck = luckBonus;
    console.log("Devil's Potion Purchased!");
    // Implement purchase logic
    // For example, add the potion to the player's inventory
  }

  private buyLeprechaunsPotion(): void {
    const luckBonus = 0.2;
    this.character.luck = luckBonus;
    console.log("Leprechaun's Potion Purchased!");
    // Implement purchase logic
    // For example, add the potion to the player's inventory
  }

  private buyHealthPotion(): void {
    const heal = 2;
    this.character.hp = heal;
    console.log("Leprechaun's Potion Purchased!");
    // Implement purchase logic
    // For example, add the potion to the player's inventory
  }

  private createDoor(
    x: number,
    y: number,
    tier: "Bronze" | "Silver" | "Gold" | "Rainbow",
    minLuck: number,
    maxLuck: number,
    price: number,
  ): void {
    const door = this.add
      .image(x, y, `${tier}Door`)
      .setInteractive()
      .setDisplaySize(100, 150);
    this.add
      .text(x, y - 120, tier, {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#000000",
      })
      .setOrigin(0.5);
    this.add
      .text(x, y + 130, `Price: ${price}`, {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#000000",
      })
      .setOrigin(0.5);

    door.on("pointerdown", async () => {
      await this.assignCharacter(tier, minLuck, maxLuck, price.toString());
    });
  }

  // private createCharacterBox(centerX: number, centerY: number): void {
  //   this.characterBox = this.add.rectangle(centerX, centerY, 300, 150, 0x333333).setOrigin(0.5);
  //   this.characterBox.setStrokeStyle(2, 0xffffff);

  //   this.characterText = this.add.text(centerX - 130, centerY - 40, "Tier: \nColor: \nLuck Multiplier: ", {
  //     fontFamily: "Arial",
  //     fontSize: 20,
  //     color: "#ffffff",
  //   });
  // }

  private getRandomColor(): string {
    const colors = ["White", "Green", "Pink", "Yellow", "Blue", "Red"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // CHARACTERS NFT AND PAYMENT
  private transactionFail: boolean = false;
  private pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  private pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;
  private async uploadToPinata(
    file: File,
    price: string,
    metadata: object,
  ): Promise<string | null> {
    const meta = metadata as {
      name: string;
      atk: number;
      color: string;
      def: number;
      hp: number;
      luck: number;
      sprite: string;
      tier: string;
    };
    const buyAndmint = this.game.registry.get("buyAndmint");
    const walletAddress = this.game.registry.get("walletAddress");
    const balance = this.game.registry.get("balance");
    if (parseInt(balance) < parseInt(price)) {
      this.transactionFail = true;
      alert(`WoK is not enough!.`);
      return null;
    }
    if (!walletAddress) {
      this.transactionFail = true;
      alert(`Wallet Address is missing`);
      return null;
    }
    const formData = new FormData();
    console.log(file);
    formData.append("file", file, file.name);

    try {
      const image = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: this.pinataApiKey as string,
            pinata_secret_api_key: this.pinataSecretApiKey as string,
          },
          body: formData,
        },
      );

      if (!image.ok) {
        throw new Error(`Upload failed: ${image.statusText}`);
      }

      const imageData = await image.json();
      this.imageURI = `https://bronze-active-seahorse-192.mypinata.cloud/ipfs/${imageData.IpfsHash}`;

      // const metadata = {
      //   name: "My NFT",
      //   description: "An NFT minted on Core DAO",
      //   image: imageURI,
      // };
      const newMetadata = {
        ...meta,
        image: this.imageURI,
      };
      // Upload metadata to Pinata
      const metadataRes = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: this.pinataApiKey as string,
            pinata_secret_api_key: this.pinataSecretApiKey as string,
          },
          body: JSON.stringify(newMetadata),
        },
      );

      const metadataData = await metadataRes.json();
      const metadataURI = `https://bronze-active-seahorse-192.mypinata.cloud/ipfs/${metadataData.IpfsHash}`;

      // 🔹 Mint NFT with metadataURI
      try {
        const buyandmint = await buyAndmint(price, walletAddress, metadataURI);
        if (buyandmint.message === "TSFailed") {
          this.transactionFail = true;
          await this.cancelUploads(imageData.IpfsHash, metadataData.IpfsHash);
          return null;
        } else {
          this.transactionFail = false;
          return metadataURI;
        }
        // this.transactionFail = false;
        // return metadataURI;
      } catch (error) {
        this.transactionFail = true;
        console.log(error);
        await this.cancelUploads(imageData.IpfsHash, metadataData.IpfsHash);
        return null;
      }
    } catch (error) {
      this.transactionFail = true;
      console.error("Error sa try outside:", error);
      alert("NFT Minting Failed!");
      return null;
    }
    return null;
  }
  private async uploadImageToPinata(
    imagePath: string,
    price: string,
    metadata: object,
  ): Promise<string | null> {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const file = new File([blob], `char_${Date.now()}.png`, {
        type: blob.type,
      });
      return await this.uploadToPinata(file, price, metadata);
    } catch (error) {
      console.error("Error converting image to File:", error);
      return null;
    }
  }
  private async cancelUploads(imageHash: string, metadataHash: string) {
    // Generate JWT Token
    const jwtResponse = await fetch(
      "https://api.pinata.cloud/users/generateApiKey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: this.pinataApiKey as string,
          pinata_secret_api_key: this.pinataSecretApiKey as string,
        },
        body: JSON.stringify({
          keyName: "My JWT Key",
          permissions: {
            endpoints: {
              pinning: {
                unpin: true,
              },
            },
          },
        }),
      },
    );

    const jwtData = await jwtResponse.json();
    const jwtToken = jwtData.JWT;

    //  Unpin File
    const image = await fetch(
      `https://api.pinata.cloud/pinning/unpin/${imageHash}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    const metadata = await fetch(
      `https://api.pinata.cloud/pinning/unpin/${metadataHash}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    if (metadata.ok) {
      console.log("✅ File Unpinned from Pinata:", metadataHash, image);
    } else {
      console.error("❌ Failed to Unpin File", await metadata.json());
    }
  }

  private async assignCharacter(
    tier: "Bronze" | "Silver" | "Gold" | "Rainbow",
    minLuck: number,
    maxLuck: number,
    price: string,
  ): Promise<string> {
    this.character.tier = tier;
    const stats = {
      Bronze: { min: 1, max: 3 },
      Silver: { min: 3, max: 5 },
      Gold: { min: 5, max: 7 },
      Rainbow: { min: 5, max: 7 },
    };
    const { min, max } = stats[tier];
    this.character.hp = this.getRandomInt(min, max);
    this.character.atk = this.getRandomInt(min, max);
    this.character.def = this.getRandomInt(min, max);
    this.character.color =
      tier === "Rainbow" ? "Rainbow" : this.getRandomColor();
    this.character.luck = parseFloat(
      (Math.random() * (maxLuck - minLuck) + minLuck).toFixed(2),
    );

    // Define sprite options based on color
    const colors = ["Red", "Blue", "Yellow", "Green", "Pink", "White", "Rainbow"];
    const spriteOptions: Record<string, number[]> = {};

    //Dynamic sprite options
    colors.forEach((color, index) => {
      spriteOptions[color] = Array.from({ length: 28 }, (_, i) => index + 1 + i * 7);
    });

    console.log(spriteOptions);

    const possibleSprites = spriteOptions[this.character.color];
    const randomIndex = this.getRandomInt(0, possibleSprites.length - 1);
    this.character.sprite = `characterSprite${possibleSprites[randomIndex]}`;

    this.character.name =
      this.characterNames[
        parseInt(this.character.sprite.replace("characterSprite", "")) - 1
      ];
    const metadata = {
      tier: this.character.tier,
      color: this.character.color,
      hp: this.character.hp,
      atk: this.character.atk,
      def: this.character.def,
      luck: this.character.luck,
      sprite: this.character.sprite,
      name: this.character.name,
    };
    await this.uploadImageToPinata(
      `assets/char_${possibleSprites[randomIndex]}.png`,
      price,
      metadata,
    );
    // Show the modal to display the character details
    if (this.transactionFail === false) {
      this.showCharacterModal();
      // Save character using API endpoint
      try {
        const response = await fetch("/api/createCharacter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tier: this.character.tier,
            color: this.character.color,
            hp: this.character.hp,
            atk: this.character.atk,
            def: this.character.def,
            luck: this.character.luck,
            sprite: this.imageURI,
            name: this.character.name,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to save character:", errorData);
        }
      } catch (error) {
        console.error("Error saving character:", error);
      }
    } else {
      console.log("transaction failed.");
    }
    return this.character.sprite;
  }

  // Helper function to get a random integer between min and max (inclusive)
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private showCharacterModal(): void {
    const modalBackground = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        520,
        420,
        0x000000,
        0.8,
      )
      .setOrigin(0.5);
    const modalBox = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        500,
        400,
        0xffffff,
      )
      .setOrigin(0.5);
    const modalText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 150,
        `Congratulations! You Got ${this.character.name}`,
        {
          fontFamily: "Arial",
          fontSize: 24,
          color: "#000000",
        },
      )
      .setOrigin(0.5);

    const characterImage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 50,
        this.character.sprite,
      )
      .setOrigin(0.5)
      .setDisplaySize(100, 100);

    const characterDetails = this.add.text(
      this.cameras.main.centerX - 110,
      this.cameras.main.centerY + 20,
      `Tier: ${this.character.tier}  Color: ${this.character.color}\nLife Points: ${this.character.hp}  Attack: ${this.character.atk}\nDefense: ${this.character.def}  Luck Multiplier: ${this.character.luck}`,
      {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#000000",
      },
    );

    const closeButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 150,
        "Close",
        {
          fontFamily: "Arial",
          fontSize: 24,
          color: "#000000",
          backgroundColor: "#4e342e",
          padding: { x: 20, y: 10 },
        },
      )
      .setOrigin(0.5)
      .setInteractive();

    closeButton.on("pointerdown", () => {
      modalBackground.destroy();
      modalBox.destroy();
      modalText.destroy();
      characterDetails.destroy();
      characterImage.destroy();
      closeButton.destroy();
    });
  }
}
