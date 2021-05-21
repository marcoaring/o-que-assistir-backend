import axios from 'axios';
import express from 'express';

import auth from './controllers/auth';
import movies from './controllers/movies';
import search from './controllers/search';
import settings from './controllers/settings';
import users from './controllers/users';

axios.defaults.headers.common.Authorization = `Bearer ${process.env.AUTHORIZATION_MOVIEDB}`;

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/api', [auth, movies, search, settings, users]);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
