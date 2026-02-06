// src/modules/builder/services/publishService.js
import { draftService } from '../state/draftService';
import { editorState } from '../state/editorState';

/**
 * Service responsible for publishing a Draft to a Live snapshot.
 */
export const publishService = {
    async publish() {
        if (!editorState.draftId) {
            throw new Error('No draft available to publish');
        }
        // Ensure latest draft is saved before publishing
        const payload = editorState.getPayload();
        await draftService.patchDraft(editorState.draftId, payload);

        // Call Node.js backend to create Live snapshot
        const response = await fetch('/api/live', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ draftId: editorState.draftId })
        });
        const data = await response.json();
        // Reset dirty flag after successful publish
        editorState.setDirty(false);
        return data; // contains liveId, timestamp, etc.
    }
};
