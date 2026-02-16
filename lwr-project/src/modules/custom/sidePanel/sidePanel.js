import { LightningElement, api, track } from 'lwc';
import { COMPONENT_REGISTRY } from 'custom/componentRegistry';
import { loadSiteTheme, saveSiteTheme, loadSite, uploadFavicon } from 'custom/dataService';

export default class SidePanel extends LightningElement {
    static renderMode = 'light';
    DEFAULT_THEMES = [
        {
            value: 'corporate',
            label: 'Corporate',
            colors: { primary: '#0f4c81', background: '#ffffff', text: '#333333' }
        },
        {
            value: 'dark',
            label: 'Dark Mode',
            colors: { primary: '#bb86fc', background: '#121212', text: '#e0e0e0' }
        },
        {
            value: 'forest',
            label: 'Forest',
            colors: { primary: '#2e7d32', background: '#f1f8e9', text: '#1b5e20' }
        }
    ];

    @track brandSetOptions = [];

    async connectedCallback() {
        this.initializeBrandSets();

        // Load initial theme from database
        try {
            const siteData = await loadSite();
            if (siteData && siteData.id) {
                this.currentSiteId = siteData.id;

                // Load Site Settings
                this.siteSettings = {
                    ...this.siteSettings,
                    title: siteData.name || 'My Site', // Map name to title
                    favicon: siteData.favicon || ''
                };

                const theme = await loadSiteTheme(siteData.id);

                if (theme) {
                    // Apply theme from database
                    if (theme.colors) {
                        this.colors = { ...this.colors, ...theme.colors };
                    }
                    if (theme.typography) {
                        this.typography = { ...this.typography, ...theme.typography };
                    }
                    if (theme.layout) {
                        this.themeLayout = theme.layout;
                    }

                    // Apply to UI immediately
                    this.applyTheme(this.colors);

                    // Also save to localStorage as backup
                    localStorage.setItem('brandingColors', JSON.stringify({ ...this.colors, typography: this.typography }));
                }
            }
        } catch (e) {
            console.error('Failed to load theme from database, using defaults', e);
            // Fallback to localStorage
            const stored = localStorage.getItem('brandingColors');
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    this.colors = data;
                    if (data.typography) {
                        this.typography = data.typography;
                    }
                    this.applyTheme(this.colors);
                } catch (e2) {
                    console.error('Failed to parse stored branding colors', e2);
                }
            }
        }

        // Load Header Config
        const storedHeader = localStorage.getItem('headerConfig');
        if (storedHeader) {
            try {
                this.headerConfig = { ...this.headerConfig, ...JSON.parse(storedHeader) };
            } catch (e) {
                console.error('Failed to parse stored header config', e);
            }
        }
    }

    initializeBrandSets() {
        const storedSets = localStorage.getItem('customBrandSets');
        let customSets = [];
        if (storedSets) {
            try {
                customSets = JSON.parse(storedSets);
            } catch (e) {
                console.error('Error parsing custom brand sets', e);
            }
        }

        this.brandSetOptions = [
            { label: 'Select a Brand Set', value: '' },
            ...this.DEFAULT_THEMES,
            ...customSets
        ];
    }
    @api activeTab;
    @api components = []; // Receive components from parent builder
    @api pages = []; // Receive pages from parent builder
    @api selectedComponent = null; // Currently selected component for editing

    get isEditing() {
        return !!this.selectedComponent;
    }

    get selectedComponentLabel() {
        return this.selectedComponent ? this.getComponentLabel(this.selectedComponent.type) : '';
    }

    get propertyFields() {
        if (!this.selectedComponent) return [];

        const props = this.selectedComponent.props || {};
        const type = this.selectedComponent.type;

        // Find config from registry
        const config = COMPONENT_REGISTRY.find(c => c.type === type);
        if (!config || !config.fields) return [];

        // Map fields adding current values
        return config.fields.map(field => ({
            ...field,
            value: props[field.name] || '',
            isTextarea: field.type === 'textarea',
            isColor: field.type === 'color',
            isCheckbox: field.type === 'checkbox' || field.type === 'boolean',
            isNumber: field.type === 'number' || field.type === 'integer'
        }));
    }

    get availableComponents() {
        return COMPONENT_REGISTRY;
    }

    // Reactive properties
    @track siteSettings = {
        title: 'FlexSite Builder',
        description: 'Build amazing websites with ease',
        exportFormat: 'html',
        responsiveMode: true,
        autoSave: false,
        viewportWidth: '100%'
    };

    get isBuildTab() { return this.activeTab === 'panel-build'; }
    get isThemeTab() { return this.activeTab === 'panel-theme'; }
    get isStructureTab() { return this.activeTab === 'panel-structure'; }
    get isPagesTab() { return this.activeTab === 'panel-pages'; }
    get isSettingsTab() { return this.activeTab === 'panel-settings'; }
    get isHeaderTab() { return this.activeTab === 'panel-header'; }

    @track headerConfig = {
        logoType: 'text',
        logoText: 'My Site',
        logoSrc: '',
        logoAlt: 'Site Logo',
        navLinks: [
            { id: 1, label: 'Home', url: '/' },
            { id: 2, label: 'About', url: '/about' },
            { id: 3, label: 'Contact', url: '/contact' }
        ],
        backgroundColor: '#ffffff',
        textColor: '#333333',
        height: 'auto'
    };

    get isLogoTextOnly() { return this.headerConfig.logoType === 'text'; }
    get isLogoImageOnly() { return this.headerConfig.logoType === 'image'; }
    get isLogoBoth() { return this.headerConfig.logoType === 'both'; }

    get showLogoText() { return this.headerConfig.logoType === 'text' || this.headerConfig.logoType === 'both'; }
    get showLogoImage() { return this.headerConfig.logoType === 'image' || this.headerConfig.logoType === 'both'; }

    handleHeaderChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.headerConfig = { ...this.headerConfig, [field]: value };
        this.dispatchHeaderUpdate();
        this.saveHeaderToLocalStorage();
    }

    handleAddNavLink() {
        const newLink = {
            id: Date.now(),
            label: 'New Link',
            url: '#'
        };
        this.headerConfig = {
            ...this.headerConfig,
            navLinks: [...this.headerConfig.navLinks, newLink]
        };
        this.dispatchHeaderUpdate();
        this.saveHeaderToLocalStorage();
    }

    handleDeleteNavLink(event) {
        const index = parseInt(event.currentTarget.dataset.index, 10);
        const newLinks = [...this.headerConfig.navLinks];
        newLinks.splice(index, 1);
        this.headerConfig = { ...this.headerConfig, navLinks: newLinks };
        this.dispatchHeaderUpdate();
        this.saveHeaderToLocalStorage();
    }

    handleNavLinkChange(event) {
        const index = parseInt(event.target.dataset.index, 10);
        const field = event.target.dataset.field;
        const value = event.target.value;

        const newLinks = [...this.headerConfig.navLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };

        this.headerConfig = { ...this.headerConfig, navLinks: newLinks };
        this.dispatchHeaderUpdate();
        this.saveHeaderToLocalStorage();
    }

    dispatchHeaderUpdate() {
        this.dispatchEvent(new CustomEvent('headerchange', {
            detail: { headerConfig: this.headerConfig }
        }));
    }

    saveHeaderToLocalStorage() {
        localStorage.setItem('headerConfig', JSON.stringify(this.headerConfig));
        // TODO: Save to DB
    }

    // Page Structure
    get hasComponents() {
        return this.components && this.components.length > 0;
    }

    get componentStructure() {
        if (!this.components) return [];

        return this.components.map((comp, index) => ({
            id: comp.id || index,
            index: index,
            label: this.getComponentLabel(comp.type),
            type: comp.type,
            preview: this.getComponentPreview(comp)
        }));
    }

    getComponentLabel(type) {
        const config = COMPONENT_REGISTRY.find(c => c.type === type);
        return config ? config.label : (type.charAt(0).toUpperCase() + type.slice(1));
    }

    getComponentPreview(comp) {
        // Extract a preview of the component's content from its properties
        if (!comp.props) return `ID: ${comp.id}`;

        const props = comp.props;

        switch (comp.type) {
            case 'hero':
                return props.title || props.subtitle || `ID: ${comp.id}`;
            case 'features':
                return props.title || `${props.items?.length || 0} items`;
            case 'footer':
                return props.copyright || `ID: ${comp.id}`;
            default:
                // Show first available property value
                const firstValue = Object.values(props)[0];
                return firstValue || `ID: ${comp.id}`;
        }
    }

    // Branding Options
    themeLayoutOptions = [
        { label: 'Sidebar (Left Nav)', value: 'sidebar' },
        { label: 'Top Nav', value: 'topnav' },
        { label: 'Stacked', value: 'stacked' }
    ];

    fontOptions = [
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Lora', value: 'Lora' },
        { label: 'Inter', value: 'Inter' },
        { label: 'Lato', value: 'Lato' },
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Poppins', value: 'Poppins' }
    ];

    // Selected Values
    selectedThemeLayout = 'sidebar';
    selectedBrandSet = 'new_set';

    colors = {
        primary: '#5b5fc7',
        background: '#e5e5e5',
        text: '#444444'
    };

    typography = {
        primary: 'Open Sans',
        heading: 'Lora'
    };

    // Component Drag & Drop
    handleDragStart(event) {
        const type = event.currentTarget.dataset.type;
        event.dataTransfer.setData('type', type);
        event.dataTransfer.effectAllowed = 'copy';
    }

    // Branding Handlers
    handleThemeChange(event) {
        this.selectedThemeLayout = event.target.value;
    }

    handleBrandSetChange(event) {
        this.selectedBrandSet = event.target.value;
        const selectedOption = this.brandSetOptions.find(opt => opt.value === this.selectedBrandSet);

        if (selectedOption && selectedOption.colors) {
            this.colors = { ...selectedOption.colors };
            this.applyTheme(this.colors);
            this.saveBrandingToLocalStorage();
        }
    }

    handleColorChange(event) {
        const field = event.target.dataset.id;
        const value = event.target.value;

        // Update local state
        this.colors = { ...this.colors, [field]: value };

        // Apply to document (Live Preview) & Dispatch to Parent
        this.applyTheme(this.colors);

        // Persist complete branding state to localStorage
        this.saveBrandingToLocalStorage();
    }

    applyTheme(colors) {
        // Dispatch to parent builder (Canvas)
        const themeUpdate = {};

        // Primary (Buttons, etc)
        if (colors.primary) {
            themeUpdate['--s-bg-primary'] = colors.primary;
            themeUpdate['--s-bg-primary-hover'] = this.adjustColor(colors.primary, -20);
            themeUpdate['--p-color-brand-600'] = colors.primary; // Core token fallback
            themeUpdate['--s-border-focus'] = colors.primary;
        }

        // Background (Canvas Page and Component Surface)
        if (colors.background) {
            themeUpdate['--s-bg-page'] = colors.background;
            themeUpdate['--s-bg-surface'] = colors.background;
        }

        // Text
        if (colors.text) {
            themeUpdate['--s-text-primary'] = colors.text;
            themeUpdate['--s-text-secondary'] = this.adjustColor(colors.text, 40);
        }

        // Typography
        const typography = colors.typography || this.typography;
        if (typography.primary) {
            themeUpdate['--s-font-family-body'] = `${typography.primary}, sans-serif`;
            themeUpdate['--s-font-family'] = `${typography.primary}, sans-serif`; // Fallback for builder.js default
        }
        if (typography.heading) {
            themeUpdate['--s-font-family-heading'] = `${typography.heading}, serif`;
        }

        this.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: themeUpdate }
        }));
    }

    // Helper to darken/lighten hex color
    adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    handleFontChange(event) {
        const field = event.target.dataset.id;
        const value = event.target.value;
        this.typography = { ...this.typography, [field]: value };

        // Apply changes
        this.applyTheme({ ...this.colors, typography: this.typography });

        // Persist complete branding state to localStorage
        this.saveBrandingToLocalStorage();
    }

    async saveBrandingToLocalStorage() {
        try {
            const brandingState = {
                ...this.colors,
                typography: this.typography
            };

            // Save to localStorage as backup
            localStorage.setItem('brandingColors', JSON.stringify(brandingState));

            // Save to database
            if (this.currentSiteId) {
                await saveSiteTheme(this.currentSiteId, {
                    colors: this.colors,
                    typography: this.typography,
                    layout: this.themeLayout
                });
                console.log('✓ Branding saved to database:', brandingState);
            } else {
                console.warn('⚠️ No site ID available, theme saved to localStorage only');
            }
        } catch (e) {
            console.error('Failed to store branding', e);
        }
    }

    handleSaveSmartSet() {
        const setName = prompt('Enter a name for your new Smart Set:');
        if (!setName) return;

        const newSet = {
            label: setName,
            value: 'custom_' + Date.now(),
            colors: { ...this.colors }
        };

        // Save to localStorage
        const storedSets = localStorage.getItem('customBrandSets');
        let customSets = [];
        if (storedSets) {
            try {
                customSets = JSON.parse(storedSets);
            } catch (e) {
                console.error('Error parsing custom brand sets', e);
            }
        }
        customSets.push(newSet);
        localStorage.setItem('customBrandSets', JSON.stringify(customSets));

        // Update UI
        this.initializeBrandSets();
        this.selectedBrandSet = newSet.value; // Select the new set

        // Force refresh of select element (optional, but good practice if not reactive enough)
        // this.template.querySelector('select').value = newSet.value; 
    }

    // Page Structure Handlers
    handleMoveUp(event) {
        event.stopPropagation();
        const fromIndex = parseInt(event.currentTarget.dataset.index, 10);
        if (fromIndex > 0) {
            this.dispatchEvent(new CustomEvent('componentreorder', {
                detail: { fromIndex, toIndex: fromIndex - 1 }
            }));
        }
    }

    handleMoveDown(event) {
        event.stopPropagation();
        const fromIndex = parseInt(event.currentTarget.dataset.index, 10);
        if (fromIndex < this.components.length - 1) {
            this.dispatchEvent(new CustomEvent('componentreorder', {
                detail: { fromIndex, toIndex: fromIndex + 1 }
            }));
        }
    }

    handleComponentSelect(event) {
        const componentId = event.currentTarget.dataset.id;
        console.log('Selected component:', componentId);

        // Dispatch event to parent to highlight/scroll to component
        this.dispatchEvent(new CustomEvent('componentselect', {
            detail: { componentId }
        }));
    }

    handleBackToStructure() {
        this.dispatchEvent(new CustomEvent('componentdeselect'));
    }

    handlePropertyChange(event) {
        const field = event.target.dataset.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        this.dispatchEvent(new CustomEvent('propertychange', {
            detail: {
                componentId: this.selectedComponent.id,
                triggeringField: field, // Added triggering field for debugging
                props: {
                    ...this.selectedComponent.props,
                    [field]: value
                }
            }
        }));
    }

    handleComponentDeleteFromTree(event) {
        event.stopPropagation();
        const componentId = event.currentTarget.dataset.id;

        // Dispatch event to parent to delete component
        this.dispatchEvent(new CustomEvent('componentdeletefromtree', {
            detail: { componentId }
        }));
    }

    // Pages Handlers
    handleAddPage() {
        const nextIndex = this.pages.length + 1;
        const name = `Page ${nextIndex}`;
        const slug = `/page-${nextIndex}`;

        // Dispatch event to parent to handle creation via API
        this.dispatchEvent(new CustomEvent('pageadd', {
            detail: { name, slug }
        }));

        // Auto-add to header navigation
        const newLink = {
            id: Date.now(),
            label: name,
            url: slug
        };
        this.headerConfig = {
            ...this.headerConfig,
            navLinks: [...this.headerConfig.navLinks, newLink]
        };
        this.dispatchHeaderUpdate();
        this.saveHeaderToLocalStorage();
    }

    handlePageSelect(event) {
        const pageId = event.currentTarget.closest('.page-item').dataset.id;

        // Update active page
        this.pages = this.pages.map(page => ({
            ...page,
            isActive: page.id === pageId
        }));

        // Dispatch event to parent
        this.dispatchEvent(new CustomEvent('pageselect', {
            detail: { pageId }
        }));
    }

    handlePageRename(event) {
        event.stopPropagation();
        const pageId = event.currentTarget.dataset.id;
        const page = this.pages.find(p => p.id === pageId);

        const newName = prompt("Enter new page name:", page.name);

        if (newName && newName.trim() !== "" && newName !== page.name) {
            const safeName = newName.trim();
            this.dispatchEvent(new CustomEvent('pagerename', {
                detail: { pageId, name: safeName }
            }));

            // Sync Header Link
            // 1. Calculate new slug (simple approximation, should match builder/server logic)
            const newSlug = '/' + safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // 2. Find link by old slug (page.slug)
            const linkIndex = this.headerConfig.navLinks.findIndex(link => link.url === page.slug);

            if (linkIndex !== -1) {
                const newLinks = [...this.headerConfig.navLinks];
                newLinks[linkIndex] = {
                    ...newLinks[linkIndex],
                    label: safeName,
                    url: newSlug
                };

                this.headerConfig = { ...this.headerConfig, navLinks: newLinks };
                this.dispatchHeaderUpdate();
                this.saveHeaderToLocalStorage();
            }
        }
    }

    handlePageDelete(event) {
        event.stopPropagation();
        const pageId = event.currentTarget.dataset.id;

        if (this.pages.length <= 1) {
            alert('Cannot delete the last page');
            return;
        }

        // Find page to get slug before removing
        const pageToRemove = this.pages.find(p => p.id === pageId);

        this.pages = this.pages.filter(page => page.id !== pageId);

        // Dispatch event to parent
        this.dispatchEvent(new CustomEvent('pagedelete', {
            detail: { pageId }
        }));

        // Sync Header Link (Remove)
        if (pageToRemove && pageToRemove.slug) {
            // Filter out the link that matches the page slug
            const newLinks = this.headerConfig.navLinks.filter(link => link.url !== pageToRemove.slug);

            // Only update if changes occurred
            if (newLinks.length !== this.headerConfig.navLinks.length) {
                this.headerConfig = { ...this.headerConfig, navLinks: newLinks };
                this.dispatchHeaderUpdate();
                this.saveHeaderToLocalStorage();
            }
        }
    }

    // Settings Handlers
    handleSettingChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;

        this.siteSettings = {
            ...this.siteSettings,
            [field]: value
        };

        console.log('Setting changed:', field, value);

        // Dispatch settings change to parent for persistence
        this.dispatchEvent(new CustomEvent('settingschange', {
            detail: { [field]: value }
        }));
    }

    async handleFaviconUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!this.currentSiteId) {
            alert('Save the site first before uploading a favicon.');
            return;
        }

        try {
            console.log('Uploading favicon...');
            const result = await uploadFavicon(this.currentSiteId, file);

            if (result.success && result.url) {
                // Determine API URL prefix same as handleFileChange import
                const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                const isLocalDev = isLocal && location.port === '3002';
                const API_URL = isLocalDev ? 'http://localhost:3001' : '';

                const fullUrl = API_URL + result.url;

                this.siteSettings = {
                    ...this.siteSettings,
                    favicon: fullUrl
                };

                // Dispatch settings change to parent
                this.dispatchEvent(new CustomEvent('settingschange', {
                    detail: { favicon: fullUrl }
                }));

                alert('Favicon uploaded successfully!');
            }
        } catch (error) {
            console.error('Favicon export error:', error);
            alert('Failed to upload favicon');
        }
    }

    handleCheckboxChange(event) {
        const field = event.target.dataset.field;
        const checked = event.target.checked;

        this.siteSettings = {
            ...this.siteSettings,
            [field]: checked
        };

        console.log('Checkbox changed:', field, checked);
    }

    handleExportSite() {
        console.log('Exporting site with settings:', this.siteSettings);

        // Dispatch event to parent to handle export
        this.dispatchEvent(new CustomEvent('exportsite', {
            detail: { settings: this.siteSettings }
        }));

        alert(`Exporting as ${this.siteSettings.exportFormat.toUpperCase()}...`);
    }

    handleImportClick() {
        console.log('Import button clicked');
        // Light DOM: use this.querySelector instead of this.template.querySelector
        const fileInput = this.querySelector('.file-input-hidden');
        if (fileInput) {
            fileInput.click();
        } else {
            console.error('File input not found - check if element is rendered');
            alert('Error: File input element not found.');
        }
    }

    async handleFileChange(event) {
        console.log('File selected');
        const file = event.target.files[0];
        if (!file) return;

        console.log('Uploading file:', file.name);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Determine API URL
            // Local dev: LWR on 3002, Backend on 3001 -> http://localhost:3001
            // Production: Served from same domain (via proxy) -> /api
            const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
            // Check if we are on the frontend port (3002 usually)
            const isLocalDev = isLocal && location.port === '3002';

            const API_URL = isLocalDev ? 'http://localhost:3001' : '';
            // If empty, fetch uses relative path e.g. /api/components/import

            console.log('Using API URL prefix:', API_URL);

            const response = await fetch(`${API_URL}/api/components/import`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ Component "${result.component.name}" imported successfully!\nPlease reload the page to see changes.`);
                // Ideally trigger a registry reload here
                this.dispatchEvent(new CustomEvent('componentimport'));
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Import Error:', error);
            alert(`❌ Import failed: ${error.message}`);
        } finally {
            // Reset input
            event.target.value = '';
        }
    }
}
