const mongoose = require("mongoose");
const validator = require("validator");

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("Connecion successfull!");
  } catch (error) {
    console.error("Error: ", error);
  }
};

main();