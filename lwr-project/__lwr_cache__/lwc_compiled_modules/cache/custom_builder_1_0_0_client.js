import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./builder.html";
import { savePage, loadPage, loadSite, createPage, updateComponent, deletePage, addComponent, updateSite } from 'custom/dataService';
import { COMPONENT_REGISTRY, fetchCustomComponents } from 'custom/componentRegistry';
class Builder extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeTab = 'panel-build';
    this.componentList = [];
    this.pagesList = [];
    // Pages loaded from database
    this.activePageId = null;
    // Currently active page ID
    this.isSaving = false;
    this.isLoading = false;
    this.notification = {
      show: false,
      message: '',
      type: ''
    };
    this.selectedComponentId = null;
    // Theme State
    this.theme = {
      '--s-bg-primary': '#3b82f6',
      '--s-text-primary': '#1f2937',
      '--s-bg-page': '#ffffff',
      '--s-font-family': 'Inter, sans-serif'
    };
    this.headerConfig = {
      logoType: 'text',
      logoText: 'My Site',
      logoSrc: '',
      logoAlt: 'Site Logo',
      navLinks: [{
        id: 1,
        label: 'Home',
        url: '/'
      }, {
        id: 2,
        label: 'About',
        url: '/about'
      }, {
        id: 3,
        label: 'Contact',
        url: '/contact'
      }],
      backgroundColor: '#ffffff',
      textColor: '#333333'
    };
    this.selectedComponentId = null;
  }
  get isLogoText() {
    return this.headerConfig.logoType === 'text';
  }
  get isLogoImage() {
    return this.headerConfig.logoType === 'image';
  }
  get isLogoBoth() {
    return this.headerConfig.logoType === 'both';
  }
  get headerStyle() {
    return `
            background-color: ${this.headerConfig.backgroundColor};
            color: ${this.headerConfig.textColor};
            min-height: ${this.headerConfig.height || 'auto'};
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e7eb;
        `;
  }
  handleHeaderChange(event) {
    this.headerConfig = {
      ...this.headerConfig,
      ...event.detail.headerConfig
    };
    // Save to DB (using saveSiteTheme or a dedicated save function)
    // For now, we rely on sidePanel saving to localStorage, 
    // but ideally we should save to DB here too.
    this.saveHeaderConfig();
  }
  async saveHeaderConfig() {
    // Placeholder for specific header saving logic if separate from theme
    // Could leverage saveSiteTheme if we extend the theme structure
    /*
    await saveSiteTheme(this.siteId, {
        header: this.headerConfig
    });
    */
  }
  get canvasStyle() {
    return Object.entries(this.theme).map(([key, value]) => `${key}: ${value}`).join(';');
  }
  async connectedCallback() {
    // Load custom components
    await fetchCustomComponents();
    // Load existing data when component mounts
    await this.loadCanvasData();
  }
  async loadCanvasData() {
    try {
      this.isLoading = true;

      // 1. Load Site Configuration
      const urlParams = new URLSearchParams(window.location.search);
      const siteIdParam = urlParams.get('site');
      const siteData = await loadSite(siteIdParam);
      this.siteId = siteData.id;
      this.pagesList = siteData.pages.map(page => ({
        id: page.id,
        name: page.name,
        slug: page.slug,
        isActive: page.id === siteData.activePageId
      }));

      // 2. Determine Active Page
      // If we have a stored activePageId local state (not yet implemented fully), use it.
      // Otherwise use site's activePageId or default to first page.
      const targetPageId = this.activePageId || siteData.activePageId || (this.pagesList[0] ? this.pagesList[0].id : null);
      if (targetPageId) {
        await this.loadPage(targetPageId);
      } else {
        this.showNotification('No pages found in site.', 'warning');
      }
    } catch (error) {
      console.error('Failed to load canvas data:', error);
      this.showNotification('Failed to load saved data', 'error');
    } finally {
      this.isLoading = false;
    }
  }
  async loadPage(pageId) {
    try {
      this.isLoading = true;
      const pageData = await loadPage(pageId);
      this.activePageId = pageId;

      // Update active state in pagesList
      this.pagesList = this.pagesList.map(p => ({
        ...p,
        isActive: p.id === pageId
      }));

      // Convert sections to component list
      if (pageData.layout && pageData.layout.sections) {
        this.componentList = pageData.layout.sections.map(section => ({
          id: section.id || Date.now(),
          type: section.type,
          isHero: section.type === 'hero',
          isFeatures: section.type === 'features',
          isFooter: section.type === 'footer',
          isText: section.type === 'text',
          isImage: section.type === 'image',
          isCard: section.type === 'card',
          isCard: section.type === 'card',
          props: {
            ...this.getDefaultProps(section.type),
            ...(section.props || section.properties || {})
          },
          containerClass: `builder-block ${section.id && this.selectedComponentId && section.id.toString() === this.selectedComponentId.toString() ? 'selected' : ''}`,
          wrapperStyle: `min-height: ${(section.props || section.properties || {}).minHeight || 'auto'}; padding-top: ${(section.props || section.properties || {}).paddingTop || '0'}; padding-bottom: ${(section.props || section.properties || {}).paddingBottom || '0'};`
        }));
      } else {
        this.componentList = [];
      }
      this.showNotification(`Loaded page: ${pageData.name}`, 'success');
    } catch (error) {
      console.error(`Failed to load page ${pageId}:`, error);
      this.showNotification('Failed to load page data', 'error');
      this.componentList = [];
    } finally {
      this.isLoading = false;
    }
  }
  handleTabSelect(event) {
    this.activeTab = event.detail;
  }
  async handleSave() {
    if (this.isSaving || !this.activePageId) return;
    try {
      this.isSaving = true;
      console.log('💾 Saving canvas state...');
      const pageState = this.buildPageState();

      // Save to backend using specific page ID
      const result = await savePage(this.activePageId, pageState);
      if (result.success) {
        this.showNotification('Page saved successfully!', 'success');
        console.log('✓ Save successful:', result);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      this.showNotification('Failed to save page. Please try again.', 'error');
    } finally {
      this.isSaving = false;
    }
  }
  buildPageState() {
    // Find current page metadata to preserve it
    const currentPage = this.pagesList.find(p => p.id === this.activePageId) || {};
    return {
      id: this.activePageId,
      name: currentPage.name || 'Untitled Page',
      slug: currentPage.slug || '/',
      layout: {
        sections: this.componentList.map(comp => ({
          id: comp.id.toString(),
          type: comp.type,
          properties: comp.props || {},
          rows: []
        }))
      },
      metadata: {
        // Server handles createdAt/updatedAt mostly, but good to send structure
        createdAt: new Date().toISOString(),
        // This should ideally come from loaded data to preserve creation time
        updatedAt: new Date().toISOString()
      }
    };
  }
  handlePreview() {
    console.log('🔍 Opening preview mode...');
    if (!this.activePageId) {
      this.showNotification('No page selected to preview', 'warning');
      return;
    }
    const url = `/preview/${this.activePageId}`; // Use deep link
    window.open(url, '_blank');
    this.showNotification('Preview opened in new tab', 'info');
  }
  handleDashboard() {
    // Navigate to the dashboard (root URL)
    window.location.href = '/';
  }

  // --- Drag and Drop Handlers (Moved from Canvas) ---

  handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }
  handleCanvasDrop(event) {
    event.preventDefault();
    const type = event.dataTransfer.getData('type');
    // Only handle new component drops here. Reordering is handled by handleItemDrop
    if (type && !event.dataTransfer.getData('reorder-index')) {
      this.addComponent(type);
    }
  }
  handleItemDragStart(event) {
    const index = event.currentTarget.dataset.index;
    event.dataTransfer.setData('reorder-index', index);
    event.dataTransfer.effectAllowed = 'copyMove';
  }
  handleItemDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const isTop = offsetY < rect.height / 2;
    event.currentTarget.classList.remove('drop-target-top', 'drop-target-bottom');
    if (isTop) {
      event.currentTarget.classList.add('drop-target-top');
    } else {
      event.currentTarget.classList.add('drop-target-bottom');
    }
  }
  handleItemDragLeave(event) {
    // Prevent clearing if moving into a child element
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    event.currentTarget.classList.remove('drop-target-top', 'drop-target-bottom');
  }
  handleItemDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const isTop = event.currentTarget.classList.contains('drop-target-top');
    event.currentTarget.classList.remove('drop-target-top', 'drop-target-bottom');
    const fromIndex = parseInt(event.dataTransfer.getData('reorder-index'), 10);
    const currentIndex = parseInt(event.currentTarget.dataset.index, 10);
    const type = event.dataTransfer.getData('type');

    // Calculate insertion index
    // If dropping on top half, insert at current index
    // If dropping on bottom half, insert at current index + 1
    const targetIndex = isTop ? currentIndex : currentIndex + 1;
    if (!isNaN(fromIndex)) {
      // Reordering
      // Logic differs slightly for reorder because moving item changes indices
      if (fromIndex !== currentIndex) {
        this.reorderComponent(fromIndex, targetIndex);
      }
    } else if (type) {
      // Insertion between components
      this.addComponent(type, targetIndex);
    }
  }

  // Logic to add component (previously handleComponentDrop)
  addComponent(type, index = null) {
    const newComponent = {
      id: Date.now(),
      type: type,
      isHero: type === 'hero',
      isFeatures: type === 'features',
      isFooter: type === 'footer',
      isText: type === 'text',
      isImage: type === 'image',
      isCard: type === 'card',
      props: this.getDefaultProps(type)
    };
    if (index !== null) {
      const items = [...this.componentList];
      items.splice(index, 0, newComponent);
      this.componentList = items;
    } else {
      this.componentList = [...this.componentList, newComponent];
    }

    // Auto select the new component
    this.selectedComponentId = newComponent.id;
    this.updateComponentListState();
  }
  reorderComponent(fromIndex, toIndex) {
    const items = [...this.componentList];
    const [reorderedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, reorderedItem);
    this.componentList = items;
  }

  // Wrapper for event from sidebar (if still used) or direct
  handleComponentDrop(event) {
    this.addComponent(event.detail.type, event.detail.index);
  }
  handleComponentDelete(event) {
    const index = event.detail.index;
    const items = [...this.componentList];
    items.splice(index, 1);
    this.componentList = items;
  }
  handleComponentReorder(event) {
    const {
      fromIndex,
      toIndex
    } = event.detail;
    const items = [...this.componentList];
    const [reorderedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, reorderedItem);
    this.componentList = items;
  }
  getDefaultProps(type) {
    const config = COMPONENT_REGISTRY.find(c => c.type === type);
    return config ? {
      ...config.defaultProps
    } : {};
  }
  showNotification(message, type = 'info') {
    this.notification = {
      show: true,
      message,
      type
    };

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.notification = {
        show: false,
        message: '',
        type: ''
      };
    }, 3000);
  }
  get notificationClass() {
    return `notification notification-${this.notification.type} ${this.notification.show ? 'show' : ''}`;
  }

  // Side Panel Event Handlers
  async handleComponentDeleteFromTree(event) {
    const componentId = event.detail.componentId;
    console.log('Deleting component from tree:', componentId);

    // Find and remove the component from the list
    this.componentList = this.componentList.filter(comp => comp.id.toString() !== componentId.toString());

    // Auto-save to database after deletion
    await this.handleSave();
    this.showNotification('Component deleted and saved', 'success');
  }
  handleComponentSelect(event) {
    // Handle both direct click (event.target) or custom event
    const componentId = event.currentTarget?.dataset?.id || event.detail?.componentId;
    console.log('Component selected:', componentId);
    if (componentId) {
      this.selectedComponentId = componentId;
      this.activeTab = 'panel-structure';
      this.updateComponentListState();
    }
  }
  handleComponentDeselect() {
    this.selectedComponentId = null;
    this.updateComponentListState();
  }
  handleMoveUp(event) {
    event.stopPropagation();
    const index = parseInt(event.currentTarget.dataset.index, 10);
    if (index > 0) {
      this.reorderComponent(index, index - 1);
    }
  }
  handleMoveDown(event) {
    event.stopPropagation();
    const index = parseInt(event.currentTarget.dataset.index, 10);
    if (index < this.componentList.length - 1) {
      this.reorderComponent(index, index + 1);
    }
  }
  handleComponentDeleteWrapper(event) {
    event.stopPropagation();
    const index = parseInt(event.currentTarget.dataset.index, 10);
    const items = [...this.componentList];
    items.splice(index, 1);
    this.componentList = items;
    this.showNotification('Component removed', 'info');
  }
  handleThemeChange(event) {
    if (event.detail.theme) {
      this.theme = {
        ...this.theme,
        ...event.detail.theme
      };
    }
  }
  async handlePropertyChange(event) {
    const {
      componentId,
      props
    } = event.detail;
    console.log('Property changed for component:', componentId, props);

    // Optimistic UI Update
    this.componentList = this.componentList.map(comp => {
      if (comp.id.toString() === componentId.toString()) {
        const newProps = {
          ...comp.props,
          ...props
        };
        return {
          ...comp,
          props: newProps,
          wrapperStyle: `min-height: ${newProps.minHeight || 'auto'}; padding-top: ${newProps.paddingTop || '0'}; padding-bottom: ${newProps.paddingBottom || '0'};`
        };
      }
      return comp;
    });

    // Backend Update
    try {
      await updateComponent(componentId, {
        props
      });
    } catch (error) {
      console.error('Failed to save property change:', error);
      this.showNotification('Failed to save changes', 'error');
    }
  }
  get selectedComponent() {
    return this.componentList.find(c => c.id.toString() === this.selectedComponentId?.toString()) || null;
  }
  updateComponentListState() {
    // Force refresh of component list to trigger re-render of canvas with selection styles
    this.componentList = this.componentList.map(comp => ({
      ...comp,
      containerClass: `builder-block ${comp.id.toString() === this.selectedComponentId?.toString() ? 'selected' : ''}`,
      wrapperStyle: `min-height: ${comp.props.minHeight || 'auto'}; padding-top: ${comp.props.paddingTop || '0'}; padding-bottom: ${comp.props.paddingBottom || '0'};`
    }));
  }
  async handlePageAdd(event) {
    const {
      name,
      slug
    } = event.detail;
    console.log('Creating new page:', name);
    try {
      this.isLoading = true;
      if (!this.siteId) {
        // If siteId missing, reload site first to get it
        const site = await loadSite();
        this.siteId = site.id;
      }
      const newPage = await createPage(this.siteId, name, slug);
      console.log('✓ Page created:', newPage);
      this.showNotification(`Page "${newPage.name || newPage.title || name}" created successfully`, 'success');

      // Reload all site data to update page list and ensure sync
      await this.loadCanvasData();

      // Switch to the new page
      await this.handlePageSelect({
        detail: {
          pageId: newPage.id
        }
      });
    } catch (error) {
      console.error('Failed to create page:', error);
      this.showNotification('Failed to create page', 'error');
    } finally {
      this.isLoading = false;
    }
  }
  async handlePageSelect(event) {
    const pageId = event.detail.pageId;
    console.log('Switching to page:', pageId);
    if (pageId === this.activePageId) return;

    // Auto-save current page before switching (optional, but good UX)
    // await this.handleSave(); 

    await this.loadPage(pageId);
  }
  async handlePageRename(event) {
    const {
      pageId,
      name
    } = event.detail;
    console.log('Renaming page:', pageId, 'to', name);
    try {
      this.isLoading = true;
      // Generate slug from name (simple slugification)
      const slug = '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Use savePage to update metadata (backend supports partial update for name/title and slug)
      await savePage(pageId, {
        name,
        slug
      });
      this.showNotification(`Page renamed to "${name}" (Slug: ${slug})`, 'success');

      // Reload to reflect changes
      await this.loadCanvasData();
    } catch (error) {
      console.error('Failed to rename page:', error);
      this.showNotification('Failed to rename page', 'error');
    } finally {
      this.isLoading = false;
    }
  }
  async handlePageDelete(event) {
    const pageId = event.detail.pageId;
    if (!confirm('Are you sure you want to delete this page? This cannot be undone.')) {
      return;
    }
    console.log('Deleting page:', pageId);
    try {
      this.isLoading = true;
      await deletePage(pageId);
      this.showNotification('Page deleted successfully', 'success');

      // Reload site data
      await this.loadCanvasData();

      // If deleted page was active, switch to another page (handled by loadCanvasData or loadSite but good to ensure)
      // loadCanvasData re-initializes site data, so it should handle default active page
    } catch (error) {
      console.error('Failed to delete page:', error);
      // Extract error message if possible
      const msg = error.message || 'Unknown error';
      this.showNotification(`Failed to delete page: ${msg}`, 'error');
    } finally {
      this.isLoading = false;
    }
  }
  handleExportSite(event) {
    const settings = event.detail.settings;
    console.log('Exporting site with settings:', settings);

    // TODO: Implement actual export functionality
    this.showNotification(`Exporting as ${settings.exportFormat.toUpperCase()}...`, 'info');
  }
  async handleComponentImport() {
    console.log('Reloading custom components...');
    await fetchCustomComponents();
    // Force refresh side panel by triggering a render cycle if needed, 
    // but since COMPONENT_REGISTRY is mutated and SidePanel reads it via getter, 
    // we might need to force update if SidePanel doesn't track it.
    // SidePanel has `get availableComponents() { return COMPONENT_REGISTRY; }`
    // Since it's a getter, it computes on render. We need to tell SidePanel to re-render.
    // We can do this by passing a version or timestamp prop, OR simpler:
    // just re-assign componentList to trigger reactivity if it used it? No.
    this.showNotification('Custom components reloaded', 'success');

    // Hack to force child update if it doesn't observe the external array
    const sidePanel = this.template.querySelector('custom-side-panel');
    if (sidePanel) {
      // force update
    }
  }
  async handleSettingsChange(event) {
    const updates = event.detail;
    console.log('Saving site settings:', updates);
    if (!this.siteId) {
      console.error('Cannot save settings: Site ID missing');
      return;
    }
    try {
      // Map 'title' to 'name' if present (backend uses 'name')
      if (updates.title) {
        updates.name = updates.title;
        delete updates.title;
      }
      await updateSite(this.siteId, updates);
      // this.showNotification('Site settings saved', 'success'); 
      // Optional: don't annoy user with too many toasts for auto-save
    } catch (error) {
      console.error('Failed to save site settings:', error);
      this.showNotification('Failed to save settings', 'error');
    }
  }
  /*LWC compiler v8.28.0*/
}
Builder.renderMode = 'light';
_registerDecorators(Builder, {
  track: {
    activeTab: 1,
    componentList: 1,
    pagesList: 1,
    activePageId: 1,
    isSaving: 1,
    isLoading: 1,
    notification: 1,
    selectedComponentId: 1,
    theme: 1,
    headerConfig: 1
  }
});
const __lwc_component_class_internal = _registerComponent(Builder, {
  tmpl: _tmpl,
  sel: "custom-builder",
  apiVersion: 66
});
export default __lwc_component_class_internal;