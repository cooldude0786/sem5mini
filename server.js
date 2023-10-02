const express = require('express');
const app = express();
const routes = require('./routes/routes');
const middleware = require('./mid/middleware');
const http = require('http');
const server = http.createServer(app);
const initSocket = require('./socket/socket'); // Import the Socket.IO setup
const cors = require('cors');
// Use the cors middleware to enable CORS for all routes
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


// Define middleware for all routes
app.use((request, response, next) => {
    // console.log(request);
    next();
});

// Serve the Socket.IO client library
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js', {
        headers: {
            'Content-Type': 'text/javascript'
        }
    });
});
// Serve the 'index.js' file with the correct MIME type
// app.get('/scr/script/index.js', (req, res) => {
//     res.sendFile(__dirname + '/scr/script/index.js', {
//         headers: {
//             'Content-Type': 'text/javascript' // Set the correct MIME type
//         }
//     });
// });

app.use('/style',express.static('scr/style'));
app.use('/img',express.static('scr/img'));
app.use('/script',express.static('scr/script'));

// Use the routes defined in routes/routes.js
app.use('/', routes);

// Initialize Socket.IO by passing the server instance
initSocket(server);

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server listening on port 3000. \n http://localhost:3000/');
});
