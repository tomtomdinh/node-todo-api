const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo.js');
const {User} = require('./../server/model/user.js')

// Todo.remove({}).then((result)=> {
//   console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIDAndRemove

Todo.findOneAndRemove({_id : '5b1388d25b32ddeaf3a30ef4'}).then((todo)=>{

});

Todo.findByIdAndRemove('5b1388d25b32ddeaf3a30ef4').then((todo)=> {
  console.log(todo);
});
