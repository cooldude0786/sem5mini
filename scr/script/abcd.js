// // const path = require("path");

// // const FileEncryption = require(path.join(__dirname,'lock.js'));
// // const fileEncryption = new FileEncryption('abcd.txt');


// // const encryptedText = fileEncryption.encrypt('Hello, World!');
// // console.log('Encrypted:', encryptedText);
// // console.log('dec',fileEncryption.decrypt(encryptedText))

// const axios = require('axios');
// async function good(userUUID){

// try {
//     const response = await axios.get(`http://localhost:3000//deleteuuid?uuid=${userUUID}`);
//     // console.log("Socket ansd",response.data.connected)
//     if (response.data !== true) {
//         console.log("socket side run else")
//         console.log(response)
//         // Handle the case where the UUID doesn't exist
//     }
// } catch (error) {
//     console.error('Error making HTTP request: giving confirmation check');
//     console.log(error)
// }
// }
// good('sdsd')