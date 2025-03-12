import { Server } from "socket.io";
import http from "http";

// Create a basic HTTP server
const server = http.createServer();

// Start Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (for flexibility)
        methods: ["GET", "POST"]
    }
});

let rooms = {} // Add rooms for every 6 Player

let colorsHistoryVal = []


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
        
        let NewPlayers = {id: socket.id, lifePoints: 10 ,name: socket.id, color: random.color, luck: 6, bet: 2000, img: random.img, LM: 0, dpotion: 2, leppot: 4, walletBal: 999}
        
        
        //Assign to this All players at their current Value
        
            
            let roomName = Object.keys(rooms).find((room) => rooms[room].length < 3)
           
           
           //If rooms already full add another room
           if (!roomName) {
        roomName = `Room${Object.keys(rooms).length + 1}`;
        rooms[roomName] = [];
    }
            //Joint to the room that have Not full
            socket.join(roomName)
            
            rooms[roomName].push(NewPlayers)
            
            console.log(rooms)
            
            io.to(roomName).emit("SetCount", rooms[roomName].length)
            
            //start the game if it's room is full
            if (rooms[roomName].length === 2) {   
              io.to(roomName).emit("InputPlayer", (rooms[roomName]))
                
            }
            
            io.to(socket.id).emit("roomAssign", roomName)
           
        //Dont Touch ---+++++++++++++++---- System Server Maintenance Only
     
     
     
     socket.on("GenerateColors", (data) => {
    let roomData = rooms[data];

    if (!roomData || roomData.length === 0) return; // Avoid errors

    let totalLuck = roomData.reduce((sum, player) => sum + player.luck, 0);
    
    //6 Collors
        let defaultColor = [
            {color: 0xff0000, img: 'redDice'},
            {color: 0xffff00, img: 'yellowDice'},
            {color: 0x00ff00, img: 'greenDice'},
            {color: 0xffffff, img: 'whiteDice'},
            {color: 0x0000ff, img: 'blueDice'},
            {color: 0xff00ff, img: 'pinkDice'},
        ]   

    function RandomColors() {  // Defined inside socket.on
        let random = Math.random() * 100;
        let cumu = 0;

        for (let i = 0; i < roomData.length; i++) {
            cumu += (roomData[i].luck / totalLuck) * 100;
            if (random < cumu) {
                return defaultColor[i];
            }
        }

        return defaultColor[0];
    };

    let selectedColor = [RandomColors(), RandomColors(), RandomColors()]; // Corrected

    io.to(data).emit("ReceiveColor", selectedColor); // Send to clients
    
    colorsHistoryVal.push(selectedColor)
    
    for (let i = 0; i < colorsHistoryVal.length - 3; i++) {
        
        colorsHistoryVal.shift()
        
    }
    
    setTimeout(() => {
        io.to(data).emit("colorHistory", colorsHistoryVal[1])
    }, 3000)
    
    
    
    
});
    
    
    socket.on("round", (data) => {
        
        io.emit("round_result", data)
        
    })
    
    
    
    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
        
        
    });
});

// Start the server
server.listen(process.env.PORT || 3001, () => {
    console.log("✅ Server running");
});
