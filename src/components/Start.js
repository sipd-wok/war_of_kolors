
const io = require('socket.io') (server)


export class Start extends Phaser.Scene {

    constructor() {
    
        super('Start')  
        
    }
    
    preload() {
        
        //Characters
        this.load.image('blue', 'img/blue.png')
        this.load.image('yellow', 'img/yellow.png')
        this.load.image('pink', 'img/boky.png')
        this.load.image('white', 'img/white.png')
        this.load.image('red', 'img/red.png')
        this.load.image('green', 'img/green.png')

        //Wok Accessories
        this.load.image('wok_coins', 'img/WokCoin.png')
        this.load.image('dpotion', 'img/dpotion.png')
        this.load.image('leppot', 'img/leppot.png')
        this.load.image('bag1', 'img/bag1.png')
        this.load.image('bag2', 'img/bag2.png')
        this.load.image('skull', 'img/dead_sign.png')
        this.load.image('sword', 'img/sword-r.png')
        this.load.image('healthPotion', 'img/healthPotion.png')

        //Wok Buttons
        this.load.image('whitesrc', 'img/whitesqr.png')

        //Dice
        this.load.image('blueDice', 'img/blueDice.png')
        this.load.image('greenDice', 'img/greenDice.png')
        this.load.image('pinkDice', 'img/pinkDice.png')
        this.load.image('redDice', 'img/redDice.png')
        this.load.image('whiteDice', 'img/whiteDice.png')
        this.load.image('yellowDice', 'img/yellowDice.png')
        this.load.image('loadDice', 'img/load.png')

    }

    create() {
            
         //Responsive
        this.cameraX = this.cameras.main.width / 2

        this.cameraY = this.cameras.main.height / 2
        
          
        //Players Logs || Waiting Other Player Logs
        //Just change for main session to index 0 as main character in their Own Devices
        this.playersLogs = [
            {lifePoints: 10 ,name: "Player 1", color: 0xff0000, luck: 6, bet: 2000, img: 'red', LM: 0, dpotion: 2, leppot: 4},
            {lifePoints: 10 ,name: "Player 2", color: 0xffff00, luck: 6, bet: 2000, img: 'yellow', LM: 0, dpotion: 2, leppot: 4},
            {lifePoints: 10 ,name: "Player 3", color: 0x00ff00, luck: 6, bet: 2000, img: 'green', LM: 0, dpotion: 2, leppot: 4},
            {lifePoints: 10 ,name: "Player 4", color: 0xffffff, luck: 6, bet: 2000, img: 'white', LM: 0, dpotion: 2, leppot: 4},
            {lifePoints: 10 ,name: "Player 5", color: 0x0000ff, luck: 6, bet: 2000, img: 'blue', LM: 0, dpotion: 2, leppot: 4},
            {lifePoints: 10 ,name: "Player 6", color: 0xff00ff, luck: 6, bet: 2000, img: 'pink', LM: 0, dpotion: 2, leppot: 4},
        ]     
        
        // this.lifePoints = [10, 10, 10, 10, 10, 10] // Life Points
        
        //Text, Elements, Colors, and prizes
        
        var totalBet = this.playersLogs.reduce((sum, player) => sum + player.bet, 0);

        var prizeWOK = totalBet

        var text_color = "#000"
        
        var walletBal = 0 //Wallets --  to Show Current Balances

        //6 Collors
        this.defualtColor = [
            {color: 0xff0000, img: 'redDice'},
            {color: 0xffff00, img: 'yellowDice'},
            {color: 0x00ff00, img: 'greenDice'},
            {color: 0xffffff, img: 'whiteDice'},
            {color: 0x0000ff, img: 'blueDice'},
            {color: 0xff00ff, img: 'pinkDice'},
        ]   
            

    // Main Board && GamePlay System && Rules
        var container = this.add.rectangle(
            this.cameraX + 450,
            this.cameraY - 430,
            450,
            90,
            0x693701
            )
        
        var WokCoins = this.add.text(
            this.cameraX + 450,
            this.cameraY - 430,
            ' Wok Coins (' + walletBal + ')',
            {
                fontSize: '28px',
                color: '#fff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)
        
        var Wokcoins = this.add.image(
            this.cameraX + 300,
            this.cameraY - 430,
            'wok_coins'
        ).setDisplaySize(50, 50)
       
        var container = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            510,
            360,
            0x000000
            )
        var container = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            500,
            350,
            0xb0c4de
            )
        var containerS2 = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            450,
            250,
            0x4682b4
            )

