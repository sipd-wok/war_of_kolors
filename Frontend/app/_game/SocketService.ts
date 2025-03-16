import { io, Socket } from "socket.io-client";

class SocketService {
  private static instance: SocketService;
  private _socket: Socket | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect() {
    if (!this._socket) {
      const socketUrl = "https://sipd-wok.onrender.com";

      console.log(`Connecting to socket server at: ${socketUrl}`);
      this._socket = io(socketUrl);

      this._socket.on("connect", () => {
        console.log("Socket connected with ID:", this._socket?.id);
      });

      this._socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }
    return this._socket;
  }

  public getSocket(): Socket {
    if (!this._socket) {
      return this.connect();
    }
    return this._socket;
  }

  public disconnect() {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
  }
}

// Export as singleton
export const socketService = SocketService.getInstance();
