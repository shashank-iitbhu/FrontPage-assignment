const mysql = require('mysql');

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

function connectWithRetry() {
  connection = mysql.createConnection(config);

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.message);
      console.log('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Connected to the database');
    }
  });
}

module.exports = { connectWithRetry };
