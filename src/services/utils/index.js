import jwt from 'jsonwebtoken';

export const generetaToken = (params = {}) =>
  jwt.sign(params, process.env.AUTHENTICATE_HASH, { expiresIn: 86400 });
