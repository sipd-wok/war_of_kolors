

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    create() {

        //Responsive
        var cameraX = this.cameras.main.width / 2

        var cameraY = this.cameras.main.height / 2

        //Players Logs || Waiting Other Player Logs
        var playersLogs = [
            {name: "Player 1", color: 0xff0000, luck: 4, lifePoints: 10, bet: 2000},
            {name: "Player 2", color: 0xffff00, luck: 5, lifePoints: 10, bet: 2000},
            {name: "Player 3", color: 0x00ff00, luck: 5, lifePoints: 10, bet: 2000},
            {name: "Player 4", color: 0xffffff, luck: 4, lifePoints: 10, bet: 2000},
            {name: "Player 5", color: 0x0000ff, luck: 6, lifePoints: 10, bet: 2000},
            {name: "Player 6", color: 0xff00ff, luck: 6, lifePoints: 10, bet: 2000},
        ]        

        //Text, Elements, Colors, and prizes
        
        var totalBet = playersLogs.reduce((sum, player) => sum + player.bet, 0);

        var prizeWOK = totalBet

        var colorb1 = 0x30363d

        var text_color = "#c9d1d9"

        var elemenated = "Drop"

       

        //Free For All Mode
        var defualtColor = [
            {color: 0xff0000},
            {color: 0xffff00},
            {color: 0x00ff00},
            {color: 0xffffff},
            {color: 0x0000ff},
            {color: 0xff00ff},
        ]

        //GamePlay System && Rules

        setInterval(() => { // Elemination
            if (playersLogs[0].lifePoints <= 0) {
                playersLogs[0].lifePoints = elemenated
                playersLogs[0].luck = 0
                playersLogs[0].name = "--+--"
            }
            if (playersLogs[1].lifePoints <= 0) {
                playersLogs[1].lifePoints = elemenated
                playersLogs[1].luck = 0
                playersLogs[1].name = "--+--"
            }
            if (playersLogs[2].lifePoints <= 0) {
                playersLogs[2].lifePoints = elemenated
                playersLogs[2].luck = 0
                playersLogs[2].name = "--+--"
            }
            if (playersLogs[3].lifePoints <= 0) {
                playersLogs[3].lifePoints = elemenated
                playersLogs[3].luck = 0
                playersLogs[3].name = "--+--"
            }
            if (playersLogs[4].lifePoints <= 0) {
                playersLogs[4].lifePoints = elemenated
                playersLogs[4].luck = 0
                playersLogs[4].name = "--+--"
            }
            if (playersLogs[5].lifePoints <= 0) {
                playersLogs[5].lifePoints = elemenated
                playersLogs[5].luck = 0
                playersLogs[5].name = "--+--"
            }


            if (playersLogs[0].lifePoints >= 20) {
                alert("Congratulation too " + playersLogs[0].name)
                this.game.destroy(true)
            }
            if (playersLogs[1].lifePoints >= 20) {
                alert("Congratulation too " + playersLogs[1].name)
                this.game.destroy(true)
            }
            if (playersLogs[2].lifePoints >= 20) {
                alert("Congratulation too " + playersLogs[2].name)
                this.game.destroy(true)
            }
            if (playersLogs[3].lifePoints >= 20) {
                alert("Congratulation too " + playersLogs[3].name)
                this.game.destroy(true)
            }
            if (playersLogs[4].lifePoints >= 20) {
                alert("Congratulation too " + playersLogs[4].name)
                this.game.destroy(true)
            }
            if (playersLogs[5].lifePoints >= 20) {
                alert("Congratulation too " + playersLogs[5].name)
                this.game.destroy(true)
            }

            
        }, 2000)

        var totalLuck = playersLogs.reduce((sum, player) => sum + player.luck, 0);

            setInterval(() => {
            
            let boxResult = [RandomColors(), RandomColors(), RandomColors()]

            box1.fillColor = boxResult[0]
            box2.fillColor = boxResult[1]
            box3.fillColor = boxResult[2]

            console.log(box1.fillColor)
            //Player 1

             if (playersLogs[0].color === boxResult[0] ||
             playersLogs[0].color === boxResult[1] ||
             playersLogs[0].color === boxResult[2]) {
                playersLogs[0].lifePoints += 1
            } else {
                playersLogs[0].lifePoints -= 1
            }
            
            if (playersLogs[0].color === boxResult[0] &&
            playersLogs[0].color === boxResult[1] ||
            playersLogs[0].color === boxResult[0] &&
            playersLogs[0].color === boxResult[2]
                ||playersLogs[0].color === boxResult[1] &&
                playersLogs[0].color === boxResult[2]) {
                playersLogs[0].lifePoints += 1
            } 
            
            if (playersLogs[0].color === boxResult[0] && 
            playersLogs[0].color === boxResult[1] && 
            playersLogs[0].color === boxResult[2]) {
                playersLogs[0].lifePoints += 1
            }

            //Player 2

             if (playersLogs[1].color === boxResult[0] ||
             playersLogs[1].color === boxResult[1] ||
             playersLogs[1].color === boxResult[2]) {
                playersLogs[1].lifePoints += 1
            } else {
                playersLogs[1].lifePoints -= 1
            }
            
            if (playersLogs[1].color === boxResult[0] && 
            playersLogs[1].color === boxResult[1] || 
            playersLogs[1].color === boxResult[0] && 
            playersLogs[1].color === boxResult[2]
            || playersLogs[1].color === boxResult[1] && 
            playersLogs[1].color === boxResult[2]) {
            playersLogs[1].lifePoints += 1
            } 
            
            if (playersLogs[1].color === boxResult[0] && 
            playersLogs[1].color === boxResult[1] && 
            playersLogs[1].color === boxResult[2]) {
                playersLogs[1].lifePoints += 1
            }

            //Player 3
            if (playersLogs[2].color === boxResult[0] || 
            playersLogs[2].color === boxResult[1] || 
            playersLogs[2].color === boxResult[2]) {
                playersLogs[2].lifePoints += 1
            } else {
                playersLogs[2].lifePoints -= 1
            }
            
            if (playersLogs[2].color === boxResult[0] && 
            playersLogs[2].color === boxResult[1] || 
            playersLogs[2].color === boxResult[0] && 
            playersLogs[2].color === boxResult[2]
            || playersLogs[2].color === boxResult[1] && 
            playersLogs[2].color === boxResult[2]) {
                playersLogs[2].lifePoints += 1
            } 
            
            if (playersLogs[2].color === boxResult[0] && playersLogs[2].color === boxResult[1] && playersLogs[2].color === boxResult[2]) {
                playersLogs[2].lifePoints += 1
            }


            //Player 4
           if (playersLogs[3].color === boxResult[0] || 
           playersLogs[3].color === boxResult[1] || 
           playersLogs[3].color === boxResult[2]) {
                playersLogs[3].lifePoints += 1
            } else {
                playersLogs[3].lifePoints -= 1
            }
            
            if (playersLogs[3].color === boxResult[0] && 
            playersLogs[3].color === boxResult[1] || 
            playersLogs[3].color === boxResult[0] && 
            playersLogs[3].color === boxResult[2]
                || playersLogs[3].color === boxResult[1] &&
                 playersLogs[3].color === boxResult[2]) {
                playersLogs[3].lifePoints += 1
            } 
            
            if (playersLogs[3].color === boxResult[0] && 
            playersLogs[3].color === boxResult[1] && 
            playersLogs[3].color === boxResult[2]) {
                playersLogs[3].lifePoints += 1
            }

            //Player 5
           if (playersLogs[4].color === boxResult[0] || 
           playersLogs[4].color === boxResult[1] || 
           playersLogs[4].color === boxResult[2]) {
                playersLogs[4].lifePoints += 1
            } else {
                playersLogs[4].lifePoints -= 1
            }
            
            if (playersLogs[4].color === boxResult[0] && 
            playersLogs[4].color === boxResult[1] || 
            playersLogs[4].color === boxResult[0] && 
            playersLogs[4].color === boxResult[2]
                || 
                playersLogs[4].color === boxResult[1] && 
                playersLogs[4].color === boxResult[2]) {
                playersLogs[4].lifePoints += 1
            } 
            
            if (playersLogs[4].color === boxResult[0] && 
            playersLogs[4].color === boxResult[1] && 
            playersLogs[4].color === boxResult[2]) {
                playersLogs[4].lifePoints += 1
            }

            //Player 6
           if (playersLogs[5].color === boxResult[0] || 
           playersLogs[5].color === boxResult[1] || 
           playersLogs[5].color === boxResult[2]) {
                playersLogs[5].lifePoints += 1
            } else {
                playersLogs[5].lifePoints -= 1
            }
            
            if (playersLogs[5].color === boxResult[0] && 
            playersLogs[5].color === boxResult[1] || 
            playersLogs[5].color === boxResult[0] && 
            playersLogs[5].color === boxResult[2]
                || 
                playersLogs[5].color === boxResult[1] && 
                playersLogs[5].color === boxResult[2]) {
                playersLogs[5].lifePoints += 1
            } 
            
            if (playersLogs[5].color === boxResult[0] && 
            playersLogs[5].color === boxResult[1] && 
            playersLogs[5].color === boxResult[2]) {
                playersLogs[5].lifePoints += 1
            }
             

            }, 3000) // Set Every 3 Second

        
        

        

        function RandomColors() {

            var random = Math.random() * 100

            var cumu = 0

            for (var i = 0; i < playersLogs.length; i++) {
                cumu += (playersLogs[i].luck / totalLuck) * 100
                if (random < cumu) {
                    return defualtColor[i].color
                }
            }

            return defualtColor[0].color

        }

        // Main Board
        var container = this.add.rectangle(
            cameraX,
            cameraY,
            500,
            300,
            0x161b22
            )

        var container_prize_pool = this.add.text(cameraX, cameraY - 100, [
            'TOTAL PRIZE = ' + prizeWOK
        ], {
            fontSize: '28px',
            color: text_color,
            fontStyle: 'bold'
        }).setOrigin(0.5)

        var count = 5
        
        var container_countdown_respin = this.add.text(cameraX, cameraY + 90, [
            'Re - rolling in ' + count + ' sec...'
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold',
        }).setOrigin(0.5)

        

            this.time.addEvent({
            delay: 1000,
            callback: () => {
                count -= 1
                container_countdown_respin.setText('Re - rolling in ' + count + ' sec...')

                if (count <= 0) {
                    container_countdown_respin.setText('Rerolling.... ')
                    
                }

            },
            
            loop: true

        })


            

        

        //Box Dice...
         var box1 = this.add.rectangle(
            cameraX - 130,
            cameraY, 
            90, 
            90, 
            playersLogs[1].color
            )

        var box2 = this.add.rectangle(
            cameraX,
            cameraY, 
            90, 
            90, 
            playersLogs[1].color
            )

        var box3 = this.add.rectangle(
            cameraX + 130,
            cameraY, 
            90, 
            90, 
            playersLogs[1].color
            )



        //Other Player

       

         setInterval(() => {
        
            var player_2_info = this.add.rectangle(
            cameraX - 450,
            cameraY + 180,
            220,
            120,
            colorb1
        )

        var player_2_info_text = this.add.text(cameraX - 530, cameraY + 140, [
            playersLogs[1].name,
            'Luck - ' + playersLogs[1].luck,
            'LIFE - ' + playersLogs[1].lifePoints
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })
        
        var player_2 = this.add.rectangle(
            cameraX - 330,
            cameraY + 120,
            112,
            112,
            playersLogs[1].color
        )

        var player_3_info = this.add.rectangle(
            cameraX + 450,
            cameraY + 180,
            220,
            120,
            colorb1
        )
        
        var player_3_info_text = this.add.text(cameraX + 400, cameraY + 140, [
            playersLogs[2].name,
            'LUCK - ' + playersLogs[2].luck,
            'LIFE - ' + playersLogs[2].lifePoints
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })

        var player_3 = this.add.rectangle(
            cameraX + 330,
            cameraY + 120,
            112,
            112,
            playersLogs[2].color
        )
        
        var player_4_info = this.add.rectangle(
            cameraX + 450,
            cameraY - 180,
            220,
            120,
            colorb1
        )
        
        var player_4_info_text = this.add.text(cameraX + 400, cameraY - 220, [
            playersLogs[3].name,
            'LUCK - ' + playersLogs[3].luck,
            'LIFE - ' + playersLogs[3].lifePoints
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })

        var player_4 = this.add.rectangle(
            cameraX + 330,
            cameraY - 120,
            112,
            112,
            playersLogs[3].color
        )

        var player_5_info = this.add.rectangle(
            cameraX - 450,
            cameraY - 180,
            220,
            120,
            colorb1
        )

        var player_5_info_text = this.add.text(cameraX - 530, cameraY - 220, [
            playersLogs[4].name,
            'LUCK - ' + playersLogs[4].luck,
            'LIFE - ' + playersLogs[4].lifePoints
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })
        
        var player_5 = this.add.rectangle(
            cameraX - 330,
            cameraY - 120,
            112,
            112,
            playersLogs[4].color
        )
        
        var player_6_info = this.add.rectangle(
            cameraX + 20,
            cameraY - 240,
            220,
            120,
            colorb1
        )

        var player_6_info_text = this.add.text(cameraX - 50, cameraY - 270, [
            playersLogs[5].name,
            'LUCK - ' + playersLogs[5].luck,
            'LIFE - ' + playersLogs[5].lifePoints
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })

        var player_6 = this.add.rectangle(
            cameraX - 120,
            cameraY - 230,
            112,
            112,
            playersLogs[5].color
        )

        //Player Main Info

        var mainplayerinfo = this.add.rectangle(
            cameraX,
            cameraY + 300,
            cameraX - 150,
            cameraY - 260,
            colorb1,
        )

        var mainplayerinfo_text = this.add.text(cameraX - 210, cameraY + 270, [
            playersLogs[0].name + ' - LUCK ' + playersLogs[0].luck,
            playersLogs[0].lifePoints + ' LIFE POINTS'
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })

        var profilePic = this.add.rectangle(
            cameraX + 140,
            cameraY + 250,
            cameraX - 490,
            cameraY - 220,
            playersLogs[0].color
        )

        }, 1000)


        


       

        

        
            
    }


}


