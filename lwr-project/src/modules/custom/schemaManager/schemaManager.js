import { LightningElement, track } from 'lwc';

export default class SchemaManager extends LightningElement {
    @track objects = [];
    @track selectedObject = null;
    @track fields = [];
    @track showWizard = false;
    @track showFormPreview = false;

    // Mock form values for preview
    @track formValues = {};

    connectedCallback() {
        this.loadObjects();
    }

    async loadObjects() {
        try {
            const res = await fetch('/api/schema/objects');
            this.objects = await res.json();
        } catch (err) {
            console.error(err);
        }
    }

    async handleObjectSelect(event) {
        const objId = event.currentTarget.dataset.id;
        this.selectedObject = this.objects.find(o => o.id === objId);
        this.loadFields(objId);
        this.showFormPreview = false;
        this.showWizard = false;
    }

    async loadFields(objectId) {
        try {
            const res = await fetch(`/api/schema/objects/${objectId}/fields`);
            this.fields = await res.json();
        } catch (err) {
            console.error(err);
        }
    }

    handleBack() {
        this.selectedObject = null;
        this.fields = [];
    }

    // Wizard Interaction
    openWizard() {
        this.showWizard = true;
    }

    handleWizardSuccess(event) {
        console.log('Field Created!', event.detail);
        this.showWizard = false;
        if (this.selectedObject) {
            this.loadFields(this.selectedObject.id);
        }
    }

    closeWizard() {
        this.showWizard = false;
    }

    // Form Preview
    toggleFormPreview() {
        this.showFormPreview = !this.showFormPreview;
        this.formValues = {}; // reset
    }

    handleFieldChange(event) {
        const { apiName, value } = event.detail;
        this.formValues = { ...this.formValues, [apiName]: value };
    }

    get previewButtonLabel() {
        return this.showFormPreview ? 'Hide Preview' : 'Preview Form';
    }

    get jsonValues() {
        return JSON.stringify(this.formValues, null, 2);
    }

    handleCreateObject() {
        // Simple prompt for now to verify Phase 1 UI flow if needed, 
        // but verifying Phase 2/4 is priority.
        const label = prompt('Enter Object Label (e.g. "Ticket"):');
        if (!label) return;
        const plural = prompt('Enter Plural Label (e.g. "Tickets"):');
        if (!plural) return;

        fetch('/api/schema/objects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label, plural_label: plural })
        }).then(() => this.loadObjects());
    }
}
