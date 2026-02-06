// src/modules/builder/utils/deepClone.js
/**
 * Deeply clones a plain JavaScript object/array.
 * Uses structuredClone when available, otherwise falls back to JSON method.
 * @param {*} obj - The value to clone.
 * @returns {*} Deep clone of the input.
 */
export function deepClone(obj) {
    if (typeof structuredClone === 'function') {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
