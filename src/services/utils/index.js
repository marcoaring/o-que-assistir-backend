import jwt from 'jsonwebtoken';

export const generetaToken = (params = {}) =>
  jwt.sign(params, process.env.AUTHENTICATE_HASH, { expiresIn: 86400 });

export const truncateString = (str, num = 150) => {
  if (str.length <= num) {
    return str;
  }
  return `${str.slice(0, num)}...`;
};

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
