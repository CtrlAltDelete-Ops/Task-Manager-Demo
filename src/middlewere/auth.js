const jwt = require("jsonwebtoken");
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('no token provided');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decoded);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});
        if(!user) {
            throw new Error();
        }
        console.log(user);
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).send('authentication error');
    }
}

module.exports = auth;