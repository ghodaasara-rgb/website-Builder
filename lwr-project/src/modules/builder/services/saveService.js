// src/modules/builder/services/saveService.js
import { draftService } from '../state/draftService';
import { editorState } from '../state/editorState';
import { debounce } from '../../utils/debounce';
import { deepClone } from '../../utils/deepClone';

/**
 * Service that orchestrates auto‑save and manual save.
 * Auto‑save is debounced to avoid excessive network traffic.
 */
const AUTO_SAVE_DELAY = 1500; // ms

export const saveService = {
    // Initialize auto‑save listener – call once during app bootstrap
    initAutoSave() {
        // Listen to changes on editorState (simple example using a proxy)
        const handler = {
            set(target, prop, value) {
                target[prop] = value;
                if (prop !== 'isDirty') {
                    target.isDirty = true;
                }
                // Trigger debounced auto‑save
                this.debouncedSave();
                return true;
            }
        };
        // Wrap editorState in a Proxy to detect any mutation
        // NOTE: In a real LWC app you would use @track and a pub/sub pattern.
        // Here we provide a minimal illustrative approach.
        // eslint-disable-next-line no-self-assign
        editorState = new Proxy(editorState, handler);
        this.debouncedSave = debounce(this.autoSave.bind(this), AUTO_SAVE_DELAY);
    },

    async autoSave() {
        if (!editorState.isDirty || !editorState.draftId) return;
        try {
            const payload = deepClone(editorState.getPayload());
            await draftService.patchDraft(editorState.draftId, payload);
            // UI feedback could be emitted via a toast event (omitted here)
        } catch (e) {
            console.warn('Auto‑save failed', e);
            // Retry logic could be added here
        }
    },

    async manualSave() {
        if (!editorState.draftId) {
            // First‑time save – create a new draft
            const payload = deepClone(editorState.getPayload());
            const result = await draftService.createDraft({ payload });
            editorState.draftId = result.id;
        } else {
            const payload = deepClone(editorState.getPayload());
            await draftService.patchDraft(editorState.draftId, payload);
        }
        // Reset dirty flag
        editorState.setDirty(false);
        // Optionally record a version entry
        await versionService.recordVersion(editorState.draftId);
    }
};
