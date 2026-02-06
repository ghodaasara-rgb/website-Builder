// src/modules/builder/state/editorState.js
import { LightningElement, track } from 'lwc';

/**
 * Central singleton store for the builder editor.
 * Exposes reactive properties used across components.
 */
class EditorState {
    // Reactive properties (LWC tracks @track fields on instances, but we use a simple object)
    constructor() {
        this.draftId = null; // will be set when a draft is created/fetched
        this.isDirty = false;
        this.components = []; // array of component descriptors
        this.layout = {}; // layout tree
        this.styles = {}; // global style overrides
        this.lastSavedAt = null;
    }

    setDirty(flag = true) {
        this.isDirty = flag;
    }

    updatePayload(payload) {
        const { components, layout, styles, draftId } = payload;
        if (components) this.components = components;
        if (layout) this.layout = layout;
        if (styles) this.styles = styles;
        if (draftId) this.draftId = draftId;
        this.setDirty(true);
    }

    getPayload() {
        return {
            draftId: this.draftId,
            components: this.components,
            layout: this.layout,
            styles: this.styles
        };
    }
}

// Export a singleton instance
export const editorState = new EditorState();
