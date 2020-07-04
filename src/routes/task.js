const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', auth, taskController.create);
router.patch('/tasks/:id', auth, taskController.update);
router.get('/tasks', auth, taskController.index);
router.get('/tasks/:id', auth, taskController.show);
router.delete('/tasks/:id', auth, taskController.destroy);

module.exports = router;
