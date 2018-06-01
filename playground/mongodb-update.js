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

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b1082ebce7fedce08704f05')
  // }, {
  //   $set: {
  //     completed: false
  //   }
  // }, {
  //   returnOrginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b112ff2ce7fedce08707b11')
  }, {
    $set: {
      name: 'Tom'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOrginal: false
  }).then((result) => {
    console.log(result);
  });
  // client.close();
});
