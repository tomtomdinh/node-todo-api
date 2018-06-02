const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

// makes database empty before every test
beforeEach((done) => {
  Todo.remove({}).then(()=> {
    done();
  });
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
        Todo.find().then((todos) => {
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
        Todo.find().then((todos)=> {
          expect(todos.length).toBe(0);
          done();
        }).catch((e)=>done(e));
      });
  });
});
