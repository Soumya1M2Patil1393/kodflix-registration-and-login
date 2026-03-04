const mysql = require('mysql2/promise');
require('dotenv').config();

// Parse the connection URL if provided
const parseConnectionUrl = (url) => {
    try {
        const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
        const match = url.match(regex);
        if (match) {
            return {
                user: match[1],
                password: match[2],
                host: match[3],
                port: parseInt(match[4]),
                database: match[5]
            };
        }
    } catch (e) {
        console.log('Could not parse connection URL, using individual env vars');
    }
    return null;
};

// Use connection URL if available, otherwise use individual env vars
const connectionUrl = process.env.DATABASE_URL;
const parsedConfig = connectionUrl ? parseConnectionUrl(connectionUrl) : null;

const dbConfig = parsedConfig || {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = mysql.createPool({
    ...dbConfig,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    acquireTimeout: 10000
});

const initDatabase = async () => {
    try {
        console.log('Attempting to connect to MySQL database...');
        console.log(`Host: ${dbConfig.host}, Port: ${dbConfig.port}, Database: ${dbConfig.database}`);
        
        const connection = await pool.getConnection();
        console.log('MySQL Database connected successfully');
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create favorites table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                movie_id VARCHAR(50),
                movie_title VARCHAR(255),
                poster_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        console.log('Database tables initialized');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('\n=== IMPORTANT ===');
        console.log('The MySQL database connection failed. This could be due to:');
        console.log('1. Network connectivity issues');
        console.log('2. Database server not running');
        console.log('3. Invalid credentials or connection details');
        console.log('\nTo use the app without a database, consider using SQLite for development.');
        console.log('==================\n');
        process.exit(1);
    }
};

module.exports = { pool, initDatabase };
