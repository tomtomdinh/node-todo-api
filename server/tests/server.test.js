const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

// makes database empty before every test
beforeEach((done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=> {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err) {
          // stops function execution
          return done(err);
        }

        // fetches everything in the collection
        // however database is wiped everytime so only one in there
        // by adding text property, it will only find that text and return that
        // single collection
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
      });
  });

  it('should not create a todo with invalid body data', (done)=> {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=> {
        if(err) {
          return done(err);
        }
        // will return 2 because it will add two todos from the todos array
        Todo.find().then((todos)=> {
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });
});

describe('GET /todos', ()=> {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
        // figure how to iterate through array and check if text matches
      })
      .end(done);
  });
});
