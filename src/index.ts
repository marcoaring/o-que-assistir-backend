import axios from 'axios';
import dotenv from 'dotenv-safe';
import express from 'express';

import settings from './controllers/settings';
import auth from './controllers/auth';

dotenv.config();

axios.defaults.headers.common.Authorization = `Bearer ${process.env.AUTHORIZATION_MOVIEDB}`;

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use('/api', [auth, settings]);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
