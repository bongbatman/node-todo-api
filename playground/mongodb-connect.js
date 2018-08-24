// const MongoClient = require('mongodb').MongoClient;

/**
 * just like import * from something;
 * called object destructing in js
 */
const {MongoClient, ObjectID} = require('mongodb');
const assert = require('assert');

// let obj = new ObjectID();
// console.log(`Object id: ${obj}`);

//Url strings for mongodb
const protocol = "mongodb:";
const hostname = "localhost";
const port = "27017";
const dbName = "TodoApp";


/**
 * There is no need to create a TodoApp db before connecting also mongodb will not create it automatically
 * unless we create a collection it to do although it will open the connection
 */
MongoClient.connect(`${protocol}//${hostname}:${port}`, { useNewUrlParser: true } , (err, client) => {

    if (err) {
        return console.log(`Cannot connect to db: ${err.message}`);
    }

    console.log("connected to mongodb server");

    let db = client.db(dbName);

    db.collection("Todos").insertOne({
        task: "Learn node",
        completed: false
    }, (err, r) => {

        //a brief test at runtime to check what we expected happened
        // assert.strictEqual(err, null );
        // assert.strictEqual(r.insertedCount, 1);

        if (err) {
            return console.log("Unable to write to db ", err);
        }

        /**
         * mongodb provides default object id with embedded time stamp and we can pull that out for any document just like this
         */
        console.log(JSON.stringify(r.ops[0]._id.getTimestamp(), undefined, 2));


    });

    // db.collection("Users").insertOne({
    //     name: "Nishant",
    //     age: 26,
    //     location: "Kanpur"
    // }, (err, r) => {
    //     if (err) {
    //         return console.log("Could not write to db ", err);
    //     }
    //
    //     console.log(JSON.stringify(r.ops, undefined, 2));
    //
    // });

    client.close().then(() => {
        console.log(`Close db connection => Successful`);
    }).catch((reject) => {
        console.log(reject);
    });
});