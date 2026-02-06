// src/modules/builder/services/versionService.js
import { editorState } from '../state/editorState';

/**
 * Service for recording version metadata for a Draft.
 */
export const versionService = {
    async recordVersion(draftId) {
        const payload = {
            draftId,
            version: (editorState.currentVersion || 0) + 1,
            timestamp: new Date().toISOString(),
            // In a real UI you would capture a summary of changes; here we leave it empty.
            changeSummary: ''
        };
        const response = await fetch('/api/versions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        // Update local version counter
        editorState.currentVersion = payload.version;
        return data;
    },

    async fetchVersions(draftId) {
        const response = await fetch(`/api/versions?draftId=${draftId}`);
        return await response.json();
    }
};
