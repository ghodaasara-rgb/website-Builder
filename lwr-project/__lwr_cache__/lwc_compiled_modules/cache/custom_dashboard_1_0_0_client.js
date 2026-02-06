import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./dashboard.html";
import { loadSites, createSite, deleteSite, loadSitePages, createPage } from 'custom/dataService'; // Import from dataService

class Dashboard extends LightningElement {
  constructor(...args) {
    super(...args);
    this.sites = [];
    this.filteredSites = [];
    this.isLoading = true;
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.viewMode = 'table';
    // Default to table view
    this.showDeleteModal = false;
    this.siteToDelete = null;
  }
  connectedCallback() {
    this.loadSites();
  }
  get isGridView() {
    return this.viewMode === 'grid';
  }
  get isTableView() {
    return this.viewMode === 'table';
  }
  get shouldRenderTable() {
    return this.viewMode === 'table' && this.sites.length > 0 && !this.isLoading;
  }
  handleViewChange(event) {
    this.viewMode = event.currentTarget.dataset.mode;
  }
  async loadSites() {
    this.isLoading = true;
    try {
      this.sites = await loadSites(); // Use dataService
      this.applyFilters();
    } catch (error) {
      console.error('Error loading sites:', error);
      this.sites = [];
      this.filteredSites = [];
    } finally {
      this.isLoading = false;
    }
  }
  applyFilters() {
    let filtered = [...this.sites];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(site => site.name.toLowerCase().includes(query) || site.domain && site.domain.toLowerCase().includes(query));
    }

    // Apply status filter
    if (this.filterStatus && this.filterStatus !== 'all') {
      filtered = filtered.filter(site => site.status === this.filterStatus);
    }
    this.filteredSites = filtered;
  }
  handleSearch(event) {
    this.searchQuery = event.detail.query;
    this.applyFilters();
  }
  handleFilter(event) {
    this.filterStatus = event.detail.status;
    this.applyFilters();
  }
  handleCreateSite() {
    const siteName = prompt('Enter new site name:');
    if (!siteName) return;
    this.createSite(siteName);
  }
  async createSite(name) {
    try {
      const newSite = await createSite(name); // Use dataService

      // Reload sites to get fresh data
      await this.loadSites();

      // Open builder for the new site
      if (newSite.id) {
        this.navigateToBuilder(newSite.id);
      }
    } catch (error) {
      console.error('Error creating site:', error);
      alert('Failed to create site. Please try again.');
    }
  }
  getSiteIdFromEvent(event) {
    // Handle CustomEvent from child component
    if (event.detail && event.detail.siteId) {
      return event.detail.siteId;
    }
    // Handle DOM Event (click on button/element)
    return event.currentTarget.dataset.id || event.target.closest('[data-id]')?.dataset.id;
  }
  handleOpenBuilder(event) {
    const siteId = this.getSiteIdFromEvent(event);
    if (siteId) {
      this.navigateToBuilder(siteId);
    }
  }
  async navigateToBuilder(siteId) {
    try {
      // Get the first page for this site
      const pages = await loadSitePages(siteId); // Use dataService

      if (pages && pages.length > 0) {
        window.location.href = `/builder?site=${siteId}&page=${pages[0].id}`;
      } else {
        // Create a default page if none exists
        const newPage = await createPage(siteId, 'Home', '/'); // Use dataService
        window.location.href = `/builder?site=${siteId}&page=${newPage.id}`;
      }
    } catch (error) {
      console.error('Error navigating to builder:', error);
      alert('Failed to open builder. Please try again.');
    }
  }
  async handlePreview(event) {
    const siteId = this.getSiteIdFromEvent(event);
    if (!siteId) return;
    try {
      // Get the first page for this site
      const pages = await loadSitePages(siteId); // Use dataService

      if (pages && pages.length > 0) {
        window.open(`/preview/${pages[0].id}`, '_blank');
      } else {
        alert('No pages found for this site.');
      }
    } catch (error) {
      console.error('Error opening preview:', error);
      alert('Failed to open preview. Please try again.');
    }
  }
  handleDelete(event) {
    const siteId = this.getSiteIdFromEvent(event);
    const site = this.sites.find(s => s.id === siteId);
    if (site) {
      this.siteToDelete = site;
      this.showDeleteModal = true;
    }
  }
  handleCancelDelete() {
    this.showDeleteModal = false;
    this.siteToDelete = null;
  }
  async handleConfirmDelete() {
    if (!this.siteToDelete) return;
    try {
      await deleteSite(this.siteToDelete.id); // Use dataService

      // Reload sites list
      await this.loadSites();
      this.showDeleteModal = false;
      this.siteToDelete = null;
    } catch (error) {
      console.error('Error deleting site:', error);
      alert('Failed to delete site. Please try again.');
    }
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  get showEmptyState() {
    return !this.isLoading && this.sites.length === 0;
  }
  get showSitesGrid() {
    return !this.isLoading && this.filteredSites.length > 0;
  }
  /*LWC compiler v8.28.0*/
}
_registerDecorators(Dashboard, {
  track: {
    sites: 1,
    filteredSites: 1,
    isLoading: 1,
    searchQuery: 1,
    filterStatus: 1,
    viewMode: 1,
    showDeleteModal: 1,
    siteToDelete: 1
  }
});
const __lwc_component_class_internal = _registerComponent(Dashboard, {
  tmpl: _tmpl,
  sel: "custom-dashboard",
  apiVersion: 66
});
export default __lwc_component_class_internal;