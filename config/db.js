const sql = require('mssql');
const { InternalServerError } = require('../utils/errors');
require('dotenv').config();

// Base configuration with security best practices
const baseConfig = {
  options: {
    encrypt: true, // Always encrypt connection
    trustServerCertificate: process.env.NODE_ENV === 'development', // Only trust self-signed certs in development
    enableArithAbort: true, // Recommended for security
    connectTimeout: 30000, // 30 seconds timeout
    requestTimeout: 30000, // 30 seconds timeout for queries
    useUTC: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Primary database config
const config = {
  ...baseConfig,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
};








// Create connection pools
const pool = new sql.ConnectionPool(config);



// Connection error handling
const handleConnectionError = (poolName, err) => {
  console.error(`Error connecting to SQL Server (${poolName}):`, err);
  // Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    throw new InternalServerError('Database connection error');
  } else {
    throw err;
  }
};

// Connect to primary database
pool.connect()
  .then(() => console.log('Connected to primary SQL Server successfully'))
  .catch(err => handleConnectionError('primary', err));


// Connect to tertiary database

// Error event handlers
pool.on('error', err => {
  console.error('Primary SQL Server connection error:', err);
});




// Graceful shutdown function
const closeAllPools = async () => {
  try {
    await pool.close();
   
   
    console.log('All database connections closed');
  } catch (err) {
    console.error('Error closing database connections:', err);
  }
};

// Handle application shutdown
process.on('SIGINT', async () => {
  console.log('Application terminating, closing database connections');
  await closeAllPools();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Application terminating, closing database connections');
  await closeAllPools();
  process.exit(0);
});

module.exports = { 
  pool,
  closeAllPools 
};
