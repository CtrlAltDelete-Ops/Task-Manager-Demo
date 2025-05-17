const express = require("express");
const User = require("../models/user");
const { findById } = require("../models/task");
const sharp = require("sharp");
const router = new express.Router();
const auth = require("../middlewere/auth");
const multer = require("multer");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
    console.log("User added successfully!");
    sendWelcomeEmail(user.email, user.name);
  } catch (e) {
    console.error("Error: ", e);
    res.status(400).send("Error!");
  }
});

router.post("/users/login", async (req, res) => {
  try {
    r = req.body;
    const user = await User.findByCredentials(r.email, r.password);
    if (!user) {
      return res
        .status(404)
        .send({ error: "user with email and password not found!" });
    }
    const token = await user.generateAuthToken();

    res.send({ user, token });
    console.log("login successfull");
  } catch (error) {
    res.status(400).send();
    console.log(error);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "logout successfull" });
    console.log("Logout successfull!");
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("loged out of all devices");
    console.log("logoutAll successfull!");
  } catch (error) {
    res.status(500).send("server error");
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users", async (req, res) => {
  const allUsers = await User.find({});
  res.send(allUsers);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "The field/fields you are trying to update is/are invalid!",
    });
  }
  const user = req.user;
  try {
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
    console.log("User updated successfully");
  } catch (e) {
    res.status(500).send("Server error!");
    console.log("Error: ", e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  const user = req.user;
  try {
    await user.deleteOne();
    res.send({ messgae: "user deleted successfully" });
    sendCancelationEmail(user.email, user.name);
  } catch (error) {
    res.status(500).send({ error: "server error" });
  }
});

const avatar = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error("filetype not supported"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  avatar.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send({ message: "avatar deleted successfully" });
});

router.get("/users/:id/avatar", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id).exec();
    if (!user || !user.avatar) {
      throw new Error("false user id");
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.send({ error });
  }
});

module.exports = router;
