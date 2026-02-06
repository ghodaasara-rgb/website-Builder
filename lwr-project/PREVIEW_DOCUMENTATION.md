# Preview Functionality Documentation

## Overview

The preview functionality allows users to view their website exactly as it will appear to end-users, without the distraction of the builder interface (sidebars, edit handles, etc.). It ensures a "What You See Is What You Get" (WYSIWYG) experience using the same CSS framework and component structure as the editor.

## Functionality Breakdown

### 1. Accessing Preview

- **Trigger**: A "Preview" button in the builder's top navigation bar.
- **Action**: Opens a new tab or redirects to the preview route.
- **URL**: `http://localhost:3000/preview` (redirects to specific page) or direct link to `http://localhost:3000/preview/p_<page_id>`.

### 2. URL Structure & Routing

- The preview system uses a parameterized URL structure to render specific pages:
  - Pattern: `/preview/:pageId`
  - Example: `/preview/p_1768804155280`
- This allows for deep linking and navigation between different pages within the preview context.

### 3. Rendering Logic

- **Clean Interface**: Removes all builder artifacts (drag handles, selection boxes, property panels).
- **Full Styling**: Applies the full global CSS framework (`framework.css`) and specific page styles.
- **Dynamic Content**:
  - Fetches the _saved_ site data (from `site-data.json` or database).
  - Renders the component tree for the requested `pageId`.
  - Supports all component types (Hero, Features, Footer, etc.).

### 4. Navigation Handling

- **Intra-site Links**: Links within the previewed content (e.g., in the Navbar) are automatically handled to keep the user in "Preview Mode".
  - Clicking "About Us" navigates to `/preview/p_about` instead of `/p_about` (production URL).
- **Back to Editor**: A dedicated "Back to Editor" button allows quick return to the builder interface.

## Implementation Requirements for LWC Project

To replicate this functionality in the `lwr-project`:

1.  **Route Configuration**: Update `lwr.config.json` to accept page parameters (e.g., `/preview/:pageId`).
2.  **Component Logic**:
    - The `preview` component must read the `pageId` from the URL.
    - Filter the loaded `site-data` to find the matching page.
    - Render _only_ that page's sections.
    - Handle the case where no ID is provided (redirect to home/active page).
3.  **Link Interception**: Ensure links inside components do not break out of the preview sandbox (optional, but recommended for full fidelity).
