const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db.js');

jest.mock('@sendgrid/mail');

beforeEach(setUpDatabase);

afterAll(async () => {
    await mongoose.connection.close();
});

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "IsmailMo",
            email: "ismail@example.com",
            password: "amin12345",
        })
        .expect(201);

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: "IsmailMo",
            email: "ismail@example.com",
        },
        token: user.tokens[0].token,
    });
});

test("should login existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login non-existent user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "hello@example.com",
            password: "hello12345",
        })
        .expect(400);
});

test("should get user profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("should not get profile for unauthenticated user", async () => {
    await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for authenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull;
});

test("Should not delete account for unauthenticated user", async () => {
    await request(app).delete("/users/me").send().expect(401);
});

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/linkedin.png')
        .expect(200)

    const user = await User.findById(userOneId);
    console.log(typeof user.avatar)
    expect(user.avatar).toEqual(expect.any(Buffer));
})

test('should update valid user field', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ "name": "Ismail Amin Mohamed" })
        .expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toBe(response.body.name);
})

test('Should not update invalid user fields', async () => {
    const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ location : "Mogadishu"})
    .expect(400)
})