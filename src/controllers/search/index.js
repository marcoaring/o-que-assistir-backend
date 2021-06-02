import axios from 'axios';
import express from 'express';

import authMiddleware from '../../middleware/auth';

const search = express.Router();
const defaultParams = {
  include_adult: false,
  language: 'pt-BR',
};

search.get('/search/actor', authMiddleware, async (req, res) => {
  try {
    if (req.query.actor.length < 3) {
      return res
        .status(400)
        .send({ error: 'Mínimo de três caracteres necessários para fazer a consulta.' });
    }

    defaultParams.query = req.query.actor;

    const url = `${process.env.API_URL_MOVIEDB}search/person`;
    const actors = [];
    const result = (await axios.get(url, { params: defaultParams })).data.results;

    result.map((person) => {
      if (person.profile_path) {
        actors.push({
          id: person.id,
          image: `${
            process.env.NODE_ENV === 'dev' ? 'http' : 'https'
          }://image.tmdb.org/t/p/original${person.profile_path}`,
          name: person.name,
          popularity: person.popularity,
        });
      }
    });

    actors.sort((person, personCompare) => {
      if (person.popularity < personCompare.popularity) return 1;
      if (person.popularity > personCompare.popularity) return -1;
      return 0;
    });

    return res.json({ actors, status: 'Sucesso' });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao receber as pessoas.' });
  }
});

export default search;
