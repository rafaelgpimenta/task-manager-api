const request = require('supertest');
const app = require('../../src/app');
const { createAuthenticatedUser } = require('../fixtures/db/users');
const { createTask } = require('../fixtures/db/tasks');
const Task = require('../../src/models/task');

describe('Task creation', () => {
  let user;
  beforeEach(async () => {
    user = await createAuthenticatedUser();
  });

  test('Should create task for user', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ description: 'Task test' })
      .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
  });
});

describe('List tasks', () => {
  let user;
  beforeEach(async () => {
    const anotherUser = await createAuthenticatedUser({
      name: 'Another User',
      email: 'another@email.com',
      password: 'asdfqwer',
    });
    await createTask(anotherUser, { description: 'Not my task' });
    user = await createAuthenticatedUser();
    await createTask(user);
    await createTask(user, { description: 'Task Two' });
  });

  test('Should fetch user tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send({ description: 'Task test' })
      .expect(200);

    expect(response.body.length).toBe(2);
  });
});

describe('Delete tasks', () => {
  let user, anotherUser, task;
  beforeEach(async () => {
    anotherUser = await createAuthenticatedUser({
      name: 'Another User',
      email: 'another@email.com',
      password: 'asdfqwer',
    });
    createTask(anotherUser, { description: 'Not my task' });
    user = await createAuthenticatedUser();
    task = await createTask(user);
  });

  test('Should not delete other users task', async () => {
    const response = await request(app)
      .delete(`/tasks/${task._id}`)
      .set('Authorization', `Bearer ${anotherUser.tokens[0].token}`)
      .send()
      .expect(404);

    const checkTask = await Task.findById(task._id);
    expect(checkTask).not.toBeNull();
  });
});
