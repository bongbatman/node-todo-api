const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const validator = require('validator');
let Schema = mongoose.Schema;

//recommended way to setup schema
let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

/**
 * Overrides the toJSON method to send trimmed version of document
 * @returns {PartialDeep<any>}
 */
userSchema.methods.toJSON = function () {
        let user = this;
        let userObj = user.toObject();

        return _.pick(userObj, ['_id', 'email']);
};


/**
 * The way to create modal methods to extend functionality. This returns a promise so that we can chain then callback.
 * @returns {Promise<string> | Promise | * | PromiseLike<string | never> | Promise<string | never>}
 */
userSchema.methods.generateAuthToken = function ( ) { //instace method on userSchema with regular function to use this keyword
        let user = this;
        let access = 'auth';
        let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

        user.tokens = user.tokens.concat([{access, token}]);

        return user.save().then(() => {
            return token;
        });
};


const User = mongoose.model("Users", userSchema);

module.exports = {User};