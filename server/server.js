// cmd command to start server mongod.exe --dbpath /Users/Tom/mongo-data
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./model/todo.js');
const {User} = require('./model/user.js');

var app = express();

// middleware that returns a function
app.use(bodyParser.json());

// standard for resource creation
app.post('/todos',(req,res)=> {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    // sends the doc back to the server
    res.send(doc);
  }, (e) => {
    // sends error if doesnt work
    // 400 status means bad request
    res.status(400).send(e);
  });
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos)=>{
    // better to wrap this in an object, makes it easier to add on more attributes
    // ex: code : 'blahblabh'
    res.send({todos});
  }, (e)=> {
    res.status(400).send(e);
  });
});

// creates id variable
app.get('/todos/:id', (req,res)=> {
  // req params gets the id
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=> {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  },(e)=> {
    res.status(400).send();
  })
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
