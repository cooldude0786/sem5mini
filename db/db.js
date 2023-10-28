
const mongoose = require('mongoose');
const { use } = require('../routes/routes');

// MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017/admin'; // Replace with your database URL

// Options to pass to the MongoDB driver
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(mongoURL, mongoOptions)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define a schema for your data
const formDataSchema = new mongoose.Schema({
    name: String,
    Uname: String,
    email: String,
    pw: String,
    xie_num: String,
    language: String,
});

const UserModel = mongoose.model("UserAccountDetails", formDataSchema); // Change this to your collection name

//   // Function to insert form data into the "user" collection
const insertFormData = async (formData) => {
    try {
        const existingUser = await UserModel.findOne({ email: formData.email });

        if (existingUser) {
            // Email is already taken, handle the error
            console.log("Found The Email")
            return { success: false, message: 'Email is already taken', action: 'email' };
        }
        const existingUserUname = await UserModel.findOne({ Uname: formData.Uname });
        if (existingUserUname) {
            return { success: false, message: 'Username is already taken', action: 'Uname' };
        }

        // Check if xie_num is already taken
        const existingUserXieNum = await UserModel.findOne({ xie_num: formData.xie_num });
        if (existingUserXieNum) {
            return { success: false, message: 'Xie Number is already taken', action: 'xie_num' };
        }
        // Create a new User document
        const newUser = new UserModel(formData);

        // Save the document to the database
        await newUser.save();

        // Return a success message
        return { success: true, message: 'Data inserted successfully' };
    } catch (error) {
        console.error('Error inserting data:', error);
        return { success: false, message: 'Failed to insert data' };
    }
};


const checkEmailExists = async (email) => {
    try {
        const existingUser = await UserModel.findOne({ email: email });

        if (existingUser) {
            return true; // Email exists
        } else {
            return false; // Email does not exist
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return false; // Error occurred
    }
};
const checkUnameExists = async (uname) => {
    try {
        const existingUser = await UserModel.findOne({ Uname: uname });

        if (existingUser) {
            return true; // User name exists
        } else {
            return false; // User name does not exist
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return false; // Error occurred
    }
};
const loginWithEmailAndPassword = async (email, password) => {
    try {
        // Check if the email exists


        if (email.includes('@student.xavier.ac.in')) {
            // Input contains @student.xavier.ac.in, so treat it as an email
            const emailExists = await checkEmailExists(email);

            if (!emailExists) {
                return { success: false, message: 'Email not found' };
            }
            const user = await UserModel.findOne({ email: email, pw: password });

            if (!user) {
                return { success: false, message: 'Invalid email or password' };
            }
            console.log('db',user.language)
            // Return a success message and the username and the language
            return { success: true, message: 'Login successful', username: user.Uname, email: user.email,language: user.language };
        } else {
            // Input does not contain @student.xavier.ac.in, so treat it as a username
            const emailExists = await checkUnameExists(email);

            if (!emailExists) {
                return { success: false, message: 'Email not found' };
            }
            const user = await UserModel.findOne({ Uname: email, pw: password });

            if (!user) {
                return { success: false, message: 'Invalid email or password' };
            }

            // Return a success message and the username
            return { success: true, message: 'Login successful', username: user.Uname, email: user.email,language: user.language };
        }

        // Attempt to find a user with the given email and password

    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Login failed' };
    }
};




module.exports = {
    insertFormData,
    loginWithEmailAndPassword,
};