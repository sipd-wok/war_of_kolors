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

  const players_length = 2; //Change this For Testing <+++++++++++++++++++++++++++++++++++++++++++++++++++

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

  //Current Players

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

      if (room.players.length >= players_length) {
        io.to(roomID).emit("proceedToGame", room);

        io.to(roomID).emit("roomAssign", "Connected");
      }
    } else {
      console.log("Room not found: ", roomID);
    }
  });

  //This Code Structure To make in game

  interface Player {
    id: string;
    lifePoints: number;
    name: string;
    color?: number;
    luck: number;
    bet: number;
    img?: string;
    LM: number;
    dpotion: number;
    leppot: number;
    health_potion: number;
    walletBal: number | null;
  }

  interface Room {
    [key: string]: Player[];
  }

  const DemoRooms: Room = {};

  socket.on("Create_BattleField", (data) => {
    console.log("Players LogIn ", data);

    let colors = [
      { color: 0xff0000, img: "red" },
      { color: 0xffff00, img: "yellow" },
      { color: 0x00ff00, img: "green" },
      { color: 0xffffff, img: "white" },
      { color: 0x0000ff, img: "blue" },
      { color: 0xff00ff, img: "pink" },
    ];

    let roomName = Object.keys(DemoRooms).find(
      (room) => DemoRooms[room].length < players_length,
    );

    if (!roomName) {
      roomName = `Connected Demo Room ${Object.keys(DemoRooms).length + 1}`;
      DemoRooms[roomName] = [];
    }

    // Assigning unique color to each player
    let availableColors = [...colors]; // Clone the array to avoid modifying the original

    const demoNames = [
      "Rainbow ",
      "Earth ",
      "DemiGod ",
      "Hacker ",
      "Water ",
      "Fire ",
    ];

    if (socket.id) {
      let NewName =
        demoNames[Math.floor(Math.random() * demoNames.length)] +
        "_" +
        socket.id.substring(0, 2);

      console.log("Demo Assign ", NewName);

      let newPlayer: Player = {
        id: socket.id,
        lifePoints: 10,
        name: NewName, // Temporary Names
        luck: 6,
        bet: 2000,
        LM: 0,
        dpotion: 2,
        leppot: 4,
        health_potion: 3,
        walletBal: 999,
      };

      // Assign a unique color if available
      if (availableColors.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableColors.length);
        let chosenColor = availableColors.splice(randomIndex, 1)[0]; // Remove chosen color
        newPlayer.color = chosenColor.color;
        newPlayer.img = chosenColor.img;
      } else {
        console.log("No more unique colors available!");
        newPlayer.color = 0x000000; // Default to black if no colors are left
        newPlayer.img = "default";
      }

      socket.join(roomName);
      DemoRooms[roomName].push(newPlayer);
    }

    io.to(roomName).emit("SetCount", DemoRooms[roomName].length);

    // Start the game when the room is full
    if (DemoRooms[roomName].length === players_length) {
      io.to(roomName).emit("InputPlayer", DemoRooms[roomName]);
    }

    io.to(roomName).emit("roomAssign", roomName);

    console.log("Created Demo Rooms ", Object.keys(DemoRooms).length);
  });

  socket.on("round", (data) => {
    io.emit("round_result", data);
  });

  const roomIntervals: Record<string, NodeJS.Timeout> = {};

  socket.on("GenerateColors", (data) => {
    console.log("Generating Colors In ", data);

    let roomData = DemoRooms[data];

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

    //🛑 Stop any existing interval for this room
    if (roomIntervals[data]) {
      clearInterval(roomIntervals[data]);
      delete roomIntervals[data];
    }

    if (!roomData) return;

    if (roomData.length === players_length) {
      if (!roomIntervals[data]) {
        roomIntervals[data] = setInterval(() => {
          let selectedColor = [RandomColors(), RandomColors(), RandomColors()];

          io.to(data).emit("ReceiveColor", selectedColor);

          const totalBet = roomData.reduce(
            (sum, player) => sum + player.bet,
            0,
          );

          for (let i = 0; i < roomData.length; i++) {
            const matchingColors =
              selectedColor?.filter((box) => box.color === roomData[i].color)
                .length ?? 0;

            if (matchingColors > 0) {
              roomData[i].lifePoints += matchingColors; // Increase life points based on matches

              // this.imageAttack_ani[i].setVisible(true);
              // setTimeout(() => {
              //     this.imageAttack_ani[i].setVisible(false);
              // }, 1000);

              io.to(data).emit("Update_Life_P", roomData);

              // this.rotateAttack(i);
            } else {
              // setTimeout(() => {
              roomData[i].lifePoints -= 1; // Reduce life points if no match

              io.to(data).emit("Update_Life_R", roomData);
              // this.shakeDmg(i);
              // }, 700);
            }

            //Winners and Lossers
            if (roomData[i].lifePoints <= 1) {
              roomData[i].lifePoints = NaN;
              roomData[i].luck = 0;
              roomData[i].name = "Dead";
            } else if (roomData[i].lifePoints >= 15) {
              console.log("Congrats To Player: ", roomData[i].name);
              clearInterval(roomIntervals[data]);
              delete roomIntervals[data];
              console.log("Claim Your Prize ", roomData[i]);
            }
          }

          setTimeout(() => {
            io.to(data).emit("colorHistory", selectedColor);
          }, 3000);
        }, 5000); // Runs every 5 seconds
      }
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

  socket.on("getCurrentRoomState", (roomID) => {
    console.log(
      `Socket ${socket.id} requested current state of room ${roomID}`,
    );
    const room = playersWaitingRooms.find((room) => room.roomID === roomID);

    if (room) {
      // Emit the current room state back to the requesting client only
      socket.emit("currentRoomState", room.players);
      console.log(
        `Sent current state of room ${roomID} to socket ${socket.id}`,
      );
    } else {
      console.log(`Room ${roomID} not found when requesting current state`);
      socket.emit("currentRoomState", []);
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
