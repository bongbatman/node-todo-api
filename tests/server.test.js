const request = require('supertest');
const assert = require('assert');
const {populateTodos, populateUsers, todos, users} = require("./seed/seed");
const {ObjectID} = require('mongodb');

const {app} = require('../server/app');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

//seed daa for GET /todos test


//before any test
beforeEach((done) => {
  populateUsers(done);
  populateTodos(done);

});

describe('POST /todos', () => {
    it('should create a new todo', function (done) {
        let task = "test create Todo";
        request(app)
            .post('/todos')
            .send({task})
            .expect(200)
            .expect((res) => {
                expect(res.body.task).toBe(task);

                //it will return body if express app returns body as response
                // console.log(res.body.task);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({task}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].task).toBe(task);
                    done();
                }).catch((e) => done(e));

            });
    });

    //beforeEach will run even after this case, so the todos will be 0 in this case
    it('should not create todo with bad data', function (done) {
        let task = " ";
        request(app)
            .post('/todos')
            .send({task})
            .expect(400)
            .expect((res) => {
                assert.strictEqual("Todo validation failed: task: Path `task` is required.", res.text);
                console.log(res.text);
                //it will return body if express app returns body as response
                // console.log(res.body.task);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));

            });
    });


});


describe("GET /todos", () => {
    it('should get all todos', function (done) {
        request(app)
            .get("/todos")
            .send(todos)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                console.log(JSON.stringify(res.body, undefined, 2));
                done();
            })
    });

});

describe("GET /todos/:id", () => {
    it('should get todo with id', function (done) {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) // passed id is object so we need to change ti to hec string
            .expect(200)
            .expect((res) => {
                expect(res.body.task).toBe(todos[0].task); // change object id to hex string
                // console.log(res.body);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                console.log(JSON.stringify(res.body, undefined, 2));
                done();
            })
    });

    it('should return 404 if todo not found', function (done) {
        let id = new ObjectID();

        request(app)
            .get(`/todos/${id.toHexString()}`) // passed id is object so we need to change ti to hec string
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID', function (done) {

        request(app)
            .get("/todos/123abc") // passed id is object so we need to change ti to hec string
            .expect(404)
            .end(done);
    });

});


describe('DELETE /todos/:id', () => {
    it('should delete todo with id', function (done) {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(todos[0]._id.toHexString());
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id.toHexString()).then((todo) => {


                    expect(todo).toStrictEqual(null);
                    done();

                }).catch((e) => {
                    console.log(e);
                });



            })


    });

    it('should return 404 if todo not found', function (done) {
        let id = new ObjectID();

        request(app)
            .delete(`/todos/${id.toHexString()}`) // passed id is object so we need to change ti to hec string
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID', function (done) {

        request(app)
            .delete("/todos/123abc") // passed id is object so we need to change ti to hec string
            .expect(404)
            .end(done);
    });
});


describe('PATCH /todos/:id', () => {



    it('should update the todo', function (done) {
        //grab id of first item
        //set completed to true and update completedAt
        //200
        //res.body.task is changed, completed is true and completed at is number .toBeA


        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                task: "Updated Patch route task", //sends the data to route as body
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.task).toBe("Updated Patch route task");
                expect(res.body.completed).toBe(true);
                expect(typeof res.body.completedAt).toBe(typeof 1);
            })
            .end(done);
        
    });

    it('should clear completedAt when todo is not completed', function (done) {
        request(app)
            .patch(`/todos/${todos[2]._id.toHexString()}`)
            .send({
                task: "Updated Patch route previously completed task", //sends the data to route as body
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.task).toBe("Updated Patch route previously completed task");
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toBe(null);
            })
            .end(done);
    });

    describe('GET /users/me', () => {

        it('should return a user if authenticated', function (done) {
            request(app)
                .get('/users/me')
                .set({"x-auth" : users[0].tokens[0].token})
                .expect(200)
                .expect((res) => {

                    //as we only send _id and email so we are checking just that
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });

        it('should return a 401 if not authenticated', function (done) {

            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    //as the response is empty object. We can use deepStrictEqual to match two objects
                    assert.deepStrictEqual(res, {});
                })
                .end(done);
        });


    });


    describe('POST /users', () => {

        it('should signup new user', function (done) {

            let newUser = {
              email: "newUser@example.com",
              password: "newUserPass"
            };

            request(app)
                .post('/users')
                .send(newUser)
                .expect(200)
                .expect((res) => {
                    assert.deepStrictEqual(res.body.email, newUser.email);
                })
                .end((err, res) => {
                    if (err){
                        return done();
                    }

                    /**
                     * As header name has "-" hyphen in it so we need to use the bracket notation instead of  '.' dot notation
                     */
                    User.findByToken(res.header['x-auth']).then((user) => {
                        expect(res.body._id).toBe(user._id.toHexString());
                        done();

                    });

                });

        });

        it('should return validation error when request invalid', function (done) {

            let newUser = {
                email: "newUserexample.com",
                password: "new"
            };
            request(app)
                .post('/users')
                .send(newUser)
                .expect(400)
                .end(done);

        });

        it('should not create user if email in use', function (done) {

            request(app)
                .post('/users')
                .send(users[0])
                .expect(400)
                .end(done)

        });

    });





});