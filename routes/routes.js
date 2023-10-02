const express = require('express');
const router = express.Router();
const middleware = require('../mid/middleware'); // Update the import path for middleware
const path = require("path");


// Route handler for /translate/:msg
router.get('/translate/:msg', middleware.setMyInfo, (request, response) => {
    var msg = request.params.msg;
    response.status(200).send(`${msg} welldone`);
});

router.get('/', (request, response) => {
    let indexPath = path.join(__dirname, "../scr/pages/home.html");
    response.sendFile(indexPath);
})

router.get('/user', (req, res) => {
    const userName = req.query.name;

    if (userName!='') {
        // Respond with a 200 OK status
        res.status(200).send('OK');
    } else {
        // Respond with an error status (e.g., 400 Bad Request)
        res.status(400).send('Invalid name');
    }
});


router.post('/Login',middleware.logIn, (req, res) => {
    var username = req.body.id;
    var password = req.body.pw;
    // Perform verification logic on the server
    if (username === 'test' || password === '123') {
        // Redirect to another page on successful verification
        res.status(200).json({ url: '/next_page' });
    } else {
        // Send an error message to the client
        res.status(400).json({ error: 'Invalid username or password' });
    }
});

// Define a route for the next page
router.get('/next_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../scr/pages/chat_On.html'));
});
module.exports = router;
