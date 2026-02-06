// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

// Validate environment variable
if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL environment variable is not set!');
  console.error('Please check your .env file in the backend directory.');
  throw new Error('POSTGRES_URL environment variable is required when USE_POSTGRES is true');
}

// Initialize Neon client
const sql = neon(process.env.POSTGRES_URL);

/**
 * Database Schema for LWR Site Builder using Vercel Postgres
 * 
 * This replaces the LowDB implementation for production deployment
 */

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create Sites table
    await sql`
      CREATE TABLE IF NOT EXISTS sites (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255),
        theme JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create Pages table
    await sql`
      CREATE TABLE IF NOT EXISTS pages (
        id VARCHAR(255) PRIMARY KEY,
        site_id VARCHAR(255) REFERENCES sites(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        is_published BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create Components table
    await sql`
      CREATE TABLE IF NOT EXISTS components (
        id VARCHAR(255) PRIMARY KEY,
        page_id VARCHAR(255) REFERENCES pages(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        "order" INTEGER DEFAULT 0,
        props JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create Drafts table
    await sql`
      CREATE TABLE IF NOT EXISTS drafts (
        id VARCHAR(255) PRIMARY KEY,
        page_id VARCHAR(255) REFERENCES pages(id) ON DELETE CASCADE,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create Versions table
    await sql`
      CREATE TABLE IF NOT EXISTS versions (
        id VARCHAR(255) PRIMARY KEY,
        page_id VARCHAR(255) REFERENCES pages(id) ON DELETE CASCADE,
        version_number INTEGER NOT NULL,
        content JSONB NOT NULL,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_pages_site_id ON pages(site_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_components_page_id ON components(page_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_drafts_page_id ON drafts(page_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_versions_page_id ON versions(page_id)`;

    console.log('✓ Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Site operations
export async function getAllSites() {
  const result = await sql`SELECT * FROM sites ORDER BY created_at DESC`;
  return result;
}

export async function getSiteById(id) {
  const result = await sql`SELECT * FROM sites WHERE id = ${id}`;
  return result[0];
}

export async function createSite(site) {
  const { id, name, domain, theme } = site;
  const result = await sql`
    INSERT INTO sites (id, name, domain, theme)
    VALUES (${id}, ${name}, ${domain}, ${JSON.stringify(theme)})
    RETURNING *
  `;
  return result[0];
}

export async function updateSiteTheme(id, theme) {
  const result = await sql`
    UPDATE sites 
    SET theme = ${JSON.stringify(theme)}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

// Page operations
export async function getPagesBySiteId(siteId) {
  const result = await sql`
    SELECT * FROM pages 
    WHERE site_id = ${siteId}
    ORDER BY "order" ASC
  `;
  return result;
}

export async function getPageById(id) {
  const result = await sql`SELECT * FROM pages WHERE id = ${id}`;
  return result[0];
}

export async function createPage(page) {
  const { id, siteId, title, slug, isPublished, order, metadata } = page;
  const result = await sql`
    INSERT INTO pages (id, site_id, title, slug, is_published, "order", metadata)
    VALUES (${id}, ${siteId}, ${title}, ${slug}, ${isPublished}, ${order}, ${JSON.stringify(metadata)})
    RETURNING *
  `;
  return result[0];
}

export async function updatePage(id, updates) {
  const { title, slug, metadata } = updates;
  const result = await sql`
    UPDATE pages
    SET 
      title = COALESCE(${title}, title),
      slug = COALESCE(${slug}, slug),
      metadata = COALESCE(${JSON.stringify(metadata)}, metadata),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}

export async function deletePage(id) {
  // Cascading delete manually for Postgres (FK constraints usually restrict deletion)

  // 1. Delete Components
  await sql`DELETE FROM components WHERE page_id = ${id}`;

  // 2. Delete Drafts (if any)
  try {
    await sql`DELETE FROM drafts WHERE page_id = ${id}`;
  } catch (err) {
    console.warn('Drafts cleanup warning (ignorable if table missing):', err.message);
  }

  // 3. Delete Versions (if any - assuming table exists and uses page_id)
  try {
    await sql`DELETE FROM versions WHERE page_id = ${id}`;
  } catch (err) {
    console.warn('Versions cleanup warning (ignorable if table missing):', err.message);
  }

  // 4. Delete Page
  const result = await sql`
    DELETE FROM pages
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}



// Component operations
export async function getComponentsByPageId(pageId) {
  const result = await sql`
    SELECT * FROM components
    WHERE page_id = ${pageId}
    ORDER BY "order" ASC
  `;
  return result;
}

export async function createComponent(component) {
  const { id, pageId, type, order, props } = component;
  const result = await sql`
    INSERT INTO components (id, page_id, type, "order", props)
    VALUES (${id}, ${pageId}, ${type}, ${order}, ${JSON.stringify(props)})
    RETURNING *
  `;
  return result[0];
}

export async function updateComponent(id, updates) {
  const { props } = updates;
  const result = await sql`
    UPDATE components
    SET props = ${JSON.stringify(props)}
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}

export async function deleteComponent(id) {
  await sql`DELETE FROM components WHERE id = ${id}`;
  return { success: true };
}

export async function deleteComponentsByPageId(pageId) {
  await sql`DELETE FROM components WHERE page_id = ${pageId}`;
  return { success: true };
}

export async function reorderComponents(pageId, componentIds) {
  // Use a transaction to update all orders atomically
  for (let i = 0; i < componentIds.length; i++) {
    await sql`
      UPDATE components
      SET "order" = ${i}
      WHERE id = ${componentIds[i]} AND page_id = ${pageId}
    `;
  }
  return { success: true };
}

// Draft operations
export async function getDraftByPageId(pageId) {
  const result = await sql`
    SELECT * FROM drafts WHERE page_id = ${pageId}
    ORDER BY updated_at DESC
    LIMIT 1
  `;
  return result[0];
}

export async function saveDraft(draft) {
  const { id, pageId, content } = draft;

  // Check if draft exists
  const existing = await getDraftByPageId(pageId);

  if (existing) {
    // Update existing draft
    const result = await sql`
      UPDATE drafts
      SET content = ${JSON.stringify(content)}, updated_at = NOW()
      WHERE page_id = ${pageId}
      RETURNING *
    `;
    return result[0];
  } else {
    // Create new draft
    const result = await sql`
      INSERT INTO drafts (id, page_id, content)
      VALUES (${id}, ${pageId}, ${JSON.stringify(content)})
      RETURNING *
    `;
    return result[0];
  }
}

export async function deleteDraft(pageId) {
  await sql`DELETE FROM drafts WHERE page_id = ${pageId}`;
  return { success: true };
}

// Version operations
export async function getVersionsByPageId(pageId) {
  const result = await sql`
    SELECT * FROM versions
    WHERE page_id = ${pageId}
    ORDER BY version_number DESC
  `;
  return result;
}

export async function createVersion(version) {
  const { id, pageId, versionNumber, content, createdBy } = version;
  const result = await sql`
    INSERT INTO versions (id, page_id, version_number, content, created_by)
    VALUES (${id}, ${pageId}, ${versionNumber}, ${JSON.stringify(content)}, ${createdBy})
    RETURNING *
  `;
  return result[0];
}

export async function getLatestVersionNumber(pageId) {
  const result = await sql`
    SELECT COALESCE(MAX(version_number), 0) as max_version
    FROM versions
    WHERE page_id = ${pageId}
  `;
  return result[0].max_version;
}
