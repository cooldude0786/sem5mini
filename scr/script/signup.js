let typingTimer;
const doneTypingInterval = 2000; // seconds
const Name = document.getElementById("name")
const Uname = document.getElementById("Uname")
const email = document.getElementById("email")
const pw = document.getElementById("pw")
const cpw = document.getElementById("cpw")
const xieNum = document.getElementById("xie_num")
let Submit = false
window.addEventListener("load", function () {
    Name.focus();
    Uname.disabled = true;
    email.disabled = true;
    pw.disabled = true;
    cpw.disabled = true;
    xieNum.disabled = true;
});


Name.addEventListener("input", function (event) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (Name.value.trim() !== '' || event.key === 'Enter') {
            Uname.disabled = false;
            Uname.focus();
            Submit = true;
        }
        return false;
    }, doneTypingInterval);
});
Name.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (Name.value.trim() !== "") {
            Uname.disabled = false;
            Uname.focus();
        }
    }
});
Uname.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (Uname.value.trim() === '') {
            return false;
        }
        email.disabled = false;
        email.focus();
        Submit = true;
    }, doneTypingInterval);
});
Uname.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (Uname.value.trim() !== "") {
            email.disabled = false;
            email.focus();
        }
    }
});

email.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (email.value.trim() === '') {
            return false;
        }
        pw.disabled = false;
        pw.focus();
        Submit = true;
    }, (doneTypingInterval + 2000));
});
email.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (email.value.trim() !== "") {
            pw.disabled = false;
            pw.focus();
        }
    }
});

pw.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (pw.value.trim() === '') {
            return false;
        }
        cpw.disabled = false;
        cpw.focus();
        Submit = true;
    }, doneTypingInterval);
});
pw.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (pw.value.trim() !== "") {
            cpw.disabled = false;
            cpw.focus();
        }
    }
});

cpw.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (cpw.value.trim() === '') {
            return false;
        }
        xieNum.disabled = false;
        xieNum.focus();
        Submit = true;
    }, doneTypingInterval);
});
cpw.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (cpw.value.trim() !== "") {
            xieNum.disabled = false;
            xieNum.focus();
        }
    }
});

xieNum.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
        if (xieNum.value.trim() === '') {
            return false;
        }
        submitForm()
    }, doneTypingInterval);
});
xieNum.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (xieNum.value.trim() !== "") {
            submitForm()
        }
    }
});

function submitForm() {
    const formData = {
        name: Name.value,
        Uname: Uname.value,
        email: email.value,
        pw: pw.value,
        cpw: cpw.value,
        xie_num: xieNum.value
    };
    // Send the data to the server using fetch
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('errorMessage').innerText = data.error
                processInput(data.action)
                // alert("in if")
            } else if (data.url) {
                // Redirect to the URL provided in the response
                // alert("in else")
                window.location.href = "http://localhost:3000/";
            }
            // hideOverlay();
        })
        .catch(error => {
            console.error('Error: here it is', error);
            // hideOverlay();
        });



}
function processInput(input) {
    if (input === 'cpw') {
        cpw.value = '';
        cpw.focus();
    } else if (input === 'email') {
        email.value = '';
        email.focus();
    } else if (input === 'Uname') {
        Uname.value = '';
        Uname.focus();
    } else if (input === 'xie_num') {
        xieNum.value = '';
        xieNum.focus();
    }
}