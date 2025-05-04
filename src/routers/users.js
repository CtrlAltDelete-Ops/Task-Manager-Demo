const express = require('express');
const User = require('../models/user');
const { findById } = require('../models/task');
const router = new express.Router();
const auth = require('../middlewere/auth');
const multer = require('multer');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user, token});
        console.log('User added successfully!');
    } catch (e) {
        console.error("Error: ", e);
        res.status(400).send('Error!');
    }
})

router.post('/users/login', async (req, res) => {
    try {
        r = req.body
        const user = await User.findByCredentials(r.email, r.password);
        if (!user) {
            return res.status(404).send({ error: "user with email and password not found!" });
        }
        const token = await user.generateAuthToken();
        
        res.send({ user, token });
        console.log('login successfull');
    } catch (error) {
        res.status(400).send();
        console.log(error);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send({ message: 'logout successfull' });
        console.log('Logout successfull!');
    } catch (error) {
        res.status(500).send({ error });
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('loged out of all devices');
        console.log('logoutAll successfull!');
    } catch (error) {
        res.status(500).send('server error');
    }
})


router.get('/users/me', auth, async(req, res) => {
    res.send(req.user);
}) 

router.get('/users', async(req, res) => {
    const allUsers = await User.find({});
    res.send(allUsers);
})

router.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'The field/fields you are trying to update is/are invalid!'});
    }
    const user = req.user;
    try {
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.send(user);
        console.log("User updated successfully");
    } catch (e) {
        res.status(500).send("Server error!");
        console.log('Error: ', e);
    }
})

router.delete("/users/me", auth, async (req, res) => {
    const user = req.user;
    try {
        await user.deleteOne();
        res.send({ messgae: "user deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
})

const avatar = multer({
    dest: 'avatars'
})

router.post('/users/me/avatar', avatar.single('avatar'), (req, res) => {
    res.send();
})


module.exports = router;