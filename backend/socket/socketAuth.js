/**
 * The function `socketAuth` is used for authenticating socket connections using JWT tokens in a
 * Node.js application.
 * @param socket - The `socket` parameter in the `socketAuth` function is typically the socket object
 * representing the connection between the client and the server in a WebSocket application. It allows
 * bidirectional communication between the client and the server.
 * @param next - The `next` parameter in the `socketAuth` function is a callback function that is
 * called to pass control to the next middleware function in the stack. It is typically used in
 * Express.js middleware functions to proceed to the next middleware or to handle errors.
 * @returns The code snippet provided defines a function `socketAuth` that handles authentication for
 * socket connections. It checks for the presence of a token in the handshake object of the socket
 * connection. If the token is found, it verifies the token using the JWT_SECRET stored in the
 * environment variables. If the token is valid, it assigns the decoded user information to
 * `socket.user` and calls the `next()` function to
 */
// // const jwt = require("jsonwebtoken");
// // const JWT_SECRET = process.env.JWT_SECRET || "erutiuiio";

// // // promisify jwt.verify to use async/await
// // function verifyToken(token) {
// //     return new Promise((resolve, reject) => {
// //         jwt.verify(token, JWT_SECRET, (err, decoded) => {
// //             if (err) reject(err);
// //             else resolve(decoded);
// //         });
// //     });
// // }

// // async function socketAuth(socket, next) {
// //     try {
// //         const token = socket.handshake.auth.token;
// //         if (!token) return next(new Error("Authentication error"));

// //         const user = await verifyToken(token);
// //         if (!user) return next(new Error("Authentication error"));

// //         socket.user = user;
// //         next();
// //     } catch (err) {
// //         next(new Error("Authentication error"));
// //     }
// // }

// // module.exports = socketAuth;

// const jwt = require("jsonwebtoken");
// require('dotenv').config();

// function socketAuth(socket, next) {
//     let token;

//     if (
//         socket.handshake &&
//         socket.handshake.auth &&
//         socket.handshake.auth.token
//     ) {
//         token = socket.handshake.auth.token;
//     } else if (
//         socket.handshake &&
//         socket.handshake.headers &&
//         socket.handshake.headers.authorization
//     ) {
//         // Authorization header usually looks like "Bearer TOKEN"
//         token = socket.handshake.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//         return next(new Error("No token provided"));
//     }

//     try {
//         const user = jwt.verify(token, process.env.JWT_SECRET);
//         socket.user = user;
//         next();
//     } catch (err) {
//         return next(new Error("Invalid token"));
//     }
// }

// module.exports = socketAuth;