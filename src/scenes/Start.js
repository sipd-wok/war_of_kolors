export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }
    create() {

        var colors = [0xffff00, 0xff0000, 0x0000ff, 0x00ff00, 0xff00ff, 0x800080]

        var chances = [0.1, 40, 20, 30, 50, 80]

        var box1 = this.add.rectangle(300, 300, 200, 200, colors[1])

        var box2 = this.add.rectangle(600, 300, 200, 200, colors[1])

        var box3 = this.add.rectangle(900, 300, 200, 200, colors[1])


        var button = this.add.rectangle(600, 500, 200, 100, 0xffffff)

        var text = this.add.text(525, 485, "Random Colors", {
            fontSize: "24px",
            color: "#ff0000",
            fontFamily: "Arial"

        })

        

        setInterval(() => {
            box1.fillColor = RandomColors()
            box2.fillColor = RandomColors()
            box3.fillColor = RandomColors()
        }, 500)

        function RandomColors() {

            var random = Math.random() * 100

            var cumu = 0

            for (var i = 0; i < colors.length; i++) {
                cumu += chances[i]
                if (random < cumu) {
                    return colors[i]
                }
            }

            return colors[0]

        }
            
    }


}


