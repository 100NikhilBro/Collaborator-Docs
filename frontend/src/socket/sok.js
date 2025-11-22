import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:2345";

const token = localStorage.getItem("token");

const socket = io(SOCKET_URL, {
    auth: {
        token: token,
    },
    transports: ["websocket"], 
    reconnectionAttempts: 5,
    timeout: 10000, 
});

export default socket;
