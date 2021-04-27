import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

import settings from './controllers/settings';

dotenv.config({ path: './.env' });
axios.defaults.headers.common.Authorization = `Bearer ${process.env.AUTHORIZATION_MOVIEDB}`;

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use('/api', [settings]);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
