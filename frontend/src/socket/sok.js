import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:2345";

const token = localStorage.getItem("token"); // assuming token stored in localStorage after login

const socket = io(SOCKET_URL, {
    auth: {
        token: token,
    },
    transports: ["websocket"], // use websocket only (optional, but recommended)
    reconnectionAttempts: 5, // optional: try reconnect 5 times
    timeout: 10000, // optional: 10s timeout
});

export default socket;