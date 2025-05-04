const express = require('express');
const Task = require('../models/task');
const router = new express.Router;
const auth = require('../middlewere/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    
    try {
       await task.save();
       console.log('Task saved successfully');
       res.status(201).send(task);
    } catch (e) {
        res.status(500).send("Server error!")
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
// GET /tasks?sortBy=createdAt:asc   
router.get('/tasks', auth, async(req, res) => {
    let match = {};
    const sort ={};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    await req.user.populate({ 
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    });
    res.send(req.user.tasks);
    console.log("All tasks query was successful");
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
        console.log("Task query successful");
    } catch (e) {
        console.log('Error: ', e);
        res.status(400).send('Server Error!');
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        res.status(404).send({ error: 'The field/fields you are trying to update is/are invalid!'})
        return console.log("invalid field patch request");
    }
    
    try {
        console.log('debugger');
        const task = await Task.find({ _id, owner: req.user._id });
        if (!task) {
            console.log('error: task id invalid!')
            return res.status(400).send({ error: "the task you are looking for doesn't exist" })
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
        console.log('Task updated successfully');
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).send({ error: 'Server error' });
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
        res.status(404).send({ Error: "no task with such id" });
        return console.log("no task with such id");
    }
    try {
        res.send({ message: "task deleted successfully" });
        console.log("task deleted successfully" );
    } catch (error) {
        res.status(500).send({ error: "server error" });
    }
})

module.exports = router;