import { LightningElement } from 'lwc';

export default class EmptyState extends LightningElement {
    handleCreate() {
        this.dispatchEvent(new CustomEvent('create'));
    }
}
