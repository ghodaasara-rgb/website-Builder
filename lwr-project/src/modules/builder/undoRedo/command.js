// src/modules/builder/undoRedo/command.js
/**
 * Base class for all editor commands.
 * Subclasses must implement `execute()` and `undo()`.
 */
export class Command {
    constructor(description) {
        this.description = description || 'Unnamed command';
    }

    /**
     * Perform the action.
     * Must be overridden.
     */
    async execute() {
        throw new Error('execute() not implemented');
    }

    /**
     * Revert the action.
     * Must be overridden.
     */
    async undo() {
        throw new Error('undo() not implemented');
    }
}
