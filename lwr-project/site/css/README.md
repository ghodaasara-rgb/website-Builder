# Enterprise CSS Framework

## Overview

This is a raw CSS framework designed for enterprise SaaS platforms. It enforces strict separation of concerns via a 3-layer token architecture.

## Architecture

### 1. Primitives (Private)

- **Prefix**: `--p-*`
- **Definition**: Raw values (Hex, px, rem, ms).
- **Rule**: NEVER use these directly in components.

### 2. Semantics (Contract)

- **Prefix**: `--s-*`
- **Definition**: Context-aware abstraction (Background, Text, Border).
- **Rule**: Components MUST use these.

### 3. Component Overrides (Optional)

- **Prefix**: `--c-*`
- **Definition**: Specific overrides for fine-grained control.
- **Rule**: Use only when semantic tokens are insufficient.

## Theming

- **Attribute**: `data-theme="light" | "dark"`
- **Scope**: Applied at `<html>` or `<body>` level.
- **Tenant Override**: `data-tenant="tenantName"` for brand-specific overrides.

## Usage

Import `tokens.css` first, then your theme file, then components.

```html
<link rel="stylesheet" href="framework/tokens.css" />
<link rel="stylesheet" href="framework/themes/light.css" />
<link rel="stylesheet" href="framework/components/button.css" />
```
