const express = require('express');
const router = express.Router();
const middleware = require('../mid/middleware'); // Update the import path for middleware
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const FileEncryption = require('../scr/script/lock.js');
const fileEncryption = new FileEncryption('key.txt');
const uuidUsernameMap = {};
uuidUsernameMap['123'] = { username: 'khizar', email: "email" };
const db = require('../db/db');
// const fileEncryption = new FileEncryption('../scr/script/lock.js');
// console.log(path.join(__dirname,'../scr/script/lock.js'))
// Route handler for /translate/:msg
router.get('/translate/:msg', middleware.setMyInfo, (request, response) => {
    var msg = request.params.msg;
    response.status(200).send(`${msg} welldone`);
});

router.get('/abcd', (req, res) => {
    res.sendFile(path.join(__dirname, "../test.html"))
})

router.get('/', (request, response) => {
    let indexPath = path.join(__dirname, "../scr/pages/home.html");
    response.sendFile(indexPath);
})

router.get('/user', (req, res) => {
    const userName = req.query.name;

    if (userName != '') {
        // Respond with a 200 OK status
        res.status(200).send('OK');
    } else {
        // Respond with an error status (e.g., 400 Bad Request)
        res.status(400).send('Invalid name');
    }
});

router.post('/Login', middleware.logIn, async (req, res) => {
    var username = req.body.id;
    var password = fileEncryption.encrypt(req.body.pw);
    const result = await db.loginWithEmailAndPassword(username, password)
    if (result.success) {
        const shortUUID = fileEncryption.encrypt(generateShortUUID());
        // uuidUsernameMap[shortUUID] = result.username;
        const existingUUID = Object.keys(uuidUsernameMap).find((key) => {
            const storedData = uuidUsernameMap[key];
            return storedData.username === result.username || storedData.email === result.email;
        });
        // Checking for data
        if (existingUUID) {
            // Either username or email is already connected, send an error response
            res.status(400).json({ error: 'Username or email is already connected' });
        } else {
            uuidUsernameMap[shortUUID] = { username: result.username, email: result.email };
            console.log("56Server-side login new with", uuidUsernameMap)
            res.status(200).json({ url: `/next_page?uuid=${shortUUID}`, u: result.username });
        }
    } else {
        // Send an error message to the client
        res.status(400).json({ error: 'Invalid username or password' });
    }
});

// Define a route for the next page
router.get('/next_page', (req, res) => {
    // console.log('chat one 1',req.query.uuid)
    // const uuid = fileEncryption.decrypt(req.query.uuid)
    // console.log('chat one',uuid)
    res.sendFile(path.join(__dirname, `../scr/pages/chat_On.html`));
    // res.status(200).send('good');
});


router.post('/signup', middleware.mySignup, async (req, res) => {
    // const { name, Uname, email, pw, cpw, xie_num } = req.body;
    req.body.pw = fileEncryption.encrypt(req.body.pw)
    const result = await db.insertFormData(req.body)
    if (result.success) {
        res.status(200).json({ url: "Login" })
    } else if (!result.success) {
        res.status(400).json({ error: result.message, action: result.action });
    }
    // res.status(200).json({ url: req.body.pw })
});
router.get('/SignUp', (req, res) => {
    res.sendFile(path.join(__dirname, `../scr/pages/signup.html`));
});

router.get('/checkUuid', (req, res) => {
    const uuidToCheck = decodeURIComponent(req.query.uuid);
    console.log("92serverCheckUrl", uuidToCheck)
    console.log('93Server-SideUrlResult', uuidToCheck, '-->', uuidUsernameMap.hasOwnProperty(uuidToCheck))
    const isUUIDConnected = uuidUsernameMap.hasOwnProperty(uuidToCheck);
    res.json({ connected: isUUIDConnected });
});


router.get('/getUsername', (req, res) => {
    const uuid = req.query.uuid;
    // Check if the UUID exists in your mapping
    const data = uuidUsernameMap[uuid]
    console.log('Server103getUsername',data)
    res.json({ data: data })
    // if (data) {
    //     res.json({ data });
    // } else {
    //     res.status(404).json({ error: 'Username not found' });
    // }
});

function generateShortUUID() {
    let shortUUID;

    do {
        // Generate a full UUID
        const fullUUID = uuidv4();

        // Extract the first 6 characters from the full UUID
        shortUUID = fullUUID.substring(0, 6);

        // Check if the short UUID is already in use
    } while (uuidUsernameMap[shortUUID]);
    return shortUUID;
}

// // Define a route to delete a UID
// router.delete('/delete-uuid/:userUUID', (req, res) => {
//     const userUUID =decodeURIComponent(req.params.userUUID);
//     console.log("server side Update url ",userUUID)
//     // if (uuidUsernameMap.hasOwnProperty(userUUID)) {
//     //     // Remove the UID from the storage
//     //     delete uuidUsernameMap[userUUID];
//     //     console.log("updated serverSide Uuid",uuidUsernameMap)
//     //     res.status(200).send(` server side success fully deleted.`);
//     // } else {
//     //     // UID not found, return an error
//     //     res.status(404).send(`UID ${userUUID} not found.`);
//     // }
//     res.json({sucess: "done"+userUUID})
// });

// router.get('/deleteuuid', (req, res) => {
//     const userUUID = decodeURIComponent(req.query.uuid);
//     if (uuidUsernameMap.hasOwnProperty(userUUID)) {
//         delete uuidUsernameMap[userUUID];
//         console.log("updated serverSide Uuid", uuidUsernameMap)
//         res.status(200).json({ data: true });
//     } else {
//         // UID not found, return an error
//         res.status(404).json({ data: false });
//     }
//     // res.json({data:true, connected: 'isUUIDConnected' });
// });

const socketIo = require('socket.io');
const axios = require('axios'); 
const { urlencoded } = require('express');
const connectedUsers = new Set();
module.exports = (server) => {
    const io = socketIo(server);
    console.log('A user connected');

    // Store user socket connections in an object

    io.on('connection', (socket) => {
        // console.log(socket.handshake.query.uuid)
        // Listen for a user joining the chat room
        socket.on('join', async (userId) => {
            userId = decodeURIComponent(userId);
            connectedUsers.add(userId);
            console.log('18socket A user connected ==>', connectedUsers);
            try {
                const response = await axios.get(`http://localhost:3000/checkUuid?uuid=${userId}`);
                // console.log("Socket ansd",response.data.connected)
                if (response.data.connected !== true) {
                    io.emit('closeit');
                    // console.log("socket side run else")
                    // Handle the case where the UUID doesn't exist
                }
            } catch (error) {
                console.error('28Error making HTTP request: retriving userid');
            }
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
            userUUID = encodeURIComponent(userUUID)
            socket.on('disconnect', async () => {
                // try {
                //     const response = await axios.get(`http://localhost:3000//deleteuuid?uuid=${userUUID}`);
                //     // console.log("Socket ansd",response.data.connected)
                //     if (response.data !== true) {
                //         console.log("socket side run else")
                //         // Handle the case where the UUID doesn't exist
                //     }
                // } catch (error) {
                //     console.error('Error making HTTP request: giving confirmation check');
                //     console.log(error)
                // }
                console.log(`63User with UUID ${decodeURIComponent(userUUID)} is about to disconnect`);
            });
        });
    });
};


module.exports = router;
