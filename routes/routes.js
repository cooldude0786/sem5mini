const express = require('express');
const router = express.Router();
const middleware = require('../mid/middleware'); // Update the import path for middleware
const path = require("path");
const translate = require('translate-google');
const { v4: uuidv4 } = require('uuid');
const FileEncryption = require('../scr/script/lock.js');
const fileEncryption = new FileEncryption('key.txt');
const uuidUsernameMap = {};
// uuidUsernameMap['123'] = { username: 'khizar', email: "email", language: "en" };
// uuidUsernameMap['523'] = { username: 'Anas', email: "email", language: "en" };
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
    var password = fileEncryption.encrypt((req.body.pw).trim());
    const result = await db.loginWithEmailAndPassword(username, password)
    if (result.success) {
        // let shortUUID = fileEncryption.encrypt(generateShortUUID());
        let shortUUID = encodeURIComponent(generateShortUUID())
        // uuidUsernameMap[shortUUID] = result.username;
        const existingUUID = Object.keys(uuidUsernameMap).find((key) => {
            // console.log('48 server',key)
            const storedData = uuidUsernameMap[key];
            return storedData.username === result.username || storedData.email === result.email;
        });
        // Checking for data
        if (existingUUID) {
            // Either username or email is already connected, send an error response
            res.status(400).json({ error: 'Username or email is already connected' });
        } else {
            uuidUsernameMap[shortUUID] = { username: result.username, email: result.email, language: result.language };
            console.log("Server user joined", shortUUID)
            res.status(200).json({ url: `/next_page?uuid=${shortUUID}`, u: result.username });
        }
    } else {
        // Send an error message to the client
        res.status(400).json({ error: 'Invalid username or password' });
    }
    console.log('server all user ', uuidUsernameMap)
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
    // req.body.language = 'en'
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

router.get('/changeLang', async (req, res) => {
    const { uuid, ln } = req.query;
    let obj = { code: 0, status: false };
    if (uuidUsernameMap.hasOwnProperty(uuid)) {
        const { username, email } = uuidUsernameMap[uuid]
        const result = await db.updateLanguage(email, username, ln)
        if (result !== null) {
            obj.status = true;
            obj.username = username
            obj.email = email
            obj.code = 200;
            obj.data = result;
        } else {
            obj.status = false;
            obj.code = 200;
            obj.action = true;
        }
    } else {
        obj.code = 404;
        obj.status = false;
    }
    res.status(obj.code).json(obj);
});


router.get('/checkUuid', (req, res) => {
    const uuidToCheck = (req.query.uuid);
    console.log("92serverCheckUrl", uuidToCheck)
    // console.log('93Server-SideUrlResult', uuidToCheck, '-->', uuidUsernameMap.hasOwnProperty(uuidToCheck))
    const isUUIDConnected = uuidUsernameMap.hasOwnProperty(uuidToCheck);
    res.json({ connected: isUUIDConnected });
});

router.get('/getUnameAndLanhuage', (req, res) => {
    const id = (req.query.uuid);
    if (uuidUsernameMap.hasOwnProperty(id)) {
        const { username, language } = uuidUsernameMap[id]
        return res.json({ uName: username, ln: language, status: true }).status(200)
    } else {
        // UID not found, return an error
        res.status(200).json({ status: false });
    }
    // res.status(200).json({id:id})

});
router.get('/getUsername', (req, res) => {
    const uuid = req.query.uuid;
    // Check if the UUID exists in your mapping
    const data = uuidUsernameMap[uuid]
    // console.log('Server103getUsername',data,uuid,uuidUsernameMap)
    // res.json({ data: data })
    if (data) {
        res.json({ data });
    } else {
        res.status(404).json({ error: 'Username not found' });
    }
});
function generateShortUUID() {
    const alphanumericChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let shortUUID = '';

    do {
        shortUUID = '';
        for (let i = 0; i < 6; i++) {
            shortUUID += alphanumericChars.charAt(Math.floor(Math.random() * alphanumericChars.length));
        }
    } while (uuidUsernameMap[shortUUID]);

    return shortUUID;
}

// function generateShortUUID() {
//     let shortUUID;

//     do {
//         // Generate a full UUID
//         const fullUUID = uuidv4();

//         // Extract the first 6 characters from the full UUID
//         shortUUID = fullUUID
//         // Check if the short UUID is already in use
//     } while (uuidUsernameMap[shortUUID]);
//     return shortUUID;
// }

// // Define a route to delete a UID
// router.delete('/delete-uuid/:userUUID', (req, res) => {
//     const userUUID =decodeURI(req.params.userUUID);
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

router.get('/ChangeLanguage', async (req, res) => {
    try {
        const { msg, ctype, Ttype } = req.query;
        let translatedText;
        translatedText = await translate(msg, { from: ctype, to: Ttype });
        res.status(200).json({status:true,msg:translatedText})
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/deleteuuid/', (req, res) => {
    const userUUID = (req.body.uuid);
    if (uuidUsernameMap.hasOwnProperty(userUUID)) {
        delete uuidUsernameMap[userUUID];
        console.log("updated serverSide Uuid", uuidUsernameMap)
        res.status(200).json({ data: true });
    } else {
        // UID not found, return an error
        res.status(200).json({ data: false });
    }
    // res.json({data:true, connected: 'isUUIDConnected' });
});


module.exports = router;
