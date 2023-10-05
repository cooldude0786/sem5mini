// socket/socket.js
const socketIo = require('socket.io');
const crypto = require('crypto');
const secretKey  = "TeItMiniProject"

function decryptString(secretKey, encryptedText) {
    const iv = crypto.randomBytes(16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}
let userj=[]
module.exports = (server) => {
    const io = socketIo(server);
    console.log('A user connected');

    // Store user socket connections in an object
    const connectedUsers = {};

    io.on('connection', (socket) => {

        // Listen for a user joining the chat room
        socket.on('join', (userId) => {
            userj.push(userId)
            console.log('A user connected');
            console.log(userj);
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
