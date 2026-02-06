import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/db.json');

// Default schema
const defaultData = {
    sites: [],
    pages: [],
    components: []
};

// Singleton DB instance
let db = null;

export async function getDB() {
    if (!db) {
        // Initialize LowDB with default data
        db = await JSONFilePreset(DB_PATH, defaultData);
        console.log('✓ Database connected:', DB_PATH);
    }
    return db;
}
