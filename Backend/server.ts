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
  players: {
    socketID: string;
    user: { id: string; user_id: string; username: string };
    potions: {
      id: string;
      devil: number;
      leprechaun: number;
      hp: number;
    };
    character: {
      id: number;
      name: string;
      sprite: string;
      created_at: string;
      tier: string;
      color: string;
      luck?: number;
    };
  }[];
  entryBet: number;
  totalBet: number;
  colorRepresentatives: {
    red: string;
    blue: string;
    yellow: string;
    green: string;
    pink: string;
    white: string;
  };
  votesToStart: number;
}

interface BattleRoom {
  roomID: string;
  players: {
    socketID: string;
    user: { id: string; user_id: string; username: string };
    potions: {
      id: string;
      devil: number;
      leprechaun: number;
    };
    character: {
      id: number;
      name: string;
      sprite: string;
      created_at: string;
      tier: string;
      color: string;
      luck?: number;
    };
    stats: {
      lifepoints: number;
    };
  }[];
  entryBet: number;
  totalBet: number;
  colorRepresentatives: {
    red: string;
    blue: string;
    yellow: string;
    green: string;
    pink: string;
    white: string;
  };
}

const guestWaitingRooms: GuestRoom[] = [];
const playersWaitingRooms: PlayerRoom[] = [];
const battleRooms: BattleRoom[] = [];

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
    const roomsToCheck = [...playersWaitingRooms, ...battleRooms];

    for (let i = roomsToCheck.length - 1; i >= 0; i--) {
      const room = roomsToCheck[i];
      const connectedSockets = io.sockets.adapter.rooms.get(room.roomID);
      const socketCount = connectedSockets ? connectedSockets.size : 0;

      if (socketCount === 0) {
        // Find the index in the original array and remove it
        const indexInOriginal1 = playersWaitingRooms.findIndex(
          (r) => r.roomID === room.roomID,
        );
        if (indexInOriginal1 !== -1) {
          playersWaitingRooms.splice(indexInOriginal1, 1);
          console.log(`Room ${room.roomID} removed - no active connections`);
        }

        const indexInOriginal2 = battleRooms.findIndex(
          (r) => r.roomID === room.roomID,
        );
        if (indexInOriginal2 !== -1) {
          battleRooms.splice(indexInOriginal2, 1);
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
  socket.on("createPlayerRoom", (callback) => {
    console.log("All Player Rooms: ", playersWaitingRooms.length);

    console.log("Available Guest Rooms: ", cleanAndListRooms());

    const roomId = uuidv4(); // Generate a unique room ID
    const newRoom: PlayerRoom = {
      roomID: roomId,
      players: [],
      colorRepresentatives: {
        red: "",
        blue: "",
        yellow: "",
        green: "",
        pink: "",
        white: "",
      },
      entryBet: 10,
      totalBet: 0,
      votesToStart: 0,
    };
    playersWaitingRooms.push(newRoom);

    console.log("Available Rooms: ", playersWaitingRooms.length);

    callback(roomId); // Send the room ID back to the client
    // ngitaun ang gn himo nga room
    const createdRoom = playersWaitingRooms.find(
      (room) => room.roomID === roomId,
    );
    if (createdRoom) {
      console.log(`Room created: ${createdRoom.roomID}`);
    } else {
      console.log("Room creation failed: Room not found");
    }
  });

  socket.on("getAvailableRoom", (playerColor: string, callback) => {
    cleanAndListRooms();
    let roomID;
    let colorRepresentativesIndex: keyof PlayerRoom["colorRepresentatives"];

    if (playerColor === "rainbow") {
      const colors = ["red", "blue", "yellow", "green", "pink", "white"];
      colorRepresentativesIndex = colors[
        Math.floor(Math.random() * colors.length)
      ] as keyof PlayerRoom["colorRepresentatives"];
    } else {
      colorRepresentativesIndex =
        playerColor as keyof PlayerRoom["colorRepresentatives"];
    }

    // Find a room where the color representative is empty
    for (let i = 0; i < playersWaitingRooms.length; i++) {
      const randomIndex = Math.floor(
        Math.random() * playersWaitingRooms.length,
      );
      const potentialRoom = playersWaitingRooms[randomIndex];

      if (
        potentialRoom.colorRepresentatives[colorRepresentativesIndex] === "" &&
        potentialRoom.players.length < 6
      ) {
        cleanAndListRooms();
        roomID = potentialRoom.roomID;
        break;
      }
    }

    callback(roomID, colorRepresentativesIndex);
  });

  socket.on("joinWaitingRoom", (roomID, socketID, user, character, potions) => {
    const room = playersWaitingRooms.find((room) => room.roomID === roomID);
    if (room) {
      // Validate player data to ensure no null or undefined values
      if (!user || !character) {
        console.log(`Invalid player data for ${socketID}:`, {
          user,
          character,
          potions,
        });
        return; // Exit early if critical data is missing
      }

      // Check if the player is already in the room to avoid duplicates
      const existingPlayerIndex = room.players.findIndex(
        (player) => player.socketID === socketID,
      );

      if (existingPlayerIndex === -1) {
        // Ensure we have valid data before adding the player
        const sanitizedUser = user || {
          id: "unknown",
          user_id: "unknown",
          username: "Unknown Player",
        };
        const sanitizedCharacter = character || {
          id: 0,
          name: "Unknown",
          sprite: "logo",
          created_at: "",
          tier: "bronze",
          color: "white",
        };
        const sanitizedPotions = potions || {
          id: "unknown",
          devil: 0,
          leprechaun: 0,
        };

        // Only add the player if they're not already in the room
        room.players.push({
          socketID,
          user: sanitizedUser,
          character: sanitizedCharacter,
          potions: sanitizedPotions,
        });

        console.log(`Room joined: ${roomID} by ${socketID}`);
      } else {
        console.log(`Player ${socketID} already in room ${roomID}`);
      }

      // Join the socket to the room
      socket.join(roomID);

      // Emit the updated players list to all clients in the room
      io.to(roomID).emit("playerJoinedWaitingRoom", room.players);
      socket.to(roomID).emit("playerVotedSkip", room?.votesToStart);
      console.log(
        `Emitting updated players list for room ${roomID}:`,
        room.players,
      );

      if (room.players.length === 6) {
        io.to(roomID).emit("proceedToGame", room);
      }
    } else {
      console.log("Room not found: ", roomID);
    }
  });

  // Track ready players for each room
  const roomReadyPlayers: { [roomID: string]: string[] } = {};

  socket.on("playerVotedSkip", (roomID, callback) => {
    const room = playersWaitingRooms.find((room) => room.roomID === roomID);
    if (room) {
      room.votesToStart++;

      // Check if callback is a function before calling it
      if (typeof callback === "function") {
        socket.to(roomID).emit("playerVotedSkip", room?.votesToStart);
        callback(room ? room.votesToStart : 0);
      }
    }

    if (room && room.votesToStart === room.players.length) {
      io.to(roomID).emit("proceedToGame");
    }
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
      playersWaitingRooms.find((r) => r.roomID === roomID);
    if (room && "players" in room) {
      callback(
        room.players.map((player: { socketID: string }) => player.socketID) ||
          [],
      );
    } else {
      callback([]);
    }
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
    for (let i = 0; i < playersWaitingRooms.length; i++) {
      const room = playersWaitingRooms[i];
      const socketIndex = room.players.findIndex(
        (player) => player.socketID === socket.id,
      );

      if (socketIndex !== -1) {
        // Remove socket from room's players array
        room.players.splice(socketIndex, 1);

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

    // Do the same for battleRooms rooms
    for (let i = 0; i < battleRooms.length; i++) {
      const room = battleRooms[i];
      const socketIndex = room.players.findIndex(
        (player) => player.socketID === socket.id,
      );

      if (socketIndex !== -1) {
        // Remove socket from room's players array
        room.players.splice(socketIndex, 1);

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
          `Socket ${socket.id} removed from battle room ${room.roomID}, ${numOfPlayers} players remaining`,
        );
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
