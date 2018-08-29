const {ObjectID} = require('mongodb');
const {Todo} = require('../../server/models/todo');
const {User} = require('../../server/models/user');
const jwt = require('jsonwebtoken');
const userOneID = new ObjectID();
const userTwoID = new ObjectID();


//**********************************************************************************************************************
/**
 * Todos collection array for test
 * @type {*[]}
 */
const todos = [{
    _id: new ObjectID(),
    task: "For test",
    _creator: userOneID
},{
    _id: new ObjectID(),
    task: "For test 2",
    _creator: userTwoID
},{
    _id: new ObjectID(),
    task: "For test 3",
    completed: true,
    completedAt: 999281,
    _creator: userOneID
}];

/**
 * function to be called beforeEach test to actually insert this seed data in test db
 * @param done
 */
const populateTodos = function (done) {
    Todo.deleteMany({}).then(() => {
        //call return to chain then()
        return Todo.insertMany(todos);
    }).then(() => done());
};
//**********************************************************************************************************************

/**
 * We create seed user data here for testing. One with jwt token and other without
 * @type [users]
 * @type {ObjectID}
 */
const users = [{
        _id: userOneID,
    password: 'userOnePass',
    email: "userOne@gmail.com",
    tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    id: userTwoID,
    password: 'userTwoPass',
    email: "userTwo@gmail.com",
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, 'abc123').toString()
    }]
}];


/**
 * Here we write the method to save user one after other as our password bcrypt (hash) mongoose middleware
 * expects 'save' command to run properly
 * @param done
 */
const populateUsers = function (done) {
    User.remove({}).then(() => {
        //here insertMany will not run the mongoose middleware which expects 'save'
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        /**
         * Over here we are using promise utility method to run multiple promises as save() returns promise
         * after than we return this final promise and chain then() call back on it
         */
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

//**********************************************************************************************************************

//exports for this module
module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
};