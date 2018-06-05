// cmd command to start server mongod.exe --dbpath /Users/Tom/mongo-data
require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');

const _= require('lodash');

const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./model/todo.js');
const {User} = require('./model/user.js');
const {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

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
  });
});

app.delete('/todos/:id', (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo)=> {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>res.status(400).send());

});

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e)=> {
    res.status(400).send();
  })

});

// POST /users
app.post('/users',(req,res)=> {
  // gets the email and password from the post request
  var body = _.pick(req.body, 'email', 'password');

  // sets the email and password within this user
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  })
  .then((token)=> {
    // putting x before an access creates a custom header
    res.header('x-auth', token).send(user);
  })
  .catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req,res)=>{
  res.send(req.user);
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
