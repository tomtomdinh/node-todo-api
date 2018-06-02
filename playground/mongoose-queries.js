const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo.js');
const {User} = require('./../server/model/user.js')

// var id = '5b124bc6a0d3a321a029abb211';
//
// if(!ObjectID.isValid(id)) {
//   console.log('id not valid');
// }

// mongoose auto makes it to objectid
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// // use this to find an individual object instead of an array
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e)=> console.log(e));

User.findById('5b1230d1d4f924040843ddd0').then((user) => {
  if(!user) {
    return console.log('Unable to find user');
  }
  console.log(JSON.stringify(user,undefined,2));
}, (e)=> {
  console.log(e);
})
