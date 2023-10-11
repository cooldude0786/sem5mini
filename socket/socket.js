// // socket/socket.js
// const socketIo = require('socket.io');
// const axios = require('axios'); 
// const { urlencoded } = require('express');
// const connectedUsers = new Set();
// module.exports = (server) => {
//     const io = socketIo(server);
//     console.log('A user connected');

//     // Store user socket connections in an object

//     io.on('connection', (socket) => {
//         // console.log(socket.handshake.query.uuid)
//         // Listen for a user joining the chat room
//         socket.on('join', async (userId) => {
//             userId = decodeURIComponent(userId);
//             connectedUsers.add(userId);
//             console.log('18socket A user connected ==>', connectedUsers);
//             try {
//                 const response = await axios.get(`http://localhost:3000/checkUuid?uuid=${userId}`);
//                 // console.log("Socket ansd",response.data.connected)
//                 if (response.data.connected !== true) {
//                     io.emit('closeit');
//                     // console.log("socket side run else")
//                     // Handle the case where the UUID doesn't exist
//                 }
//             } catch (error) {
//                 console.error('28Error making HTTP request: retriving userid');
//             }
//             // Store the user's socket with their user ID
//             io.emit('userJoined', Array.from(connectedUsers));
//         });


//         // Handle private messages
//         socket.on('private message', ({ recipientId, message }) => {
//             // Get the recipient's socket based on their user ID
//             const recipientSocket = connectedUsers[recipientId];

//             if (recipientSocket) {
//                 // Emit the private message to the recipient's socket
//                 recipientSocket.emit('private message', { senderId: socket.id, message });
//             }
//             else {
//                 console.log("not found")
//             }
//         });

//         socket.on('beforeDisconnect', (userUUID) => {
//             userUUID = encodeURIComponent(userUUID)
//             socket.on('disconnect', async () => {
//                 // try {
//                 //     const response = await axios.get(`http://localhost:3000//deleteuuid?uuid=${userUUID}`);
//                 //     // console.log("Socket ansd",response.data.connected)
//                 //     if (response.data !== true) {
//                 //         console.log("socket side run else")
//                 //         // Handle the case where the UUID doesn't exist
//                 //     }
//                 // } catch (error) {
//                 //     console.error('Error making HTTP request: giving confirmation check');
//                 //     console.log(error)
//                 // }
//                 console.log(`63User with UUID ${decodeURIComponent(userUUID)} is about to disconnect`);
//             });
//         });
//     });
// };
