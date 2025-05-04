require('../src/db/mongoose');
const Task = require('../src/models/task');
const { countDocuments } = require('../src/models/user');

// Task.findByIdAndDelete('680b4cfb8c9d0be4cfd285f6').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ "completed": "false" });
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log("Error: ", e);
// })

const deleteTaskAndCount = async() => {
    const deletedTask = await Task.findByIdAndDelete('680b51c01e7596445fcbeacb');
    console.log(deletedTask);
    const falseTasks = await Task.countDocuments({ completed: false });
    console.log(falseTasks);
}

deleteTaskAndCount();