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

    //find() returns a mongodb cursor
    /**
     * To fetch data from object id we can use ObjectId.createFromHexString function or pass in the object id as
     * constructor parameter like here
     */
    // db.collection("Todos").find({_id: new ObjectID("5b8034fdad96ca4e5ce7a3e5")}).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    //
    // }, (err) => {
    //     console.log("Unabel to fetch documents");
    // });

    // db.collection("Todos").find().count().then((count) => {
    //     console.log("Todos");
    //     console.log(`Todos count: ${count}`);
    // });

    db.collection("Users").find({name: "Andrew", location: "Kolkata"}).count().then( (count) => {
        console.log("Todos");
        console.log(`Todos count: ${count}`);
    });

    // client.close().then(() => {
    //     console.log(`Close db connection => Successful`);
    // }).catch((reject) => {
    //     console.log(reject);
    // });
});