const request = require('supertest');
const assert = require('assert');

const {app} = require('../server/app');
const {Todo} = require('../server/models/todo');


//before any test
beforeEach((done) => {
   Todo.deleteMany({}).then(() => {
        done();
   });

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
                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));

            });
    });


});