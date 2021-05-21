import axios from 'axios';
import express from 'express';

import authMiddleware from '../../middleware/auth';

const movies = express.Router();
const defaultParams = {
  include_adult: false,
  language: 'pt-BR',
};

movies.get('/films/genres', authMiddleware, async (req, res) => {
  try {
    const url = `${process.env.API_URL_MOVIEDB}genre/movie/list`;
    const { genres } = (await axios.get(url, { params: defaultParams })).data;

    genres.sort((a, b) => {
      const x = a.name.toUpperCase();
      const y = b.name.toUpperCase();

      return x === y ? 0 : x > y ? 1 : -1;
    });

    return res.json({ genres, status: 'Sucesso' });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao receber as pessoas.' });
  }
});

export default movies;
