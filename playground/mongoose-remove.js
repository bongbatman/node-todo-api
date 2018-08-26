const {ObjectID} = require('mongodb');

//local imports - accessing mongoose like this simply connects to db as well
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// Todo.remove({}).then((result) => { //removes everything and only removes how many removed
//         console.log(result);
// });

// Todo.findOneAndRemove().then((result) => { //removes and returns the removed document
//
// });

// Todo.findByIdAndRemove("5b82586ead96ca4e5ce7bda8").then((todo) => { //removes and returns the removed document
//     console.log(todo);
// });