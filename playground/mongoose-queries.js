const {ObjectID} = require('mongodb');

//local imports - accessing mongoose like this simply connects to db as well
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// let id = "5b81bb234f4b3c0554d96e3911";
// let id = "5b81bb234f4b3c0554d96e39";

let id = "5b80743dc8d5242f18c2bc34";

if(!ObjectID.isValid(id)) {
    console.log("ID not valid");
}


// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log("Todos", todos);
// });
//
// //finds first one that matches id
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log("Todo", todo);
// });

// Todo.findById(id).then((todo) => {
//     if (todo === null) {
//         return console.log("ID not found");
//     }
//     console.log("Todo By ID", todo);
// }).catch((e) => {
//    console.log(e.message);
// });

User.findById(id).then((user) => {
    if (user === null) {
        return console.log("Unable to find user");
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => {
   console.log(e.message);
});
