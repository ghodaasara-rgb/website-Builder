const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');
const { v4: uuidv4 } = require('uuid');

// Reserved names check
const RESERVED_TABLES = ['users', 'settings', 'sys_objects', 'sys_fields', 'auth', 'public', 'sqlite_sequence'];

// Helper to sanitize API names
function sanitizeApiName(name) {
    return name.toLowerCase().replace(/[^a-z0-9_]/g, '');
}

/**
 * POST /api/schema/objects
 * Create a new custom object and physical table.
 */
router.post('/objects', async (req, res) => {
    try {
        const { label, plural_label } = req.body;

        if (!label || !plural_label) {
            return res.status(400).json({ error: 'Label and Plural Label are required.' });
        }

        const api_name = sanitizeApiName(label);

        if (RESERVED_TABLES.includes(api_name)) {
            return res.status(400).json({ error: `Table name '${api_name}' is reserved.` });
        }

        const objectId = uuidv4();

        // 1. Register in sys_objects
        await run(
            `INSERT INTO sys_objects (id, label, api_name, plural_label) VALUES (?, ?, ?, ?)`,
            [objectId, label, api_name, plural_label]
        );

        // 2. Create Physical Table
        // default columns: id, created_at
        await run(`
            CREATE TABLE "${api_name}" (
                id TEXT PRIMARY KEY,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log(`✓ Created object '${label}' (Table: ${api_name})`);
        res.json({ success: true, object: { id: objectId, label, api_name } });

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Object with this name already exists.' });
        }
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/schema/objects
 * List all custom objects.
 */
router.get('/objects', async (req, res) => {
    try {
        const objects = await all('SELECT * FROM sys_objects ORDER BY created_at DESC');
        res.json(objects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/schema/objects/:id/fields
 * List fields for an object
 */
router.get('/objects/:id/fields', async (req, res) => {
    try {
        const fields = await all('SELECT * FROM sys_fields WHERE object_id = ?', [req.params.id]);
        // Parse metadata_json
        const parsedFields = fields.map(f => ({
            ...f,
            metadata_json: JSON.parse(f.metadata_json || '{}')
        }));
        res.json(parsedFields);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/schema/fields
 * Create a new field and add column to table.
 */
router.post('/fields', async (req, res) => {
    try {
        const { object_id, label, data_type, metadata = {}, is_required = false } = req.body;

        if (!object_id || !label || !data_type) {
            return res.status(400).json({ error: 'Object ID, Label, and Data Type are required.' });
        }

        // Verify object exists
        const objectDef = await get('SELECT api_name FROM sys_objects WHERE id = ?', [object_id]);
        if (!objectDef) {
            return res.status(404).json({ error: 'Object not found.' });
        }

        const tableName = objectDef.api_name;
        const fieldApiName = sanitizeApiName(label);
        const fieldId = uuidv4();

        // 1. Determine SQL Type
        let conflictClause = '';
        let sqlDataType = 'TEXT';

        switch (data_type) {
            case 'NUMBER': sqlDataType = 'REAL'; break;
            case 'CHECKBOX': sqlDataType = 'INTEGER'; break; // 0 or 1
            case 'DATE':
            case 'DATETIME': sqlDataType = 'TEXT'; break; // ISO string
            default: sqlDataType = 'TEXT';
        }

        // 2. Register in sys_fields
        // Use transaction-like flow (manual in sqlite without explicit transaction for DDL mix)
        // Insert first
        await run(
            `INSERT INTO sys_fields (id, object_id, api_name, label, data_type, metadata_json, is_required) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [fieldId, object_id, fieldApiName, label, data_type, JSON.stringify(metadata), is_required ? 1 : 0]
        );

        // 3. ALTER TABLE
        // SQLite ALTER TABLE ADD COLUMN is limited (no strict constraints generally in simplest form)
        // But basic adding works.
        try {
            await run(`ALTER TABLE "${tableName}" ADD COLUMN "${fieldApiName}" ${sqlDataType}`);
        } catch (alterError) {
            // Rollback metadata insert if ALTER fails (e.g. duplicate column logic handled by sys_fields unique constraint mostly, but db might differ)
            await run('DELETE FROM sys_fields WHERE id = ?', [fieldId]);
            throw alterError;
        }

        console.log(`✓ Created field '${label}' on '${tableName}'`);
        res.json({ success: true, field: { id: fieldId, api_name: fieldApiName } });

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Field with this name already exists on the object.' });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
