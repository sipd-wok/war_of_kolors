import { Scene } from "phaser";
import { io, Socket } from "socket.io-client";
import { EventBus } from "../EventBus";

// Define player log interface for type safety
interface PlayerLog {
  name: string;
  color: number;
  luck: number;
  bet: number;
}

export class Room extends Scene {
  // Leva GUI properties
  levaControlsEnabled: boolean = true;
  levaSubscriptions: Array<() => void> = [];

  // Room properties
  socket!: Socket;
  roomId!: string;

  // Camera position
  cameraX!: number;
  cameraY!: number;
  visualViewportWidth!: number;

  // Game data
  playersLogs!: PlayerLog[];
  lifePoints!: (number | string)[];
  Img!: string[];

  // UI elements
  player_info_p!: Array<{ x: number; y: number }>;
  text_value!: Phaser.GameObjects.Text[];
  mainplayerinfo_text!: Phaser.GameObjects.Text;
  die1!: Phaser.GameObjects.Image;
  die2!: Phaser.GameObjects.Image;
  die3!: Phaser.GameObjects.Image;
  slash!: Phaser.GameObjects.Image;

  constructor() {
    super("Room");
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Connected with ID:", this.socket.id);
    });
  }

  // Renamed from roomID to roomId for consistency
  init(data: { roomID: string }) {
    this.roomId = data.roomID;
    console.log("Room initialized with roomId:", this.roomId);
  }

  create() {
    //Responsive
    this.cameraX = this.cameras.main.width / 2;
    this.cameraY = this.cameras.main.height / 2;
    this.visualViewportWidth = window.visualViewport?.width || 1024;

    // responsivve condigurations
    const wokArenaConfig = {
      width: this.visualViewportWidth! + 50,
      height: this.visualViewportWidth! * (3000 / 4200) + 50,
      rotation: 0,
    };
    const dieConfig = {
      size: 90,
      spaceBetween: 100,
    };

    if (
      this.visualViewportWidth !== undefined &&
      this.visualViewportWidth < 928
    ) {
      wokArenaConfig.width = this.visualViewportWidth! * 2.1;
      wokArenaConfig.height =
        this.visualViewportWidth! * (3000 / 4200) * 2.1 + 20;
      dieConfig.size = 60;
      dieConfig.spaceBetween = 70;
    }

    //Players Logs || Waiting Other Player Logs
    this.playersLogs = [
      { name: "Player 1", color: 0xff0000, luck: 4, bet: 2000 },
      { name: "Player 2", color: 0xffff00, luck: 5, bet: 2000 },
      { name: "Player 3", color: 0x00ff00, luck: 5, bet: 2000 },
      { name: "Player 4", color: 0xffffff, luck: 4, bet: 2000 },
      { name: "Player 5", color: 0x0000ff, luck: 6, bet: 2000 },
      { name: "Player 6", color: 0xff00ff, luck: 6, bet: 2000 },
    ];

    this.Img = [
      "character1",
      "character2",
      "character3",
      "character4",
      "character5",
      "character6",
    ];

    this.lifePoints = [10, 10, 10, 10, 10, 10]; // Life Points

    //Text, Elements, Colors, and prizes
    const totalBet = this.playersLogs.reduce(
      (sum: number, player: PlayerLog) => sum + player.bet,
      0,
    );

    const prizeWOK = totalBet;
    const colorb1 = 0x30363d;
    const text_color = "#c9d1d9";

    //Free For All Mode
    const defualtColor = [
      { color: 0xff0000 },
      { color: 0xffff00 },
      { color: 0x00ff00 },
      { color: 0xffffff },
      { color: 0x0000ff },
      { color: 0xff00ff },
    ];

    //GamePlay System && Rules

    // Add black background
    this.cameras.main.setBackgroundColor(0x161b22);

    // Main Board
    this.add
      .image(this.cameraX, this.cameraY, "wokArena")
      .setDisplaySize(wokArenaConfig.width, wokArenaConfig.height);

    this.add
      .text(this.cameraX, this.cameraY - 100, ["TOTAL PRIZE = " + prizeWOK], {
        fontSize: "28px",
        color: text_color,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Dices
    this.die1 = this.add
      .image(this.cameraX - dieConfig.spaceBetween, this.cameraY, "die-1")
      .setDisplaySize(dieConfig.size, dieConfig.size);
    this.die2 = this.add
      .image(this.cameraX, this.cameraY, "die-2")
      .setDisplaySize(dieConfig.size, dieConfig.size);
    this.die3 = this.add
      .image(this.cameraX + dieConfig.spaceBetween, this.cameraY, "die-3")
      .setDisplaySize(dieConfig.size, dieConfig.size);
    this.time.addEvent({
      delay: 800,
      callback: () => {
        this.die1.setTexture(`die-${Math.floor(Math.random() * 6) + 1}`);
        this.tweens.add({
          targets: this.die1,
          y: this.die1.y - 16,
          duration: 340,
          ease: "Power2",
          yoyo: true,
        });

        this.die2.setTexture(`die-${Math.floor(Math.random() * 6) + 1}`);
        this.tweens.add({
          targets: this.die2,
          y: this.die2.y - 16,
          duration: 400,
          ease: "Power2",
          yoyo: true,
        });

        this.die3.setTexture(`die-${Math.floor(Math.random() * 6) + 1}`);
        this.tweens.add({
          targets: this.die3,
          y: this.die3.y - 16,
          duration: 320,
          ease: "Power2",
          yoyo: true,
        });
      },
      loop: true,
    });

    this.slash = this.add
      .image(this.cameraX, this.cameraY, "slash")
      .setDisplaySize(800, 800)
      .setAlpha(0.8); // Start with slightly transparent

    this.time.addEvent({
      delay: 600,
      callback: () => {
        // Create a diagonal slashing animation from top-right to bottom-left
        // Position at top-right of screen
        this.slash.setPosition(this.cameraX + 400, this.cameraY - 800);

        this.tweens.add({
          targets: this.slash,
          x: this.cameraX - 500, // Move to bottom-left
          y: this.cameraY + 800,
          alpha: 1, // Fade in during slash
          scale: { from: 2, to: 1.5 },
          duration: 500,
          ease: "Power2",
        });
      },
      loop: true,
    });

    let count = 5;

    const container_countdown_respin = this.add
      .text(
        this.cameraX,
        this.cameraY + 90,
        ["Re - rolling in " + count + " sec..."],
        {
          fontSize: "24px",
          color: text_color,
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        count -= 1;
        container_countdown_respin.setText(
          "Re - rolling in " + count + " sec...",
        );

        if (count <= 0) {
          container_countdown_respin.setText("Rerolling.... ");
        }
      },

      loop: true,
    });

    const totalLuck = this.playersLogs.reduce(
      (sum: number, player: PlayerLog) => sum + player.luck,
      0,
    );

    const RandomColors = () => {
      const random = Math.random() * 100;
      let cumu = 0;

      for (let i = 0; i < this.playersLogs.length; i++) {
        cumu += (this.playersLogs[i].luck / totalLuck) * 100;
        if (random < cumu) {
          return defualtColor[i].color;
        }
      }

      return defualtColor[0].color;
    };

    const setColors = () => {
      const boxResult = [RandomColors(), RandomColors(), RandomColors()];

      for (let i = 0; i < this.playersLogs.length; i++) {
        if (
          this.playersLogs[i].color === boxResult[0] ||
          this.playersLogs[i].color === boxResult[1] ||
          this.playersLogs[i].color === boxResult[2]
        ) {
          this.lifePoints[i] = Number(this.lifePoints[i]) + 1;
        } else {
          this.lifePoints[i] = Number(this.lifePoints[i]) - 1;
        }

        if (
          (this.playersLogs[i].color === boxResult[0] &&
            this.playersLogs[i].color === boxResult[1]) ||
          (this.playersLogs[i].color === boxResult[0] &&
            this.playersLogs[i].color === boxResult[2]) ||
          (this.playersLogs[i].color === boxResult[1] &&
            this.playersLogs[i].color === boxResult[2])
        ) {
          this.lifePoints[i] = Number(this.lifePoints[i]) + 1;
        }

        if (
          this.playersLogs[i].color === boxResult[0] &&
          this.playersLogs[i].color === boxResult[1] &&
          this.playersLogs[i].color === boxResult[2]
        ) {
          this.lifePoints[i] = Number(this.lifePoints[i]) + 1;
        }

        if (Number(this.lifePoints[i]) <= 0) {
          this.lifePoints[i] = "NaN";
          this.playersLogs[i].luck = 0;
          this.playersLogs[i].name = "Eliminated";
        } else if (Number(this.lifePoints[i]) >= 20) {
          setTimeout(() => {
            this.scene.pause();
            // Fixed the destroy method - use stop() instead
            this.scene.stop();
            setTimeout(() => {
              this.add.rectangle(
                this.cameraX,
                this.cameraY,
                500,
                300,
                0x161b22,
              );

              this.add
                .text(
                  this.cameraX,
                  this.cameraY - 100,
                  ["TOTAL PRIZE = " + prizeWOK],
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
                  ["The Winner is " + this.playersLogs[i].name],
                  {
                    fontSize: "28px",
                    color: text_color,
                    fontStyle: "bold",
                  },
                )
                .setOrigin(0.5);

              this.add
                .image(this.cameraX, this.cameraY, this.Img[i])
                .setDisplaySize(100, 100);
            }, 1000);
          }, 2000);
        }
      }
    };

    setTimeout(() => {
      setInterval(setColors, 3000);
    }, 3000);

    //Other Player
    this.player_info_p = [
      { x: this.cameraX - 210, y: this.cameraY + 270 },
      { x: this.cameraX - 530, y: this.cameraY + 140 },
      { x: this.cameraX + 400, y: this.cameraY + 140 },
      { x: this.cameraX + 400, y: this.cameraY - 220 },
      { x: this.cameraX - 530, y: this.cameraY - 220 },
      { x: this.cameraX - 50, y: this.cameraY - 270 },
    ];

    const player_info = [
      { x: this.cameraX - 450, y: this.cameraY + 180, width: 220, height: 120 },
      { x: this.cameraX - 450, y: this.cameraY + 180, width: 220, height: 120 },
      { x: this.cameraX + 450, y: this.cameraY + 180, width: 220, height: 120 },
      { x: this.cameraX + 450, y: this.cameraY - 180, width: 220, height: 120 },
      { x: this.cameraX - 450, y: this.cameraY - 180, width: 220, height: 120 },
      { x: this.cameraX + 20, y: this.cameraY - 240, width: 220, height: 120 },
    ];

    const player_ar = [
      { x: this.cameraX - 530, y: this.cameraY + 140 },
      { x: this.cameraX - 330, y: this.cameraY + 120 },
      { x: this.cameraX + 330, y: this.cameraY + 120 },
      { x: this.cameraX + 330, y: this.cameraY - 120 },
      { x: this.cameraX - 330, y: this.cameraY - 120 },
      { x: this.cameraX - 120, y: this.cameraY - 230 },
    ];

    for (let i = 1; i < this.playersLogs.length; i++) {
      this.add.rectangle(
        player_info[i].x,
        player_info[i].y,
        player_info[i].width,
        player_info[i].height,
        colorb1,
      );
    }

    this.text_value = [];

    for (let i = 1; i < this.playersLogs.length; i++) {
      const info_text = this.add.text(
        this.player_info_p[i].x,
        this.player_info_p[i].y,

        this.playersLogs[i].name +
          "\n" +
          "LUCK - " +
          this.playersLogs[i].luck +
          "\n" +
          "Life - " +
          this.lifePoints[i],

        {
          fontSize: "24px",
          color: "#fff",
          fontStyle: "bold",
        },
      );

      this.text_value.push(info_text);
    }

    for (let i = 1; i < this.playersLogs.length; i++) {
      this.add.rectangle(
        player_ar[i].x,
        player_ar[i].y,
        122,
        122,
        this.playersLogs[i].color,
      );

      this.add
        .image(player_ar[i].x, player_ar[i].y, this.Img[i])
        .setDisplaySize(100, 100);
    }

    //Player Main Info
    this.add.rectangle(
      this.cameraX,
      this.cameraY + 300,
      this.cameraX - 150,
      this.cameraY - 260,
      colorb1,
    );

    this.mainplayerinfo_text = this.add.text(
      this.cameraX - 210,
      this.cameraY + 270,
      [
        this.playersLogs[0].name +
          " - LUCK " +
          this.playersLogs[0].luck +
          this.lifePoints[0] +
          " LIFE POINTS",
      ],
      {
        fontSize: "24px",
        color: text_color,
        fontStyle: "bold",
      },
    );

    this.add.rectangle(
      this.cameraX + 140,
      this.cameraY + 250,
      this.cameraX - 490,
      this.cameraY - 220,
      this.playersLogs[0].color,
    );

    this.add
      .image(this.cameraX + 140, this.cameraY + 250, this.Img[0])
      .setDisplaySize(115, 115);

    // Connect to Leva GUI if it's enabled
    this.setupLevaControlListeners();

    EventBus.emit("current-scene-ready", this);
  }

  update(): void {}

  // Add the setupLevaControlListeners method
  setupLevaControlListeners() {
    if (!this.levaControlsEnabled) return;

    // Here you would add your event listeners for Leva
    // This is just a placeholder as the actual implementation will depend on your Leva integration
    console.log("Leva control listeners set up");
  }
}
