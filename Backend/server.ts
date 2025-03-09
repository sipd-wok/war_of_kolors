import express, { Request, Response } from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { instrument } from "@socket.io/admin-ui";

interface GuestRoom {
  roomID: string;
  sockets: string[];
}

interface PlayerRoom {
  roomID: string;
  sockets: string[];
  betAmount: number;
}

const guestWaitingRooms: GuestRoom[] = [];
const PlayersWaitingRooms: PlayerRoom[] = [];

// Create express app
const app = express();
app.use(express.json());
app.use(cors()); // kilanglan mo ni ang cors

// Create HTTP server with Express
const server = http.createServer(app);

// Create Socket.IO server using the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // frontend url ex localhost: 3000
    methods: ["GET", "POST"],
  },
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  console.log("A user connected! " + socket.id);

  function cleanAndListRooms() {
    const roomList = [];

    // Create a copy of the array to safely remove items during iteration
    const roomsToCheck = [...guestWaitingRooms, ...PlayersWaitingRooms];

    for (let i = roomsToCheck.length - 1; i >= 0; i--) {
      const room = roomsToCheck[i];
      const connectedSockets = io.sockets.adapter.rooms.get(room.roomID);
      const socketCount = connectedSockets ? connectedSockets.size : 0;

      if (socketCount === 0) {
        // Find the index in the original array and remove it
        const indexInOriginal = guestWaitingRooms.findIndex(
          (r) => r.roomID === room.roomID,
        );
        if (indexInOriginal !== -1) {
          guestWaitingRooms.splice(indexInOriginal, 1);
          console.log(`Room ${room.roomID} removed - no active connections`);
        }
      } else {
        roomList.push({
          roomID: room.roomID,
          connectedPlayers: socketCount,
        });
      }
    }

    return roomList;
  }

  // Socket event to get rooms with counts and clean empty rooms
  socket.on("getRoomsWithCounts", (callback) => {
    const roomsWithCounts = cleanAndListRooms();
    console.log("Active rooms:", roomsWithCounts.length);
    callback(roomsWithCounts);
  });

  // Call this function periodically or when needed
  socket.on("cleanEmptyRooms", (callback) => {
    const activeRooms = cleanAndListRooms();
    console.log(`Cleaned rooms. ${activeRooms.length} active rooms remaining.`);
    if (callback) callback(activeRooms.length);
  });

  // Create a new room for guests
  // himo random room id
  // add ang new room sa guest rooms
  socket.on("createGuestRoom", (callback) => {
    console.log("All Guest Rooms: ", guestWaitingRooms.length);

    console.log("Available Guest Rooms: ", cleanAndListRooms());

    const roomId = uuidv4(); // Generate a unique room ID
    const newRoom: GuestRoom = {
      roomID: roomId,
      sockets: [], // empty lang any mag create room
    };
    guestWaitingRooms.push(newRoom);

    console.log("Available Guest Rooms: ", guestWaitingRooms.length);

    callback(roomId); // Send the room ID back to the client
    // ngitaun ang gn himo nga room
    const createdRoom = guestWaitingRooms.find(
      (room) => room.roomID === roomId,
    );
    if (createdRoom) {
      console.log(`Room created: ${createdRoom.roomID}`);
    } else {
      console.log("Room creation failed: Room not found");
    }
  });

  socket.on("getAvailableRoom", (callback) => {
    const roomsWithCounts = cleanAndListRooms();
    const roomID =
      roomsWithCounts[Math.floor(Math.random() * roomsWithCounts.length)]
        ?.roomID;
    callback(roomID);
  });

  socket.on("joinRoom", (roomID, socketID) => {
    const room = guestWaitingRooms.find((room) => room.roomID === roomID);
    if (room) {
      room.sockets.push(socketID);
      console.log(`Room joined: ${roomID} by ${socketID}`);

      socket.join(roomID);

      // ibalik ang connected players
      const numOfPlayers = io.sockets.adapter.rooms.get(roomID)?.size || 0;
      io.to(roomID).emit("aPlayerJoined", roomID, socketID, numOfPlayers);
    } else {
      console.log("Room not found: ", roomID);
    }
  });

  // Track ready players for each room
  const roomReadyPlayers: { [roomID: string]: string[] } = {};

  socket.on("playerReady", (roomID, socketID) => {
    // Initialize the room's ready players array if it doesn't exist
    if (!roomReadyPlayers[roomID]) {
      roomReadyPlayers[roomID] = [];
    }

    // Add this player to the ready players list if not already there
    if (!roomReadyPlayers[roomID].includes(socketID)) {
      roomReadyPlayers[roomID].push(socketID);
    }

    // Get all players in the room
    const allPlayers = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    // Send the complete list of ready players and their position in the room
    io.to(roomID).emit("updatePlayersReady", {
      roomID,
      readyPlayerID: socketID,
      allReadyPlayers: roomReadyPlayers[roomID],
      totalPlayers: allPlayers.length,
    });
  });

  // Add these handlers in your server.ts file inside the io.on("connection") handler:

  socket.on("checkIfPlayerWasReady", (roomID, playerID, callback) => {
    const wasReady = roomReadyPlayers[roomID]?.includes(playerID) || false;
    callback(wasReady);
  });

  socket.on("getReadyPlayers", (roomID, callback) => {
    callback(roomReadyPlayers[roomID] || []);
  });

  socket.on("getUpdatedPlayers", (roomID, callback) => {
    const room =
      guestWaitingRooms.find((r) => r.roomID === roomID) ||
      PlayersWaitingRooms.find((r) => r.roomID === roomID);
    callback(room?.sockets || []);
  });

  // You can also add auto-cleanup when a player disconnects
  socket.on("disconnect", () => {
    // Find all guest rooms this socket is part of
    for (let i = 0; i < guestWaitingRooms.length; i++) {
      const room = guestWaitingRooms[i];
      const socketIndex = room.sockets.indexOf(socket.id);

      if (socketIndex !== -1) {
        // Remove socket from room's sockets array
        room.sockets.splice(socketIndex, 1);

        // Notify remaining players that someone left
        const numOfPlayers =
          io.sockets.adapter.rooms.get(room.roomID)?.size || 0;
        io.to(room.roomID).emit(
          "playerLeft",
          room.roomID,
          socket.id,
          numOfPlayers,
        );

        console.log(
          `Socket ${socket.id} removed from guest room ${room.roomID}, ${numOfPlayers} players remaining`,
        );
      }
    }

    // Do the same for player rooms
    for (let i = 0; i < PlayersWaitingRooms.length; i++) {
      const room = PlayersWaitingRooms[i];
      const socketIndex = room.sockets.indexOf(socket.id);

      if (socketIndex !== -1) {
        // Remove socket from room's sockets array
        room.sockets.splice(socketIndex, 1);

        // Notify remaining players that someone left
        const numOfPlayers =
          io.sockets.adapter.rooms.get(room.roomID)?.size || 0;
        io.to(room.roomID).emit(
          "playerLeft",
          room.roomID,
          socket.id,
          numOfPlayers,
        );

        console.log(
          `Socket ${socket.id} removed from player room ${room.roomID}, ${numOfPlayers} players remaining`,
        );
      }
    }

    // Remove this player from any ready player lists
    for (const roomID in roomReadyPlayers) {
      const index = roomReadyPlayers[roomID].indexOf(socket.id);
      if (index !== -1) {
        roomReadyPlayers[roomID].splice(index, 1);

        // Notify room about updated ready players
        const allPlayers = Array.from(
          io.sockets.adapter.rooms.get(roomID) || [],
        );
        io.to(roomID).emit("updatePlayersReady", {
          roomID,
          readyPlayerID: null,
          allReadyPlayers: roomReadyPlayers[roomID],
          totalPlayers: allPlayers.length,
        });
      }
    }

    // Clean up empty rooms
    cleanAndListRooms();
  });
});

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// Set the network port
const port = process.env.PORT || 3000;

// Start the Express server
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
