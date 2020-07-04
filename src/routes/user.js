const express = require('express');
const multer = require('multer');
const upload = multer({
  // dest: 'avatars', // save to fs
  limits: { fileSize: 1000000 },
  fileFilter(_req, file, callback) {
    const allowedtypes = ['image/jpeg', 'image/png']
    if (!allowedtypes.includes(file.mimetype)) {
      return callback(new Error('Please upload an image'));
    }

    callback(undefined, true);
  }
});
const auth = require('../middleware/auth');
const router = new express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.create);
// router.patch('/users/:id', auth, userController.update);
router.patch('/users/me', auth, userController.update);
// router.get('/users', userController.index);
router.get('/users/me', auth, userController.show);
// router.get('/users/:id', userController.show);
router.delete('/users/me', auth, userController.destroy);
// router.delete('/users/:id', auth, userController.destroy);
router.post('/users/sign_in', userController.signIn);
router.post('/users/sign_out', auth, userController.signOut);
router.post('/users/sign_out_all', auth, userController.signOutAll);

router.post('/users/me/avatar', auth, upload.single('avatar'), userController.uploadProfilePic,
(error, _req, res, _next) => {
  res.status(400).send({ error: error.message });
});
router.delete('/users/me/avatar', auth, userController.removeProfilePic);
router.get('/users/:id/avatar', userController.showProfilePic);

module.exports = router;
