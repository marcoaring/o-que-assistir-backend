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

search.get('/search/movie', authMiddleware, async (req, res) => {
  try {
    const params = {
      sort_by: 'popularity.desc',
    };

    if (req.query.actors) {
      params.with_people = req.query.actors;
    }

    if (req.query.genres) {
      params.with_genres = req.query.genres;
    }

    if (req.query.year) {
      params.primary_release_year = req.query.year;
    }

    if (req.query.streamings) {
      params.with_watch_providers = req.query.streamings;
      params.watch_region = 'BR';
    }

    Object.assign(params, defaultParams);

    axios.get(`${process.env.API_URL_MOVIEDB}discover/movie`, { params }).then((response) => {
      const promises = response.data.results.map((movie) =>
        axios
          .get(`${process.env.API_URL_MOVIEDB}movie/${movie.id}/watch/providers`)
          .then((streamings) => {
            let streaming = {
              buy: [],
              flatrate: [],
              rent: [],
            };

            if (streamings.data.results.BR) {
              if (streamings.data.results.BR.buy) {
                streamings.data.results.BR.buy.map((streamingBuy) => {
                  streaming.buy.push({
                    id: streamingBuy.provider_id,
                    logo: `${
                      process.env.NODE_ENV === 'dev' ? 'http' : 'https'
                    }://image.tmdb.org/t/p/original${streamingBuy.logo_path}`,
                    name: streamingBuy.provider_name,
                  });
                });
              }

              if (streamings.data.results.BR.flatrate) {
                streamings.data.results.BR.flatrate.map((streamingFlatrate) => {
                  streaming.flatrate.push({
                    id: streamingFlatrate.provider_id,
                    logo: `${
                      process.env.NODE_ENV === 'dev' ? 'http' : 'https'
                    }://image.tmdb.org/t/p/original${streamingFlatrate.logo_path}`,
                    name: streamingFlatrate.provider_name,
                  });
                });
              }

              if (streamings.data.results.BR.rent) {
                streamings.data.results.BR.rent.map((streamingRent) => {
                  streaming.rent.push({
                    id: streamingRent.provider_id,
                    logo: `${
                      process.env.NODE_ENV === 'dev' ? 'http' : 'https'
                    }://image.tmdb.org/t/p/original${streamingRent.logo_path}`,
                    name: streamingRent.provider_name,
                  });
                });
              }

              if (
                streaming.buy.length === 0 &&
                streaming.flatrate.length === 0 &&
                streaming.rent.length === 0
              ) {
                streaming = null;
              }
            } else {
              streaming = null;
            }

            return {
              background: `${
                process.env.NODE_ENV === 'dev' ? 'http' : 'https'
              }://image.tmdb.org/t/p/original${movie.backdrop_path}`,
              description: movie.overview,
              genres: movie.genre_ids,
              id: movie.id,
              popularity: movie.popularity,
              poster: `${
                process.env.NODE_ENV === 'dev' ? 'http' : 'https'
              }://image.tmdb.org/t/p/original${movie.poster_path}`,
              release_date: movie.release_date,
              streamings: streaming,
              title: movie.title,
              vote: movie.vote_average,
            };
          })
      );

      return Promise.all(promises).then((movies) => res.json({ movies, status: 'Sucesso' }));
    });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao encontrar o filme.' });
  }
});

export default search;
