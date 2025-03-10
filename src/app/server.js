const { Server } = require("socket.io");
const http = require("http");

// Create a basic HTTP server
const server = http.createServer();

// Start Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow all origins (for flexibility)
        methods: ["GET", "POST"]
    }
});

// Handle player connections
io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);
    
    socket.on("randomColorsGenerated", (data) => {
        console.log("Receive Colors from Players", data)
        io.emit("updateColors", data)
    })

    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
    });
});

// Start the server
server.listen(3001, () => {
    console.log("✅ Server running on http://localhost:3001");
});
