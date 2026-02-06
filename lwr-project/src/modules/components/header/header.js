import { LightningElement, api } from 'lwc';

export default class Header extends LightningElement {
    static renderMode = 'light';
    @api isSaving = false;

    handleSave() {
        this.dispatchEvent(new CustomEvent('save'));
    }

    handleDashboard() {
        this.dispatchEvent(new CustomEvent('dashboard'));
    }

    handlePreview() {
        this.dispatchEvent(new CustomEvent('preview'));
    }
}
