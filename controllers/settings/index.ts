import axios from 'axios';
import express from 'express';

const settings = express.Router();

settings.get('/settings', async (req, res) => {
  const url = `${process.env.API_URL_MOVIEDB}configuration`;
  const configurations = (await axios.get(url)).data;

  res.json({
    baseUrl: configurations.images.base_url,
    secureBaseUrl: configurations.images.secure_base_url,
  });
});

export default settings;
