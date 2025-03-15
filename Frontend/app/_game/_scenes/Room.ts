import { Scene } from "phaser";
import { io, Socket } from "socket.io-client";
//import { EventBus } from "../EventBus";
//import { socketService } from "../SocketService";

export class Room extends Scene {

  //Responsive 
  private cameraX: number = 0;
  private cameraY: number = 0;

  //Generated For Image
  private defaultColor: Array<{
    color: number,
    img: string
  }> = [];

  //Players Arrays
  private playersLogs: Array<{
    id: string | number;
    lifePoints: number;
    name: string;
    color: number;
    luck: number;
    bet: number;
    img: string;
    LM: number;
    dpotion: number;
    leppot: number;
    health_potion: number;
    walletBal: number;
  }> = [];

  //Game Effects
  private imageDead: Phaser.GameObjects.Image[] = [];
  private skull: Phaser.GameObjects.Image[] = [];
  private imageAttack: {
    image: Phaser.GameObjects.Image;
    originalX: number;
    originalY: number;
  }[] = [];
  private imageShake: {
    image: Phaser.GameObjects.Image;
    originalX: number;
    originalY: number;
  }[] = [];
  private imageAttack_ani: Phaser.GameObjects.Image[] = [];
  private container_countdown_respin: Phaser.GameObjects.Text = null!;
  private spinning: ReturnType<typeof setInterval> | null = null
  private updatePlayer: ReturnType<typeof setInterval> | null = null
  private bounceBox: boolean = true
  private updateFunction: boolean = false
  private activeTween: Phaser.Tweens.Tween | null = null;


  //For Every Players Info
  private dpotion: Phaser.GameObjects.Text = null!;
  private leppot: Phaser.GameObjects.Text = null!;
  private healthPotion: Phaser.GameObjects.Text = null!;
  private text_value: Phaser.GameObjects.Text[] = [];
  private player_info_p: { x: number; y: number }[] = [];
  private player_ar: { x: number; y: number }[] = [];
  private box1!: Phaser.GameObjects.Image;
  private box2!: Phaser.GameObjects.Image;
  private box3!: Phaser.GameObjects.Image;
  private box1h: Phaser.GameObjects.Image | null = null;
  private box2h: Phaser.GameObjects.Image | null = null;
  private box3h: Phaser.GameObjects.Image | null = null;
  private boxStart: Phaser.GameObjects.Image | null = null;
  private mainplayerinfo_text: Phaser.GameObjects.Text = null!;
  private boxResult: Array<{color: number, img: string}> | null = null



  //API Informations
  private tempRoom: Array<{id: string & number}> | null = null

  socket!: Socket;
    roomID!: string;

  //  player information
  user!: { id: string; user_id: string; username: string };
  potions!: {
    id: string;
    devil: number;
    leprechaun: number;
    hp: number;
  };
  character!: {
    id: number;
    name: string;
    sprite: string;
    created_at: string;
    tier: string;
    color: string;
    luck?: number;
  };


  constructor() {
    super("Room");
  }
  
