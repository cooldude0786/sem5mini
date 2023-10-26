let typingTimer;
const doneTypingInterval = 1000; // 2 seconds
const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const overlay = document.getElementById("overlay");
const form = document.getElementById("myForm");
const errorField = document.querySelector(".error-message");
// Function to show the overlay and loading spinner
console.log("hiii")
function showOverlay() {
    overlay.style.display = "flex";
}

// Function to hide the overlay and loading spinner
function hideOverlay() {
    overlay.style.display = "none";
}

window.addEventListener("load", function () {
    // When the page is loaded, focus on the username field
    usernameField.focus();

    // Disable the password field initially
    passwordField.disabled = true;

    // // Add an event listener to the username field for input
    // usernameField.addEventListener("input", function () {
    //     if (usernameField.value.trim() !== "") {
    //         // If the username is filled, enable the password field
    //         passwordField.focus();
    //         passwordField.disabled = false;
    //     } else {
    //         // If the username is empty, disable the password field
    //         passwordField.disabled = true;
    //     }
    // });
});

// usernameField.addEventListener("keydown", function (event) {
//     if (event.key === "Enter" && usernameField.value.trim() !== "") {
//         event.preventDefault(); // Prevent form submission
//         passwordField.focus(); // Set focus to the password field
//     }
// });
// usernameField.addEventListener("input", function () {
//     clearTimeout(typingTimer);
//     typingTimer = setTimeout(function () {
//         if()
//     }, doneTypingInterval);
// });

usernameField.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (usernameField.value.trim() === '') {
            return false;
        }
        passwordField.disabled = false;
        passwordField.focus();
        Submit = true;
    }, doneTypingInterval);
});
usernameField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (usernameField.value.trim() !== "") {
            passwordField.disabled = false;
            passwordField.focus();
        }
    }
});

passwordField.addEventListener("input", function () {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(function () {
        const enteredPassword = passwordField.value;
        if (enteredPassword === '') {
            console.log("Password is empty");
            return;
        }

        // Show the overlay and loading spinner before submitting the form
        showOverlay();

        // Create an object to hold the data to send to the server
        const formData = {
            id: usernameField.value,
            pw: enteredPassword
        };

        // Send the data to the server using fetch
        fetch('http://localhost:3000/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    errorField.textContent = data.error;
                    passwordField.value = ''; // Clear the password field
                } else if (data.url) {
                    // Redirect to the URL provided in the response
                    // alert(data.url)
                    window.location.href = "http://localhost:3000" + data.url;
                }
                hideOverlay();
            })
            .catch(error => {
                console.error('Error:', error);
                hideOverlay();
            });



    }, doneTypingInterval);
});


