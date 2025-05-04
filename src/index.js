const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
})


app.listen(port, () => {
    console.log('App running on port 3000');
})