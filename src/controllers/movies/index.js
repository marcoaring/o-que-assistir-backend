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

movies.get('/films/streamings', authMiddleware, async (req, res) => {
  try {
    const url = `${process.env.API_URL_MOVIEDB}watch/providers/movie`;
    defaultParams.watch_region = 'BR';
    const streamings = [];
    const { results } = (await axios.get(url, { params: defaultParams })).data;

    results.map((streaming) => {
      streamings.push({
        id: streaming.provider_id,
        logo: `${process.env.NODE_ENV === 'dev' ? 'http' : 'https'}://image.tmdb.org/t/p/original${
          streaming.logo_path
        }`,
        name: streaming.provider_name,
      });
    });

    streamings.sort((a, b) => {
      const x = a.name.toUpperCase();
      const y = b.name.toUpperCase();

      return x === y ? 0 : x > y ? 1 : -1;
    });

    return res.json({ streamings, status: 'Sucesso' });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao receber os stramings.' });
  }
});

export default movies;
