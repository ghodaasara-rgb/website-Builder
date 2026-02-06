// src/modules/builder/utils/idGenerator.js
import { nanoid } from 'nanoid';
/**
 * Generates a unique identifier for components, drafts, etc.
 * Wraps nanoid to provide a consistent prefix.
 * @param {string} prefix - Optional prefix (e.g., 'cmp', 'draft').
 * @returns {string} Prefixed unique ID.
 */
export function generateId(prefix = '') {
    const id = nanoid();
    return prefix ? `${prefix}_${id}` : id;
}
