# MySQL Integration Guide (FreeSQLDatabase)

This guide explains how to switch the project's database from PostgreSQL/LowDB to a MySQL database hosted on [FreeSQLDatabase.com](https://www.freesqldatabase.com/).

## Prerequisites

1.  A registered account on [FreeSQLDatabase.com](https://www.freesqldatabase.com/).
2.  An active database instance (Create one via their dashboard).
3.  The database credentials (Host, Database Name, User, Password, Port) which are typically sent to your email after creation.

## Step 1: Install MySQL Driver

In the `backend` directory, install the `mysql2` package, which is a fast, reliable MySQL driver for Node.js.

```bash
cd backend
npm install mysql2
```

## Step 2: Configure Environment Variables

Create or update the `.env` file in your `backend` directory with your MySQL credentials.

**File:** `backend/.env`

```env
# ... existing variables ...

POSTGRES_URL=... # You can keep or remove this
USE_POSTGRES=false # Set to false if you were using this flag

# MySQL Configuration
MYSQL_HOST=sql.freesqldatabase.com
MYSQL_USER=sqlxxxxxxx
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=sqlxxxxxxx
MYSQL_PORT=3306
```

## Step 3: Create the MySQL Database Module

Create a new file `backend/models/mysql-db.js`. This file effectively replaces `postgres-db.js`, adapting the SQL syntax for MySQL.

**File:** `backend/models/mysql-db.js`

```javascript
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

// Validate environment variables
if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE) {
  console.error('❌ MySQL environment variables are missing!');
  throw new Error('MySQL configuration is required.');
}

// Create Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
        theme LONGTEXT, -- Using LONGTEXT for JSON to ensure compatibility
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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

    connection.release();
    console.log('✓ MySQL Database initialized successfully');
  } catch (error) {
    console.error('Error initializing MySQL database:', error);
    throw error;
  }
}

// --- Site Operations ---

export async function getAllSites() {
  const [rows] = await pool.execute('SELECT * FROM sites ORDER BY created_at DESC');
  // Parse JSON fields
  return rows.map(site => ({
    ...site,
    theme: typeof site.theme === 'string' ? JSON.parse(site.theme) : site.theme
  }));
}

export async function getSiteById(id) {
  const [rows] = await pool.execute('SELECT * FROM sites WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const site = rows[0];
  return { ...site, theme: typeof site.theme === 'string' ? JSON.parse(site.theme) : site.theme };
}

export async function createSite(site) {
  const { id, name, domain, theme } = site;
  await pool.execute(
    'INSERT INTO sites (id, name, domain, theme) VALUES (?, ?, ?, ?)',
    [id, name, domain, stringify(theme)]
  );
  return getSiteById(id);
}

export async function updateSiteTheme(id, theme) {
  await pool.execute(
    'UPDATE sites SET theme = ? WHERE id = ?',
    [stringify(theme), id]
  );
  return getSiteById(id);
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
  const sql = `UPDATE pages SET ${fields.join(', ')} WHERE id = ?`;
  
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
      'UPDATE drafts SET content = ? WHERE page_id = ?',
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
```

## Step 4: Integrate into Server

In your `backend/server.js`, you need to import from `mysql-db.js` instead of `postgres-db.js`.

**Example Change in `backend/server.js`:**

```javascript
// Comment out the old import
// import * as db from './models/postgres-db.js';

// Add the new import
import * as db from './models/mysql-db.js';

// The rest of your server code should work as is because 
// we kept the function names and signatures identical!
```
