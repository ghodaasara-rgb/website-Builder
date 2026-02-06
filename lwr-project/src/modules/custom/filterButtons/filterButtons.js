import { LightningElement, api } from 'lwc';

export default class FilterButtons extends LightningElement {
    @api activeFilter = 'all';

    handleFilterAll() {
        this.dispatchFilterEvent('all');
    }

    handleFilterDraft() {
        this.dispatchFilterEvent('draft');
    }

    handleFilterPublished() {
        this.dispatchFilterEvent('published');
    }

    dispatchFilterEvent(status) {
        this.dispatchEvent(new CustomEvent('filter', {
            detail: { status }
        }));
    }

    get allButtonClass() {
        return `filter-button ${this.activeFilter === 'all' ? 'active' : ''}`;
    }

    get draftButtonClass() {
        return `filter-button ${this.activeFilter === 'draft' ? 'active' : ''}`;
    }

    get publishedButtonClass() {
        return `filter-button ${this.activeFilter === 'published' ? 'active' : ''}`;
    }
}
