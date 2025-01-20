import 'dotenv/config';
import express from 'express';
import { connectWithRetry } from './config/db.js';
import { scrapeNewestStories } from './scraper/scrape.js';

const app = express();
const SCRAPE_INTERVAL = 5 * 60 * 1000; // Scrape every 5 minutes
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('Starting the application...');

  await new Promise((resolve) => connectWithRetry(resolve));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    console.log('Starting initial scrape...');
    scrapeNewestStories();

    // Periodic scraping every 5 minutes
    setInterval(() => {
      console.log('Starting periodic scrape...');
      scrapeNewestStories();
    }, SCRAPE_INTERVAL);
  });
};

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

startServer();
