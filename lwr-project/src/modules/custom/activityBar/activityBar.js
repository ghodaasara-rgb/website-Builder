import { LightningElement, api } from 'lwc';

export default class ActivityBar extends LightningElement {
    static renderMode = 'light';
    @api activeTab = 'panel-build';

    get computedClassHeader() {
        return `activity-tab ${this.activeTab === 'panel-header' ? 'active' : ''}`;
    }

    handleTabClick(event) {
        const tabId = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('tabselect', { detail: tabId }));
    }

    get computedClassTheme() { return `activity-tab ${this.activeTab === 'panel-theme' ? 'active' : ''}`; }
    get computedClassBuild() { return `activity-tab ${this.activeTab === 'panel-build' ? 'active' : ''}`; }
    get computedClassStructure() { return `activity-tab ${this.activeTab === 'panel-structure' ? 'active' : ''}`; }
    get computedClassPages() { return `activity-tab ${this.activeTab === 'panel-pages' ? 'active' : ''}`; }
    get computedClassSettings() { return `activity-tab ${this.activeTab === 'panel-settings' ? 'active' : ''}`; }
}
