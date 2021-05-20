import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../../models/user';

const auth = express.Router();

const generetaToken = (params = {}) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  jwt.sign(params, process.env.AUTHENTICATE_HASH, { expiresIn: 86400 });

auth.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await UserModel.findOne({ email })) {
      return res.status(400).send({ error: 'User already exists' });
    }

    const user = await UserModel.create(req.body);

    delete user.password;

    return res.send({ user, token: generetaToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

auth.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).send({ error: 'User not found' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: 'Invalid password' });
  }

  delete user.password;

  return res.send({ user, token: generetaToken({ id: user.id }) });
});

export default auth;
