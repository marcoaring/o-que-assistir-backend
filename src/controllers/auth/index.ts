import express from 'express';

import { IUser } from '../../interfaces/user.interface';
import UserModel from '../../models/user';

const auth = express.Router();

auth.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await UserModel.findOne({ email })) {
      return res.status(400).send({ error: 'User already exists' });
    }

    const user: IUser = await UserModel.create(req.body);

    delete user.password;

    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

export default auth;
