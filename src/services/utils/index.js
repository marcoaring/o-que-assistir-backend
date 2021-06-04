import jwt from 'jsonwebtoken';

export const generetaToken = (params = {}) =>
  jwt.sign(params, process.env.AUTHENTICATE_HASH, { expiresIn: 86400 });

export const truncateString = (str, num = 150) => {
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...`;
};
