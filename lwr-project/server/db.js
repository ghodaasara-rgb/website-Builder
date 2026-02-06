const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../data/database.sqlite');

// Ensure database directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✓ Connected to SQLite database');
        initDatabase();
    }
});

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error('SQL Error:', sql, params, err);
                reject(err);
            }
            else resolve(this);
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                console.error('SQL Error:', sql, params, err);
                reject(err);
            }
            else resolve(result);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('SQL Error:', sql, params, err);
                reject(err);
            }
            else resolve(rows);
        });
    });
}

async function initDatabase() {
    try {
        // 1. sys_objects
        await run(`
            CREATE TABLE IF NOT EXISTS sys_objects (
                id TEXT PRIMARY KEY,
                label TEXT NOT NULL,
                api_name TEXT UNIQUE NOT NULL,
                plural_label TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. sys_fields
        await run(`
            CREATE TABLE IF NOT EXISTS sys_fields (
                id TEXT PRIMARY KEY,
                object_id TEXT NOT NULL,
                api_name TEXT NOT NULL,
                label TEXT NOT NULL,
                data_type TEXT NOT NULL,
                metadata_json TEXT DEFAULT '{}',
                is_required BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(object_id) REFERENCES sys_objects(id) ON DELETE CASCADE,
                UNIQUE(object_id, api_name)
            )
        `);

        console.log('✓ System tables initialized');
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
    }
}

module.exports = { db, run, get, all };
