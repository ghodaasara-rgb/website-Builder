import { LightningElement, api } from 'lwc';

export default class DynamicFieldRenderer extends LightningElement {
    @api field; // { label, api_name, data_type, metadata_json, is_required }
    @api value;

    // Computed properties for template switching
    get isText() { return this.field.data_type === 'TEXT' || this.field.data_type === 'EMAIL' || this.field.data_type === 'URL'; }
    get isNumber() { return this.field.data_type === 'NUMBER' || this.field.data_type === 'CURRENCY' || this.field.data_type === 'PERCENT'; }
    get isCheckbox() { return this.field.data_type === 'CHECKBOX'; }
    get isDate() { return this.field.data_type === 'DATE'; }
    get isDateTime() { return this.field.data_type === 'DATETIME'; }
    get isPicklist() { return this.field.data_type === 'PICKLIST'; }
    get isTextarea() { return this.field.data_type === 'TEXT_AREA' || this.field.data_type === 'RICH_TEXT'; }

    get picklistOptions() {
        if (!this.field.metadata_json || !this.field.metadata_json.values) return [];
        return this.field.metadata_json.values.map(v => ({ label: v, value: v }));
    }

    get step() {
        if (this.field.metadata_json && this.field.metadata_json.precision !== undefined) {
            // e.g. precision 2 -> step 0.01
            return Math.pow(10, -(this.field.metadata_json.precision));
        }
        return 'any';
    }

    handleChange(event) {
        const val = this.field.data_type === 'CHECKBOX' ? event.target.checked : event.target.value;
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                fieldId: this.field.id,
                apiName: this.field.api_name,
                value: val
            }
        }));
    }
}
