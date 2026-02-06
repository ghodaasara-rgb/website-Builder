// src/modules/builder/undoRedo/concreteCommands/addComponentCmd.js
import { Command } from '../command';
import { editorState } from '../../state/editorState';
import { generateId } from '../../utils/idGenerator';

/**
 * Command to add a new component to the editor.
 * payload: { type: string, props?: object, parentId?: string }
 */
export class AddComponentCmd extends Command {
    constructor({ type, props = {}, parentId = null }) {
        super('Add Component');
        this.component = {
            id: generateId('cmp'),
            type,
            props,
            parentId,
            order: 0 // will be set by service based on sibling count
        };
    }

    async execute() {
        // Insert component into editorState.components
        const comps = editorState.components;
        // Determine order based on existing siblings
        const siblings = comps.filter(c => c.parentId === this.component.parentId);
        this.component.order = siblings.length;
        comps.push(this.component);
        editorState.setDirty(true);
    }

    async undo() {
        // Remove the component we added
        const comps = editorState.components;
        const idx = comps.findIndex(c => c.id === this.component.id);
        if (idx !== -1) {
            comps.splice(idx, 1);
            editorState.setDirty(true);
        }
    }
}
