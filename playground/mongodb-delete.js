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

    //deleteMany
    // db.collection("Todos").deleteMany({task: "Eat lunch"}).then((result) => {
    //    console.log(result.result);
    // });

    //deleteOne
    // db.collection("Todos").deleteOne({task: "Eat lunch"}).then((result) => {
    //     console.log(result.result);
    // });

    //findOneAndDelete - returns the object as well
    // db.collection("Todos").findOneAndDelete({completed: false}).then((doc) => {
    //     console.log(doc);
    // });

    // db.collection("Users").deleteMany({name: "Andrew", location: "Kanpur"}).then((result) => {
    //     console.log("Deleted Many");
    //     console.log(result.result);
    // });
    //
    // db.collection("Users").findOneAndDelete({location: "Kolkata"}).then((doc) => {
    //     console.log("Found one specified and deleted");
    //     console.log(doc);
    // });

    db.collection("Users").findOneAndDelete({_id: ObjectID.createFromHexString("5b8031122ab80c22a0af26a7")})
        .then((doc) => {
            console.log("Found one specified and deleted");
            console.log(doc);
        });



    // client.close().then(() => {
    //     console.log(`Close db connection => Successful`);
    // }).catch((reject) => {
    //     console.log(reject);
    // });
});