// console.log("hello i am oresent")
// const socket = io();
function getUsernameFromServer(uuid) {
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
            console.log('Username:', data.username);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the UUID from the URL
// const userUUID = (getQueryParam('uuid'));
const userUUID = encodeURIComponent(getQueryParam('uuid'));
const socket = io({ query: { uuid: userUUID } });
socket.on('connect', () => {
    socket.emit('join', userUUID);

    // Listen for the 'disconnectUser' event from the server

});
socket.on('userJoined', (newUserUUID) => {
    loop(newUserUUID)
});
const loop = (uids) => {
    Object.keys(uids).forEach((key) => {
        const value = uids[key];
        // console.log(`${key}: ${value}`);
        if (userUUID !== value) {
            console.log("here in if", value)
            // getUsernameFromServer(value);
        } else {
            console.log("Here in else", value)
        }
    });
}


socket.on('closeit', () => {
    // Handle the 'closeit' event here
window.location.replace('http://localhost:3000/');
});


window.addEventListener('beforeunload', function (e) {
    // Emit the event and send the UUID to the server
    socket.emit('beforeDisconnect', userUUID);
});