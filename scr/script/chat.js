console.log("hello i am oresent")
// const socket = io();
// socket.emit('join', userId);
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get the UUID from the URL
const userUUID = getQueryParam('uuid');
console.log(userUUID)
const socket = io({ query: { uuid: userUUID } });
socket.on('connect', () => { 
    console.log('Connected to the server');
});
