import express from 'express';

import { generetaToken } from '../../services/utils';
import UserModel from '../../models/user';

const users = express.Router();

users.post('/usuario/cadastro', async (req, res) => {
  const { email } = req.body;

  try {
    if (await UserModel.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já existente.' });
    }

    const user = await UserModel.create(req.body);

    delete user.password;

    return res.send({ user, token: generetaToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: 'Ocorreu um erro no cadastro.' });
  }
});

export default users;
