const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let jwtData = {
    id: 4
};

let jwtToken = jwt.sign(jwtData, '123abc');
console.log(`Signed data: ${jwtToken}`);

let decoded = jwt.verify(jwtToken, '123abc');
console.log("Decoded data: ", decoded);

// let msg = 'I am a hashed string';
// let hash = SHA256(msg).toString();

// console.log(`msg: ${msg},\n Hash: ${hash}`);

/**
 * Basic JWT -> jsonwebtoken skeleton to show what goes on in it and how it works
 * This example uses crypto-js library but wctual to use is jsonwebtoken lib
 * @type {{id: number}}
 */
//Basic JWT setup to show how it works
// let data = {
//   id: 3
// };
// let token = {   // equivalent to jwt.sign
//     obj: data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
//
// token.obj.id = 5;
// token.hash = SHA256(JSON.stringify(token.obj)).toString(); //changing data as the secret is only on server
//
// let resultHash = SHA256(JSON.stringify(token.obj) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//     console.log("Data was not changed"); // equivalent to jwt.verify
// } else {
//     console.log("Data was changed. Don't trust");
// }