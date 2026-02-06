import { LightningElement, track } from 'lwc';

export default class SearchBar extends LightningElement {
    @track searchValue = '';
    @track searchValue = '';

    handleSearchInput(event) {
        this.searchValue = event.target.value;

        // Debounced search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.dispatchEvent(new CustomEvent('search', {
                detail: { query: this.searchValue }
            }));
        }, 300);
    }

    disconnectedCallback() {
        clearTimeout(this.searchTimeout);
    }
}
