"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[167],{7167:(e,t,i)=>{i.r(t),i.d(t,{default:()=>r});var s=i(5155),a=i(2115),o=i(1057),l=i(4298);class h extends Phaser.Scene{preload(){this.load.image("blue","img/blue.png"),this.load.image("yellow","img/yellow.png"),this.load.image("pink","img/boky.png"),this.load.image("white","img/white.png"),this.load.image("red","img/red.png"),this.load.image("green","img/green.png"),this.load.image("wok_coins","img/WokCoin.png"),this.load.image("dpotion","img/dpotion.png"),this.load.image("leppot","img/leppot.png"),this.load.image("bag1","img/bag1.png"),this.load.image("bag2","img/bag2.png"),this.load.image("skull","img/dead_sign.png"),this.load.image("sword","img/sword-r.png"),this.load.image("healthPotion","img/healthPotion.png"),this.load.image("whitesrc","img/whitesqr.png"),this.load.image("blueDice","img/blueDice.png"),this.load.image("greenDice","img/greenDice.png"),this.load.image("pinkDice","img/pinkDice.png"),this.load.image("redDice","img/redDice.png"),this.load.image("whiteDice","img/whiteDice.png"),this.load.image("yellowDice","img/yellowDice.png"),this.load.image("loadDice","img/load.png")}create(){this.socket=(0,l.io)("http://localhost:3001"),this.cameraX=this.cameras.main.width/2,this.cameraY=this.cameras.main.height/2,this.playersLogs=[],this.socket.on("ClearAllInterval",e=>{e&&clearInterval(this.updatePlayer)}),this.updatePlayer=setInterval(()=>{let e=[this.playersLogs[0].id,this.playersLogs[0].LM,this.playersLogs[0].lifePoints,this.playersLogs[0].walletBal,this.playersLogs[0].leppot,this.playersLogs[0].dpotion,this.playersLogs[0].health_potion,this.room];this.socket.emit("UpdatePlayer1",e)},500),this.defaultColor=[{color:0xff0000,img:"redDice"},{color:0xffff00,img:"yellowDice"},{color:65280,img:"greenDice"},{color:0xffffff,img:"whiteDice"},{color:255,img:"blueDice"},{color:0xff00ff,img:"pinkDice"}],this.room=[];let e=()=>{let e=this.playersLogs.reduce((e,t)=>e+t.bet,0),t="#000",i=this.playersLogs[0].walletBal;this.add.rectangle(this.cameraX+450,this.cameraY-430,450,90,6895361),this.add.text(this.cameraX+450,this.cameraY-430," Wok Coins ("+i+")",{fontSize:"28px",color:"#fff",fontStyle:"bold"}).setOrigin(.5),this.add.image(this.cameraX+300,this.cameraY-430,"wok_coins").setDisplaySize(50,50),this.add.rectangle(this.cameraX,this.cameraY,510,360,0),this.add.rectangle(this.cameraX,this.cameraY,500,350,0xb0c4de),this.add.rectangle(this.cameraX,this.cameraY,450,250,4620980),this.add.text(this.cameraX,this.cameraY-100,["TOTAL PRIZE = "+e],{fontSize:"28px",color:t,fontStyle:"bold"}).setOrigin(.5);let s=5;this.container_countdown_respin=this.add.text(this.cameraX,this.cameraY+90,["Re - rolling in "+s+" sec..."],{fontSize:"24px",color:t,fontStyle:"bold"}).setOrigin(.5);let a=this.time.addEvent({delay:1e3,callback:()=>{s-=1,this.container_countdown_respin.setText("Re - rolling in "+s+" sec..."),s<=0&&a.remove()},loop:!0});this.box1=this.add.image(this.cameraX-130,this.cameraY,this.defaultColor[0].img).setDisplaySize(120,120).setVisible(!1),this.box2=this.add.image(this.cameraX,this.cameraY,this.defaultColor[0].img).setDisplaySize(120,120).setVisible(!1),this.box3=this.add.image(this.cameraX+130,this.cameraY,this.defaultColor[0].img).setDisplaySize(120,120).setVisible(!1),this.box1h=this.add.image(this.cameraX+360,this.cameraY-320,this.defaultColor[0].img).setDisplaySize(90,90).setVisible(!0),this.box2h=this.add.image(this.cameraX+460,this.cameraY-320,this.defaultColor[0].img).setDisplaySize(90,90),this.box3h=this.add.image(this.cameraX+560,this.cameraY-320,this.defaultColor[0].img).setDisplaySize(90,90),this.boxStart=this.add.image(this.cameraX,this.cameraY,"loadDice").setDisplaySize(300,280),setTimeout(()=>{var e;null===(e=this.boxStart)||void 0===e||e.destroy(),this.spinning=setInterval(()=>{var e,t,i;let s=Phaser.Math.Between(0,this.defaultColor.length-1),a=Phaser.Math.Between(0,this.defaultColor.length-1),o=Phaser.Math.Between(0,this.defaultColor.length-1),l=null===(e=this.defaultColor[s])||void 0===e?void 0:e.img,h=null===(t=this.defaultColor[a])||void 0===t?void 0:t.img,r=null===(i=this.defaultColor[o])||void 0===i?void 0:i.img;l&&this.box1.setTexture(l).setVisible(!0),h&&this.box2.setTexture(h).setVisible(!0),r&&this.box3.setTexture(r).setVisible(!0)},100),this.rotateBounce(this.box1,this.bounceBox),this.rotateBounce(this.box2,this.bounceBox),this.rotateBounce(this.box3,this.bounceBox)},1800),this.imageDead=[],this.skull=[],this.imageAttack=[],this.imageShake=[],this.imageAttack_ani=[];let o=0,l=!0;this.socket.emit("GenerateColors",this.room),this.socket.on("ReceiveColor",i=>{var s,a,h;if(this.socket.on("UpdatePlayer1Final",e=>{let t=this.socket.id,i=this.playersLogs.findIndex(e=>e.id===t);-1!==i&&(this.playersLogs[i]=e,console.log(this.playersLogs[i]))}),this.socket.on("UpdateAll",e=>{let t=this.socket.id,i=e.findIndex(e=>e.id===t);if(-1!==i){let t=e.splice(i,1)[0];t&&e.unshift(t)}this.playersLogs=e}),this.boxResult=i,!l)return;null===(s=this.box1)||void 0===s||s.setTexture(i[0].img),null===(a=this.box2)||void 0===a||a.setTexture(i[1].img),null===(h=this.box3)||void 0===h||h.setTexture(i[2].img);let r=o+=1;this.socket.emit("round",r),this.socket.on("round_result",e=>{this.container_countdown_respin.setText("Round "+e)});for(let i=0;i<this.playersLogs.length;i++){let s=this.boxResult.filter(e=>e.color===this.playersLogs[i].color).length;if(s>0?(this.playersLogs[i].lifePoints+=s,this.imageAttack_ani[i].setVisible(!0),setTimeout(()=>{this.imageAttack_ani[i].setVisible(!1)},1e3),this.rotateAttack(i)):setTimeout(()=>{this.playersLogs[i].lifePoints-=1,this.shakeDmg(i)},700),this.playersLogs[i].lifePoints<=1)this.playersLogs[i].lifePoints=NaN,this.playersLogs[i].luck=0,this.playersLogs[i].name="Dead",this.imageDead[i].setVisible(!1),this.skull[i].setTexture("skull").setVisible(!0),this.imageAttack_ani[i].destroy();else if(this.playersLogs[i].lifePoints>=15){let s=[this.playersLogs[i].id,this.playersLogs[i].name,this.room,e];this.socket.emit("WinnersIs",s),setTimeout(()=>{l=!1,setTimeout(()=>{this.add.rectangle(this.cameraX,this.cameraY,560,310,0),this.add.rectangle(this.cameraX,this.cameraY,550,300,0xffffff),this.add.text(this.cameraX,this.cameraY-100,["TOTAL PRIZE = "+e+" Wok"],{fontSize:"28px",color:t,fontStyle:"bold"}).setOrigin(.5),this.add.text(this.cameraX,this.cameraY+100,["The Winner is "+this.playersLogs[i].name],{fontSize:"28px",color:t,fontStyle:"bold"}).setOrigin(.5),this.add.image(this.cameraX,this.cameraY,this.playersLogs[i].img).setDisplaySize(120,120)},1e3)},2e3)}}null!==this.spinning&&clearInterval(this.spinning),setTimeout(()=>{this.spinning=setInterval(()=>{var e,t,i;let s=Phaser.Math.Between(0,this.defaultColor.length-1),a=Phaser.Math.Between(0,this.defaultColor.length-1),o=Phaser.Math.Between(0,this.defaultColor.length-1),l=null===(e=this.defaultColor[s])||void 0===e?void 0:e.img,h=null===(t=this.defaultColor[a])||void 0===t?void 0:t.img,r=null===(i=this.defaultColor[o])||void 0===i?void 0:i.img;l&&this.box1.setTexture(l).setVisible(!0),h&&this.box2.setTexture(h).setVisible(!0),r&&this.box3.setTexture(r).setVisible(!0)},100),this.rotateBounce(this.box1,this.bounceBox),this.rotateBounce(this.box2,this.bounceBox),this.rotateBounce(this.box3,this.bounceBox)},2e3)}),this.socket.on("colorHistory",e=>{var t,i,s;null===(t=this.box1h)||void 0===t||t.setTexture(e[0].img),null===(i=this.box2h)||void 0===i||i.setTexture(e[1].img),null===(s=this.box3h)||void 0===s||s.setTexture(e[2].img)}),this.player_info_p=[{x:this.cameraX-590,y:this.cameraY-70},{x:this.cameraX-570,y:this.cameraY+70},{x:this.cameraX-300,y:this.cameraY+220},{x:this.cameraX+190,y:this.cameraY+220},{x:this.cameraX+460,y:this.cameraY+70},{x:this.cameraX+460,y:this.cameraY-140}],this.player_ar=[{x:this.cameraX-360,y:this.cameraY-100},{x:this.cameraX-360,y:this.cameraY+100},{x:this.cameraX-90,y:this.cameraY+260},{x:this.cameraX+90,y:this.cameraY+260},{x:this.cameraX+360,y:this.cameraY+100},{x:this.cameraX+360,y:this.cameraY-100}],this.text_value=[];for(let e=1;e<this.playersLogs.length;e++){let i=this.add.text(this.player_info_p[e].x,this.player_info_p[e].y,this.playersLogs[e].name+"\nLM - "+this.playersLogs[e].LM+"\nLP - "+this.playersLogs[e].lifePoints,{fontSize:"24px",color:t,fontStyle:"bold"});this.text_value.push(i)}for(let e=0;e<this.playersLogs.length;e++){this.add.rectangle(this.player_ar[e].x,this.player_ar[e].y,150,150,this.playersLogs[e].color);let t=this.add.image(this.player_ar[e].x,this.player_ar[e].y,this.playersLogs[e].img).setDisplaySize(140,140).setVisible(!1),i=this.add.image(this.player_ar[e].x,this.player_ar[e].y,this.playersLogs[e].img).setDisplaySize(140,140),s=this.add.image(this.player_ar[e].x,this.player_ar[e].y,"sword").setDisplaySize(140,140).setVisible(!1);this.imageShake.push({image:i,originalX:i.x,originalY:i.y}),this.imageAttack.push({image:s,originalX:s.x,originalY:s.y}),this.imageAttack_ani.push(s),this.imageDead.push(i),this.skull.push(t)}this.mainplayerinfo_text=this.add.text(this.cameraX-430,this.cameraY-420,[this.playersLogs[0].name+"\n - LUCK Multiplayer - "+this.playersLogs[0].lifePoints+" LIFE POINTS"],{fontSize:"34px",color:t,fontStyle:"bold"}),this.add.rectangle(this.cameraX-540,this.cameraY-340,190,190,this.playersLogs[0].color),this.add.image(this.cameraX-540,this.cameraY-340,this.playersLogs[0].img).setDisplaySize(180,180);let h=this.add.rectangle(this.cameraX,this.cameraY+340,520,370,0).setVisible(!1),r=this.add.rectangle(this.cameraX,this.cameraY+340,510,360,0xffffff).setVisible(!1),n=this.add.image(this.cameraX-100,this.cameraY+300,"dpotion").setDisplaySize(140,140).setInteractive().setVisible(!1);n.on("pointerdown",()=>{this.buttonClick1()});let g=this.add.text(this.cameraX-140,this.cameraY+370,"Dpotion",{fontSize:"24px",color:"#000",fontStyle:"bold"}).setVisible(!1);this.dpotion=this.add.text(this.cameraX-70,this.cameraY+230,""+this.playersLogs[0].dpotion+"x",{fontSize:"42px",color:"#000",fontStyle:"bold"}).setVisible(!1);let m=this.add.image(this.cameraX+100,this.cameraY+300,"leppot").setDisplaySize(140,140).setInteractive().setVisible(!1);m.on("pointerdown",()=>{m.disableInteractive(),isNaN(this.playersLogs[0].lifePoints)||this.playersLogs[0].lifePoints>=15||this.playersLogs[1].lifePoints>=15||this.playersLogs[2].lifePoints>=15||this.playersLogs[3].lifePoints>=15||this.playersLogs[4].lifePoints>=15||this.playersLogs[5].lifePoints>=15?m.disableInteractive():this.buttonClick2()}),this.leppot=this.add.text(this.cameraX+150,this.cameraY+230,""+this.playersLogs[0].leppot+"x",{fontSize:"42px",color:"#000",fontStyle:"bold"}).setVisible(!1);let c=this.add.text(this.cameraX+60,this.cameraY+370,"Leppot",{fontSize:"24px",color:"#000",fontStyle:"bold"}).setVisible(!1),d=this.add.image(this.cameraX+540,this.cameraY+370,"bag2").setDisplaySize(110,120).setInteractive(),p=!1;d.on("pointerdown",()=>{p?(d.setTexture("bag2"),r.setVisible(!1),h.setVisible(!1),n.setVisible(!1),m.setVisible(!1),g.setVisible(!1),c.setVisible(!1),this.leppot.setVisible(!1),this.dpotion.setVisible(!1)):(d.setTexture("bag1"),r.setVisible(!0),h.setVisible(!0),n.setVisible(!0),m.setVisible(!0),g.setVisible(!0),c.setVisible(!0),this.leppot.setVisible(!0),this.dpotion.setVisible(!0)),p=!p})},t=this.add.text(this.cameraX,this.cameraY,"Connecting...",{font:"34px",color:"#000",fontStyle:"bold"}).setOrigin(.5,.5);this.socket.on("SetCount",e=>{t.setText("Waiting For Others Players "+e+"/6")});let i=this.add.text(this.cameraX,this.cameraY-440,"-----",{font:"34px",color:"#000",fontStyle:"bold"}).setOrigin(.5,.5);this.socket.on("roomAssign",e=>{i.setText(e),this.room=e}),this.socket.on("InputPlayer",i=>{t.destroy();let s=this.socket.id,a=i.findIndex(e=>e.id===s);if(-1!==a){let e=i.splice(a,1)[0];e&&i.unshift(e)}this.playersLogs=i,setTimeout(e,2e3),setTimeout(()=>{this.updateFunction=!0},5e3)}),this.updateFunction=!1}buttonClick1(){if(this.playersLogs[0].lifePoints<=5){let e=.7>Math.random()?-2:7;this.playersLogs[0].lifePoints=Math.max(1,this.playersLogs[0].lifePoints+e),this.playersLogs[0].dpotion>=1?this.playersLogs[0].dpotion-=1:alert("Buy Another One")}}buttonClick2(){if(this.playersLogs[0].LM>=0){let e=Math.floor(10*Phaser.Math.FloatBetween(.2,.8))/10;this.playersLogs[0].leppot>=1?(this.playersLogs[0].LM+=e,this.playersLogs[0].leppot-=1,this.playersLogs[0].luck+=e):alert("Buy Another One?")}}rotateBounce(e,t){e&&t&&this.tweens.add({targets:e,y:e.y-30,angle:360,ease:"Sine.easeInOut",duration:150,yoyo:!0,repeat:9})}rotateAttack(e){let t=this.imageAttack[e];t&&t.image&&this.tweens.add({targets:t.image,angle:360,duration:500,ease:"easeInOut"})}shakeDmg(e){let t=this.imageShake[e];t&&t.image&&this.tweens.add({targets:t.image,x:t.originalX+Phaser.Math.Between(-5,5),y:t.originalY+Phaser.Math.Between(-5,5),angle:Phaser.Math.Between(-5,5),alpha:.3,duration:50,yoyo:!0,repeat:3,onComplete:()=>{t.image.x=t.originalX,t.image.y=t.originalY,t.image.setAngle(0)}})}update(){if(this.updateFunction){this.mainplayerinfo_text.setText([this.playersLogs[0].name+"\nLUCK Multiplayer - "+this.playersLogs[0].LM+"\nLIFE POINTS - "+this.playersLogs[0].lifePoints]),this.dpotion.setText(this.playersLogs[0].dpotion+"x"),this.leppot.setText(this.playersLogs[0].leppot+"x");for(let e=1;e<this.playersLogs.length;e++)this.text_value[e-1]&&this.text_value[e-1].setText(this.playersLogs[e].name+"\nLM - "+this.playersLogs[e].LM+"\nLP - "+this.playersLogs[e].lifePoints)}}constructor(){super("Room"),this.cameraX=0,this.cameraY=0,this.defaultColor=[],this.playersLogs=[],this.imageDead=[],this.skull=[],this.imageAttack=[],this.imageShake=[],this.imageAttack_ani=[],this.container_countdown_respin=null,this.bounceBox=!0,this.updateFunction=!1,this.dpotion=null,this.leppot=null,this.text_value=[],this.player_info_p=[],this.player_ar=[],this.box1=null,this.box2=null,this.box3=null,this.box1h=null,this.box2h=null,this.box3h=null,this.boxStart=null,this.mainplayerinfo_text=null,this.boxResult=null,this.room=[]}}let r=()=>((0,a.useEffect)(()=>{if(!window.game){console.log("Initializing Phaser game...");let e={type:o.AUTO,parent:"game-container",width:1296,height:926,scene:[h],backgroundColor:"#87CEEB",scale:{mode:o.Scale.FIT,autoCenter:o.Scale.CENTER_BOTH}};window.game=new o.Game(e)}return()=>{window.game&&(console.log("Destroying Phaser game..."),window.game.destroy(!0),window.game=null)}},[]),(0,s.jsx)("div",{id:"game-container",className:"game-container"}))}}]);