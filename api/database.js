const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use /tmp for Vercel (writable), otherwise use current directory
const dbDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..');
const dbPath = path.join(dbDir, 'kodflix.db');

// Ensure directory exists
try {
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
} catch (err) {
    console.error('Error creating directory:', err);
}

// Create database connection
let db = null;
let isInitialized = false;

const getDb = () => {
    if (!db) {
        try {
            db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                } else {
                    console.log('Connected to SQLite database at:', dbPath);
                }
            });
        } catch (error) {
            console.error('Database connection error:', error);
        }
    }
    return db;
};

// Promisify database methods
const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        const database = getDb();
        if (!database) {
            reject(new Error('Database not available'));
            return;
        }
        database.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, changes: this.changes });
        });
    });
};

const getQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        const database = getDb();
        if (!database) {
            reject(new Error('Database not available'));
            return;
        }
        database.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const allQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        const database = getDb();
        if (!database) {
            reject(new Error('Database not available'));
            return;
        }
        database.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const initDatabase = async () => {
    if (isInitialized) return;
    
    try {
        // Create users table
        await runQuery(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create favorites table
        await runQuery(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                movie_id TEXT,
                movie_title TEXT,
                poster_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        
        isInitialized = true;
        console.log('SQLite database tables initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error.message);
        throw error;
    }
};

// Pool-like interface for compatibility
const pool = {
    execute: async (sql, params = []) => {
        // Ensure database is initialized before executing queries
        await initDatabase();
        
        if (sql.trim().toLowerCase().startsWith('select')) {
            return [await allQuery(sql, params)];
        } else if (sql.trim().toLowerCase().includes('insert')) {
            const result = await runQuery(sql, params);
            return [{ insertId: result.id }];
        } else {
            await runQuery(sql, params);
            return [];
        }
    }
};

module.exports = { pool, initDatabase, db: getDb };
