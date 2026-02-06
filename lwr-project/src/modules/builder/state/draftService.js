// src/modules/builder/state/draftService.js
import { editorState } from './editorState';

/**
 * Service responsible for creating, fetching and patching Draft records.
 * Uses the Node.js Express API under /api/drafts.
 */
export const draftService = {
    async createDraft(initialPayload) {
        const response = await fetch('/api/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: initialPayload })
        });
        const data = await response.json();
        editorState.draftId = data.id;
        editorState.setDirty(false);
        return data;
    },

    async fetchDraft(draftId) {
        const response = await fetch(`/api/drafts/${draftId}`);
        const data = await response.json();
        editorState.updatePayload(data.payload);
        editorState.lastSavedAt = data.updatedAt;
        editorState.setDirty(false);
        return data;
    },

    async patchDraft(draftId, payload) {
        const response = await fetch(`/api/drafts/${draftId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload })
        });
        const data = await response.json();
        editorState.lastSavedAt = data.updatedAt;
        editorState.setDirty(false);
        return data;
    }
};
