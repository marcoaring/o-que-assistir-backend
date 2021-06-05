import axios from 'axios';
import express from 'express';
import cors from 'cors';

import auth from './controllers/auth';
import movies from './controllers/movies';
import search from './controllers/search';
import users from './controllers/users';

axios.defaults.headers.common.Authorization = `Bearer ${process.env.AUTHORIZATION_MOVIEDB}`;

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api', [auth, movies, search, users]);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
