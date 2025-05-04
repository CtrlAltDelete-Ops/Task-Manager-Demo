const jwt = require("jsonwebtoken");
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'helloworldnow');
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
        console.log('Error occured');
        res.status(401).send('authentication error');
    }
}

module.exports = auth;