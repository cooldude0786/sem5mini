const userUUID = encodeURI(getQueryParam('uuid'));
// console.log("hello i am oresent")
// const socket = io();
// import { get } from 'axios'; // For CommonJS (Node.js) syntax
const connectedUsers = new Map();
var currentUser = null;
const chatHistory = {};
// Function to add a user to chat history
function addUserToHistory(uid) {
    if (!chatHistory[uid]) {
        chatHistory[uid] = [];
    }
}

// Function to add a message to a user's chat history
function addMessageToHistory(uid, position, msg) {
    if (!chatHistory[uid]) {
        addUserToHistory(uid);
    }
    chatHistory[uid].push({ position, msg });
    let box = document.getElementById('chatBox')
    box.innerHTML += `<li class="RChat"><span class="RChat">${msg}</span></li> `;
    box.scrollTop = box.scrollHeight;
    let input = document.getElementById('CharSendValue')
    input.value = '';
    input.focus()
    console.log('on sending', chatHistory)
}
function addMessageToHistoryOnRecived(uid, position, msg) {
    if (!chatHistory[uid]) {
        addUserToHistory(uid);
    }
    chatHistory[uid].push({ position, msg });
    if (currentUser === uid) {
        let box = document.getElementById('chatBox')
        box.innerHTML += `<li class="${position.toLowerCase()}Chat"><span class="${position}Chat">${msg}</span></li>`
    }
    console.log('on receving', chatHistory)
}
function getChatHistory(uid) {
    if (chatHistory[uid]) {
        return chatHistory[uid];
    }
    return false;
}
// const { urlencoded } = require("body-parser");
const userList = document.getElementById("ContactList");
async function getUsernameFromServer(uuid) {
    // console.log('here uid before check', uuid)
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
            if (data.data.username) {
                connectedUsers.set(uuid, data.data.username)
                // console.log('found', uuid, data.data.username)
                document.getElementById('ContactList').innerHTML += `<li onclick=clicledme(this.id) class="lChat" id="${uuid}"><span class="LChat">${data.data.username}</span></li>`
            }
            // console.log('Username:', connectedUsers);
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
const socket = io({ query: { uuid: userUUID } });
socket.on('connect', async () => {
    socket.emit('join', encodeURI(userUUID));
    // const url = `http://localhost:3000/checkUuid?uuid=${encodeURI(userUUID)}`
    // fetch(url)
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         // Handle the response data here, which should contain the username. 
    //         // document.getElementById('ContactList').innerHTML += `<li class="lChat" id="${uuid}"><span class="LChat">${data.data.username}</span></li>`
    //         if (data.connected) {
    //             window.location.replace('http://localhost:3000/');
    //         }
    //         console.log('referhsd', data);
    //     })
    //     .catch((error) => {
    //         console.error('Error:', error);
    //     });

});
socket.on('userJoined', (newUserUUID) => {
    console.log("before loop", newUserUUID)
    loop(newUserUUID)
});
// const loop = async (uids) => {
//     document.getElementById('ContactList').innerHTML = ''
//     for (i in uids) {
//         uids[i] = uids[i]
//         console.log(uids[i])
//         if (userUUID != uids[i]) { await getUsernameFromServer(uids[i]) }
//     }
// }
const loop = async (uids) => {
    // console.log('at start of loop function ------------>', connectedUsers)
    // document.getElementById('ContactList').innerHTML = '';
    for (let i in uids) {
        const uid = uids[i];
        console.log(uid);
        if (userUUID !== uid && !connectedUsers.has(uid)) {
            await getUsernameFromServer(uid);
        }
    }
    // console.log('at end of loop function ------------>', connectedUsers)
};

// socket.on('closeit', () => {
//     // Handle the 'closeit' event here
//     // window.location.replace('http://localhost:3000/');
// });


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


document.getElementById('sendbtn').addEventListener(onclick, () => {
    if (document.getElementById('CharSendValue').value == '') {
        return;
    }
    let msg = document.getElementById('CharSendValue').value
    socket.on('private message', ({ connectedUser, msg }) => {
        const chat = document.getElementById('chatBox');
        chat.innerHTML = `<li class="lChat"><span class="LChat">abcd1</span></li>`

        chat.appendChild(listItem);
    });
})

socket.on('userleaved', (newUserUUID) => {
    // console.log('beofre deleting -------------------->', connectedUsers)
    var element = document.getElementById(newUserUUID.message);
    console.log(element)
    element.parentNode.removeChild(element);

    connectedUsers.delete(newUserUUID.message);
    loop(newUserUUID.users)
    // console.log('after deleting -------------------->', connectedUsers)
});


function clicledme(id_) {
    currentUser = id_
    let box = document.getElementById('chatBox')
    if (currentUser !== null) {
        document.getElementById('ChatBoxImage').style.display = 'none';
        box.style.display = 'block'
    }
    console.log('click to activate the chats,', currentUser)
    let chats = getChatHistory(currentUser)
    box.innerHTML = ''
    for (i in chats) {
        box.innerHTML += `<li class="${chats[i].position.toLowerCase()}Chat"><span class="${chats[i].position}Chat">${chats[i].msg}</span></li>`
        console.log(chats[i].msg)
    }
    // connectedUsers = id_
    // alert(connectedUsers)
}
function sendMsg() {
    let input = document.getElementById('CharSendValue').value.trim()
    let box = document.getElementById('chatBox')
    if (connectedUsers.has(currentUser) && input !== '') {
        // connectedUsers.set(currentUser,box.value)
        sendPrivateMessage(currentUser, input)
        addMessageToHistory(currentUser, 'R', input)
        // console.log(typeof chats, chats)
    }
};


function sendPrivateMessage(recipientId, message) {
    console.log('send messg', typeof recipientId, typeof userUUID, message)
    socket.emit('private message', { recipientId, userUUID, message });
}

// Listening for a private message
socket.on('private message', ({ sender, msg }) => {
    // Handle the private message here
    addMessageToHistoryOnRecived(sender, 'L', msg)
    // addMessageToHistory(senderId,'L',message)
    // console.log(`Private message from ${sender}: ${msg}`);
});

const inputElement = document.getElementById('CharSendValue');

// Add event listener for the 'keypress' event
inputElement.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMsg();
    }
});