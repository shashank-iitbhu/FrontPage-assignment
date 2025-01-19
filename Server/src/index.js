require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const { connectWithRetry } = require('./config/db');

const app = express();

const PORT = process.env.PORT || 5000;
// const test= process.env.MYSQL_HOST;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(`${test}`);
});

connectWithRetry();

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
