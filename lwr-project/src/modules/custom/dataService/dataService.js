/**
 * Data Service Module
 * Handles all API communication with the Node.js backend
 */

// Backend API URL
// For production (Vercel), use the deployed backend URL
// For local development, use localhost
// Backend API URL
// On Vercel, set the API_URL environment variable to your deployed backend URL
const BACKEND_BASE = (function () {
    if (import.meta.env && import.meta.env.API_URL) {
        return import.meta.env.API_URL;
    }
    // Check if running in browser and on localhost
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001';
        }
    }
    return 'https://backend-six-xi-72.vercel.app';
})();

const API_BASE_URL = `${BACKEND_BASE}/api`;

export async function loadSites() {
    try {
        const response = await fetch(`${API_BASE_URL}/sites`);
        if (!response.ok) throw new Error('Failed to load sites');
        return await response.json();
    } catch (error) {
        console.error('❌ Error loading sites:', error);
        throw error;
    }
}

export async function createSite(name) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error('Failed to create site');
        return await response.json();
    } catch (error) {
        console.error('❌ Error creating site:', error);
        throw error;
    }
}

export async function deleteSite(siteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete site');
        return await response.json();
    } catch (error) {
        console.error('❌ Error deleting site:', error);
        throw error;
    }
}

/**
 * Save PAGE (Metadata + Components) - Composite Save (POST)
 */
export async function savePage(pageId, pageData) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData)
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to save page: ${err}`);
        }
        return await response.json();
    } catch (error) {
        console.error('❌ Error saving page:', error);
        throw error;
    }
}

/**
 * Update PAGE (Metadata + Components) - Composite Update (PUT)
 */
export async function updatePage(pageId, pageData) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pageData)
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to update page: ${err}`);
        }
        return await response.json();
    } catch (error) {
        console.error('❌ Error updating page:', error);
        throw error;
    }
}

/**
 * Load global site configuration (first site found)
 * @returns {Promise<Object>} Site data from the server
 */
export async function loadSite(siteId = null) {
    try {
        let site;

        if (siteId) {
            // Fetch specific site
            const response = await fetch(`${API_BASE_URL}/sites/${siteId}`);
            if (!response.ok) throw new Error('Failed to load site');
            site = await response.json();
        } else {
            // Fallback: Fetch all sites and take the first one
            const response = await fetch(`${API_BASE_URL}/sites`);
            if (!response.ok) throw new Error('Failed to load sites');
            const sites = await response.json();
            site = sites.length > 0 ? sites[0] : null;
        }

        if (site) {
            // Fetch pages for this site to match strict builder contract
            const pagesResponse = await fetch(`${API_BASE_URL}/sites/${site.id}/pages`);
            if (pagesResponse.ok) {
                site.pages = await pagesResponse.json();
            } else {
                site.pages = [];
            }
        }
        return site;
    } catch (error) {
        console.error('❌ Error loading site:', error);
        throw error;
    }
}

/**
 * Load all pages for a site
 * @param {string} siteId
 * @returns {Promise<Array>} List of pages
 */
export async function loadSitePages(siteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}/pages`);
        if (!response.ok) throw new Error('Failed to load pages');
        return await response.json();
    } catch (error) {
        console.error('❌ Error loading pages:', error);
    }
}

/**
 * Load site theme/branding settings
 * @param {string} siteId
 * @returns {Promise<Object>} Theme configuration
 */
export async function loadSiteTheme(siteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}/theme`);
        if (!response.ok) throw new Error('Failed to load theme');
        return await response.json();
    } catch (error) {
        console.error('❌ Error loading theme:', error);
        return null; // Return null on error, use defaults
    }
}

/**
 * Save site theme/branding settings
 * @param {string} siteId
 * @param {Object} theme - Theme object with colors, typography, layout
 * @returns {Promise<Object>} Updated theme
 */
