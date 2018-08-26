const mongoose = require('mongoose');

//telling mongoose to use built in promise
mongoose.Promise = global.Promise;

//actual connection to db server if we use mlab addon then we need to use MONGOLAB_URI otheriwse PROD_MONGODB
mongoose.connect(process.env.PROD_MONGODB, { useNewUrlParser: true}).then((res) => {
    console.log("Connection to db successful  ");
});
// mongoose.connect("mongodb://batman0071:i7bhaukal@ds125372.mlab.com:25372/billama-db", { useNewUrlParser: true}).then((res) => {
//     console.log("Connection to db successful  ");
// });


module.exports = {
  mongoose
};