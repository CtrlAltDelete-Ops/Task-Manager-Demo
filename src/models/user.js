const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: 8,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('The password cannot contain the word "password"!');
      }
    },
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'helloworldnow');
  
  user.tokens.push({token: token});
  await user.save();
  console.log('token saved')
  
  return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error("This user doesn't exist");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("The password is incorrect");
  }
  return user;
}

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password') || user.isNew) {
    console.log("isModified for password: ", user.isModified('password'));
    console.log("isModified for all fields: ", user.isModified());
    user.password = await bcrypt.hash(user.password, 8);
    console.log("password hashed successfully");
  }
  next();
})

userSchema.pre('deleteOne', { document: true }, async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id })
  next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
