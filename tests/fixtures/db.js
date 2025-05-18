const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: "Ismail Amin",
    email: "ismailamin@example.com",
    password: "amin12345",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET_KEY),
        },
    ],
};

const setUpDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
}

module.exports = {
    userOneId,
    userOne,
    setUpDatabase
}