const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.use((error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

module.exports = app;