        var container_prize_pool = this.add.text(this.cameraX, this.cameraY - 100, [
            'TOTAL PRIZE = ' + prizeWOK
        ], {
            fontSize: '28px',
            color: text_color,
            fontStyle: 'bold'
        }).setOrigin(0.5)
        
        

        var count = 5
        //5 second Delay before Start the Game
        this.container_countdown_respin = this.add.text(this.cameraX, this.cameraY + 90, [
            'Re - rolling in ' + count + ' sec...'
        ], {
            fontSize: '24px',
            color: text_color,
            fontStyle: 'bold',
        }).setOrigin(0.5)

        

            let countDown = this.time.addEvent({
            delay: 1000,
            callback: () => {
                count -= 1
                this.container_countdown_respin.setText('Re - rolling in ' + count + ' sec...')
                if (count <= 0) {
                    countDown.remove()
                }
            },
            
            loop: true

        })

        //LUCK Formula Dont Touch !!!
        var totalLuck = this.playersLogs.reduce((sum, player) => sum + player.luck, 0);
        
        const RandomColors = () => {

            var random = Math.random() * 100

            var cumu = 0

            for (var i = 0; i < this.playersLogs.length; i++) {
                cumu += (this.playersLogs[i].luck / totalLuck) * 100
                if (random < cumu) {
                    return this.defualtColor[i]
                }
            }

            return this.defualtColor[0]

        } 
        
        
        //Box Dice...
        this.box1 = this.add.image(
            this.cameraX - 130,
            this.cameraY, 
            this.defualtColor[0].img
            ).setDisplaySize(120, 120).setVisible(false)

        this.box2 = this.add.image(
            this.cameraX,
            this.cameraY, 
            this.defualtColor[0].img
            ).setDisplaySize(120, 120).setVisible(false)

        this.box3 = this.add.image(
            this.cameraX + 130,
            this.cameraY, 
            this.defualtColor[0].img
            ).setDisplaySize(120, 120).setVisible(false)
        
        //Dice History
         this.box1h = this.add.image(
            this.cameraX + 360,
            this.cameraY - 320, 
            this.defualtColor[0].img
            ).setDisplaySize(90, 90).setVisible(true)

        this.box2h = this.add.image(
            this.cameraX + 460,
            this.cameraY - 320, 
            this.defualtColor[0].img
            ).setDisplaySize(90, 90)

        this.box3h = this.add.image(
            this.cameraX + 560,
            this.cameraY - 320, 
            this.defualtColor[0].img
            ).setDisplaySize(90, 90)

        this.boxStart = this.add.image(
            this.cameraX,
            this.cameraY, 
            'loadDice'
            ).setDisplaySize(300, 280)

        this.bounceBox = true

        setTimeout(() => {

            this.boxStart.setVisible(false)

            this.spinning = setInterval(() => {
                let Value1 = Phaser.Math.Between(0, this.defualtColor.length - 1);
                this.box1.setTexture(this.defualtColor[Value1].img).setVisible(true)
                let Value2 = Phaser.Math.Between(0, this.defualtColor.length - 1);
                this.box2.setTexture(this.defualtColor[Value2].img).setVisible(true)
                let Value3 = Phaser.Math.Between(0, this.defualtColor.length - 1);
                this.box3.setTexture(this.defualtColor[Value3].img).setVisible(true)
            }, 100)

            this.rotateBounce(this.box1, this.bounceBox)

            this.rotateBounce(this.box2, this.bounceBox)

            this.rotateBounce(this.box3, this.bounceBox)

            this.box1h.setTexture(boxResult[0].img)

            this.box2h.setTexture(boxResult[1].img)

            this.box3h.setTexture(boxResult[2].img)

        }, 7200)

        //Arrays for Dmg Reciever
        this.imageDead = []
        
        this.skull = []
        
        this.imageAttack = []

        this.imageShake = []

        this.imageAttack_ani = []

        let round = 0

        let closedGame = true

