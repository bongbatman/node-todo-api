const mongoose = require('mongoose');

//Url strings for mongodb
const protocol = "mongodb:";
const hostname = "localhost";
const port = "27017";
const dbName = "TodoApp";

//telling mongoose to use built in promise
mongoose.Promise = global.Promise;

//actual connection to db server
mongoose.connect(`${protocol}//${hostname}:${port}/${dbName}`, { useNewUrlParser: true}).then((res) => {
    console.log("Connection to db successful  ");
});



module.exports = {
  mongoose
};