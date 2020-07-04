const User = require('../models/user');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCalcelationEmail } = require('../emails/account');

const create = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
}

const update = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(attr => allowedUpdate.includes(attr));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    for (const attr of updates) req.user[attr] = req.body[attr];
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
}

const show = async (req, res) => {
  res.send(req.user);
}

const destroy = async (req, res) => {
  try {
    await req.user.remove();
    sendCalcelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
}

const signIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
}

const signOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(doc => doc.token !== req.token);
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
}

const signOutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
}

const uploadProfilePic = async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({
    width: 250, height: 250,
  }).png().toBuffer();

  // req.user.avatar = req.file.buffer;
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}

const removeProfilePic = async (req, res) => {
  req.user.avatar = undefined;
  try {
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
}

const showProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error);
  }
}

module.exports = {
  create, update, show, destroy,
  signIn, signOut, signOutAll,
  uploadProfilePic, removeProfilePic,
  showProfilePic,
}

// const index = async (_req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     res.status(500).send();
//   }
// }

// const show = async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.status(404).send();

//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
// }

// const destroy = async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findByIdAndDelete(_id);
//     if (!user) return res.status(404).send();

//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
// }


// const update = async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdate = ['name', 'email', 'password', 'age'];
//   const isValidOperation = updates.every(attr => allowedUpdate.includes(attr));

//   if (!isValidOperation) {
//     return res.status(400).send({ error: 'Invalid updates!' });
//   }

//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     for (const attr of updates) user[attr] = req.body[attr];
//     await user.save();
//     // const user = await User.findByIdAndUpdate(_id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });
//     if (!user) return res.status(404).send();

//     res.send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// }
