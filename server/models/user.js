const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
 * The way to create instance methods to extend functionality. This returns a promise so that we can chain then callback.
 * @returns {Promise<string> | Promise | * | PromiseLike<string | never> | Promise<string | never>}
 */
userSchema.methods.generateAuthToken = function ( ) { //instace method on userSchema with regular function to use this keyword

    //instance methods get called with individual documents ***user***
    let user = this;
        let access = 'auth';
        let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

        user.tokens = user.tokens.concat([{access, token}]);

        return user.save().then(() => {
            return token;
        });
};

/**
 * Returns new promise this is the model function to find user by its token
 * @param token
 * @returns {*}
 */
userSchema.statics.findByToken = function (token) {
    //model methods get called with models ***User***
    let User = this;
    let decoded;

    try{
       decoded = jwt.verify(token, 'abc123');
    }catch (e) {

        /**
         * this can be simplified as
         * return Promise.reject();
         * or
         * return Promise.reject(e);
         * in second case e will pass on to catch block
         */
        return new Promise((resolve, reject) =>{
            reject();
        } );
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
/**
 * mongoose middleware to hash password before it is being saved
 */
userSchema.pre("save", function (next) {
       let user = this;
      if (user.isModified('password')) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash;
                    next();
                });
            });
      }else{
          next();
      }
});

const User = mongoose.model("Users", userSchema);

module.exports = {User};