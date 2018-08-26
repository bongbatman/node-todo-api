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

    //set the data to something new
   // db.collection("Todos").findOneAndUpdate({_id: ObjectID.createFromHexString("5b80625dad96ca4e5ce7a797")}, {
   //     $set: {
   //        completed: true
   //     }
   // }, {
   //     returnOriginal: false
   // }).then((res) => {
   //      console.log(res.value);
   // });

    //increment data by number specified
    db.collection("Users").findOneAndUpdate({_id: ObjectID.createFromHexString("5b8065cead96ca4e5ce7a823")}, {
        $inc: {
            age: 1
        },
        $set: {
            name: "Nishu Pishu"
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res.value);
    });





    // client.close().then(() => {
    //     console.log(`Close db connection => Successful`);
    // }).catch((reject) => {
    //     console.log(reject);
    // });
});