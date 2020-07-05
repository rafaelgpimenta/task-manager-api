const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user.js');
const taskRouter = require('./routes/task.js');

const app = express();

// app.use((_req, res, _next) => {
//   res.status(503).send("Sorry, we're down for maintenance");
// });

app.use(express.json());

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT
app.listen(port, () => {
  console.log('Running on port' + port);
});
