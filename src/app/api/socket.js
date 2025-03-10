import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, { path: "/api/socket" });

        io.on("connection", (socket) => {
            console.log("A user connected:", socket.id);

            socket.on("message", (msg) => {
                console.log("Received message:", msg);
                alert("Message: " + msg)
                io.emit("message", msg); // Send the message to all clients
            });

            socket.on("disconnect", () => {
                console.log("A user disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}