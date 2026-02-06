// src/modules/builder/undoRedo/commandStack.js
import { Command } from './command';

/**
 * Manages undo and redo stacks.
 * Provides `push`, `undo`, `redo` methods.
 */
export const commandStack = {
    undoStack: [], // array of Command instances
    redoStack: [],

    /**
     * Push a new command onto the undo stack and clear redo stack.
     * @param {Command} cmd
     */
    push(cmd) {
        if (!(cmd instanceof Command)) {
            throw new Error('Only Command instances can be pushed');
        }
        this.undoStack.push(cmd);
        this.redoStack = [];
    },

    /**
     * Undo the last command.
     */
    async undo() {
        if (this.undoStack.length === 0) return;
        const cmd = this.undoStack.pop();
        await cmd.undo();
        this.redoStack.push(cmd);
    },

    /**
     * Redo the last undone command.
     */
    async redo() {
        if (this.redoStack.length === 0) return;
        const cmd = this.redoStack.pop();
        await cmd.execute();
        this.undoStack.push(cmd);
    }
};
