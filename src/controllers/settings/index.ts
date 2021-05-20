import axios from 'axios';
import express from 'express';

import authMiddleware from '../../middleware/auth';

const settings = express.Router();

settings.use(authMiddleware);

settings.get('/settings', async (req, res) => {
  try {
    const url = `${process.env.API_URL_MOVIEDB}configuration`;
    const configurations = (await axios.get(url)).data;

    return res.json({
      baseUrl: configurations.images.base_url,
      secureBaseUrl: configurations.images.secure_base_url,
    });
  } catch (err) {
    return res.status(400).send({ error: 'Failed' });
  }
});

export default settings;
