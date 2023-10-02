// socket/socket.js
const socketIo = require('socket.io');
let userj=[]
module.exports = (server) => {
    const io = socketIo(server);

    // Store user socket connections in an object
    const connectedUsers = {};

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Listen for a user joining the chat room
        socket.on('join', (userId) => {
            userj.push(userId)
            console.log(userj)
            // Store the user's socket with their user ID
            connectedUsers[userId] = socket;
        });

        // Handle private messages
        socket.on('private message', ({ recipientId, message }) => {
            // Get the recipient's socket based on their user ID
            const recipientSocket = connectedUsers[recipientId];

            if (recipientSocket) {
                // Emit the private message to the recipient's socket
                recipientSocket.emit('private message', { senderId: socket.id, message });
            }
            else{
                console.log("not found")
            }
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');

            // Remove the user's socket from the connected users object
            for (const userId in connectedUsers) {
                if (connectedUsers[userId] === socket) {
                    delete connectedUsers[userId];
                    break;
                }
            }
        });
    });
};
