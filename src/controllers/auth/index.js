import express from 'express';
import bcrypt from 'bcryptjs';

import { generetaToken } from '../../services/utils';
import UserModel from '../../models/user';

const auth = express.Router();

auth.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).send({ error: 'Usuário não encontrado.' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: 'Senha inválida.' });
  }

  delete user.password;

  return res.send({ user, token: generetaToken({ id: user.id }) });
});

export default auth;
