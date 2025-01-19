const axios = require('axios');
const cheerio = require('cheerio');
const express= require('express');

// Function to scrape a single page
async function scrapePage(pageNumber) {
  const url = pageNumber === 1 
    ? 'https://news.ycombinator.com/' 
    : `https://news.ycombinator.com/?p=${pageNumber}`;
    
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const stories = [];
    $('.athing').each((index, element) => {
      const title = $(element).find('.titleline > a').text();
      const link = $(element).find('.titleline > a').attr('href');
      const id = $(element).attr('id');
      
      stories.push({ id, title, link });
    });
    
    return stories;
  } catch (error) {
    console.error(`Error scraping page ${pageNumber}:`, error.message);
    return [];
  }
}

// Function to scrape multiple pages
async function scrapeMultiplePages(totalPages = 5) {
  let allStories = [];
  
  for (let page = 1; page <= totalPages; page++) {
    const stories = await scrapePage(page);
    console.log(`Scraped ${stories.length} stories from page ${page}`);
    allStories = allStories.concat(stories);
  }
  
  return allStories;
}

// Example usage
scrapeMultiplePages(3).then((stories) => {
  console.log(`Total stories scraped: ${stories.length}`);
  console.log(stories);
});
