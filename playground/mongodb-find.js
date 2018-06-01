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

  // db.collection('Todos').find({_id: new ObjectID('5b1082ebce7fedce08704f05')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('unable to fetch todos', err);
  // });

  db.collection('Todos').find().count().then((count) => {
    console.log('Todos count: ', count);
  }, (err) => {
    console.log('unable to fetch todos', err);
  });



  // client.close();
});
