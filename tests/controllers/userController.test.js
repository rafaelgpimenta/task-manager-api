const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user');

// TODO: use factory
const userOne = {
  name: 'User One',
  email: 'userone@email.com',
  password: 'qwerasdf',
}

beforeEach(async () => await User.deleteMany());
afterEach(async () => await User.deleteMany());

describe('Sign up', () => {
  test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test',
      email: 'test@email.com',
      password: 'qwerasdf',
    }).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
      user:{
        name: 'Test',
        email: 'test@email.com',
      },
      token: user.tokens[0].token,
    });
    expect(user.password).not.toBe('qwerasdf');
  });
});

describe('Sign in', () => {
  beforeEach(async () => await new User(userOne).save());

  test('Should login existing user', async () => {
    const response = await request(app).post('/users/sign_in').send({
      email: userOne.email,
      password: userOne.password,
    }).expect(200);
    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[0].token);
  });

  test('Should not login nonexisting user', async () => {
    await request(app).post('/users/sign_in').send({
      email: 'nonexisting-user@email.com',
      password: 'qwerasdf',
    }).expect(400);
  });
});

describe('Read user profile', () => {
  let user;
  beforeEach(async () => {
    user = new User(userOne);
    await user.save();
    await user.generateAuthToken();
  });

  test('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('Should not get profile for unauthenticated user', async () => {
    await request(app)
      .get('/users/me')
      .send()
      .expect(401);
  });
});

describe('Delete user', () => {
  let user;
  beforeEach(async () => {
    user = new User(userOne);
    await user.save();
    await user.generateAuthToken();
  });

  test('Should delete authenticated user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${user.tokens[0].token}`)
      .send()
      .expect(200);
    const nullUser = await User.findById(user._id);
    expect(nullUser).toBeNull();
  });

  test('Should not delete unauthenticated user', async () => {
    await request(app)
      .delete('/users/me')
      .send()
      .expect(401);
  });
});
