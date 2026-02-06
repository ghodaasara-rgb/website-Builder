// src/modules/builder/undoRedo/concreteCommands/deleteComponentCmd.js
import { Command } from '../command';
import { editorState } from '../../state/editorState';

/**
 * Command to delete a component by ID.
 */
export class DeleteComponentCmd extends Command {
    constructor(componentId) {
        super('Delete Component');
        this.componentId = componentId;
        this.backup = null; // will hold the removed component for undo
    }

    async execute() {
        const comps = editorState.components;
        const idx = comps.findIndex(c => c.id === this.componentId);
        if (idx === -1) return;
        this.backup = { ...comps[idx] };
        comps.splice(idx, 1);
        editorState.setDirty(true);
    }

    async undo() {
        if (!this.backup) return;
        editorState.components.push(this.backup);
        editorState.setDirty(true);
    }
}
