// const { Server } = require("socket.io");
// // // const { setupDocumentSocket } = require("../socket/documentSockets");
// // // const socketAuth = require("../socket/socketAuth");

// let io;

// function initSocket(server) {
//     io = new Server(server, {
//         cors: { origin: "*" }, // Production me yeh origin ko apne frontend domain pe set karna
//     });

//     // io.use(socketAuth); // Socket-level middleware for authentication

//     io.on("connection", (socket) => {
//         console.log("User connected:", socket.id);

//         // setupDocumentSocket(socket, io);

//         socket.on("disconnect", () => {
//             console.log("User disconnected:", socket.id);
//         });
//     });
// }

// function getIo() {
//     if (!io) throw new Error("Socket.io not initialized");
//     return io;
// }

// module.exports = { initSocket, getIo };