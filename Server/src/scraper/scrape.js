import axios from 'axios';
import * as cheerio from 'cheerio';
import { pool } from '../config/db.js';

const scrapeNewestStories = async () => {
  const url = 'https://news.ycombinator.com/newest';

  try {
    console.log('Scraping started...');
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const stories = [];
    $('.athing').each((index, element) => {
      const id = parseInt($(element).attr('id'), 10);
      const title = $(element).find('.titleline > a').text();
      const link = $(element).find('.titleline > a').attr('href');

      if (id && title) {
        stories.push({ id, title, link: link || null });
      } else {
        console.warn('Incomplete story data:', { id, title, link });
      }
    });

    console.log(`Scraped ${stories.length} stories`);

    if (stories.length === 0) {
      console.warn('No stories found. Check the website structure.');
      return;
    }

    // Save stories to the database
    const sql = `
      INSERT INTO stories (id, title, link) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE title = VALUES(title), link = VALUES(link), created_at = CURRENT_TIMESTAMP
    `;
    const values = stories.map((story) => [story.id, story.title, story.link]);

    // Use the pool to execute the query
    const [result] = await pool.query(sql, [values]);
    console.log(`Saved ${result.affectedRows} stories to the database.`);
  } catch (error) {
    console.error('Error scraping stories:', error.message);
  }
};

export { scrapeNewestStories };
