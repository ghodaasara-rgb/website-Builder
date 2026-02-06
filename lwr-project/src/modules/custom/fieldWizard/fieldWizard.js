import { LightningElement, track, api } from 'lwc';
import { FIELD_TYPES } from './fieldWizardConfig';

export default class FieldWizard extends LightningElement {
    @api objectId; // Passed from parent
    @track step = 1;
    @track selectedType = null;
    @track configValues = {};
    @track fieldLabel = '';
    @track fieldApiName = '';
    @track error = '';

    get fieldTypes() {
        return FIELD_TYPES;
    }

    get isStep1() { return this.step === 1; }
    get isStep2() { return this.step === 2; }
    get isStep3() { return this.step === 3; }

    get selectedTypeLabel() {
        return this.selectedType ? this.selectedType.label : '';
    }

    get dynamicConfigFields() {
        if (!this.selectedType) return [];
        return this.selectedType.config.map(field => ({
            ...field,
            isTextarea: field.type === 'textarea',
            isCheckbox: field.type === 'checkbox',
            isNumber: field.type === 'number',
            value: this.configValues[field.name] || field.defaultValue || ''
        }));
    }

    // Step 1: Select Type
    handleSelectType(event) {
        const typeCode = event.currentTarget.dataset.type;
        this.selectedType = FIELD_TYPES.find(t => t.type === typeCode);
        this.step = 2;
        this.error = '';
    }

    // Step 2: Configure
    handleLabelChange(event) {
        this.fieldLabel = event.target.value;
    }

    handleConfigChange(event) {
        const name = event.target.dataset.name;
        const type = event.target.type;
        const value = type === 'checkbox' ? event.target.checked : event.target.value;
        this.configValues = { ...this.configValues, [name]: value };
    }

    handleNext() {
        if (!this.fieldLabel) {
            this.error = 'Label is required';
            return;
        }
        this.step = 3;
    }

    handleBack() {
        this.step = this.step - 1;
        this.error = '';
    }

    // Step 3: Save
    async handleSave() {
        this.error = '';
        try {
            // Transform config values for picklist (split lines)
            const metadata = { ...this.configValues };
            if (this.selectedType.type === 'PICKLIST' && metadata.values && typeof metadata.values === 'string') {
                metadata.values = metadata.values.split('\n').map(v => v.trim()).filter(v => v);
            }

            const payload = {
                object_id: this.objectId,
                label: this.fieldLabel,
                data_type: this.selectedType.type,
                metadata: metadata
            };

            const BACKEND_BASE = (import.meta.env && import.meta.env.API_URL) ||
                process.env.API_URL ||
                'https://backend-six-xi-72.vercel.app';
            const response = await fetch(`${BACKEND_BASE}/api/schema/fields`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                // Try json parse
                try {
                    const errJson = JSON.parse(errText);
                    throw new Error(errJson.error || errText);
                } catch {
                    throw new Error(errText);
                }
            }

            const result = await response.json();
            console.log('Field created:', result);

            // Dispatch success event
            this.dispatchEvent(new CustomEvent('success', { detail: result }));

            // Reset or close
            this.step = 1;
            this.selectedType = null;
            this.configValues = {};
            this.fieldLabel = '';

        } catch (err) {
            this.error = err.message;
        }
    }
}
