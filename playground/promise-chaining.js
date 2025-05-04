require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('6807530671caf23bcbceec7e', {age: 18}).then((res) => {
    console.log(res);
    return User.countDocuments();
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log("Error: ", error);
})