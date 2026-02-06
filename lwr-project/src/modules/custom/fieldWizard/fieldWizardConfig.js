export const FIELD_TYPES = [
    {
        label: 'Text',
        type: 'TEXT',
        icon: 'utility:text',
        description: 'Single line of text',
        config: [
            { name: 'maxLength', label: 'Max Length', type: 'number', defaultValue: 255 }
        ]
    },
    {
        label: 'Number',
        type: 'NUMBER',
        icon: 'utility:number_input',
        description: 'Numeric value with precision',
        config: [
            { name: 'precision', label: 'Decimal Places', type: 'number', defaultValue: 0 }
        ]
    },
    {
        label: 'Picklist',
        type: 'PICKLIST',
        icon: 'utility:picklist_type',
        description: 'Select from a list of options',
        config: [
            { name: 'values', label: 'Values (One per line)', type: 'textarea', required: true }
        ]
    },
    {
        label: 'Checkbox',
        type: 'CHECKBOX',
        icon: 'utility:check',
        description: 'True or False toggle',
        config: [
            { name: 'defaultValue', label: 'Default Checked', type: 'checkbox' }
        ]
    },
    {
        label: 'Date',
        type: 'DATE',
        icon: 'utility:date_input',
        description: 'Date picker',
        config: []
    },
    {
        label: 'Email',
        type: 'EMAIL',
        icon: 'utility:email',
        description: 'Email address validation',
        config: []
    }
];
