

export class Start extends Phaser.Scene {
    constructor() {
    
        super('Start')  
        
    }
    
    preload() {
        
        //Characters
        this.load.image('blue', '/blue.png')
        this.load.image('yellow', '/yellow.png')
        this.load.image('pink', '/boky.png')
        this.load.image('white', '/white.png')
        this.load.image('red', '/red.png')
        this.load.image('green', '/green.png')
        
        this.load.image("sky", "https://labs.phaser.io/assets/skies/space3.png");
        
    }

    create() {
            
         this.add.image(window.innerWidth / 2, window.innerHeight / 2, "sky").setScale(2)
         //Responsive
        this.cameraX = this.cameras.main.width / 2

        this.cameraY = this.cameras.main.height / 2
        
        
        
           
        //Players Logs || Waiting Other Player Logs
        this.playersLogs = [
            {name: "Player 1", color: 0xff0000, luck: 6, bet: 2000, img: 'red'},
            {name: "Player 2", color: 0xffff00, luck: 6, bet: 2000, img: 'yellow'},
            {name: "Player 3", color: 0x00ff00, luck: 6, bet: 2000, img: 'green'},
            {name: "Player 4", color: 0xffffff, luck: 6, bet: 2000, img: 'white'},
            {name: "Player 5", color: 0x0000ff, luck: 6, bet: 2000, img: 'blue'},
            {name: "Player 6", color: 0xff00ff, luck: 6, bet: 2000, img: 'pink'},
        ]     
        
        this.lifePoints = [10, 10, 10, 10, 10, 10] // Life Points
        
        //Text, Elements, Colors, and prizes
        
        var totalBet = this.playersLogs.reduce((sum, player) => sum + player.bet, 0);

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
            
    // Main Board
        var container = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            500,
            350,
            0xff0000
            )
        var containerS2 = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            450,
            250,
            0x161b22
            )

        var container_prize_pool = this.add.text(this.cameraX, this.cameraY - 100, [
            'TOTAL PRIZE = ' + prizeWOK
        ], {
            fontSize: '28px',
            color: text_color,
            fontStyle: 'bold'
        }).setOrigin(0.5)
        
        

        var count = 5
        
        var container_countdown_respin = this.add.text(this.cameraX, this.cameraY + 90, [
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
            this.cameraX - 130,
            this.cameraY, 
            120, 
            120, 
            this.playersLogs[0].color
            )

        var box2 = this.add.rectangle(
            this.cameraX,
            this.cameraY, 
            120, 
            120, 
            this.playersLogs[0].color
            )

        var box3 = this.add.rectangle(
            this.cameraX + 130,
            this.cameraY, 
            120, 
            120, 
            this.playersLogs[0].color
            )

       
         var totalLuck = this.playersLogs.reduce((sum, player) => sum + player.luck, 0);

        
        const RandomColors = () => {

            var random = Math.random() * 100

            var cumu = 0

            for (var i = 0; i < this.playersLogs.length; i++) {
                cumu += (this.playersLogs[i].luck / totalLuck) * 100
                if (random < cumu) {
                    return defualtColor[i].color
                }
            }

            return defualtColor[0].color

        } 
        
        
        const setColors = () => {
            let boxResult = [RandomColors(), RandomColors(), RandomColors()]

            box1.fillColor = boxResult[0]
            box2.fillColor = boxResult[1]
            box3.fillColor = boxResult[2]

            for (let i = 0; i < this.playersLogs.length; i++) {
                
          if (
             this.playersLogs[i].color === boxResult[0] ||
             this.playersLogs[i].color === boxResult[1] ||
             this.playersLogs[i].color === boxResult[2]) {
             this.lifePoints[i] += 1
            } else {
             this.lifePoints[i] -= 1
            }
            
            if (
            this.playersLogs[i].color === boxResult[0] &&
            this.playersLogs[i].color === boxResult[1] ||
            this.playersLogs[i].color === boxResult[0] &&
            this.playersLogs[i].color === boxResult[2] || 
            this.playersLogs[i].color === boxResult[1] &&
            this.playersLogs[i].color === boxResult[2]) {
            this.lifePoints[i] += 1
            } 
            
            if (
            this.playersLogs[i].color === boxResult[0] && 
            this.playersLogs[i].color === boxResult[1] && 
            this.playersLogs[i].color === boxResult[2]) {
            this.lifePoints[i] += 1
            }
               
            
            if (this.lifePoints[i] <= 0) {
                this.lifePoints[i] = "NaN".toString()
                this.playersLogs[i].luck = 0
                this.playersLogs[i].name = "Eliminated"
            } else if (this.lifePoints[i] >= 15){
                
                setTimeout(() => {
                    
                    this.scene.pause()
                    this.scene.destroy()
                    setTimeout(() => {
               
                var container2 = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            500,
            300,
            0x161b22
            )
               
                        
               var container_winners_text1 = this.add.text(this.cameraX, this.cameraY - 100, [
            'TOTAL PRIZE = ' + prizeWOK + ' Wok'
        ], {
            fontSize: '28px',
            color: text_color,
            fontStyle: 'bold'
        }).setOrigin(0.5)
        
        var container_winners_text2 = this.add.text(this.cameraX, this.cameraY + 100, [
            'The Winner is ' + this.playersLogs[i].name
        ], {
            fontSize: '28px',
            color: text_color,
            fontStyle: 'bold'
        }).setOrigin(0.5)
        
        var winner_pic = this.add.image(
            this.cameraX,
            this.cameraY,
            this.playersLogs[i].img
        ).setDisplaySize(120, 120)
                        
                        
                    }, 1000)
                    
                }, 2000)
                
            }
                
            }
        }
            setTimeout(() => {
                setInterval(setColors, 3000)
            }, 3000)

        //Other Player
       
       this.player_info_p = [
           {x: this.cameraX - 210, y: this.cameraY + 270},
           {x: this.cameraX - 530, y: this.cameraY + 140},
           {x: this.cameraX + 400, y: this.cameraY + 140},
           {x: this.cameraX + 400, y: this.cameraY - 220},
           {x: this.cameraX - 530, y: this.cameraY - 220},
           {x: this.cameraX - 50, y: this.cameraY - 270},
           
       ]
       
       
       
       let player_ar = [
           {x: this.cameraX - 530, y: this.cameraY + 140},
           {x: this.cameraX - 330, y: this.cameraY + 120},
           {x: this.cameraX + 330, y: this.cameraY + 120},
           {x: this.cameraX + 330, y: this.cameraY - 120},
           {x: this.cameraX - 330, y: this.cameraY - 120},
           {x: this.cameraX - 120, y: this.cameraY - 230},
       ]
       
       
       this.text_value = []
       
       
       for (let i = 1; i < this.playersLogs.length; i++) {
           
           let info_text = this.add.text(
               this.player_info_p[i].x,
               this.player_info_p[i].y,
               
               
               this.playersLogs[i].name + '\n' +
               'LUCK - ' + this.playersLogs[i].luck + '\n' +
               
               'Life - ' + this.lifePoints[i]
               
               ,
               
               {
                   fontSize: '24px',
                   color: '#fff',
                   fontStyle: 'bold'
               }
               
               
           )
          
         this.text_value.push(info_text)           
           
       }
       
        
       
        
        for (let i = 1; i < this.playersLogs.length; i++) {
            
            var player_ar_rect = this.add.rectangle(
                player_ar[i].x,
                player_ar[i].y,
                122,
                122,
                this.playersLogs[i].color 
                
            )
            
            let images = this.add.image(
                player_ar[i].x,
                player_ar[i].y,
                this.playersLogs[i].img
            ).setDisplaySize(118, 118)
           
        }

        //Player Main

        this.mainplayerinfo_text = this.add.text(this.cameraX - 210, this.cameraY + 270,
     [       this.playersLogs[0].name + ' - LUCK ' + this.playersLogs[0].luck +
            this.lifePoints[0] + ' LIFE POINTS'
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold'
        })

        var profilePic = this.add.rectangle(
            this.cameraX + 140,
            this.cameraY + 250,
            130,
            130,
            this.playersLogs[0].color
        )
        
        let images = this.add.image(
                this.cameraX + 140,
                this.cameraY + 250,
                this.playersLogs[0].img
            ).setDisplaySize(125, 125)
            
    }
               
        
  update() {
    
    this.mainplayerinfo_text.setText(
    [
            this.playersLogs[0].name + ' - LUCK ' + this.playersLogs[0].luck,
            this.lifePoints[0] + ' LIFE POINTS'
        ])
    
    
    for (let i = 1; i < this.playersLogs.length; i++) {
        if (this.text_value[i - 1]) {
            this.text_value[i - 1].setText(
                
                this.playersLogs[i].name + '\n' +
               'LUCK - ' + this.playersLogs[i].luck + '\n' +
               
               'Life - ' + this.lifePoints[i]
                
                
            )
            
            
        }
    }

    
    
}
              }
             