        const setColors = () => {

            if(!closedGame) return

            clearInterval(this.spinning)

            let boxResult = [RandomColors(), RandomColors(), RandomColors()]
            
            this.box1.setTexture(boxResult[0].img)
            this.box2.setTexture(boxResult[1].img)
            this.box3.setTexture(boxResult[2].img)

            let round_result = round += 1

            this.container_countdown_respin.setText('Round ' + round_result)
            
            setTimeout(() => {
                
                this.spinning = setInterval(() => {
                    let Value1 = Phaser.Math.Between(0, this.defualtColor.length - 1);
                    this.box1.setTexture(this.defualtColor[Value1].img)
                    let Value2 = Phaser.Math.Between(0, this.defualtColor.length - 1);
                    this.box2.setTexture(this.defualtColor[Value2].img)
                    let Value3 = Phaser.Math.Between(0, this.defualtColor.length - 1);
                    this.box3.setTexture(this.defualtColor[Value3].img)
                }, 100)

                this.rotateBounce(this.box1, this.bounceBox)

                this.rotateBounce(this.box2, this.bounceBox)

                this.rotateBounce(this.box3, this.bounceBox)

                this.box1h.setTexture(boxResult[0].img)

                this.box2h.setTexture(boxResult[1].img)

                this.box3h.setTexture(boxResult[2].img)

            }, 4100)

            for (let i = 0; i < this.playersLogs.length; i++) {
                
          if (
             this.playersLogs[i].color === boxResult[0].color ||
             this.playersLogs[i].color === boxResult[1].color ||
             this.playersLogs[i].color === boxResult[2].color) {
             this.imageAttack_ani[i].setVisible(true)
             
             setTimeout(() => {
                this.imageAttack_ani[i].setVisible(false)
             }, 1000)

             this.rotateAttack(i)
             this.playersLogs[i].lifePoints += 1
            } else {
             

             setTimeout(() => {
                 this.playersLogs[i].lifePoints -= 1
                this.shakeDmg(i)
             }, 700)

            }
            
            if (
            this.playersLogs[i].color === boxResult[0].color &&
            this.playersLogs[i].color === boxResult[1].color ||
            this.playersLogs[i].color === boxResult[0].color &&
            this.playersLogs[i].color === boxResult[2].color || 
            this.playersLogs[i].color === boxResult[1].color &&
            this.playersLogs[i].color === boxResult[2].color) {
            this.rotateAttack(i)
            this.imageAttack_ani[i].setVisible(true)

            setTimeout(() => {
                this.imageAttack_ani[i].setVisible(false)
             }, 1000)

            this.playersLogs[i].lifePoints += 1
            } 
            
            if (
            this.playersLogs[i].color === boxResult[0].color && 
            this.playersLogs[i].color === boxResult[1].color && 
            this.playersLogs[i].color === boxResult[2].color) {
            this.rotateAttack(i)
            this.playersLogs[i].lifePoints += 1

            setTimeout(() => {
                this.imageAttack_ani[i].setVisible(false)
             }, 1000)

            this.imageAttack_ani[i].setVisible(true)
            }
            

            //Winners and Lossers  
            if (this.playersLogs[i].lifePoints <= 0) {

                this.playersLogs[i].lifePoints = NaN
                this.playersLogs[i].luck = 0
                this.playersLogs[i].name = "Dead"
                this.imageDead[i].setVisible(false)
                this.skull[i].setTexture('skull').setVisible(true)
                this.imageAttack_ani[i].destroy()

            } else if (this.playersLogs[i].lifePoints >= 15){
                
                //here Add to Recieve the WOK Prize to Transfer Wok Wallet
                

                setTimeout(() => {
                    
                    closedGame = false

                    setTimeout(() => {
               
               var containerBg1 = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            560,
            310,
            0x000000
            )
               
                var container2 = this.add.rectangle(
            this.cameraX,
            this.cameraY,
            550,
            300,
            0xffffff
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
                setInterval(setColors, 5000)//Set Colors Every 5 Seconds
            }, 3000)

        //Other Player 
        //This Code Dont Touch For maintenance only
       this.player_info_p = [
           {x: this.cameraX - 590, y: this.cameraY - 70},
           {x: this.cameraX - 570, y: this.cameraY + 70},
           {x: this.cameraX - 300, y: this.cameraY + 220},
           {x: this.cameraX + 190, y: this.cameraY + 220},
           {x: this.cameraX + 460, y: this.cameraY + 70},
           {x: this.cameraX + 460, y: this.cameraY - 140},
           
       ]
       
       this.player_ar = [
           {x: this.cameraX - 360, y: this.cameraY - 100},
           {x: this.cameraX - 360, y: this.cameraY + 100},
           {x: this.cameraX - 90, y: this.cameraY + 260},
           {x: this.cameraX + 90, y: this.cameraY + 260},
           {x: this.cameraX + 360, y: this.cameraY + 100},
           {x: this.cameraX + 360, y: this.cameraY - 100},
       ]
       
       
       this.text_value = []
       
       for (let i = 1; i < this.playersLogs.length; i++) {
           
           let info_text = this.add.text(
               this.player_info_p[i].x,
               this.player_info_p[i].y,
               
               
               this.playersLogs[i].name + '\n' +
               'LM - ' + this.playersLogs[i].LM + '\n' +
               
               'LP - ' + this.playersLogs[i].lifePoints
               
               ,
               
               {
                   fontSize: '24px',
                   color: text_color,
                   fontStyle: 'bold'
               }
               
               
           )
          
         this.text_value.push(info_text)           
           
       }

        for (let i = 0; i < this.playersLogs.length; i++) {
            
            var player_ar_rect = this.add.rectangle(
                this.player_ar[i].x,
                this.player_ar[i].y,
                150,
                150,
                this.playersLogs[i].color 
                
            )

            let dead = this.add.image(
                this.player_ar[i].x,
                this.player_ar[i].y,
                this.playersLogs[i].img
            ).setDisplaySize(140, 140).setVisible(false)
            
            let images = this.add.image(
                this.player_ar[i].x,
                this.player_ar[i].y,
                this.playersLogs[i].img
            ).setDisplaySize(140, 140)

            let attack = this.add.image(
                this.player_ar[i].x,
                this.player_ar[i].y,
                'sword'
            ).setDisplaySize(140, 140).setVisible(false)
           
           this.imageShake.push({ image: images, originalX: images.x, originalY: images.y })

           this.imageAttack.push({ image: attack, originalX: attack.x, originalY: attack.y })

           this.imageAttack_ani.push(attack)

           this.imageDead.push(images)

           this.skull.push(dead)

        }

        //Player Main

        this.mainplayerinfo_text = this.add.text(this.cameraX - 430, this.cameraY - 420,
     [       this.playersLogs[0].name + '\n - LUCK Multiplayer - ' +
            this.playersLogs[0].lifePoints + ' LIFE POINTS'
        ], {
            fontSize: '34px',
            color: text_color,
            fontStyle: 'bold'
        })

        var profilePic = this.add.rectangle(
            this.cameraX - 540,
            this.cameraY - 340,
            190,
            190,
            this.playersLogs[0].color
        )
        
        let images = this.add.image(
                this.cameraX - 540, 
                this.cameraY - 340,
                this.playersLogs[0].img
            ).setDisplaySize(180, 180)
            
        var potionsbg = this.add.rectangle(
            this.cameraX,
            this.cameraY + 340,
            520,
            370,
            0x000000
            ).setVisible(false)
              
        var potions = this.add.rectangle(
            this.cameraX,
            this.cameraY + 340,
            510,
            360,
            0xffffff
            ).setVisible(false)
           
        var potion_img1 = this.add.image(
            this.cameraX - 100,
            this.cameraY + 300,
            'dpotion'
        ).setDisplaySize(140, 140)
         .setInteractive()
         .setVisible(false)
         potion_img1.on('pointerdown', () => {
            this.buttonClick1();
        });
       
        var potion_name_1 = this.add.text(
            this.cameraX - 140,
            this.cameraY + 370,
            'Dpotion',
            {
                fontSize: '24px',
                color: '#000',
                fontStyle: 'bold'
            }
        ).setVisible(false)
        
            this.dpotion = this.add.text(
            this.cameraX - 70,
            this.cameraY + 230,
            '' + this.playersLogs[0].dpotion + 'x',
            {
                fontSize: '42px',
                color: '#000',
                fontStyle: 'bold'
            }
        ).setVisible(false)
        
         let potion_img2 = this.add.image(
            this.cameraX + 100,
            this.cameraY + 300,
            'leppot'
        )
        .setDisplaySize(140, 140)
        .setInteractive()
        .setVisible(false)

        potion_img2.on('pointerdown', () => {
            
            potion_img2.disableInteractive()

            if (isNaN(this.playersLogs[0].lifePoints)) {

                potion_img2.disableInteractive()

            } else {

                this.buttonClick2();

            }

        });
        
            this.leppot = this.add.text(
            this.cameraX + 150,
            this.cameraY + 230,
            '' + this.playersLogs[0].leppot + 'x',
            {
                fontSize: '42px',
                color: '#000',
                fontStyle: 'bold'
            }
        ).setVisible(false)
        
        
        var potion_name_2 = this.add.text(
            this.cameraX + 60,
            this.cameraY + 370,
            'Leppot',
            {
                fontSize: '24px',
                color: '#000',
                fontStyle: 'bold'
            }
        ).setVisible(false)

        var bag = this.add.image(
            this.cameraX + 540,
            this.cameraY + 370,
            'bag2'
        )
        .setDisplaySize(110, 120)
        .setInteractive()
        
        let isOpen = false

        bag.on('pointerdown', () => {

            if (isOpen) {
                bag.setTexture('bag2')
                potions.setVisible(false)
                potionsbg.setVisible(false)
                potion_img1.setVisible(false)
                potion_img2.setVisible(false)
                potion_name_1.setVisible(false)
                potion_name_2.setVisible(false)
                this.leppot.setVisible(false)
                this.dpotion.setVisible(false)
            } else {
                bag.setTexture('bag1')
                potions.setVisible(true)
                potionsbg.setVisible(true)
                potion_img1.setVisible(true)
                potion_img2.setVisible(true)
                potion_name_1.setVisible(true)
                potion_name_2.setVisible(true)
                this.leppot.setVisible(true)
                this.dpotion.setVisible(true)
            }

            isOpen = !isOpen

        })

        
        
    }
  
  
  buttonClick1() {
        
    if (this.playersLogs[0].lifePoints <= 5) {
        let randomNumber = Math.random() < 0.7 ? -2 : 7;

        this.playersLogs[0].lifePoints = Math.max(1, this.playersLogs[0].lifePoints + randomNumber);
        
       if (this.playersLogs[0].dpotion >= 1) {
           
           this.playersLogs[0].dpotion -= 1
           
       } else {
           
           //Add Wallet here -- Price -- to buy Dpotion
           
           alert("Buy Another One")
           
           
       }
      
}
        
  }
  
  buttonClick2() {
        
            if (this.playersLogs[0].LM >= 0) {
                
                var Value = Math.floor(Phaser.Math.FloatBetween(0.2, 0.8) * 10) / 10
                
                if (this.playersLogs[0].leppot >= 1) {
               
                this.playersLogs[0].LM += Value
                this.playersLogs[0].leppot -= 1
                this.playersLogs[0].luck += Value
                    
                } else {
                    
                    //Add Wallet here -- Price -- to Buy leppot Potion
                    
                    alert("Buy Another One?")
                    
                }  

                
                     
            }
           
        
  } 

rotateBounce(box, shouldAnimate) {
    if (!shouldAnimate) return; // If condition is false, exit function
    this.tweens.add({
        targets: box,  
        y: box.y - 30,
        angle: 360,                         
        ease: 'Sine.easeInOut',  
        duration: 500,
        yoyo: true,
    });
}



  // Special Effect: Rotate Attack
rotateAttack(index) {
    let imgData = this.imageAttack[index]; // Get stored image

    // Prevent error if index is out of range
    if (!imgData || !imgData.image) return;

    this.tweens.add({
        targets: imgData.image, // Apply tween to the image
        angle: 360, // Rotate 360 degrees
        duration: 500, // Duration of the full rotation
        ease: 'easeInOut' // Constant rotation speed
    });
}


    //Special Effects
  shakeDmg(index) {

    let imgData = this.imageShake[index]; // Get stored image and original position

    // Prevent error if index is out of range
    if (!imgData || !imgData.image) return; 

    this.tweens.add({
        targets: imgData.image, // Fix: No "s"
        x: imgData.originalX + Phaser.Math.Between(-5, 5), // Random X shake
        y: imgData.originalY + Phaser.Math.Between(-5, 5), // Random Y shake
        angle: Phaser.Math.Between(-5, 5), // Small rotation shake
        alpha: 0.3,
        duration: 50,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
            imgData.image.x = imgData.originalX; // Reset X
            imgData.image.y = imgData.originalY; // Reset Y
            imgData.image.setAngle(0); // Reset rotation
        }
    });
}
        
  update() {
    
    this.mainplayerinfo_text.setText(
    [
            this.playersLogs[0].name + '\nLUCK Multiplayer - ' + this.playersLogs[0].LM +
            '\nLIFE POINTS - ' + this.playersLogs[0].lifePoints
        ])
        
    this.dpotion.setText(
            this.playersLogs[0].dpotion + 'x',
         
        )
        
      this.leppot.setText(
            this.playersLogs[0].leppot + 'x',
        )
    
    for (let i = 1; i < this.playersLogs.length; i++) {
        if (this.text_value[i - 1]) {
            this.text_value[i - 1].setText(
                
                this.playersLogs[i].name + '\n' +
               'LM - ' + this.playersLogs[i].LM + '\n' +
               
               'LP - ' + this.playersLogs[i].lifePoints
                
                
            )
            
            
        }
    }
  }
    
 }
     
            