  preload() {

    this.load.setPath("assets");
        
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

// async init(data: any) {

//     this.roomID = data.roomID

//     console.log("ROOM ID", this.roomID)

//     // this.socket = socketService.getSocket();

//     // if (this.socket.connected) {
//     //     this.socket.emit("Create_BattleField", "Successfully Create Demo")
//     // }

// } 

 create() {

    this.scale.resize(1296, 926)
    
    this.socket = io("http://127.0.0.1:3000/")

    this.socket.on("connect", () => {
        console.log("✅ Connected to server:", this.socket.id);
        this.socket.emit("Create_BattleField", "Successfully Create Demo")
        
    });

    
    this.socket.on("connect_error", (err) => {
        console.error("❌ Connection error:", err.message);
        alert("Connection Time Out Or Server Error")
    });

   //Responsive
   this.cameraX = this.cameras.main.width / 2

   this.cameraY = this.cameras.main.height / 2



   //Players Logs || Waiting Other Player Logs
  //Just change for main session to index 0 as main character in their Own Devices
  this.playersLogs = [
    // {id: 'playersId', lifePoints: 10 ,name: 'Player 1', color: 0xff0000, luck: 6, bet: 2000, img: 'red', LM: 0, dpotion: 2, leppot: 4, health_potion: 5, walletBal: 999},
  ] 

//   this.socket.on("ClearAllInterval", (data) => {

//     if(data && this.updatePlayer !== null) {
//         clearInterval(this.updatePlayer)
//     }

//   })

//   this.updatePlayer = setInterval(() => {
//     const playersOrginalValue = [
//         this.playersLogs[0].id, 
//         this.playersLogs[0].LM, 
//         this.playersLogs[0].lifePoints,
//         this.playersLogs[0].walletBal,
//         this.playersLogs[0].leppot,
//         this.playersLogs[0].dpotion,
//         this.playersLogs[0].health_potion, 
//         this.room
//     ]

//     this.socket.emit("UpdatePlayer1", playersOrginalValue)
//   }, 500)

  

  ///6 Collors
this.defaultColor = [
    {color: 0xff0000, img: 'redDice'},
    {color: 0xffff00, img: 'yellowDice'},
    {color: 0x00ff00, img: 'greenDice'},
    {color: 0xffffff, img: 'whiteDice'},
    {color: 0x0000ff, img: 'blueDice'},
    {color: 0xff00ff, img: 'pinkDice'},
]   
           
    
    // setTimeout(() => {
    //     this.socket.emit("Exporting_Data", this.socket.id)
    // }, 1000)
    
    this.tempRoom = []

    const loadPlayers = () => {
            
            //Text, Elements, Colors, and prizes
            
            const totalBet = this.playersLogs.reduce((sum, player) => sum + player.bet, 0);
    
            const prizeWOK = totalBet
    
            const text_color = "#000"
            
            const walletBal = this.playersLogs[0].walletBal //Wallets --  to Show Current Balances
    
        // Main Board && GamePlay System && Rules
            this.add.rectangle(
                this.cameraX + 450,
                this.cameraY - 430,
                450,
                90,
                0x693701
                )
            
            this.add.text(
                this.cameraX + 450,
                this.cameraY - 430,
                ' Wok Coins (' + walletBal + ')',
                {
                    fontSize: '28px',
                    color: '#fff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5)
            
            this.add.image(
                this.cameraX + 300,
                this.cameraY - 430,
                'wok_coins'
            ).setDisplaySize(50, 50)
           
            this.add.rectangle(
                this.cameraX,
                this.cameraY,
                510,
                360,
                0x000000
                )
    
            this.add.rectangle(
                this.cameraX,
                this.cameraY,
                500,
                350,
                0xb0c4de
                )
            this.add.rectangle(
                this.cameraX,
                this.cameraY,
                450,
                250,
                0x4682b4
                )
    
            this.add.text(this.cameraX, this.cameraY - 100, [
                'TOTAL PRIZE = ' + prizeWOK
            ], {
                fontSize: '28px',
                color: text_color,
                fontStyle: 'bold'
            }).setOrigin(0.5)            
    
            this.container_countdown_respin = this.add.text(this.cameraX, this.cameraY + 90, 
                'Re - rolling in ', {
                    fontSize: '25px',
                    color: '#000'
                }).setOrigin(0.5, 0.5)
            
            //Box Dice...
            this.box1 = this.add.image(
                this.cameraX - 130,
                this.cameraY, 
                this.defaultColor[0].img
                ).setDisplaySize(120, 120).setVisible(false)
    
            this.box2 = this.add.image(
                this.cameraX,
                this.cameraY, 
                this.defaultColor[0].img
                ).setDisplaySize(120, 120).setVisible(false)
    
            this.box3 = this.add.image(
                this.cameraX + 130,
                this.cameraY, 
                this.defaultColor[0].img
                ).setDisplaySize(120, 120).setVisible(false)
            
            //Dice History
             this.box1h = this.add.image(
                this.cameraX + 360,
                this.cameraY - 320, 
                this.defaultColor[0].img
                ).setDisplaySize(90, 90).setVisible(true)
    
            this.box2h = this.add.image(
                this.cameraX + 460,
                this.cameraY - 320, 
                this.defaultColor[0].img
                ).setDisplaySize(90, 90)
    
            this.box3h = this.add.image(
                this.cameraX + 560,
                this.cameraY - 320, 
                this.defaultColor[0].img
                ).setDisplaySize(90, 90)
    
            this.boxStart = this.add.image(
                this.cameraX,
                this.cameraY, 
                'loadDice'
                ).setDisplaySize(300, 280)
    
            setTimeout(() => {
    
                this.boxStart?.destroy()

                this.spinning = setInterval(() => {

                    const Value1 = Phaser.Math.Between(0, this.defaultColor.length - 1);
                    const Value2 = Phaser.Math.Between(0, this.defaultColor.length - 1);
                    const Value3 = Phaser.Math.Between(0, this.defaultColor.length - 1);

                    const color1 = this.defaultColor[Value1]?.img
                    const color2 = this.defaultColor[Value2]?.img
                    const color3 = this.defaultColor[Value3]?.img

                    if (color1) {
                        this.box1?.setTexture(color1).setVisible(true)
                    }
                    if (color2) {
                        this.box2?.setTexture(color2).setVisible(true)
                    }
                    if (color3) {
                        this.box3?.setTexture(color3).setVisible(true)
                    }
            
                }, 100)
                
                this.restartBounce(this.box1, this.bounceBox)
    
                this.restartBounce(this.box2, this.bounceBox)
    
                this.restartBounce(this.box3, this.bounceBox)
                
            }, 1800)
    
            //Arrays for Dmg Recieve
            
            this.imageDead = []
            
            this.skull = []
            
            this.imageAttack = []
    
            this.imageShake = []
    
            this.imageAttack_ani = []
    
            let round = 0
    
            let closedGame = true

            this.socket.on("ReceiveColor", (data) => {


                this.boxResult = data

                if(!closedGame) return

                this.box1?.setTexture(data[0].img)
                this.box2?.setTexture(data[1].img)
                this.box3?.setTexture(data[2].img)

                this.stopBounce(this.box1)
        
                this.stopBounce(this.box2)
        
                this.stopBounce(this.box3)
                
                const round_result = round += 1
                
                this.socket.emit("round", round_result)
                
                this.socket.on("round_result", (data) => {

                this.container_countdown_respin.setText('Round ' + data) 
                    
                })

                this.socket.on("Update_Life_P", (data) => {

                    const players = this.socket.id

                    interface Player {  
                        id: string | number
                    }
                    
                    const index = data.findIndex((player: Player) => player.id === players)
                    
                    if (index !== -1) {
                        
                        const currentPlayer = data.splice(index, 1)[0]
                        
                        if (currentPlayer) {
                            
                            data.unshift(currentPlayer)
                            
                        }
                        
                    }
                        
                    this.playersLogs = data
                                      
                })

                this.socket.on("Update_Life_R", (data) => {
                        
                    const players = this.socket.id

                    interface Player {  
                        id: string | number
                    }
                    
                    const index = data.findIndex((player: Player) => player.id === players)
                    
                    if (index !== -1) {
                        
                        const currentPlayer = data.splice(index, 1)[0]
                        
                        if (currentPlayer) {
                            
                            data.unshift(currentPlayer)
                            
                        }
                        
                    }
                        
                    setTimeout(() => {
                        this.playersLogs = data
                    }, 700)
                    

                })


                for (let i = 0; i < this.playersLogs.length; i++) {
                    
                    const matchingColors = this.boxResult?.filter(box => box.color === this.playersLogs[i].color).length ?? 0;

                    if (matchingColors > 0) {

                        this.imageAttack_ani[i].setVisible(true);
                        setTimeout(() => {
                            this.imageAttack_ani[i].setVisible(false);
                        }, 1000);

                       this.rotateAttack(i);
                    } else {
                       setTimeout(() => {
                           this.shakeDmg(i);
                       }, 700);
                    }
                    
                    //Winners and Lossers  
                      if (this.playersLogs[i].lifePoints <= 1) {
          
                          this.imageDead[i].setVisible(false)
                          this.skull[i].setTexture('skull').setVisible(true)
                          this.imageAttack_ani[i].destroy()
          
                      } else if (this.playersLogs[i].lifePoints >= 15){
                          
                          setTimeout(() => {
                              
                              closedGame = false
          
                              setTimeout(() => {
                         
                                this.add.rectangle(
                                this.cameraX,
                                this.cameraY,
                                560,
                                310,
                                0x000000
                                )
                                    
                                this.add.rectangle(
                                this.cameraX,
                                this.cameraY,
                                550,
                                300,
                                0xffffff
                                )
                                 
                  this.add.text(this.cameraX, this.cameraY - 100, [
                      'TOTAL PRIZE = ' + prizeWOK + ' Wok'
                  ], {
                      fontSize: '28px',
                      color: text_color,
                      fontStyle: 'bold'
                  }).setOrigin(0.5)
                  
                  this.add.text(this.cameraX, this.cameraY + 100, [
                      'The Winner is ' + this.playersLogs[i].name
                  ], {
                      fontSize: '28px',
                      color: text_color,
                      fontStyle: 'bold'
                  }).setOrigin(0.5)
                  
                  this.add.image(
                      this.cameraX,
                      this.cameraY,
                      this.playersLogs[i].img
                  ).setDisplaySize(120, 120)
                                  
                                  
                              }, 1000)
                              
                          }, 2000)
                          
                      }
                          
                      }

                      if (this.spinning !== null) {
                        clearInterval(this.spinning)//Bugging
                    }
    
                    setTimeout(() => {
                        
                        this.spinning = setInterval(() => {
                        const Value1 = Phaser.Math.Between(0, this.defaultColor.length - 1);
                        const Value2 = Phaser.Math.Between(0, this.defaultColor.length - 1);
                        const Value3 = Phaser.Math.Between(0, this.defaultColor.length - 1);
    
                        const color1 = this.defaultColor[Value1]?.img
                        const color2 = this.defaultColor[Value2]?.img
                        const color3 = this.defaultColor[Value3]?.img
    
                        if (color1) {
                            this.box1?.setTexture(color1).setVisible(true)
                        }
                        if (color2) {
                            this.box2?.setTexture(color2).setVisible(true)
                        }
                        if (color3) {
                            this.box3?.setTexture(color3).setVisible(true)
                        }
                        }, 100)
        
                        this.restartBounce(this.box1, this.bounceBox)
        
                        this.restartBounce(this.box2, this.bounceBox)
        
                        this.restartBounce(this.box3, this.bounceBox)
        
                   }, 2000)

            });

            this.socket.on("colorHistory", (data) => {
                 
                this.box1h?.setTexture(data[0].img)
                
                this.box2h?.setTexture(data[1].img)

                this.box3h?.setTexture(data[2].img)
            
            })
      
            //Other Player 
            //Position
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
               
               const info_text = this.add.text(
                   this.player_info_p[i].x,
                   this.player_info_p[i].y,
                   
                   this.playersLogs[i].name + '\n' +
                   'LM - ' + this.playersLogs[i].LM + '\n' +
                   
                   'LP - ' + this.playersLogs[i].lifePoints,
                   
                   {
                       fontSize: '24px',
                       color: text_color,
                       fontStyle: 'bold'
                   }
                   
               )
              
             this.text_value.push(info_text)           
               
           }
    
            for (let i = 0; i < this.playersLogs.length; i++) {
                
                this.add.rectangle(
                    this.player_ar[i].x,
                    this.player_ar[i].y,
                    150,
                    150,
                    0xffffff,
                    0
                ).setStrokeStyle(4, this.playersLogs[i].color)
                
                const dead = this.add.image(
                    this.player_ar[i].x,
                    this.player_ar[i].y,
                    this.playersLogs[i].img
                ).setDisplaySize(140, 140).setVisible(false)
                
                const images = this.add.image(
                    this.player_ar[i].x,
                    this.player_ar[i].y,
                    this.playersLogs[i].img
                ).setDisplaySize(140, 140)
    
                const attack = this.add.image(
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
            [   this.playersLogs[0].name + '\n - LUCK Multiplayer - ' +
                this.playersLogs[0].lifePoints + ' LIFE POINTS'
            ], {
                fontSize: '34px',
                color: text_color,
                fontStyle: 'bold'
            })
    
            this.add.rectangle(
                this.cameraX - 540,
                this.cameraY - 340,
                190,
                190,
                0xffffff,
                0
            ).setStrokeStyle(4, this.playersLogs[0].color)

            this.add.image(
                    this.cameraX - 540, 
                    this.cameraY - 340,
                    this.playersLogs[0].img
                ).setDisplaySize(180, 180)
                
            const potionsbg = this.add.rectangle(
                this.cameraX,
                this.cameraY + 340,
                870,
                370,
                0x000000
                ).setVisible(false)
                  
            const potions = this.add.rectangle(
                this.cameraX,
                this.cameraY + 340,
                860,
                360,
                0xffffff
                ).setVisible(false)

            //Devil Potions
            const potion_img1 = this.add.image(
                this.cameraX,
                this.cameraY + 300,
                'dpotion'
            ).setDisplaySize(140, 140)
             .setInteractive()
             .setVisible(false)
             
             potion_img1.on('pointerdown', () => {
                this.buttonClick1();
            });
           
            const potion_name_1 = this.add.text(
                this.cameraX,
                this.cameraY + 390,
                'Devil \n potion',
                {
                    fontSize: '24px',
                    color: '#000',
                    fontStyle: 'bold'
                }
            ).setVisible(false).setOrigin(0.5, 0.5)
            
                this.dpotion = this.add.text(
                this.cameraX + 50,
                this.cameraY + 230,
                '' + this.playersLogs[0].dpotion + 'x',
                {
                    fontSize: '42px',
                    color: '#000',
                    fontStyle: 'bold'
                }
            ).setVisible(false)

            //Leppot
             const potion_img2 = this.add.image(
                this.cameraX + 220,
                this.cameraY + 300,
                'leppot'
            )
            .setDisplaySize(140, 140)
            .setInteractive()
            .setVisible(false)
    
            potion_img2.on('pointerdown', () => {
                
                potion_img2.disableInteractive()
    
              if (isNaN(this.playersLogs[0].lifePoints) || this.playersLogs[0].lifePoints >= 15 || 
                    this.playersLogs[1].lifePoints >= 15 || this.playersLogs[2].lifePoints >= 15 || 
                    this.playersLogs[3].lifePoints >= 15 || this.playersLogs[4].lifePoints >= 15 || 
                    this.playersLogs[5].lifePoints >= 15) {
    
                    potion_img2.disableInteractive()
    
                } else {
    
                    this.buttonClick2();
    
                }  
    
            });
            
                this.leppot = this.add.text(
                this.cameraX + 290,
                this.cameraY + 230,
                '' + this.playersLogs[0].leppot + 'x',
                {
                    fontSize: '42px',
                    color: '#000',
                    fontStyle: 'bold'
                }
            ).setVisible(false)
            
            
            const potion_name_2 = this.add.text(
                this.cameraX + 220,
                this.cameraY + 390,
                'Leppot',
                {
                    fontSize: '24px',
                    color: '#000',
                    fontStyle: 'bold'
                }
            ).setVisible(false).setOrigin(0.5, 0.5)
    
            const bag = this.add.image(
                this.cameraX + 540,
                this.cameraY + 370,
                'bag2'
            )
            .setDisplaySize(110, 120)
            .setInteractive()

            //Health Potion
            const potion_img3 = this.add.image(
                this.cameraX - 220,
                this.cameraY + 300,
                'healthPotion'
            ).setDisplaySize(140, 140)
             .setInteractive()
             .setVisible(false)
             
             potion_img3.on('pointerdown', () => {
                this.buttonClick3();
            });
           
            const potion_name_3 = this.add.text(
                this.cameraX - 220,
                this.cameraY + 390,
                'Health \n Potion',
                {
                    fontSize: '24px',
                    color: '#000',
                    fontStyle: 'bold'
                }
            ).setVisible(false).setOrigin(0.5, 0.5)
            
                this.healthPotion = this.add.text(
                this.cameraX - 160,
                this.cameraY + 230,
                '' + this.playersLogs[0].health_potion + 'x',
                {
                    fontSize: '42px',
                    color: '#000',
                    fontStyle: 'bold'
                }
            ).setVisible(false)
            
            let isOpen = false
    
            bag.on('pointerdown', () => {
    
                if (isOpen) {
                    bag.setTexture('bag2')
                    potions.setVisible(false)
                    potionsbg.setVisible(false)
                    potion_img1.setVisible(false)
                    potion_img2.setVisible(false)
                    potion_img3.setVisible(false)
                    potion_name_1.setVisible(false)
                    potion_name_2.setVisible(false)
                    potion_name_3.setVisible(false)
                    this.leppot.setVisible(false)
                    this.dpotion.setVisible(false)
                    this.healthPotion.setVisible(false)
                } else {
                    bag.setTexture('bag1')
                    potions.setVisible(true)
                    potionsbg.setVisible(true)
                    potion_img1.setVisible(true)
                    potion_img2.setVisible(true)
                    potion_img3.setVisible(true)
                    potion_name_1.setVisible(true)
                    potion_name_2.setVisible(true)
                    potion_name_3.setVisible(true)
                    this.leppot.setVisible(true)
                    this.dpotion.setVisible(true)
                    this.healthPotion.setVisible(true)
                }
    
                isOpen = !isOpen
    
            })
            
            }

            const waiting = this.add.text(this.cameraX, this.cameraY, "Connecting...", {
                font: '34px',
                color: '#000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)
            
            this.socket.on("SetCount", (data) => {
                
                waiting.setText("Waiting For Others Players " + data + "/6")
                
            })
            
            const roomText = this.add.text(this.cameraX, this.cameraY - 440, "-----", {
                font: '23px',
                color: '#000',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0.5)
            
            this.socket.on("roomAssign", (data) => {                
                
                roomText.setText(data)

                this.socket.emit("GenerateColors", data)

            })
                
            this.socket.on("InputPlayer", (data) => {
            
            waiting.destroy()
            
            const players = this.socket.id

            interface Player {  
                id: string | number
            }
            
            const index = data.findIndex((player: Player) => player.id === players)
            
            if (index !== -1) {
                
                const currentPlayer = data.splice(index, 1)[0]
                
                if (currentPlayer) {
                    
                    data.unshift(currentPlayer)
                    
                }
                
            }
                 
            this.playersLogs = data  
            
            setTimeout(loadPlayers, 2000)
        
            setTimeout(() => {
            
            this.updateFunction = true
            
            }, 5000)
            
            })
        
            this.updateFunction = false
    
 }

  buttonClick1() {
         

         
   }
   
   buttonClick2() {
         
            
         
   } 
 
   buttonClick3() {


   }

 rotateBounce(box: Phaser.GameObjects.Image | null, bounceBox: boolean) {
 
         if(!box || !bounceBox) return;

         this.activeTween = this.tweens.add({
         targets: box,  
         y: box.y - 30,
         angle: 360,                         
         ease: 'Sine.easeInOut',  
         duration: 150,
         yoyo: true,
         repeat: -1,
         });
         
 }
 
 stopBounce(box: Phaser.GameObjects.Image) {

    if(!box) return
 // Stop all tweens affecting this box
    if (this.activeTween) {
        this.activeTween.stop();
        this.activeTween = null; // Clear reference
    }
    this.tweens.killTweensOf(box);
        // Ensure all tweens related to the box are stopped
        (box as Phaser.GameObjects.Image).y = 450; // Reset the Y position (change if needed)
        (box as Phaser.GameObjects.Image).setAngle(0); // Reset rotation to default
    
}
 
restartBounce(box: Phaser.GameObjects.Image | null, bounceBox: boolean) {
    this.rotateBounce(box, bounceBox);
}

   // Special Effect: Rotate Attack
 rotateAttack(index: number) {
     const imgData = this.imageAttack[index]; // Get stored image
 
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
   shakeDmg(index: number) {
 
     const imgData = this.imageShake[index]; // Get stored image and original position
 
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
     
     if (!this.updateFunction) {
         return
     }
     
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
