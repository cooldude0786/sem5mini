// Middleware to modify the :msg parameter
const setMyInfo = (req, res, next) => {
    console.log(req.params.msg)
    req.params.msg = req.params.msg + " hi and hello";
    next();
};
const logIn = (req, res, next) => {
    // const { id, pw } = req.body;

    // if (id.length < 6) {
    //     // If the condition is not met, return an error message in JSON format
    //     return res.status(400).json({ error: 'ID must be at least 6 characters long' });
    // }

    // If the condition is met, continue to the next middleware or route
    next();
};

const mySignup = (req, res, next) => {
    const { name, Uname, email, pw, cpw, xie_num } = req.body;
    req.body.language = 'en'
    if (pw !== cpw) {
        // cpw.value = ""
        // cpw.placeholder = "Password Doesn't Match"
        // console.log('middleware', name, Uname, email, pw, cpw, xie_num);
        return res.status(400).json({ error: "Password Doesn't matched", action: "cpw" });
    } else
        next();
};

module.exports = {
    setMyInfo,
    logIn,
    mySignup,
    // Add other middleware functions here as needed
};
