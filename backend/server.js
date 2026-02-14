// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { getDB } from './models/db.js';
import * as MysqlDB from './models/mysql-db.js';
import * as DB from './models/db-abstraction.js';
import { nanoid } from 'nanoid';
import draftRoutes from './routes/draft.js';
import liveRoutes from './routes/live.js';
import versionRoutes from './routes/version.js';
import multer from 'multer';
import AdmZip from 'adm-zip';
import { Octokit } from 'octokit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const USE_MYSQL = process.env.MYSQL_HOST && process.env.MYSQL_DATABASE;
const COMPONENTS_DIR = path.join(__dirname, '../lwr-project/src/modules/custom');

// Configure Multer for temp upload
// Configure Multer for temp upload
const TEMP_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'temp_uploads');
const upload = multer({ dest: TEMP_DIR });

const app = express();

// CORS Configuration - Allow frontend URLs from environment variable
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, '')) // Remove trailing slashes
    : ['http://localhost:3002'];

console.log('🔐 CORS Allowed Origins:', allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) {
            console.log('✅ CORS: Allowing request with no origin');
            return callback(null, true);
        }

        // Normalize origin (remove trailing slash)
        const normalizedOrigin = origin.replace(/\/$/, '');

        // Check if origin matches allowed origins or is a Vercel deployment
        const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
            allowedOrigins.some(allowed => normalizedOrigin.startsWith(allowed)) ||
            normalizedOrigin.includes('.vercel.app');

        if (isAllowed) {
            console.log(`✅ CORS: Allowing origin: ${origin}`);
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked origin: ${origin}`);
            console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/drafts', draftRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/versions', versionRoutes);

// Paths for legacy data
const LEGACY_DATA_DIR = path.join(__dirname, '../lwr-project/data');
const LEGACY_PAGES_DIR = path.join(LEGACY_DATA_DIR, 'pages');

/**
 * Initialize database based on environment configuration
 * - If USE_POSTGRES=true: Initialize Neon Postgres tables
 * - If USE_POSTGRES=false: Use LowDB with legacy migration
 */
async function initializeDatabase() {
    console.log(`🔧 Database Mode: ${USE_MYSQL ? 'MySQL (Remote)' : 'LowDB (Local)'}`);

    if (USE_MYSQL) {
        // Initialize MySQL schema
        try {
            await MysqlDB.initializeDatabase();
            console.log('✓ MySQL Database initialized');

            //Check if we need to seed with default data
            const sites = await MysqlDB.getAllSites();
            if (!sites || sites.length === 0) {
                console.log('📦 Seeding default site...');
                const siteId = `site_${nanoid()}`;
                await MysqlDB.createSite({
                    id: siteId,
                    name: 'My LWR Site',
                    domain: 'localhost:3000',
                    theme: {
                        colors: {
                            primary: '#3b82f6',
                            background: '#ffffff',
                            text: '#1f2937'
                        },
                        typography: {
                            primary: 'Inter',
                            heading: 'Inter'
                        },
                        layout: 'sidebar'
                    }
                });
                console.log('✓ Default site created');
            }
        } catch (error) {
            console.error('❌ MySQL initialization failed:', error.message);
            throw error;
        }
    } else {
        // Use LowDB with migration logic
        await migrateFromLegacyData();
    }
}

/**
 * Legacy LowDB migration function (only used when USE_MYSQL=false)
 */
async function migrateFromLegacyData() {
    const db = await getDB();
    await db.read();

    // Check if migration is needed (empty DB)
    if (db.data.sites.length === 0) {
        console.log('🔄 Starting migration from legacy data...');

        try {
            // 1. Create Default Site
            const siteId = `site_${nanoid()}`;
            const defaultSite = {
                id: siteId,
                name: 'My LWR Site',
                domain: 'localhost:3000',
                createdAt: new Date().toISOString(),
                theme: {
                    colors: {
                        primary: '#3b82f6',
                        background: '#ffffff',
                        text: '#1f2937'
                    },
                    typography: {
                        primary: 'Inter',
                        heading: 'Inter'
                    },
                    layout: 'sidebar'
                }
            };
            db.data.sites.push(defaultSite);

            // 2. Read Legacy Pages
            const files = await fs.readdir(LEGACY_PAGES_DIR).catch(() => []);

            for (const file of files) {
                if (!file.endsWith('.json')) continue;

                const filePath = path.join(LEGACY_PAGES_DIR, file);
                const pageData = JSON.parse(await fs.readFile(filePath, 'utf-8'));

                // 3. Migrate Page Metadata
                const pageId = pageData.id || `page_${nanoid()}`;

                db.data.pages.push({
                    id: pageId,
                    siteId: siteId,
                    title: pageData.name,
                    slug: pageData.slug,
                    isPublished: true,
                    order: 0,
                    metadata: pageData.metadata || {}
                });

                // 4. Migrate Components
                if (pageData.layout && pageData.layout.sections) {
                    pageData.layout.sections.forEach((section, index) => {
                        db.data.components.push({
                            id: section.id || `cmp_${nanoid()}`,
                            pageId: pageId,
                            type: section.type,
                            order: index,
                            props: section.properties || {}
                        });
                    });
                }
            }

            await db.write();
            console.log('✓ LowDB migration complete');
        } catch (error) {
            console.warn('⚠️ Migration skipped or failed (legacy data might not exist):', error.message);
        }
    }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    // Check if env vars are present (don't expose values)
    const envStatus = {
        MYSQL_HOST: !!process.env.MYSQL_HOST,
        MYSQL_USER: !!process.env.MYSQL_USER,
        MYSQL_DATABASE: !!process.env.MYSQL_DATABASE,
        USE_MYSQL_FLAG: !!(process.env.MYSQL_HOST && process.env.MYSQL_DATABASE)
    };

    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        dbType: process.env.MYSQL_HOST ? 'MySQL' : 'LowDB',
        env: envStatus,
        version: '1.0.1'
    });
});
// Get all sites (MVP: only one site supported mostly)
app.get('/api/sites', async (req, res) => {
    try {
        console.log('📊 Fetching all sites...');
        const sites = await DB.getAllSites();
        console.log(`✅ Found ${sites ? sites.length : 0} sites`);
        res.json(sites || []);
    } catch (error) {
        console.error('❌ Error fetching sites:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            error: 'Failed to fetch sites',
            details: error.message,
            dbType: process.env.MYSQL_HOST ? 'MySQL' : 'LowDB'
        });
    }
});

// Get Single Site
app.get('/api/sites/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const site = await DB.getSiteById(id);

        if (!site) return res.status(404).json({ error: 'Site not found' });

        res.json(site);
    } catch (error) {
        console.error('Error fetching site:', error);
        res.status(500).json({ error: 'Failed to fetch site' });
    }
});

// Create new site
app.post('/api/sites', async (req, res) => {
    try {
        const { name, domain, theme, status } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Site name is required' });
        }

        const newSite = await DB.createSite({
            name,
            domain: domain || '',
            theme: theme || {
                colors: { primary: '#4f46e5', background: '#ffffff', text: '#1f2937' },
                typography: { primary: 'Inter', heading: 'Inter' },
                layout: 'sidebar'
            },
            status: status || 'draft'
        });

        res.status(201).json(newSite);
    } catch (error) {
        console.error('Error creating site:', error);
        res.status(500).json({ error: 'Failed to create site' });
    }
});

// Update site
app.put('/api/sites/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, domain, status } = req.body;

        const updatedSite = await DB.updateSite(id, { name, domain, status });

        if (!updatedSite) return res.status(404).json({ error: 'Site not found' });

        res.json({ success: true, site: updatedSite });
    } catch (error) {
        console.error('Error updating site:', error);
        res.status(500).json({ error: 'Failed to update site' });
    }
});

// Delete site
app.delete('/api/sites/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await DB.deleteSite(id);

        if (!result) return res.status(404).json({ error: 'Site not found' });

        res.json({ success: true, deletedSiteId: id });
    } catch (error) {
        console.error('Error deleting site:', error);
        res.status(500).json({ error: `Failed to delete site: ${error.message}` });
    }
});

// Get Site Theme
app.get('/api/sites/:id/theme', async (req, res) => {
    try {
        const { id } = req.params;
        const site = await DB.getSiteById(id);

        if (!site) return res.status(404).json({ error: 'Site not found' });

        res.json(site.theme || {});
    } catch (error) {
        console.error('Error fetching theme:', error);
        res.status(500).json({ error: 'Failed to fetch theme' });
    }
});

// Update Site Theme
app.put('/api/sites/:id/theme', async (req, res) => {
    try {
        const { id } = req.params;
        const { colors, typography, layout } = req.body;

        const updatedSite = await DB.updateSiteTheme(id, { colors, typography, layout });

        if (!updatedSite) return res.status(404).json({ error: 'Site not found' });

        res.json({ success: true, theme: updatedSite.theme });
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ error: 'Failed to update theme' });
    }
});

// Get Pages for a Site
app.get('/api/sites/:id/pages', async (req, res) => {
    try {
        const { id } = req.params;
        const pages = await DB.getPagesBySiteId(id);
        res.json(pages);
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Create New Page for Site
app.post('/api/sites/:id/pages', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        const site = await DB.getSiteById(id);
        if (!site) return res.status(404).json({ error: 'Site not found' });

        const newPage = await DB.createPage({
            siteId: id,
            title: name || 'Untitled Page',
            slug: slug || `/page-${nanoid(6)}`,
            isPublished: true,
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        });

        // Add default Hero component to new page
        await DB.createComponent({
            pageId: newPage.id,
            type: 'hero',
            order: 0,
            props: {
                title: newPage.title,
                subtitle: 'Start building your new page',
                ctaText: 'Get Started',
                ctaSecondaryText: 'Learn More',
                backgroundImage: '',
                textColor: '#ffffff'
            }
        });

        res.json(newPage);
    } catch (error) {
        console.error('Error creating page:', error);
        res.status(500).json({ error: `Failed to create page: ${error.message}` });
    }
});

// Get Components for a Page (Sorted)
app.get('/api/pages/:id/components', async (req, res) => {
    try {
        const { id } = req.params;
        const components = await DB.getComponentsByPageId(id);
        res.json(components);
    } catch (error) {
        console.error('Error fetching components:', error);
        res.status(500).json({ error: 'Failed to fetch components' });
    }
});


// Get Single Page Details
app.get('/api/pages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const page = await DB.getPageById(id);
        if (page) {
            res.json(page);
        } else {
            res.status(404).json({ error: 'Page not found' });
        }
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
});

/**
 * Composite Update: Save Page Metadata + Replace All Components
 * This restores the "Save" button functionality for the frontend
 */
app.post('/api/pages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, metadata, layout } = req.body;

        // 1. Update Page Metadata
        const page = await DB.getPageById(id);
        if (!page) return res.status(404).json({ error: 'Page not found' });

        // Fix: Map 'name' to 'title' for Postgres DB
        await DB.updatePage(id, { title: name, slug, metadata });

        // 2. Replace Components (if layout is provided)
        if (layout && layout.sections) {
            // Remove old components for this page
            await DB.deleteComponentsByPageId(id);

            // Add new components
            for (let index = 0; index < layout.sections.length; index++) {
                const section = layout.sections[index];
                await DB.createComponent({
                    id: section.id || nanoid(), // Ensure ID exists
                    pageId: id,
                    type: section.type,
                    order: index,
                    props: section.properties || {}
                });
            }
        }

        const updatedPage = await DB.getPageById(id);
        res.json({ success: true, page: updatedPage });
    } catch (error) {
        console.error('Error saving page:', error);
        res.status(500).json({ error: 'Failed to save page' });
    }
});

// Delete Page
app.delete('/api/pages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await DB.deletePage(id);

        if (!result) return res.status(404).json({ error: 'Page not found' });

        res.json({ success: true, deletedPageId: id });
    } catch (error) {
        console.error('Error deleting page:', error);
        res.status(500).json({ error: `Failed to delete page: ${error.message}` });
    }
});


// Add Component to Page
app.post('/api/pages/:id/components', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, props, order } = req.body;

        const newComponent = await DB.createComponent({
            pageId: id,
            type,
            props: props || {},
            order
        });

        res.json(newComponent);
    } catch (error) {
        console.error('Error creating component:', error);
        res.status(500).json({ error: 'Failed to create component' });
    }
});

// Update Component Properties
app.put('/api/components/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { props } = req.body;

        const component = await DB.updateComponent(id, { props });

        if (!component) return res.status(404).json({ error: 'Component not found' });

        res.json(component);
    } catch (error) {
        console.error('Error updating component:', error);
        res.status(500).json({ error: 'Failed to update component' });
    }
});

// Delete Component
app.delete('/api/components/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await DB.deleteComponent(id);

        if (!result) return res.status(404).json({ error: 'Component not found' });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting component:', error);
        res.status(500).json({ error: 'Failed to delete component' });
    }
});

// Batch Reorder Components
app.put('/api/pages/:id/reorder', async (req, res) => {
    try {
        const { id } = req.params;
        const { componentIds } = req.body;

        if (!Array.isArray(componentIds)) {
            return res.status(400).json({ error: 'Invalid data' });
        }

        await DB.reorderComponents(id, componentIds);

        res.json({ success: true });
    } catch (error) {
        console.error('Error reordering components:', error);
        res.status(500).json({ error: 'Failed to reorder components' });
    }
});

// --- Custom Components Import ---

// Get Custom Components
app.get('/api/components/custom', async (req, res) => {
    try {
        const components = await DB.getAllCustomComponents();
        res.json(components);
    } catch (error) {
        console.error('Error fetching custom components:', error);
        res.status(500).json({ error: 'Failed to fetch custom components' });
    }
});

// Import Component (Zip Upload)
app.post('/api/components/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const zipPath = req.file.path;
        console.log('📦 Received component import:', req.file.originalname);

        const zip = new AdmZip(zipPath);
        const zipEntries = zip.getEntries();

        // Find component root (folder inside zip)
        // Assume zip structure: myComponent/ (optional) -> myComponent.js, myComponent.html
        // OR direct files.
        // We'll normalize to a specific folder name based on the main entry.

        let componentName = null;
        let mainJsFound = false;
        let mainHtmlFound = false;

        // Simple validation: Look for .js and .html with same name
        zipEntries.forEach(entry => {
            if (entry.entryName.endsWith('.js') && !entry.entryName.includes('/')) {
                // Root file
                const name = path.basename(entry.entryName, '.js');
                if (name !== 'utils' && !name.startsWith('.')) {
                    componentName = name;
                    mainJsFound = true;
                }
            } else if (entry.entryName.endsWith('.html') && !entry.entryName.includes('/')) {
                const name = path.basename(entry.entryName, '.html');
                // Check if matches found js or looks like a component
                if (name === componentName) mainHtmlFound = true;
            } else if (entry.isDirectory && !componentName) {
                // Maybe it's inside a folder
                const parts = entry.entryName.split('/').filter(Boolean);
                if (parts.length === 1) componentName = parts[0];
            }
        });

        // Refined Logic for Extraction
        // 1. Extract to temp dir
        // 2. Identify LWC structure
        // 3. Move to valid destination

        // For simplicity: We enforce that the zip MUST contain a single top-level folder matching the component name OR files at root
        // Let's unzip to a temp staging folder first
        // Let's unzip to a temp staging folder first
        const tempStage = path.join(TEMP_DIR, `stage_${nanoid()}`);
        zip.extractAllTo(tempStage, true);

        // Analyze extracted files
        const extractedFiles = await fs.readdir(tempStage);
        let targetFolderSource = tempStage;

        // Check if wrapped in a folder
        const isSingleDir = extractedFiles.length === 1 && (await fs.stat(path.join(tempStage, extractedFiles[0]))).isDirectory();
        if (isSingleDir) {
            componentName = extractedFiles[0];
            targetFolderSource = path.join(tempStage, componentName);
        } else {
            // Files are at root. Try to infer name from .js file
            const jsFile = extractedFiles.find(f => f.endsWith('.js') && !f.endsWith('.test.js'));
            if (!jsFile) throw new Error('No main JavaScript file found in component');
            componentName = path.basename(jsFile, '.js');
        }

        // Validate component Name
        if (!componentName || !/^[a-zA-Z][a-zA-Z0-9]*$/.test(componentName)) {
            throw new Error(`Invalid component name: ${componentName}. Must be alphanumeric.`);
        }

        // Ensure target directory custom/ exists
        await fs.mkdir(COMPONENTS_DIR, { recursive: true });

        const finalDest = path.join(COMPONENTS_DIR, componentName);

        if (process.env.VERCEL) {
            // --- VERCEL MODE: Commit to GitHub ---
            console.log('🚀 Running on Vercel: Triggering GitHub Auto-Commit...');

            if (!process.env.GITHUB_TOKEN || !process.env.REPO_OWNER || !process.env.REPO_NAME) {
                throw new Error('Missing GitHub Configuration (GITHUB_TOKEN, REPO_OWNER, REPO_NAME)');
            }

            const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
            const owner = process.env.REPO_OWNER;
            const repo = process.env.REPO_NAME;
            const branch = 'main'; // Assume main branch

            // Read all files from tempStage
            const filesToCommit = [];

            // Recursive function to read files
            async function readDirRecursive(dir) {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        await readDirRecursive(fullPath);
                    } else {
                        const content = await fs.readFile(fullPath, 'base64');
                        const relativePath = path.relative(tempStage, fullPath);
                        // Target path in repo: lwr-project/src/modules/custom/<componentName>/...
                        const repoPath = `lwr-project/src/modules/custom/${componentName}/${relativePath}`;
                        filesToCommit.push({
                            path: repoPath,
                            content: content,
                            encoding: 'base64'
                        });
                    }
                }
            }
            await readDirRecursive(tempStage);

            // Create a commit via GitHub API
            // 1. Get Ref
            const { data: refData } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
            const latestCommitSha = refData.object.sha;

            // 2. Create Blobs & Tree
            const treeItems = [];
            for (const file of filesToCommit) {
                const { data: blobData } = await octokit.rest.git.createBlob({
                    owner, repo, content: file.content, encoding: 'base64'
                });
                treeItems.push({
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blobData.sha
                });
            }

            const { data: treeData } = await octokit.rest.git.createTree({
                owner, repo, base_tree: latestCommitSha, tree: treeItems
            });

            // 3. Create Commit
            const { data: commitData } = await octokit.rest.git.createCommit({
                owner, repo,
                message: `[Auto-Import] Added custom component: ${componentName}`,
                tree: treeData.sha,
                parents: [latestCommitSha]
            });

            // 4. Update Ref
            await octokit.rest.git.updateRef({
                owner, repo, ref: `heads/${branch}`, sha: commitData.sha
            });

            console.log(`✅ GitHub Commit Created: ${commitData.sha}`);

            // Check for metadata file in the extracted location (tempStage) BEFORE cleanup
            const tempFiles = await fs.readdir(tempStage);
            const metaFile = tempFiles.find(f => f.endsWith('.js-meta.xml'));
            if (metaFile) {
                // We need to read it now before it's deleted
                const metaContent = await fs.readFile(path.join(tempStage, metaFile), 'utf-8');
                // Parse metadata logic (reused below, but we need to duplicate or extract function)
                // For simplicity, we'll store it in a var and let the parsing logic below verify it exists
                // But wait, the below logic looks in `finalDest` which won't exist on Vercel.
                // Critical Fix: Copy meta file to a memory buffer or parse it right here.

                // Let's modify the code flow to parse from `tempStage` ALWAYS.
            }

        } else {
            // --- LOCAL MODE: Write to Disk ---
            // Create final directory
            await fs.mkdir(finalDest, { recursive: true });

            // Check if exists
            const exists = await fs.stat(finalDest).then(() => true).catch(() => false);
            if (exists) {
                console.log(`⚠️ Overwriting existing component: ${componentName}`);
                await fs.rm(finalDest, { recursive: true, force: true });
            }

            // Move files
            await fs.rename(targetFolderSource, finalDest);
            console.log(`✅ Component installed to: ${finalDest}`);
        }


        // --- Metadata Parsing (Unified Logic) ---
        let metaContent = '';
        let metaFilename = '';

        if (process.env.VERCEL) {
            const tempFiles = await fs.readdir(tempStage).catch(() => []);
            const mFile = tempFiles.find(f => f.endsWith('.js-meta.xml'));
            if (mFile) {
                metaContent = await fs.readFile(path.join(tempStage, mFile), 'utf-8');
                metaFilename = mFile;
            }
        } else {
            const finalFiles = await fs.readdir(finalDest).catch(() => []);
            const mFile = finalFiles.find(f => f.endsWith('.js-meta.xml'));
            if (mFile) {
                metaContent = await fs.readFile(path.join(finalDest, mFile), 'utf-8');
                metaFilename = mFile;
            }
        }

        // Cleanup temp (Always do this at the end)
        if (process.env.VERCEL) {
            await fs.rm(tempStage, { recursive: true, force: true }).catch(() => { });
            await fs.rm(zipPath, { force: true }).catch(() => { });
        } else {
            await fs.rm(tempStage, { recursive: true, force: true }).catch(() => { });
            await fs.rm(zipPath, { force: true }).catch(() => { });
        }

        let componentMetadata = {
            props: {},
            fields: []
        };

        if (metaContent) {
            console.log('📄 Found metadata file:', metaFilename);

            try {
                // Regex to extract property definitions
                const propertyRegex = /<property\s+([^>]+?)\/?>/g;
                let match;

                while ((match = propertyRegex.exec(metaContent)) !== null) {
                    const attributesString = match[1];
                    const attributes = {};

                    // Parse attributes
                    const attrRegex = /(\w+)=["']([^"']*)["']/g;
                    let attrMatch;
                    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
                        attributes[attrMatch[1]] = attrMatch[2];
                    }

                    if (attributes.name && attributes.type) {
                        const propName = attributes.name;

                        // Map XML types to Builder types
                        let builderType = 'text'; // default
                        let defaultValue = attributes.default || '';

                        switch (attributes.type) {
                            case 'String':
                                builderType = 'text';
                                break;
                            case 'Integer':
                            case 'Double':
                                builderType = 'number';
                                break;
                            case 'Boolean':
                                builderType = 'checkbox';
                                defaultValue = defaultValue === 'true';
                                break;
                            case 'Color': // Custom type extension
                                builderType = 'color';
                                break;
                        }

                        // Special case: Detect color by name if type is String
                        if (attributes.type === 'String' && propName.toLowerCase().includes('color')) {
                            builderType = 'color';
                        }

                        // Add to default props
                        componentMetadata.props[propName] = defaultValue;

                        // Add to fields config
                        componentMetadata.fields.push({
                            name: propName,
                            label: attributes.label || propName,
                            type: builderType,
                            description: attributes.description || ''
                        });
                    }
                }
                console.log('✅ Parsed metadata:', componentMetadata.fields.length, 'fields');

            } catch (err) {
                console.warn('⚠️ Failed to parse metadata:', err.message);
            }
        }

        // Save to DB
        const newComponent = await DB.createCustomComponent({
            name: componentName,
            label: componentName, // Ideally parse title from .js-meta.xml
            path: `custom/${componentName}`,
            type: 'custom',
            // Save parsed metadata
            defaultProps: componentMetadata.props,
            fields: componentMetadata.fields
        });

        res.json({ success: true, component: newComponent });

    } catch (error) {
        console.error('Import failed:', error);
        // Cleanup temp zip if processing failed
        if (req.file && req.file.path) {
            await fs.rm(req.file.path, { force: true }).catch(() => { });
        }
        res.status(500).json({ error: error.message || 'Failed to import component' });
    }
});

// Setup Server
async function start() {
    await initializeDatabase();

    // Only listen if not running in Vercel (Vercel handles the server)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on http://localhost:${PORT}`);
            console.log(`🔗 CORS: Allowing origins from ${allowedOrigins.join(', ')}`);
            console.log(`💾 Database: ${USE_MYSQL ? 'MySQL (Remote)' : 'LowDB'}`);
        });
    }
}

// Start if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
    start().catch(err => {
        console.error('❌ Fatal startup error:', err);
        process.exit(1);
    });
} else {
    // Vercel mode: Initialize DB but don't crash if it fails
    start().catch(err => {
        console.error('❌ DB initialization failed (Vercel):', err.message);
        // App still serves requests - individual routes will fail gracefully
    });
}

export default app;
