// src/modules/builder/utils/debounce.js
/**
 * Creates a debounced version of a function.
 * The function will be invoked after `wait` ms have elapsed since the last call.
 * @param {Function} func - Function to debounce.
 * @param {number} wait - Milliseconds to wait.
 * @returns {Function} Debounced function.
 */
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
