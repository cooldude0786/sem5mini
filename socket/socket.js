// socket/socket.js
const socketIo = require('socket.io');
const axios = require('axios');
const { urlencoded } = require('express');
const connectedUsers = new Set();
const userSocketMap = new Map();
connectedUsers.add('123')
connectedUsers.add('523')
module.exports = (server) => {
    const io = socketIo(server);
    console.log('A user connected');

    // Store user socket connections in an object

    io.on('connection', (socket) => {
        // console.log(socket.handshake.query.uuid)
        // Listen for a user joining the chat room
        socket.on('join', async (userId) => {
            // console.log('at socekt side before encrypt',userId,decodeURIComponent(userId))
            // userId = decodeURI(userId);

            console.log('Socket user Added 20 =>', userId);
            try {
                axios({
                    method: "get",
                    url: `http://localhost:3000/checkUuid?uuid=${userId}`,
                    // data: formData,
                    // headers: { "Content-Type": "multipart/form-data" },
                })
                    .then(({ data }) => {
                        if (data.connected) {
                            console.log('called if')
                            connectedUsers.add(userId);
                            userSocketMap.set(userId, socket);
                            io.emit('userJoined', Array.from(connectedUsers));
                        } else {
                            // console.log('called',socket)
                            socket.emit('Kill', '');
                        }

                        console.log('checking', data, connectedUsers, userId);
                        
                    })
                    .catch((err) => {
                        console.error(err);
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

            // const lastElement = myArray[myArray.length - 1];
            // console.log("socket side", Array.from(connectedUsers))
            // Store the user's socket with their user ID
        });


        // Handle private messages
        socket.on('private message', ({ recipientId, message, userUUID }) => {
            // Get the recipient's socket based on their user ID
            console.log('Out', recipientId, userUUID, message)
            const recipientSocket = userSocketMap.get(recipientId);
            if (recipientSocket) {
                recipientSocket.emit('private message', { sender: userUUID, msg: message });
            } else {
                console.log('Error happened');
            }
        });

        socket.on('beforeDisconnect', (userUUID) => {
            userUUID = encodeURI(userUUID)
            // console.log(userUUID)
            socket.on('disconnect', async () => {
                try {
                    const response = await axios.post('http://localhost:3000/deleteuuid/', { uuid: userUUID });

                    // Check the response status or data to determine success
                    if (response.status === 200) {
                        connectedUsers.delete(userUUID)
                        userSocketMap.delete(userUUID);
                        // io.emit('userleaved', Array.from(connectedUsers))
                        io.emit('userleaved', { users: Array.from(connectedUsers) , message:userUUID});
                        console.log(`Socket user ==> ${(userUUID)} is about to disconnect 84`);
                        console.log('user list at socekt', connectedUsers)
                        // console.log('Successfully deleted UUID on the server');
                    } else {
                        // console.log('Server returned an error:', response.data);
                        // Handle the case where the UUID doesn't exist or the server returned an error
                    }
                } catch (error) {
                    console.error('Error making POST request for deleting UUID:', error);
                }

                // console.log(connectedUsers)
                //     io.emit('closeit',);
                // io.emit('userJoined', Array.from(connectedUsers));


            });
        });
    });
};
