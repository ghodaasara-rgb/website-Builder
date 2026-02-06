const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');
const PAGES_DIR = path.join(DATA_DIR, 'pages');
const SITE_FILE = path.join(DATA_DIR, 'site.json');
const LEGACY_DATA_FILE = path.join(DATA_DIR, 'site-data.json');

const schemaRoutes = require('./server/routes/schema');
require('./server/db'); // Initialize DB

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount Schema Routes
app.use('/api/schema', schemaRoutes);

// Serve static files from LWR build (will be available after LWR starts)
app.use(express.static(path.join(__dirname, 'dist')));

// Helper: Ensure directory exists
async function ensureDir(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// Helper: Check if file exists
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Ensure data directory and structure exist
async function ensureDataStructure() {
    await ensureDir(DATA_DIR);
    await ensureDir(PAGES_DIR);

    // Migration Logic: Check for legacy file and no new site file
    if ((await fileExists(LEGACY_DATA_FILE)) && !(await fileExists(SITE_FILE))) {
        console.log('🔄 Migrating legacy data...');
        try {
            const legacyData = JSON.parse(await fs.readFile(LEGACY_DATA_FILE, 'utf-8'));

            // 1. Create site.json (activePageId, version, generic metadata)
            const siteData = {
                version: legacyData.version || '1.0.0',
                activePageId: legacyData.activePageId || (legacyData.pages[0] ? legacyData.pages[0].id : null),
                pages: legacyData.pages.map(p => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug
                })) // Minimal page info for listing
            };
            await fs.writeFile(SITE_FILE, JSON.stringify(siteData, null, 2), 'utf-8');

            // 2. Create individual page files
            for (const page of legacyData.pages) {
                const pageFile = path.join(PAGES_DIR, `${page.id}.json`);
                await fs.writeFile(pageFile, JSON.stringify(page, null, 2), 'utf-8');
            }

            console.log('✓ Migration complete');
        } catch (error) {
            console.error('❌ Migration failed:', error);
        }
    } else if (!(await fileExists(SITE_FILE))) {
        // Initialize fresh if no data exists
        const defaultPageId = 'page-1';
        const defaultSite = {
            version: '1.0.0',
            activePageId: defaultPageId,
            pages: [{ id: defaultPageId, name: 'Home', slug: '/' }]
        };

        const defaultPage = {
            id: defaultPageId,
            name: 'Home',
            slug: '/',
            layout: { sections: [] },
            metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        await fs.writeFile(SITE_FILE, JSON.stringify(defaultSite, null, 2), 'utf-8');
        await fs.writeFile(path.join(PAGES_DIR, `${defaultPageId}.json`), JSON.stringify(defaultPage, null, 2), 'utf-8');
        console.log('✓ Created default site structure');
    }
}

// API Routes

/**
 * GET /api/site
 * Load site configuration (list of pages, active page)
 */
app.get('/api/site', async (req, res) => {
    try {
        if (await fileExists(SITE_FILE)) {
            const data = JSON.parse(await fs.readFile(SITE_FILE, 'utf-8'));
            res.json(data);
        } else {
            res.status(404).json({ error: 'Site configuration not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dummy endpoint to unblock frontend
app.get('/api/sites', (req, res) => {
    res.json([]);
});

/**
 * GET /api/pages/:id
 * Load specific page data
 */
app.get('/api/pages/:id', async (req, res) => {
    try {
        const pageId = req.params.id;
        const pageFile = path.join(PAGES_DIR, `${pageId}.json`);

        if (await fileExists(pageFile)) {
            const data = JSON.parse(await fs.readFile(pageFile, 'utf-8'));
            res.json(data);
        } else {
            res.status(404).json({ error: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/pages/:id
 * Save specific page data
 */
app.post('/api/pages/:id', async (req, res) => {
    try {
        const pageId = req.params.id;
        const pageData = req.body;
        const pageFile = path.join(PAGES_DIR, `${pageId}.json`);

        if (!pageData) {
            return res.status(400).json({ error: 'No data provided' });
        }

        // Update timestamp
        pageData.metadata = {
            ...pageData.metadata,
            updatedAt: new Date().toISOString()
        };

        await fs.writeFile(pageFile, JSON.stringify(pageData, null, 2), 'utf-8');

        console.log(`✓ Saved page ${pageId}`);
        res.json({ success: true, timestamp: pageData.metadata.updatedAt });
    } catch (error) {
        console.error('❌ Save error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Legacy Support / Composite Load
 * Returns full site structure for initial backward compatibility if needed,
 * or as a complete dump.
 */
app.get('/api/load', async (req, res) => {
    try {
        const siteData = JSON.parse(await fs.readFile(SITE_FILE, 'utf-8'));
        const fullPages = [];

        for (const p of siteData.pages) {
            const pFile = path.join(PAGES_DIR, `${p.id}.json`);
            if (await fileExists(pFile)) {
                fullPages.push(JSON.parse(await fs.readFile(pFile, 'utf-8')));
            }
        }

        res.json({
            ...siteData,
            pages: fullPages
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start LWR in development mode
function startLWR() {
    const lwrProcess = spawn('npx', ['lwr', 'dev', '--port', '3002'], {
        cwd: __dirname,
        stdio: 'inherit'
    });

    lwrProcess.on('error', (error) => {
        console.error('❌ Failed to start LWR:', error);
    });

    return lwrProcess;
}

// Start server
async function start() {
    try {
        await ensureDataStructure();

        app.listen(PORT, () => {
            console.log('\n🚀 LWR Site Builder Server Started (New Database Structure)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📡 API Server:    http://localhost:${PORT}`);
            console.log(`🎨 LWR Frontend:  http://localhost:3002`);
            console.log(`💾 Data Dir:      ${DATA_DIR}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        });

        setTimeout(() => startLWR(), 1000);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

start();
