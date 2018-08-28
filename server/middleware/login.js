const _ = require('lodash');
const bcrypt = require('bcryptjs');
let {User} = require('./../models/user');


let login = function (req, res, next) {

    //step1 get email and password from body
    let body = _.pick(req.body, ['email', 'password']);

    //step2 find the user of this email if it exists
    User.findOne({'email': body.email}).then((user) => {
        //Step3 If user exists then check the password in body is same as hashed password or reject()
        if (!user) {
            return Promise.reject();
        }
        bcrypt.compare(body.password, user.password, (err, match) => {
            if(!match) {
                return res.status(401).send("Either email or password is incorrect!");
            }

            //sets body as response and moves on to actual route for execution
            res.body = user;
            next();
        });


    }).catch((e) => {
        return res.status(401).send("Either email or password is incorrect!");
    });
};

module.exports = {
    login
};