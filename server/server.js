
// change directory to C:\Program Files\MongoDB\Server\3.6\bin
// cmd command to start database server mongod.exe --dbpath /Users/Tom/mongo-data

// manages local environments
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
app.post('/todos', authenticate,(req,res)=> {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
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

app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos)=>{
    // better to wrap this in an object, makes it easier to add on more attributes
    // ex: code : 'blahblabh'
    res.send({todos});
  }, (e)=> {
    res.status(400).send(e);
  });
});

// creates id variable
app.get('/todos/:id', authenticate, (req,res)=> {
  // req params gets the id
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=> {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  },(e)=> {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, async (req,res) => {

  try {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    });

    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  } catch (e) {
    res.status(400).send();
  }

  // Todo.findOneAndRemove({
  //   _id: id,
  //   _creator: req.user._id
  // }).then((todo)=> {
  //   if(!todo) {
  //     return res.status(404).send();
  //   }
  //
  //   res.send({todo});
  // }).catch((e)=>res.status(400).send());

});

app.patch('/todos/:id', authenticate, (req,res) => {
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

  Todo.findOneAndUpdate( {
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e)=> {
    res.status(400).send();
  })

});

// POST /users
app.post('/users',async (req,res)=> {
  try {
    // gets the email and password from the post request
    const body = _.pick(req.body, 'email', 'password');
    // sets the email and password within this user
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    // putting x before an access creates a custom header
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
//   user.save().then(() => {
//     return user.generateAuthToken();
//   })
//   .then((token)=> {
//
//   })
//   .catch((e) => res.status(400).send(e));
});

app.get('/users/me', authenticate, (req,res)=>{
  res.send(req.user);
});

app.post('/users/login', async (req,res) => {
  try {
    const body = _.pick(req.body, 'email', 'password');
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }

  // User.findByCredentials(body.email, body.password).then((user) => {
  //   return user.generateAuthToken().then((token)=> {
  //     res.header('x-auth', token).send(user);
  //   });
  // }).catch((e) => {
  //   res.status(400).send();
  // });

});

app.delete('/users/me/token', authenticate, async (req,res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
  // req.user.removeToken(req.token).then(()=> {
  //     res.status(200).send();
  // }, ()=> {
  //   res.status(400).send();
  // });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
