// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name: 'tom', age: 27};
//
// // object destructuring, takes out the value of the name property
// var {name} = user;

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true},
  (err,client) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // deletemany
  db.collection('Users').deleteMany({name: 'Tom'}).then((result) => {
    console.log(result);
  });

  // deleteone
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=> {
  //   console.log(result);
  // });
  // findoneandDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b1129f9ce7fedce0870791d')}).then((result) => {
    console.log(result);
  });


  // client.close();
});
