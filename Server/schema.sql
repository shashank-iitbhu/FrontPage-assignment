CREATE DATABASE IF NOT EXISTS hacker_news;

USE hacker_news;

CREATE TABLE IF NOT EXISTS stories (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_id (id)
);
