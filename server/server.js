const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000, () => {
  console.log('Started on port 3000');
});
