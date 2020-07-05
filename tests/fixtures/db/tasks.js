const Task = require('../../../src/models/task');

const taskOne = { description: 'Task One' }

const createTask = async (user, taskAttr = undefined) => {
  return await new Task({
    ...(taskAttr || taskOne),
    owner: user._id,
  }).save();
}

module.exports = { createTask }
