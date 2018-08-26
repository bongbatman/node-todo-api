//configure db according to environment
let env = process.env.NODE_ENV || 'development';
console.log('env *********', env);


//Url strings for mongodb
const protocol = "mongodb:";
const hostname = "localhost";
const dbPort = "27017";
const dbName = "TodoApp";
const testdbName = "TodoAppTests";

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.PROD_MONGODB = `${protocol}//${hostname}:${dbPort}/${dbName}`;
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.PROD_MONGODB = `${protocol}//${hostname}:${dbPort}/${testdbName}`;
}