/**
 * Database Abstraction Layer
 * Provides unified API that works with both LowDB and Neon Postgres
 */

import { getDB } from './db.js';
import * as MysqlDB from './mysql-db.js';
import { nanoid } from 'nanoid';

// Determine if we should use MySQL based on env vars
const USE_MYSQL = process.env.MYSQL_HOST && process.env.MYSQL_DATABASE;

// ============ SITES ============

export async function getAllSites() {
    if (USE_MYSQL) {
        return await MysqlDB.getAllSites();
    } else {
        const db = await getDB();
        return db.data.sites;
    }
}

export async function getSiteById(id) {
    if (USE_MYSQL) {
        return await MysqlDB.getSiteById(id);
    } else {
        const db = await getDB();
        return db.data.sites.find(s => s.id === id);
    }
}

export async function createSite(site) {
    if (USE_MYSQL) {
        const siteToCreate = {
            ...site,
            id: site.id || `site_${nanoid()}`
        };
        return await MysqlDB.createSite(siteToCreate);
    } else {
        const db = await getDB();
        const newSite = {
            id: `site_${nanoid()}`,
            name: site.name || 'Untitled Site',
            domain: site.domain || '',
            theme: site.theme || {},
            status: site.status || 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        db.data.sites.push(newSite);
        await db.write();
        return newSite;
    }
}

export async function updateSite(id, updates) {
    if (USE_MYSQL) {
        return await MysqlDB.updateSite(id, updates);
    } else {
        const db = await getDB();
        const site = db.data.sites.find(s => s.id === id);
        if (!site) return null;

        if (updates.name !== undefined) site.name = updates.name;
        if (updates.domain !== undefined) site.domain = updates.domain;
        if (updates.status !== undefined) site.status = updates.status;
        if (updates.favicon !== undefined) site.favicon = updates.favicon;
        site.updatedAt = new Date().toISOString();

        await db.write();
        return site;
    }
}

export async function updateSiteTheme(id, theme) {
    if (USE_MYSQL) {
        return await MysqlDB.updateSiteTheme(id, theme);
    } else {
        const db = await getDB();
        const site = db.data.sites.find(s => s.id === id);
        if (!site) return null;

        if (!site.theme) site.theme = {};
        if (theme.colors) site.theme.colors = { ...site.theme.colors, ...theme.colors };
        if (theme.typography) site.theme.typography = { ...site.theme.typography, ...theme.typography };
        if (theme.layout) site.theme.layout = theme.layout;
        site.updatedAt = new Date().toISOString();

        await db.write();
        return site;
    }
}

export async function deleteSite(id) {
    if (USE_MYSQL) {
        return await MysqlDB.deleteSite(id);
    } else {
        const db = await getDB();
        const siteIndex = db.data.sites.findIndex(s => s.id === id);
        if (siteIndex === -1) return null;

        const deletedSite = db.data.sites.splice(siteIndex, 1)[0];

        // Get all pages for this site
        const pageIds = db.data.pages.filter(p => p.siteId === id).map(p => p.id);

        // Delete all related data
        db.data.pages = db.data.pages.filter(p => p.siteId !== id);
        db.data.components = db.data.components.filter(c => !pageIds.includes(c.pageId));

        await db.write();
        return deletedSite;
    }
}

// ============ PAGES ============

export async function getPagesBySiteId(siteId) {
    if (USE_MYSQL) {
        return await MysqlDB.getPagesBySiteId(siteId);
    } else {
        const db = await getDB();
        return db.data.pages.filter(p => p.siteId === siteId);
    }
}

export async function getPageById(id) {
    if (USE_MYSQL) {
        return await MysqlDB.getPageById(id);
    } else {
        const db = await getDB();
        return db.data.pages.find(p => p.id === id);
    }
}

export async function createPage(page) {
    if (USE_MYSQL) {
        // Ensure ID and Order are present for MySQL
        const pageToCreate = {
            ...page,
            id: page.id || `page_${nanoid()}`,
        };

        if (pageToCreate.order === undefined) {
            const existing = await MysqlDB.getPagesBySiteId(page.siteId);
            pageToCreate.order = existing ? existing.length : 0;
        }

        return await MysqlDB.createPage(pageToCreate);
    } else {
        const db = await getDB();
        const newPage = {
            id: `page_${nanoid()}`,
            siteId: page.siteId,
            title: page.title || 'Untitled Page',
            slug: page.slug || `/page-${nanoid(6)}`,
            isPublished: page.isPublished ?? true,
            order: page.order ?? db.data.pages.filter(p => p.siteId === page.siteId).length,
            metadata: page.metadata || {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };
        db.data.pages.push(newPage);
        await db.write();
        return newPage;
    }
}

export async function updatePage(id, updates) {
    if (USE_MYSQL) {
        return await MysqlDB.updatePage(id, updates);
    } else {
        const db = await getDB();
        const page = db.data.pages.find(p => p.id === id);
        if (!page) return null;

        if (updates.name) page.name = updates.name;
        if (updates.name) page.title = updates.name;
        if (updates.slug) page.slug = updates.slug;
        if (updates.metadata) page.metadata = { ...page.metadata, ...updates.metadata };
        page.metadata.updatedAt = new Date().toISOString();

        await db.write();
        return page;
    }
}

export async function deletePage(id) {
    if (USE_MYSQL) {
        return await MysqlDB.deletePage(id);
    } else {
        const db = await getDB();
        const index = db.data.pages.findIndex(p => p.id === id);
        if (index === -1) return null;

        const deleted = db.data.pages.splice(index, 1)[0];
        // Cleanup components
        if (db.data.components) {
            db.data.components = db.data.components.filter(c => c.pageId !== id);
        }
        await db.write();
        return deleted;
    }
}

// ============ COMPONENTS ============

export async function getComponentsByPageId(pageId) {
    if (USE_MYSQL) {
        return await MysqlDB.getComponentsByPageId(pageId);
    } else {
        const db = await getDB();
        return db.data.components
            .filter(c => c.pageId === pageId)
            .sort((a, b) => a.order - b.order);
    }
}

export async function createComponent(component) {
    if (USE_MYSQL) {
        // Ensure ID is present
        const componentToCreate = {
            ...component,
            id: component.id || `cmp_${nanoid()}`
        };
        return await MysqlDB.createComponent(componentToCreate);
    } else {
        const db = await getDB();
        const existingComponents = db.data.components.filter(c => c.pageId === component.pageId);

        const newComponent = {
            id: `cmp_${nanoid()}`,
            pageId: component.pageId,
            type: component.type,
            props: component.props || {},
            order: component.order ?? existingComponents.length
        };

        db.data.components.push(newComponent);
        await db.write();
        return newComponent;
    }
}

export async function updateComponent(id, updates) {
    if (USE_MYSQL) {
        return await MysqlDB.updateComponent(id, updates);
    } else {
        const db = await getDB();
        const component = db.data.components.find(c => c.id === id);
        if (!component) return null;

        if (updates.props) component.props = { ...component.props, ...updates.props };

        await db.write();
        return component;
    }
}

export async function deleteComponent(id) {
    if (USE_MYSQL) {
        return await MysqlDB.deleteComponent(id);
    } else {
        const db = await getDB();
        const index = db.data.components.findIndex(c => c.id === id);
        if (index === -1) return null;

        db.data.components.splice(index, 1);
        await db.write();
        return { success: true };
    }
}

export async function deleteComponentsByPageId(pageId) {
    if (USE_MYSQL) {
        return await MysqlDB.deleteComponentsByPageId(pageId);
    } else {
        const db = await getDB();
        db.data.components = db.data.components.filter(c => c.pageId !== pageId);
        await db.write();
        return { success: true };
    }
}

export async function reorderComponents(pageId, componentIds) {
    if (USE_MYSQL) {
        return await MysqlDB.reorderComponents(pageId, componentIds);
    } else {
        const db = await getDB();
        componentIds.forEach((compId, index) => {
            const component = db.data.components.find(c => c.id === compId && c.pageId === pageId);
            if (component) {
                component.order = index;
            }
        });
        await db.write();
        return { success: true };
    }
}
// ============ CUSTOM COMPONENTS ============

export async function createCustomComponent(component) {
    if (USE_MYSQL) {
        return await MysqlDB.createCustomComponent({
            ...component,
            id: component.id || `custom_${nanoid()}`
        });
    } else {
        const db = await getDB();
        // Initialize if not exists
        if (!db.data.custom_components) db.data.custom_components = [];

        const newComponent = {
            id: `custom_${nanoid()}`,
            name: component.name,
            label: component.label,
            type: component.type || 'custom',
            path: component.path,
            defaultProps: component.defaultProps || {},
            fields: component.fields || [],
            createdAt: new Date().toISOString()
        };
        db.data.custom_components.push(newComponent);
        await db.write();
        return newComponent;
    }
}

export async function getAllCustomComponents() {
    if (USE_MYSQL) {
        return await MysqlDB.getAllCustomComponents();
    } else {
        const db = await getDB();
        return db.data.custom_components || [];
    }
}
