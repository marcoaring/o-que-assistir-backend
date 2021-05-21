import axios from 'axios';
import express from 'express';

import authMiddleware from '../../middleware/auth';

const search = express.Router();
const defaultParams = {
  include_adult: false,
  language: 'pt-BR',
};

search.get('/search/author', authMiddleware, async (req, res) => {
  try {
    if (req.query.author.length < 3) {
      return res
        .status(400)
        .send({ error: 'Mínimo de três caracteres necessários para fazer a consulta.' });
    }

    defaultParams.query = req.query.author;

    const url = `${process.env.API_URL_MOVIEDB}search/person`;
    const authors = [];
    const result = (await axios.get(url, { params: defaultParams })).data.results;

    result.map((person) => {
      if (person.profile_path) {
        authors.push({
          id: person.id,
          image: person.profile_path,
          name: person.name,
          popularity: person.popularity,
        });
      }
    });

    authors.sort((person, personCompare) => {
      if (person.popularity < personCompare.popularity) return 1;
      if (person.popularity > personCompare.popularity) return -1;
      return 0;
    });

    return res.json({ authors, status: 'Sucesso' });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao receber as pessoas.' });
  }
});

export default search;
