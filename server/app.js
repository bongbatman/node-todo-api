//library imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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
        task: req.body.task,
        completed: req.body.completed
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e.message);
    });
});

//all todos
app.get('/todos', (req, res) => {
    Todo.find({}).then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e.message);
    })
});


//todo by id passing id as url parameter
app.get('/todos/:id', (req, res) => {
   //req.params is an object containing url parameters
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        res.status(404).send("ID not valid");
    }else{
    // res.send(req.params.id);
        Todo.findById(id).then((todo) => {
            if (todo === null) {
                //return is important or else the code will continue
                return res.status(404).send()
            }
            res.send(todo);

        }).catch((e) => {
            res.status(404).send();
        });


    }

});

app.listen(3000, () => {
    console.log("started on port 3000");
});

module.exports = {
  app
};
