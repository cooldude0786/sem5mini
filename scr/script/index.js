window.onload = () =>{
    window.location.href = "https://www.geeksforgeeks.org/";
}


const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');
const namemsg = document.getElementById('name-msg');
let socket; // Declare the socket variable at a higher scope
const userId = prompt('Please enter your name:');
socket = io(); // Initialize the socket and assign it to the global variable
await = socket.emit('join', userId );

nameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value;
    const msg = namemsg.value;

    // Send a GET request to the server with the entered name
    fetch(`/user?name=${name}`)
        .then((response) => {
            if (response.status === 200) {
                socket.emit('private message', { name, msg });
                console.log(name)
            } else {
                console.error('Failed to get user data from the server');
            }
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
});

nameForm.addEventListener('reset', (e) => {
    if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
    } else {
        alert("not there")
    }
});


window.addEventListener('beforeunload', function (e) {
    if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
    } 

    
});

window.addEventListener('unload', function (e) {
    if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
    }

    
});
