import { Start } from './scenes/Start.js';

const config = {
        type: Phaser.AUTO,
        parent: "game-container",
        width: 1296,
        height: 926,
        scene: [Start],
        backgroundColor: '#87CEEB',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };
new Phaser.Game(config);
            