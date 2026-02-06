# LWR Builder Component Standards

This document defines the strict standards for creating Lightning Web Components (LWC) incompatible with the LWR Website Builder.

## 1. File Structure
The component **MUST** be zipped with a single top-level folder matching the component name.

```text
myComponent.zip
└── myComponent/
    ├── myComponent.html        # Required: Template
    ├── myComponent.js          # Required: Controller
    ├── myComponent.js-meta.xml # Required: Metadata for Side Panel
    └── myComponent.css         # Optional: Styles
```

## 2. Metadata (js-meta.xml)
To expose properties in the Builder's Side Panel, you **MUST** define them in `js-meta.xml` using `<targetConfigs>`.

**Supported Types:**
- `String`: Renders a text input.
- `Integer`: Renders a number input.
- `Boolean`: Renders a checkbox/toggle.
- `Color`: Renders a color picker. (Note: Use `type="Color"` which is a custom extension for this builder, or `String` and name it `*Color`)

**Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
    </targets>
    <targetConfigs>
        <targetConfig targets="lightning__AppPage">
            <!-- Text Input -->
            <property name="heading" type="String" label="Card Heading" default="Hello World" />
            
            <!-- Color Picker -->
            <property name="backgroundColor" type="Color" label="Background Color" default="#ffffff" />
            
            <!-- Toggle -->
            <property name="showImage" type="Boolean" label="Show Image" default="true" />
        </targetConfig>
    </targetConfigs>
</LightningComponentBundle>
```

## 3. Component Implementation (JavaScript)
Properties defined in XML **MUST** be exposed as `@api` properties in your class.

```javascript
import { LightningElement, api } from 'lwc';

export default class MyComponent extends LightningElement {
    @api heading;
    @api backgroundColor;
    @api showImage;

    get style() {
        return `background-color: ${this.backgroundColor};`;
    }
}
```

## 4. CSS Variables
Use standard CSS Custom Properties for theming where possible.
- Avoid importing external stylesheets via `@import`.
- Scope styles using the host selector.

```css
/* myComponent.css */
:host {
    display: block;
    --c-text-color: #333;
}

.card {
    color: var(--c-text-color);
}
```

## 5. Restrictions
- **No 3rd Party NPM Imports**: The builder does not support `npm install` for uploaded components. All code must be self-contained or use standard LWC modules.
- **No Remote Calls**: Avoid `fetch` in `connectedCallback` unless strictly necessary and CORS is handled.
