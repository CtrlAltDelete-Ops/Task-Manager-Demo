const request = require('supertest');
const Task = require('../src/models/task');
const app = require("../src/app");
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db.js');
const mongoose =require('mongoose');

beforeEach(setUpDatabase);

afterAll(async () => {
    await mongoose.connection.close();
});

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ description: 'This is a test task' })
        .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task.description).not.toBeNull();
    expect(task.completed).toEqual(false);
})