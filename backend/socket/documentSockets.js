// const debounce = require("lodash/debounce");
// const Document = require("../models/Document");
// const Y = require("yjs"); // Tujhe Y.js bhi import karna padega yahan

// // Debounced save to avoid too many DB writes
// const debounceSave = debounce(async(docId, ydoc) => {
//     try {
//         const state = Y.encodeStateAsUpdate(ydoc); // Uint8Array
//         await Document.findByIdAndUpdate(docId, { yjsState: state });
//         console.log(`Document ${docId} state saved`);
//     } catch (error) {
//         console.error("Failed to save document state:", error);
//     }
// }, 1000); // 1 second debounce


// async function setupDocumentSocket(socket, io) {
//     socket.on("join-document", async(docId) => {
//         try {
//             const userId = socket.user._id; // authenticated user id (ensure socketAuth middleware sets this correctly)
//             const doc = await Document.findById(docId);

//             if (!doc) {
//                 return socket.emit("error", "Document not found");
//             }

//             // Check ownership and collaborator access
//             const isOwner = doc.owner.equals(userId);
//             const isCollaborator = doc.collaborators.some(c => c.user.equals(userId));

//             if (!isOwner && !isCollaborator) {
//                 return socket.emit("error", "Access denied");
//             }

//             socket.join(docId);
//             console.log(`${socket.id} joined document ${docId}`);

//             const ydoc = getYDoc(docId); // Make sure getYDoc function is defined/imported

//             // Apply saved state from DB (if exists)
//             if (doc.yjsState) {
//                 Y.applyUpdate(ydoc, doc.yjsState);
//             }

//             // Send initial Yjs document state to client in base64
//             const initialState = Buffer.from(Y.encodeStateAsUpdate(ydoc)).toString("base64");
//             socket.emit("init-document", initialState);

//             socket.on("sync-update", (updateBase64) => {
//                 const update = Buffer.from(updateBase64, "base64");
//                 Y.applyUpdate(ydoc, update);

//                 // Broadcast update to other clients in room
//                 socket.to(docId).emit("sync-update", updateBase64);

//                 // Save document state with debounce to limit DB writes
//                 debounceSave(docId, ydoc);
//             });

//             socket.on("disconnect", () => {
//                 console.log(`${socket.id} left document ${docId}`);
//                 socket.leave(docId);
//             });
//         } catch (error) {
//             console.error(error);
//             socket.emit("error", "Server error during join");
//         }
//     });
// }

// module.exports = setupDocumentSocket;



// function setupDocumentSocket(socket, io) {
//     socket.on("join-document", (docId) => {
//         socket.join(docId);
//         console.log(`User ${socket.id} joined room ${docId}`);
//     });

//     socket.on("send-changes", ({ docId, delta }) => {
//         socket.to(docId).emit("receive-changes", delta);
//     });
// }

// module.exports = { setupDocumentSocket };