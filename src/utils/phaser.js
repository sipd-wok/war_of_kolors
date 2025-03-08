let Phaser = null;

if (typeof window !== "undefined") {
  // Import Phaser only in the browser
  Phaser = require("phaser");
}

export default Phaser;
