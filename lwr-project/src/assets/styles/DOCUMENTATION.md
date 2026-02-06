# Enterprise CSS Framework Documentation

## 1. Framework Overview

### Introduction

The Enterprise CSS Framework is a modular, token-based design system modeled after modern utilities like Tailwind and SLDS, but built with a strict "semantic-first" philosophy. It enforces separation of concerns through a three-layer architecture (Primitives, Semantics, Components), ensuring consistency, maintainability, and accessibility across enterprise SaaS applications. The framework is designed to be "raw CSS" with no build step required for consumption, relying on native CSS variables for powerful runtime theming.

### Directory Structure

- **`framework/tokens.css`**: The core DNA of the system. Defines all design tokens including Primitives (raw values) and Semantics (contextual abstractions). This is the source of truth.
- **`framework/themes/`**: Contains the theming engine files.
  - `light.css`, `dark.css`: Base mode definitions.
  - `tenant-*.css`: Customer-specific overrides for multi-tenancy.
- **`framework/components/`**: Atomic UI elements (Buttons, Inputs, Badges). Each file is self-contained and consumes _only_ semantic tokens.
- **`framework/layout/`**: Structural patterns (Grid, Modal, Drawer) that handle positioning and macro-layout.
- **`framework/builder/`**: Specific styles for the visual editor/builder tool, scoped to avoid conflicts with the main application.
- **`framework/framework.css`**: The single entry point that imports all layers in the correct order for easy consumption.

---

## 2. Installation & Usage

### Quick Start

To use the framework, simply import the single entry point file `framework.css` into your project. This file automatically loads all necessary tokens, themes, layouts, and components.

1.  **Download**: Copy the entire `framework/` directory to your project (e.g., inside `assets/css/`).
2.  **Import**: Link `framework.css` in your HTML `<head>`.
3.  **Activate**: Set the `data-theme="light"` attribute on your `<body>` tag.

### HTML Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Enterprise App</title>
    <!-- Import Framework -->
    <link rel="stylesheet" href="assets/framework/framework.css" />
  </head>
  <body data-theme="light">
    <main class="page">
      <div class="container">
        <h1>Hello World</h1>
        <button class="btn btn--primary">Click Me</button>
      </div>
    </main>
  </body>
</html>
```

---

## 3. Theming & Architecture

### Design Tokens

The framework relies on a strict token hierarchy defined in `tokens.css`:

1.  **Primitives (`--p-*`)**: Raw values (e.g., `--p-color-neutral-900`, `--p-space-4`). _Rule: Never use these directly in components._
2.  **Semantics (`--s-*`)**: Context-aware aliases (e.g., `--s-text-primary`, `--s-bg-surface`). _Rule: Components must consume these._
3.  **Component Overrides (`--c-*`)**: (Optional) Specific overrides for fine-grained control if needed.

### Multi-Tenancy

The framework supports powerful runtime theming via CSS Variables and Data Attributes.

- **Base Modes**: `data-theme="light"` or `data-theme="dark"` on the `<body>` tag switches the entire color palette by redefining the Semantic Tokens.
- **Tenant Layer**: Tenant files (e.g., `tenant-acme.css`) allow "white-labeling" by overriding specific semantic tokens (like `--s-bg-primary`) under a `[data-tenant="acme"]` selector. This allows the application to adapt to different customer brands seamlessly without changing component CSS.

---

## 4. Component Library

### Alert & Toast (`components/alert.css`)

Displays valid feedback messages.
**Classes**: `.alert`, `.alert--success`, `.alert--error`, `.alert--warning`, `.alert--info`

```html
<div class="alert alert--info">
  <span>System update pending.</span>
</div>
```

### Badge (`components/badge.css`)

Small status descriptors.
**Classes**: `.badge`, `.badge--success`, `.badge--warning`

```html
<span class="badge badge--success">Active</span>
```

### Breadcrumbs (`components/breadcrumbs.css`)

Navigation trail.
**Classes**: `.breadcrumbs`, `.breadcrumbs-item`, `.breadcrumbs-link`

```html
<ul class="breadcrumbs">
  <li class="breadcrumbs-item">
    <a href="#" class="breadcrumbs-link">Home</a>
  </li>
  <li class="breadcrumbs-item">Settings</li>
</ul>
```

### Button (`components/button.css`)

Interactive triggers.
**Classes**: `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--destructive`, `.btn--ghost`, `.btn--sm`, `.btn--lg`, `.btn--block`

```html
<button class="btn btn--primary">Save Changes</button>
<button class="btn btn--secondary btn--sm">Cancel</button>
```

### Checkbox & Radio (`components/checkbox-radio.css`)

Selection controls.
**Classes**: `.checkbox`, `.radio`, `.switch`

```html
<input type="checkbox" class="checkbox" />
<input type="radio" class="radio" />
<input type="checkbox" class="switch" />
```

### Empty State (`components/empty-state.css`)

Placeholder for missing content.
**Classes**: `.empty-state`, `.empty-state-icon`, `.empty-state-title`

```html
<div class="empty-state">
  <h3 class="empty-state-title">No Projects</h3>
