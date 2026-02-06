// src/modules/builder/components/header/header.js
import { LightningElement } from 'lwc';
import { saveService } from '../../services/saveService';
import { publishService } from '../../services/publishService';
import { commandStack } from '../../undoRedo/commandStack';

export default class BuilderHeader extends LightningElement {
    handleUndo() {
        commandStack.undo();
    }

    handleRedo() {
        commandStack.redo();
    }

    async handleManualSave() {
        try {
            await saveService.manualSave();
            this.dispatchEvent(new CustomEvent('toast', { detail: { variant: 'success', message: 'Draft saved.' } }));
        } catch (e) {
            console.error(e);
            this.dispatchEvent(new CustomEvent('toast', { detail: { variant: 'error', message: 'Save failed.' } }));
        }
    }

    async handlePublish() {
        try {
            const result = await publishService.publish();
            this.dispatchEvent(new CustomEvent('toast', { detail: { variant: 'success', message: `Published live ID ${result.liveId}` } }));
        } catch (e) {
            console.error(e);
            this.dispatchEvent(new CustomEvent('toast', { detail: { variant: 'error', message: 'Publish failed.' } }));
        }
    }
}
