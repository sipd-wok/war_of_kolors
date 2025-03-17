import express, { Request, Response } from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { v4 as uuidv4 } from "uuid";
import { instrument } from "@socket.io/admin-ui";
import { Socket } from "dgram";
import { stringToBytes } from "uuid/dist/cjs/v35";
import { callbackify } from "util";
import { console } from "inspector";

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
  
  const players_length = 1 //Change this For Testing <+++++++++++++++++++++++++++++++++++++++++++++++++++ 

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

      if (room.players.length === players_length) {

        io.to(roomID).emit("proceedToGame", room);
        
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
    color: number;
    luck: number;
    bet: number;
    img: string;
    LM: number;
    dpotion: number;
    leppot: number;
    health_potion: number;
    walletBal: number;
}

interface Room {
    [key: string]: Player[];
}

const DemoRooms: Room = {}
const usedColors = new Map<string, number>();

socket.on("Create_BattleField", (roomAddress, players) => {

    const colors: { [key: string]: number } = {
        red: 0xff0000,
        yellow: 0xffff00,
        green: 0x00ff00,
        white: 0xffffff,
        blue: 0x0000ff,
        pink: 0xff00ff,
    };

    // Ensure the room exists
    if (!DemoRooms[roomAddress]) {
        DemoRooms[roomAddress] = [];
    }
    
        const player = players;
        
        // Assign a color, defaulting to an available one if not specified
        const playerColor = colors[player.character.color] || getNextAvailableColor()

        const newPlayer: Player = {
            id: socket.id,
            lifePoints: 10,
            name: player.user.username,
            color: playerColor,
            luck: player.character.luck,
            bet: 10,
            img: player.character.sprite,
            LM: player.character.luck,
            dpotion: player.potions.devil,
            leppot: player.potions.leprechaun,
            health_potion: player.potions.hp,
            walletBal: 0,
        };

        DemoRooms[roomAddress].push(newPlayer);
    

    socket.join(roomAddress);
    io.to(roomAddress).emit("SetCount", DemoRooms[roomAddress].length);
    io.to(roomAddress).emit("roomAssign", roomAddress);

    // Start the game when the room is full
    if (DemoRooms[roomAddress].length === players_length) {
        io.to(roomAddress).emit("InputPlayer", DemoRooms[roomAddress]);
    }

    console.log("Created Demo Rooms: ", Object.keys(DemoRooms).length);

    // Function to get the next available color
function getNextAvailableColor(): number {
  let availableColors = Object.values(colors).filter(color => !usedColors.has(color.toString()));

  if (availableColors.length === 0) {
      usedColors.clear(); // Reset if all colors are used
      availableColors = Object.values(colors);
  }

  const assignedColor = availableColors[0]; // Pick the first available color
  usedColors.set(assignedColor.toString(), assignedColor);

  return assignedColor;
}

});


socket.once("DevilPotion", (roomID, data) => {

  const RoomTrack = DemoRooms[roomID];

  if (!RoomTrack) return; // Room does not exist

  // Find the player in the room
  const player = RoomTrack.find(player => player.id === data.id);

  if (!player) return; // Player not found

  if (player.luck >= 1) {

      const randomNumber = getWeightedRandomNumber();

      // Apply the random value to lifePoints (not luck)
      const Devilresult = Math.max(1, player.luck + randomNumber);

      player.luck = Devilresult

      player.LM = Devilresult

      if (player.dpotion >= 1) {
          player.dpotion -= 1; // Reduce potion count
      } else {
          // Deduct from wallet or notify
          player.walletBal -= 10; // Example: Deduct 10 from wallet
          if (player.walletBal < 0) player.walletBal = 0; // Prevent negative balance

          // Send an alert to the player (if needed)
          io.to(roomID).emit("Notify", { message: "Buy another Devil Potion!" });
      }

      // Emit the updated player data
      io.to(roomID).emit("UpdatePlayer", player);
  }

});

