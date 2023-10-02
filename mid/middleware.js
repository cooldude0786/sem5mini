// Middleware to modify the :msg parameter
const setMyInfo = (req, res, next) => {
    console.log(req.params.msg)
    req.params.msg = req.params.msg + " hi and hello";
    next();
};
const logIn = (req, res, next) => {
    const { id, pw } = req.body;

    if (id.length < 6) {
        // If the condition is not met, return an error message in JSON format
        return res.status(400).json({ error: 'ID must be at least 6 characters long' });
    }

    // If the condition is met, continue to the next middleware or route
    next();
};

module.exports = {
    setMyInfo,
    logIn,
    // Add other middleware functions here as needed
};
