
//import http from "http";
//import { Server } from "socket.io";

const { Server }  = require("socket.io")
const http = require("http") 

// Create a basic HTTP server
const server = http.createServer();

// Start Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (for flexibility)
        methods: ["GET", "POST"]
    }
});

let rooms = {} // If you Want the Data Of All Players each Room Just call this to access their Information And Input to Database
//In This Structure This Rooms Is very Important, All players personal information get here every time will updates its value  By Cordy ;)

// Handle player connections
io.on("connection", (socket) => {

        console.log("Players LogIn ", socket.id)
        
        //In their Socket Id You Can Retrieve the Data from database using this
        
        let color = [
            {color: 0xff0000, img: 'red'},
            {color: 0xffff00, img: 'yellow'},
            {color: 0x00ff00, img: 'green'},
            {color: 0xffffff, img: 'white'},
            {color: 0x0000ff, img: 'blue'},
            {color: 0xff00ff, img: 'pink'},
        ]
        
        let random = color[Math.floor(Math.random() * color.length)];
console.log(random);
        
        let NewPlayers = {id: socket.id, lifePoints: 10 ,name: socket.id, color: random.color, luck: 6, bet: 2000, img: random.img, LM: 0, dpotion: 2, leppot: 4, health_potion: 3, walletBal: 999}
        
        //Assign to this All players at their current Value
        
           let roomName = Object.keys(rooms).find((room) => rooms[room].length < 6)
           
           //If rooms already full add another room
           if (!roomName) {
        roomName = `Room${Object.keys(rooms).length + 1}`;
        rooms[roomName] = [];
    }
            //Joint to the room that have Not full
            socket.join(roomName)
            
            rooms[roomName].push(NewPlayers)
            
            io.to(roomName).emit("SetCount", rooms[roomName].length)
            
            //start the game if it's room is full
            if (rooms[roomName].length === 6) {   
              io.to(roomName).emit("InputPlayer", (rooms[roomName]))
                
            }
            
            io.to(socket.id).emit("roomAssign", roomName)
           
        //Dont Touch ---+++++++++++++++---- System Server Maintenance Only
     
        //const roomIntervals: Record<string, NodeJS.Timeout> = {};
        
        socket.on("GenerateColors", (data) => {

            let roomData = rooms[data];
        
            if (!roomData || roomData.length === 0) return; // Avoid errors
        
            let totalLuck = roomData.reduce((sum, player) => sum + player.luck, 0);
        
            let defaultColor = [
                { color: 0xff0000, img: "redDice" },
                { color: 0xffff00, img: "yellowDice" },
                { color: 0x00ff00, img: "greenDice" },
                { color: 0xffffff, img: "whiteDice" },
                { color: 0x0000ff, img: "blueDice" },
                { color: 0xff00ff, img: "pinkDice" },
            ];
        
            function RandomColors() {
                let random = Math.random() * 100;
                let cumu = 0;
        
                for (let i = 0; i < roomData.length; i++) {
                    cumu += (roomData[i].luck / totalLuck) * 100;
                    if (random < cumu) {
                        return defaultColor[i];
                    }
                }
                return defaultColor[0];
            }
        
            // 🛑 Stop any existing interval for this room
            // if (roomIntervals[data]) {
            //     clearInterval(roomIntervals[data]);
            // }

            socket.on("WinnersIs", ([id, Pname, roomId, prizeWok]) => {

                const CurrentRoom = rooms[roomId]

                console.log("ID: ", id)
                console.log("Player Name: ", Pname)
                console.log("Room: ", CurrentRoom)
                console.log("PrizeWOK", prizeWok)
                
            })

        
            // 🚀 Start new interval
            //roomIntervals[data] = 
            setInterval(() => {
                let selectedColor = [RandomColors(), RandomColors(), RandomColors()];
        
                io.to(data).emit("ReceiveColor", selectedColor);
        
                setTimeout(() => {
                    io.to(data).emit("colorHistory", selectedColor);
                }, 3000);
            }, 5000); // Runs every 5 seconds
        });
    
    
        socket.on("UpdatePlayer1", (
            [
            id, 
            LM, 
            lifePoints,
            walletBal,
            leppot,
            dpotion,
            health_potion, 
            roomData
            ]) => {
            
            const Room_01 = rooms[roomData]

            // interface Player {  
            //     id: string | number
            // }
            
            //const index = data.findIndex((player: Player) => player.id === players)

            if(!Room_01 || Room_01.length === 0) return

            const index = Room_01.findIndex(player => player.id === id)
            
            if (index === -1) return

            Object.assign(Room_01[index], { 
                lifePoints, 
                leppot, 
                LM, 
                walletBal, 
                dpotion, 
                health_potion 
            });

            io.emit("UpdatePlayer1Final", Room_01[index])

        })

    socket.on("round", (data) => {
        
        io.emit("round_result", data)
        
    })
    
    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
        
        
    });
});

// Start the server
server.listen(3001, () => {
    console.log("✅ Server running");
});
