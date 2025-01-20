import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

const connectWithRetry = async (resolve) => {
  try {
    console.log('Attempting to establish a database connection...');
    const connection = await pool.getConnection();
    console.log('Database connection established.');
    connection.release();
    if (resolve) resolve();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(() => connectWithRetry(resolve), 5000);
  }
};

export { connectWithRetry, pool };
