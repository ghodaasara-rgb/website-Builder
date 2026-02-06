// src/modules/builder/undoRedo/concreteCommands/updateStyleCmd.js
import { Command } from '../command';
import { editorState } from '../../state/editorState';

/**
 * Command to update style properties of a component.
 * payload: { componentId: string, styleChanges: object }
 */
export class UpdateStyleCmd extends Command {
    constructor({ componentId, styleChanges }) {
        super('Update Component Style');
        this.componentId = componentId;
        this.styleChanges = styleChanges;
        this.prevStyle = null; // will store previous style for undo
    }

    async execute() {
        const comp = editorState.components.find(c => c.id === this.componentId);
        if (!comp) return;
        // Save previous style (assume comp.props.style exists)
        this.prevStyle = { ...(comp.props.style || {}) };
        // Merge new style changes
        comp.props.style = { ...(comp.props.style || {}), ...this.styleChanges };
        editorState.setDirty(true);
    }

    async undo() {
        const comp = editorState.components.find(c => c.id === this.componentId);
        if (!comp) return;
        comp.props.style = this.prevStyle;
        editorState.setDirty(true);
    }
}
