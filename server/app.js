//library imports
const express = require('express');
const bodyParser = require('body-parser');

//local imports - accessing mongoose like this simply connects to db as well
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let app = express();



//middleware - to store body as json by bodyParser
app.use(bodyParser.json());


//to add a task, send back response is post is successful
app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        task: req.body.task
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e.message);
    });
});


app.get('/todos', (req, res) => {

});


app.listen(3000, () => {
    console.log("started on port 3000");
});

module.exports = {
  app
};