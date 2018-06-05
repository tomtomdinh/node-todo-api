const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// first parameter are rounds, the more rounds there are the longer the bcrypt algorithm is
// the longer it is the better it is, less susceptible to brute force attacks
// bcrypt.genSalt(10, (err,salt) => {
//   bcrypt.hash(password,salt,(err,hash)=> {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$v/4Ti7W18SNlwtGz8RdTj.2hiMWQGH6l7ng9AmiwixgSI8Mc5/ufG';

bcrypt.compare(password, hashedPassword, (err, res)=>{
  console.log(res);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message : ${message}`);
// console.log(`Hash : ${hash}`);
//
// var data = {
//   id: 4
// };
//
// // hash the string plus salt it so it is not the same hash everytime
// // user can manipulate the id but can never get the same salted hash
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
