// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Validate environment variables
if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE) {
    console.error('❌ MySQL environment variables are missing!');
    // We don't throw immediately to allow the app to start if just checking, 
    // but practically this will fail on first query.
    // Better to warn.
}

// Create Connection Pool with minimal connections for free tier
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 2, // Reduced from 10 to 2 for free tier compatibility
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Helper validation for JSON fields
const stringify = (val) => typeof val === 'object' ? JSON.stringify(val) : val;

/**
 * Initialize Database Tables
 */
export async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();

        // Create Sites table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS sites (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255),
        theme LONGTEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL
      )
    `);

        // Migration: Add updated_at and status columns if they don't exist
        try {
            const [columns] = await connection.execute(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'sites'
            `);

            const columnNames = columns.map(col => col.COLUMN_NAME);

            if (!columnNames.includes('updated_at')) {
                console.log('🔄 Adding updated_at column to sites table...');
                await connection.execute(`
                    ALTER TABLE sites 
                    ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL
                `);
                console.log('✓ Added updated_at column');
            }

            if (!columnNames.includes('status')) {
                console.log('🔄 Adding status column to sites table...');
                await connection.execute(`
                    ALTER TABLE sites 
                    ADD COLUMN status VARCHAR(50) DEFAULT 'draft'
                `);
                console.log('✓ Added status column');
            }
        } catch (migrationError) {
            console.warn('⚠️  Migration warning:', migrationError.message);
        }

        // Create Pages table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS pages (
        id VARCHAR(255) PRIMARY KEY,
        site_id VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        is_published BOOLEAN DEFAULT true,
        \`order\` INTEGER DEFAULT 0,
        metadata LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
      )
    `);

        // Create Components table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS components (
        id VARCHAR(255) PRIMARY KEY,
        page_id VARCHAR(255),
        type VARCHAR(100) NOT NULL,
        \`order\` INTEGER DEFAULT 0,
        props LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
      )
    `);

        // Create Drafts table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS drafts (
        id VARCHAR(255) PRIMARY KEY,
        page_id VARCHAR(255),
        content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL,
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
      )
    `);

        // Create Versions table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS versions (
        id VARCHAR(255) PRIMARY KEY,
        page_id VARCHAR(255),
        version_number INTEGER NOT NULL,
        content LONGTEXT NOT NULL,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
      )
    `);

        // Create Custom Components table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS custom_components (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        label VARCHAR(255) NOT NULL,
        type VARCHAR(100) DEFAULT 'custom',
        path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        defaultProps LONGTEXT,
        fields LONGTEXT
      )
    `);

        // Migration for existing table
        try {
            const [ccColumns] = await connection.execute(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'custom_components'
            `);
            const ccColumnNames = ccColumns.map(col => col.COLUMN_NAME);

            if (!ccColumnNames.includes('defaultProps')) {
                await connection.execute('ALTER TABLE custom_components ADD COLUMN defaultProps LONGTEXT');
            }
            if (!ccColumnNames.includes('fields')) {
                await connection.execute('ALTER TABLE custom_components ADD COLUMN fields LONGTEXT');
            }
        } catch (e) { console.warn('Migration error', e); }

        connection.release();
        console.log('✓ MySQL Database initialized successfully');
    } catch (error) {
        console.error('Error initializing MySQL database:', error);
        throw error;
    }
}

// --- Site Operations ---

export async function getAllSites() {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                s.*,
                COUNT(p.id) as pageCount
            FROM sites s
            LEFT JOIN pages p ON s.id = p.site_id
            GROUP BY s.id
            ORDER BY s.updated_at DESC, s.created_at DESC
        `);
        // Parse JSON fields with error handling
        return rows.map(site => {
            let parsedTheme = site.theme;
            if (typeof site.theme === 'string') {
                try {
                    parsedTheme = JSON.parse(site.theme);
                } catch (e) {
                    console.warn(`Warning: Failed to parse theme for site ${site.id}, using default`);
                    parsedTheme = {};
                }
            }
            return {
                ...site,
                theme: parsedTheme || {},
                pageCount: parseInt(site.pageCount) || 0
            };
        });
    } catch (error) {
        console.error('❌ MySQL getAllSites error:', error.message);
        throw error;
    }
}

export async function getSiteById(id) {
    const [rows] = await pool.execute('SELECT * FROM sites WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const site = rows[0];
    return { ...site, theme: typeof site.theme === 'string' ? JSON.parse(site.theme) : site.theme };
}

export async function createSite(site) {
    const { id, name, domain, theme, status = 'draft' } = site;
    await pool.execute(
        'INSERT INTO sites (id, name, domain, theme, status, updated_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [id, name, domain, stringify(theme), status]
    );
    return getSiteById(id);
}

export async function updateSiteTheme(id, theme) {
    await pool.execute(
        'UPDATE sites SET theme = ?, updated_at = NOW() WHERE id = ?',
        [stringify(theme), id]
    );
    return getSiteById(id);
}

export async function updateSite(id, updates) {
    const { name, domain, status } = updates;
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (domain !== undefined) { fields.push('domain = ?'); values.push(domain); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }

    if (fields.length === 0) return getSiteById(id);

    // Always update the timestamp
    fields.push('updated_at = NOW()');
    values.push(id);

    const sql = `UPDATE sites SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);
    return getSiteById(id);
}

