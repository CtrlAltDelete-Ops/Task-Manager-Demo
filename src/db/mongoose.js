const mongoose = require("mongoose");
const validator = require("validator");

const main = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");
    console.log("Connecion successfull!");
  } catch (error) {
    console.error("Error: ", error);
  }
};

main();

