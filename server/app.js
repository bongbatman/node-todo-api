//no need of any exports as its a relative file too generic

require('./config/config');
//library imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {login} = require("./middleware/login");

//local imports - accessing mongoose like this simply connects to db as well
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {authenticate} = require("./middleware/authenticate");

let app = express();

const port = process.env.PORT;



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

app.post('/users', (req, res) => {
    console.log(req.body);
    let body = _.pick(req.body, ['email', 'password']);

    let user = new User(body);

    /**
     * Signup instance method in play with custom headers in play
     */
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header({'x-auth': token, 'x-Powered-By' : 'Friendly Devs'}).send(user);
    }).catch((e) => {
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
        return res.status(404).send("ID not valid");
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

//delete todo by id passing id as url parameter
app.delete('/todos/:id', (req, res) => {
    //req.params is an object containing url parameters
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid");
    }else{
        // res.send(req.params.id);
        Todo.findByIdAndRemove(id).then((todo) => {
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

//best practices for api development
app.patch('/todos/:id', (req, res) => {
    //req.params is an object containing url parameters
    let id = req.params.id;

    //use lodash here to specify the properties user will be able to update by creating a new subset
    let body = _.pick(req.body, ['task', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid");
    }

    if ((_.isBoolean(body.completed)) && body.completed) {
        //set the property completedAt of body
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

   Todo.findByIdAndUpdate(id, {
       $set: body
   }, {
       //returns new updated object can also be used as returnOriginal: flase
       new: true
   }).then((doc) => {
        if (!doc) {
            return res.sendStatus(404);
        }

        res.send(doc);
   }).catch((e) => {
       res.status(404).send();
   });


});



/**
 * First private route, using middleware function defined above
 * and then extracted to new file
 */
app.get('/users/me', authenticate, (req,res) => {
    res.header({'x-Powered-By': 'Friendly Devs'}).send(req.user);

});

//POST /users/login private user login route
/**
 * Here we use a login middleware to first login the user and then pass on here to generate auth token
 * Same could be achieved by creating a model function getUserByCredentials and passing in email password and
 * returning a promise when its done. Finally generating the auth token
 */
app.post('/users/login', login, (req, res) => {

    let user = new User(res.body);
    user.generateAuthToken().then((token) => {
         res.header({'x-auth': token, 'x-Powered-By' : 'Friendly Devs'}).send(res.body);
    }).catch((e) => {
        res.sendStatus(400);
    });


});


app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {
  app
};
