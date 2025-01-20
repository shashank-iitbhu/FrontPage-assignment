import { pool } from "../config/db.js";
import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeNewestStories = async () => {
  const url = "https://news.ycombinator.com/newest";
  const stories = [];

  try {
    console.log("Scraping started...");
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $(".athing").each((index, element) => {
      const id = parseInt($(element).attr("id"), 10);
      const title = $(element).find(".titleline > a").text();
      const link = $(element).find(".titleline > a").attr("href");

      if (id && title) {
        stories.push({ id, title, link: link || null });
      }
    });

    console.log(`Scraped ${stories.length} stories`);

    if (stories.length === 0) {
      console.warn("No stories found. Check the website structure.");
      return [];
    }

    // Save stories to the database
    const sql = `
      INSERT INTO stories (id, title, link)
      VALUES ?
      ON DUPLICATE KEY UPDATE title = VALUES(title), link = VALUES(link), created_at = CURRENT_TIMESTAMP
    `;
    const values = stories.map((story) => [story.id, story.title, story.link]);

    const [result] = await pool.query(sql, [values]);
    console.log(`Saved ${result.affectedRows} stories to the database.`);

    return stories;
  } catch (error) {
    console.error("Error scraping stories:", error.message);
    return [];
  }
};