// Function to generate a weighted random number between -2 and 25
function getWeightedRandomNumber(): number {
  const rand = Math.random(); // Generates a number between 0 and 1

  if (rand < 0.7) {
      // 70% chance: Common values (-2 to 5)
      return Math.floor(Math.random() * 8) - 2; // Random between -2 and 5
  } else if (rand < 0.9) {
      // 20% chance: Medium values (6 to 15)
      return Math.floor(Math.random() * 10) + 6; // Random between 6 and 15
  } else {
      // 10% chance: Rare values (16 to 25)
      return Math.floor(Math.random() * 10) + 16; // Random between 16 and 25
  }
}

socket.once("LeppotPotion", (roomID, data) => {

  const RoomTrack = DemoRooms[roomID];

  if (!RoomTrack) return; // Room does not exist

  // Find the player in the room
  const player = RoomTrack.find(player => player.id === data.id);

  if (!player) return; // Player not found

  if (player.leppot <= 0) return

  player.luck += 2
  player.LM += 2

})

socket.once("HealthPotion", (roomID, data) => {
  const RoomTrack = DemoRooms[roomID];

  if (!RoomTrack) return; // Room does not exist

  // Find the player in the room
  const player = RoomTrack.find(player => player.id === data.id);

  if (!player) return; // Player not found

  if (player.health_potion <= 0) return

  if (player.lifePoints <= 5) {

    player.lifePoints += 2

  }

})

    
  socket.on("round", (data) => {
        
    io.emit("round_result", data)
    
  })



  const roomIntervals: Record<string, NodeJS.Timeout> = {};

socket.once("GenerateColors", (data) => {
    console.log("Generating Colors In ", data);
    console.log("Waiting Room: ", playersWaitingRooms);

    const roomData = DemoRooms[data];

    if (!roomData || roomData.length === 0) return; // Avoid errors

    const totalLuck = roomData.reduce((sum, player) => sum + player.luck, 0);

    const defaultColor = [
        { color: 0xff0000, img: "redDice" },
        { color: 0xffff00, img: "yellowDice" },
        { color: 0x00ff00, img: "greenDice" },
        { color: 0xffffff, img: "whiteDice" },
        { color: 0x0000ff, img: "blueDice" },
        { color: 0xff00ff, img: "pinkDice" },
    ];

    function RandomColors() {
        const random = Math.random() * 100;
        let cumu = 0;

        for (let i = 0; i < roomData.length; i++) {
            cumu += (roomData[i].luck / totalLuck) * 100;
            if (random < cumu) {
                return defaultColor[i];
            }
        }
        return defaultColor[0];
    }

    // 🛑 Prevent duplicate intervals by always clearing first
    if (roomIntervals[data]) {
        console.log("Clearing existing interval for room:", data);
        clearInterval(roomIntervals[data]);
        delete roomIntervals[data];
    }

    if (roomData.length !== players_length) return; // Ensure enough players

    console.log("Starting new interval for room:", data);

    // ✅ Now, we safely create a single interval
    roomIntervals[data] = setInterval(() => {
        const selectedColor = [RandomColors(), RandomColors(), RandomColors()];

        io.to(data).emit("ReceiveColor", selectedColor);

        const totalBet = roomData.reduce((sum, player) => sum + player.bet, 0);

        for (let i = 0; i < roomData.length; i++) {
            const matchingColors = selectedColor?.filter(box => box.color === roomData[i].color).length ?? 0;

            if (matchingColors > 0) {
                roomData[i].lifePoints += matchingColors; // Increase life points
                io.to(data).emit("Update_Life_P", roomData);
            } else {
                roomData[i].lifePoints -= 1; // Reduce life points if no match
                io.to(data).emit("Update_Life_R", roomData);
            }

            // Winners and Losers  
            if (roomData[i].lifePoints <= 1) {
                roomData[i].lifePoints = NaN;
                roomData[i].luck = 0;
                roomData[i].name = "Dead";
            } else if (roomData[i].lifePoints >= 15) {
                console.log("Congrats To Player: ", roomData[i].name);
                clearInterval(roomIntervals[data]); // Stop interval when someone wins
                delete roomIntervals[data];
                console.log("Claim Your Prize ", roomData[i]);
                io.to(data).emit("ReceiveColor", selectedColor);
            }
        }

        setTimeout(() => {
            io.to(data).emit("colorHistory", selectedColor);
        }, 3000);
    }, 5000); // Runs every 5 seconds
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
