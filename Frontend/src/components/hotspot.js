import http from "http";
import WebSocket from "ws";

const server = http.createServer(); // Create an HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        console.log("Received:", message);
        ws.send("Hello from server!");
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.listen(8080, "192.168.55.1", () => {
    console.log("Server running on ws://192.168.55.1:8080");
});