export async function deleteSite(id) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch site info before deletion
        const site = await getSiteById(id);

        // Delete site (CASCADE will handle pages, components, drafts, versions)
        await connection.execute('DELETE FROM sites WHERE id = ?', [id]);

        await connection.commit();
        return site;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// --- Page Operations ---

export async function getPagesBySiteId(siteId) {
    const [rows] = await pool.execute(
        'SELECT * FROM pages WHERE site_id = ? ORDER BY `order` ASC',
        [siteId]
    );
    return rows.map(page => ({
        ...page,
        metadata: typeof page.metadata === 'string' ? JSON.parse(page.metadata) : page.metadata,
        is_published: !!page.is_published // Ensure boolean
    }));
}

export async function getPageById(id) {
    const [rows] = await pool.execute('SELECT * FROM pages WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const page = rows[0];
    return {
        ...page,
        metadata: typeof page.metadata === 'string' ? JSON.parse(page.metadata) : page.metadata,
        is_published: !!page.is_published
    };
}

export async function createPage(page) {
    const { id, siteId, title, slug, isPublished, order, metadata } = page;
    await pool.execute(
        'INSERT INTO pages (id, site_id, title, slug, is_published, `order`, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, siteId, title, slug, isPublished, order, stringify(metadata)]
    );
    return getPageById(id);
}

export async function updatePage(id, updates) {
    const { title, slug, metadata } = updates;
    // Dynamic update query
    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (slug !== undefined) { fields.push('slug = ?'); values.push(slug); }
    if (metadata !== undefined) { fields.push('metadata = ?'); values.push(stringify(metadata)); }

    if (fields.length === 0) return getPageById(id);

    values.push(id);
    const sql = `UPDATE pages SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;

    await pool.execute(sql, values);
    return getPageById(id);
}

export async function deletePage(id) {
    // MySQL handles cascading deletes via FK constraints if configured, 
    // but explicitly deleting enables consistency if constraints are missing.
    // Although we defined ON DELETE CASCADE, manual cleanup is safe.

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        // Delete page (Cascade will handle children, but we return deleted info)
        const page = await getPageById(id);
        await connection.execute('DELETE FROM pages WHERE id = ?', [id]);
        await connection.commit();
        return page;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// --- Component Operations ---

export async function getComponentsByPageId(pageId) {
    const [rows] = await pool.execute(
        'SELECT * FROM components WHERE page_id = ? ORDER BY `order` ASC',
        [pageId]
    );
    return rows.map(comp => ({
        ...comp,
        props: typeof comp.props === 'string' ? JSON.parse(comp.props) : comp.props
    }));
}

export async function createComponent(component) {
    const { id, pageId, type, order, props } = component;
    await pool.execute(
        'INSERT INTO components (id, page_id, type, `order`, props) VALUES (?, ?, ?, ?, ?)',
        [id, pageId, type, order, stringify(props)]
    );
    // Fetch manually because MySQL doesn't support RETURNING *
    const [rows] = await pool.execute('SELECT * FROM components WHERE id = ?', [id]);
    return {
        ...rows[0],
        props: typeof rows[0].props === 'string' ? JSON.parse(rows[0].props) : rows[0].props
    };
}

export async function updateComponent(id, updates) {
    const { props } = updates;
    await pool.execute(
        'UPDATE components SET props = ? WHERE id = ?',
        [stringify(props), id]
    );
    const [rows] = await pool.execute('SELECT * FROM components WHERE id = ?', [id]);
    return {
        ...rows[0],
        props: typeof rows[0].props === 'string' ? JSON.parse(rows[0].props) : rows[0].props
    };
}

export async function deleteComponent(id) {
    await pool.execute('DELETE FROM components WHERE id = ?', [id]);
    return { success: true };
}

export async function deleteComponentsByPageId(pageId) {
    await pool.execute('DELETE FROM components WHERE page_id = ?', [pageId]);
    return { success: true };
}

export async function reorderComponents(pageId, componentIds) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (let i = 0; i < componentIds.length; i++) {
            await connection.execute(
                'UPDATE components SET `order` = ? WHERE id = ? AND page_id = ?',
                [i, componentIds[i], pageId]
            );
        }
        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// --- Draft Operations ---

export async function getDraftByPageId(pageId) {
    const [rows] = await pool.execute(
        'SELECT * FROM drafts WHERE page_id = ? ORDER BY updated_at DESC LIMIT 1',
        [pageId]
    );
    if (rows.length === 0) return null;
    return {
        ...rows[0],
        content: typeof rows[0].content === 'string' ? JSON.parse(rows[0].content) : rows[0].content
    };
}

export async function saveDraft(draft) {
    const { id, pageId, content } = draft;
    const existing = await getDraftByPageId(pageId);

    if (existing) {
        await pool.execute(
            'UPDATE drafts SET content = ?, updated_at = NOW() WHERE page_id = ?',
            [stringify(content), pageId]
        );
        return getDraftByPageId(pageId);
    } else {
        await pool.execute(
            'INSERT INTO drafts (id, page_id, content) VALUES (?, ?, ?)',
            [id, pageId, stringify(content)]
        );
        return getDraftByPageId(pageId);
    }
}

export async function deleteDraft(pageId) {
    await pool.execute('DELETE FROM drafts WHERE page_id = ?', [pageId]);
    return { success: true };
}

// --- Version Operations ---

export async function getVersionsByPageId(pageId) {
    const [rows] = await pool.execute(
        'SELECT * FROM versions WHERE page_id = ? ORDER BY version_number DESC',
        [pageId]
    );
    return rows.map(v => ({
        ...v,
        content: typeof v.content === 'string' ? JSON.parse(v.content) : v.content
    }));
}

export async function createVersion(version) {
    const { id, pageId, versionNumber, content, createdBy } = version;
    await pool.execute(
        'INSERT INTO versions (id, page_id, version_number, content, created_by) VALUES (?, ?, ?, ?, ?)',
        [id, pageId, versionNumber, stringify(content), createdBy]
    );

    const [rows] = await pool.execute('SELECT * FROM versions WHERE id = ?', [id]);
    return {
        ...rows[0],
        content: typeof rows[0].content === 'string' ? JSON.parse(rows[0].content) : rows[0].content
    };
}

export async function getLatestVersionNumber(pageId) {
    const [rows] = await pool.execute(
        'SELECT COALESCE(MAX(version_number), 0) as max_version FROM versions WHERE page_id = ?',
        [pageId]
    );
    return rows[0].max_version;
}

// --- Custom Component Operations ---

export async function createCustomComponent(component) {
    const { id, name, label, type, path, defaultProps, fields } = component;
    await pool.execute(
        'INSERT INTO custom_components (id, name, label, type, path, defaultProps, fields) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, label, type || 'custom', path, stringify(defaultProps), stringify(fields)]
    );
    const [rows] = await pool.execute('SELECT * FROM custom_components WHERE id = ?', [id]);
    return {
        ...rows[0],
        defaultProps: typeof rows[0].defaultProps === 'string' ? JSON.parse(rows[0].defaultProps) : rows[0].defaultProps,
        fields: typeof rows[0].fields === 'string' ? JSON.parse(rows[0].fields) : rows[0].fields
    };
}

export async function getAllCustomComponents() {
    const [rows] = await pool.execute('SELECT * FROM custom_components ORDER BY created_at DESC');
    return rows.map(comp => ({
        ...comp,
        defaultProps: typeof comp.defaultProps === 'string' ? JSON.parse(comp.defaultProps) : comp.defaultProps,
        fields: typeof comp.fields === 'string' ? JSON.parse(comp.fields) : comp.fields
    }));
}
