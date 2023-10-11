// console.log("hello i am oresent")
// const socket = io();
// import { get } from 'axios'; // For CommonJS (Node.js) syntax

async function getUsernameFromServer(uuid) {
    // Replace 'your_server_endpoint' with the actual endpoint on your server to get the username.
    const url = `/getUsername?uuid=${uuid}`;
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Handle the response data here, which should contain the username. 
                   document.getElementById('ContactList').innerHTML += `<li class="lChat" id="${uuid}"><span class="LChat">${data.data.username}</span></li>`
            console.log('Username:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // const path = require("path");

    // const FileEncryption = require(path.join(__dirname,'lock.js'));
    // const fileEncryption = new FileEncryption('abcd.txt');


    // const encryptedText = fileEncryption.encrypt('Hello, World!');
    // console.log('Encrypted:', encryptedText);
    // console.log('dec',fileEncryption.decrypt(encryptedText))

}
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the UUID from the URL
// const userUUID = (getQueryParam('uuid'));
const userUUID = encodeURIComponent(getQueryParam('uuid'));
const socket = io({ query: { uuid: userUUID } });
socket.on('connect', async () => {
    socket.emit('join', userUUID);
});
socket.on('userJoined', (newUserUUID) => {
    console.log("before loop",newUserUUID)
    loop(newUserUUID)
});
const loop = (uids) => {
    Object.keys(uids).forEach(async (key) => {
        // const value = uids[key];
        // console.log(`${key}: ${value}`);
        // if (userUUID !== value) {
            const result = await getUsernameFromServer(key)
            console.log("here in if",result)
        // } else {
            // console.log("Here in else", value)
        // }
    });
}


socket.on('closeit', () => {
    // Handle the 'closeit' event here
    // window.location.replace('http://localhost:3000/');
});


window.addEventListener('beforeunload', function (e) {
    // Emit the event and send the UUID to the server
    socket.emit('beforeDisconnect', userUUID);
});

// async function callit() {
//     try {
//         const response = await get(`http://localhost:3000//deleteuuid?uuid=${userUUID}`);
//         // console.log("Socket ansd",response.data.connected)
//         if (response.data !== true) {
//             console.log("socket side run else")
//             console.log(response)
//             // Handle the case where the UUID doesn't exist
//         }
//     } catch (error) {
//         console.error('Error making HTTP request: giving confirmation check');
//         console.log(error)
//     }
// }