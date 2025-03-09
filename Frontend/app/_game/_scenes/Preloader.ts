import { Scene } from "phaser";

export class Preloader extends Scene {
  cameraX!: number;
  cameraY!: number;

  constructor() {
    super("Preloader");
  }

  init() {
    this.cameraX = this.cameras.main.width / 2;
    this.cameraY = this.cameras.main.height / 2;
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(this.cameraX, this.cameraY, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add
      .rectangle(this.cameraX, this.cameraY, 468, 32)
      .setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(
      this.cameraX - 230,
      this.cameraY,
      4,
      28,
      0xffffff,
    );

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("loader", "loader.png");

    this.load.image("toy-frame-silver", "toy-frame-silver.png");
    this.load.image("toy-frame-gold", "toy-frame-gold.png");
    this.load.image("toy-frame-bronze", "toy-frame-bronze.png");
    this.load.image("banner-bronze", "bronzetier.png");
    this.load.image("banner-silver", "silvertier.png");
    this.load.image("banner-gold", "goldtier.png");

    this.load.image("wokArena", "/gameRoom/wokarena.png");
    this.load.image("die-1", "/gameRoom/die-1.png");
    this.load.image("die-2", "/gameRoom/die-2.png");
    this.load.image("die-3", "/gameRoom/die-3.png");
    this.load.image("die-4", "/gameRoom/die-4.png");
    this.load.image("die-5", "/gameRoom/die-5.png");
    this.load.image("die-6", "/gameRoom/die-6.png");
    this.load.image("slash", "/gameRoom/slash.png");

    for (let i = 1; i <= 107; i++) {
      this.load.image(`characterSprite${i}`, `char_${i}.png`);
    }

    this.load.audio("ambiance", "/bgm/ambiance.mp3");
    this.load.audio("action", "/bgm/action.mp3");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