</div>
```

### Input (`components/input.css`)

Text fields.
**Classes**: `.input`, `.input--error`, `.input--sm`

```html
<input type="text" class="input" placeholder="Enter name..." />
```

### Loader (`components/loader.css`)

Loading spinner.
**Classes**: `.loader`, `.loader--sm`, `.loader--lg`

```html
<div class="loader"></div>
```

### Navigation (`components/nav.css`)

Global and side navigation patterns.
**Classes**: `.global-nav`, `.side-nav`, `.side-nav-link`

```html
<nav class="side-nav">
  <a href="#" class="side-nav-link" aria-current="page">Dashboard</a>
</nav>
```

### Pagination (`components/pagination.css`)

Page navigation.
**Classes**: `.pagination`, `.pagination-link`

```html
<ul class="pagination">
  <li><a href="#" class="pagination-link" aria-current="page">1</a></li>
  <li><a href="#" class="pagination-link">2</a></li>
</ul>
```

### Select (`components/select.css`)

Dropdown menus.
**Classes**: `.select`, `.select--error`

```html
<select class="select">
  <option>Option 1</option>
</select>
```

### Table (`components/table.css`)

Data grids.
**Classes**: `.table`, `.table-container`, `.table--striped`, `.table--compact`

```html
<div class="table-container">
  <table class="table table--striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice</td>
        <td>Admin</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 5. Layout & Patterns

### Grid System (`layout/grid.css`)

Responsive 12-column grid.
**Classes**: `.grid`, `.col-span-{1-12}`, `.container`

```html
<div class="container">
  <div class="grid">
    <div class="col-span-4">Sidebar</div>
    <div class="col-span-8">Content</div>
  </div>
</div>
```

### Accordion (`layout/accordion.css`)

Collapsible sections.
**Classes**: `.accordion`, `.accordion-item`, `.accordion-trigger`
**Note**: Requires JS to toggle `.is-open` on `.accordion-item`.

```html
<div class="accordion">
  <div class="accordion-item is-open">
    <button class="accordion-trigger">Section 1</button>
    <div class="accordion-content">Content...</div>
  </div>
</div>
```

### Card (`layout/card.css`)

Content container.
**Classes**: `.card`, `.card-header`, `.card-body`, `.card-footer`, `.card--interactive`

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">Body Content</div>
</div>
```

### Drawer (`layout/drawer.css`)

Slide-out panel.
**Classes**: `.drawer`, `.drawer-backdrop`, `.drawer-header`, `.drawer-body`
**Note**: Requires JS to toggle `.is-open` on `.drawer-backdrop`.

```html
<div class="drawer-backdrop is-open">
  <div class="drawer">
    <div class="drawer-header">Menu</div>
    <div class="drawer-body">...</div>
  </div>
</div>
```

### Modal (`layout/modal.css`)

Dialog overlay.
**Classes**: `.modal`, `.modal-backdrop`, `.modal-header`, `.modal-body`
**Note**: Requires JS to toggle `.is-open` on `.modal-backdrop`.

```html
<div class="modal-backdrop is-open">
  <div class="modal">
    <div class="modal-header">Confirm</div>
    <div class="modal-body">Are you sure?</div>
  </div>
</div>
```

### Section & Sticky (`layout/section.css`, `layout/sticky.css`)

Page structure control.
**Classes**: `.section`, `.section--hero`, `.sticky-header`, `.sticky-footer`

### Tabs (`layout/tabs.css`)

Tabbed content.
**Classes**: `.tabs`, `.tabs-list`, `.tab-trigger`, `.tab-content`
**Note**: Requires JS to handle active state toggling.

---

## 6. Accessibility (A11y)

The framework is built with WCAG 2.1 AA standards in mind.

- **Contrast**: All Semantic Tokens are vetted for 4.5:1 text contrast ratios in both Light and Dark modes.
- **Focus**: A global focus ring strategy uses `--s-ring-color` to ensuring visible focus states for keyboard users on all interactive elements.
- **ARIA**: Components like Modals, Tabs, and Accordions are designed to be paired with ARIA attributes (`aria-selected`, `aria-current`) and proper semantic HTML (`<button>`, `<nav>`).
- **Reduced Motion**: Motion tokens (`--s-motion-*`) are typically short durations, respecting user preferences for performance and accessibility.