export async function saveSiteTheme(siteId, theme) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}/theme`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(theme)
        });
        if (!response.ok) throw new Error('Failed to save theme');
        return await response.json();
    } catch (error) {
        console.error('❌ Error saving theme:', error);
        throw error;
    }
}

/**
 * Create a new page for a site
 * @param {string} siteId
 * @param {string} name
 * @param {string} slug
 * @returns {Promise<Object>} The created page
 */
export async function createPage(siteId, name, slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, slug })
        });
        if (!response.ok) throw new Error('Failed to create page');
        return await response.json();
    } catch (error) {
        console.error('❌ Error creating page:', error);
        throw error;
    }
}

/**
 * Load specific page data (Metadata + Components)
 * @param {string} pageId - The ID of the page to load
 * @returns {Promise<Object>} Page object with integrated components
 */
export async function loadPage(pageId) {
    try {
        // Parallel fetch for page metadata and its components
        const [pageRes, componentsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/pages/${pageId}`),
            fetch(`${API_BASE_URL}/pages/${pageId}/components`)
        ]);

        if (!pageRes.ok || !componentsRes.ok) {
            throw new Error('Failed to load page data');
        }

        const page = await pageRes.json();
        const components = await componentsRes.json();

        // Reconstruct layout structure expected by builder
        return {
            ...page,
            layout: {
                sections: components // Builder expects 'sections' array
            }
        };
    } catch (error) {
        console.error(`❌ Error loading page ${pageId}:`, error);
        throw error;
    }
}

/**
 * Save PAGE METADATA only (not components)
 * @param {string} pageId
 * @param {Object} pageMeta
 */
export async function savePageMetadata(pageId, pageMeta) {
    // Implement PUT /api/pages/:id if needed for title/slug updates
    console.warn('savePageMetadata not fully implemented on backend yet');
}

/**
 * Delete a page
 * @param {string} pageId
 */
export async function deletePage(pageId) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete page');
        return await response.json();
    } catch (error) {
        console.error('❌ Error deleting page:', error);
        throw error;
    }
}

/**
 * Add a new component to a page
 * @param {string} pageId
 * @param {Object} componentData { type, props, order }
 */
export async function addComponent(pageId, componentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/components`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(componentData)
        });
        return await response.json();
    } catch (error) {
        console.error('❌ Error adding component:', error);
        throw error;
    }
}

/**
 * Update an existing component
 * @param {string} componentId
 * @param {Object} updates { props: {...} }
 */
export async function updateComponent(componentId, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/components/${componentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await response.json();
    } catch (error) {
        console.error('❌ Error updating component:', error);
        throw error;
    }
}

/**
 * Delete a component
 * @param {string} componentId
 */
export async function deleteComponent(componentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/components/${componentId}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('❌ Error deleting component:', error);
        throw error;
    }
}

/**
 * Get all custom components
 * @returns {Promise<Array>} List of custom components
 */
export async function getAllCustomComponents() {
    if (USE_MYSQL) {
        return await MysqlDB.getAllCustomComponents();
    } else {
        const db = await getDB();
        return db.data.custom_components || [];
    }
}

/**
 * Upload Favicon for a site
 * @param {string} siteId
 * @param {File} file
 */
export async function uploadFavicon(siteId, file) {
    try {
        const formData = new FormData();
        formData.append('favicon', file);

        const response = await fetch(`${API_BASE_URL}/sites/${siteId}/favicon`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to upload favicon');
        return await response.json();
    } catch (error) {
        console.error('❌ Error uploading favicon:', error);
        throw error;
    }
}

/**
 * Update Site Settings (Name, Domain, Status, Favicon)
 * @param {string} siteId
 * @param {Object} updates
 */
export async function updateSite(siteId, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/sites/${siteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        if (!response.ok) throw new Error('Failed to update site');
        return await response.json();
    } catch (error) {
        console.error('❌ Error updating site:', error);
        throw error;
    }
}

/**
 * Reorder components on a page
 * @param {string} pageId
 * @param {Array<string>} componentIds Ordered list of IDs
 */
export async function reorderComponents(pageId, componentIds) {
    try {
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/reorder`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ componentIds })
        });
        return await response.json();
    } catch (error) {
        console.error('❌ Error reordering components:', error);
        throw error;
    }
}
