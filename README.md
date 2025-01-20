FrontPage Assignment - Hacker News Scraper
==========================================

This project scrapes the latest stories from Hacker News and broadcasts them in real-time using WebSockets. The application consists of two parts:

-   **Backend**: A Node.js server that scrapes data from Hacker News, stores it in a MySQL database, and broadcasts updates to connected clients.
-   **Frontend**: A React-based client that listens for WebSocket updates and displays the latest stories.

Features
--------

-   Scrape the latest stories from Hacker News every 5 minutes.
-   Store stories in a MySQL database.
-   Broadcast new stories in real-time to all connected clients via WebSockets every 5 minutes.
-   Frontend to display stories and updates in a user-friendly interface.

Prerequisites
-------------

Before you begin, ensure you have the following installed:

-   Docker
-   Docker Compose
-   Node.js
-   npm

### Set up environment variables

Create a `.env` file in the root directory by copying the content from the `.example.env` file.

Running the Project
-------------------

### 1\. Build and run the containers with Docker Compose

Run the following command in the root directory to build and start the containers:

`docker-compose up --build`

This will start:

-   A MySQL database container.
-   A backend Node.js container that scrapes data and serves WebSocket connections.

### 2\. Access the application

-   The backend API will be available at `http://localhost:5000`.
-   MySQL will be accessible at `http://localhost:3306` by default, or on the configured port.

### 3\. Verifying MySQL Database Creation

After starting the containers, check if the `hacker_news` database and tables are correctly set up.

-   Connect to MySQL via Docker:

`docker exec -it hacker-news-mysql mysql -u root -p`

-   Enter the root password (`password` in this case) to access the MySQL shell.

-   List the databases to ensure `hacker_news` exists:

`SHOW DATABASES;`

-   Switch to the `hacker_news` database:

`USE hacker_news;`

-   List tables to ensure the `stories` table is created:

`SHOW TABLES;`

-   Check the Table Structure

Once you're connected to MySQL, run the following command to describe the structure of the `stories` table:

`DESCRIBE stories;`

This will show the columns of the `stories` table, including their names, data types, and other properties. Look for the `created_at` column in the output.

-   If the `created_at` Column is Missing

If the `created_at` column is not listed, you can add it with the following SQL command:

`ALTER TABLE stories ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`

This command adds the `created_at` column with a `TIMESTAMP` data type, and it will automatically set the current timestamp when a new row is inserted.


Running the Frontend
-------------------

Here are the steps to run the **frontend** (React) setup:

### 1\. Install Dependencies

First, navigate to the `client` directory (where your React app is located) and install the required dependencies:

`cd client
npm install`

This will install all the necessary packages listed in `package.json`.

### 2\. Start the React Development Server

To start the React app, run the following command from the `client` directory:

`npm start`

This will start the development server and open the frontend application in your browser, usually available at `http://localhost:3000`.
