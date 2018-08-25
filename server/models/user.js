let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//recommended way to setup schema
let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
});

const User = mongoose.model("Users", userSchema);

module.exports = {User};