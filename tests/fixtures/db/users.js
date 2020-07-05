const User = require('../../../src/models/user');

const userOne = {
  name: 'User One',
  email: 'userone@email.com',
  password: 'qwerasdf',
}

const createUser = async (userAttr = undefined) => {
  return await new User(userAttr || userOne).save();
}

const createAuthenticatedUser = async (userAttr = undefined) => {
  const user = await createUser(userAttr || userOne);
  await user.generateAuthToken();
  return user;
}

module.exports = { createUser, createAuthenticatedUser }
