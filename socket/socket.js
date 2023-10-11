// socket/socket.js
const socketIo = require('socket.io');
const axios = require('axios');
const { urlencoded } = require('express');
const connectedUsers = new Set();
connectedUsers.add('123')
module.exports = (server) => {
    const io = socketIo(server);
    console.log('A user connected');

    // Store user socket connections in an object

    io.on('connection', (socket) => {
        // console.log(socket.handshake.query.uuid)
        // Listen for a user joining the chat room
        socket.on('join', async (userId) => {
            console.log('at socekt side before encrypt',userId,decodeURI(userId))
            userId = decodeURI(userId);
            connectedUsers.add(userId);
            console.log('18socket A user connected ==>', connectedUsers);
            try {
                axios({
                    method: "get",
                    url: `http://localhost:3000/checkUuid?uuid=${userId}`,
                    // data: formData,
                    // headers: { "Content-Type": "multipart/form-data" },
                  })
                    .then(({ data }) => {
                      console.log(data);
                    })
                    .catch((err) => {
                      console.error(err.toJSON());
                    })
                // const response = await axios.get(`http://localhost:3000/checkUuid?uuid=${userId}`);
                // // console.log("Socket ansd",response.data.connected)
                // if (response.data.connected !== true) {
                //     io.emit('closeit');
                //     console.log("Socket 26 runss")
                //     // Handle the case where the UUID doesn't exist
                // }
            } catch (error) {
                console.error('28Error making HTTP request: retriving userid');
            }
            const myArray = Array.from(connectedUsers);
            const lastElement = myArray[myArray.length - 1];
            console.log("socket side", Array.from(connectedUsers))
            // Store the user's socket with their user ID
            io.emit('userJoined', Array.from(connectedUsers));
        });


        // Handle private messages
        socket.on('private message', ({ recipientId, message }) => {
            // Get the recipient's socket based on their user ID
            const recipientSocket = connectedUsers[recipientId];

            if (recipientSocket) {
                // Emit the private message to the recipient's socket
                recipientSocket.emit('private message', { senderId: socket.id, message });
            }
            else {
                console.log("not found")
            }
        });

        socket.on('beforeDisconnect', (userUUID) => {
            userUUID = encodeURI(userUUID)
            console.log(userUUID)
            socket.on('disconnect', async () => {
                try {
                    const response = await axios.post('http://localhost:3000/deleteuuid/', { uuid: userUUID });
                    
                    // Check the response status or data to determine success
                    if (response.status === 200) {
                        console.log('Successfully deleted UUID on the server');
                    } else {
                        console.log('Server returned an error:', response.data);
                        // Handle the case where the UUID doesn't exist or the server returned an error
                    }
                } catch (error) {
                    console.error('Error making POST request for deleting UUID:', error);
                }
                connectedUsers.delete(decodeURI(userUUID))
                console.log(`63User with UUID ${decodeURI(userUUID)} is about to disconnect`);
                console.log(connectedUsers)
            });
        });
    });
};
