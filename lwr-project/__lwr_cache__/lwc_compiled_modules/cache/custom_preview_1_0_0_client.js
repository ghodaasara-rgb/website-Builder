import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./preview.html";
import { loadPage, loadSite, loadSiteTheme } from 'custom/dataService';
class Preview extends LightningElement {
  constructor(...args) {
    super(...args);
    this.pageData = null;
    this.currentPage = null;
    this.sitePages = [];
    this.isLoading = true;
    this.headerConfig = {
      logoType: 'text',
      logoText: 'My Site',
      navLinks: [],
      backgroundColor: '#ffffff',
      textColor: '#333333'
    };
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
        `;
  }

  // Add rootStyle to apply branding colors to CSS variables if needed
  get rootStyle() {
    return '';
  }
  async connectedCallback() {
    // Note: applyBrandingColors needs currentSiteId, so we'll call it after loadPreviewData
    await this.loadPreviewData();

    // Load Header Config from localStorage (simulation of global site config)
    const storedHeader = localStorage.getItem('headerConfig');
    if (storedHeader) {
      try {
        this.headerConfig = {
          ...this.headerConfig,
          ...JSON.parse(storedHeader)
        };
      } catch (e) {
        console.error('Failed to parse stored header config', e);
      }
    }
  }
  async loadPreviewData() {
    try {
      this.isLoading = true;

      // 1. Load Site Context (to get list of pages and default page)
      const siteData = await loadSite();
      if (!siteData) throw new Error('No site found');
      console.log('✓ Site data loaded:', siteData);

      // Populate site pages for navigation
      this.sitePages = siteData.pages.map(page => ({
        ...page,
        label: page.name || page.slug,
        isCurrent: false
      }));

      // Store site ID for theme loading
      this.currentSiteId = siteData.id;

      // 2. Resolve Page ID
      let pageId = this.getPageIdFromUrl();

      // If no ID in URL, use active or first page
      if (!pageId) {
        pageId = siteData.activePageId || (siteData.pages.length > 0 ? siteData.pages[0].id : null);
      }
      if (!pageId) {
        console.warn('No pages found in site');
        return;
      }

      // 3. Load Specific Page Data
      await this.loadPageData(pageId);

      // 4. Apply branding now that we have currentSiteId
      await this.applyBrandingColors();
    } catch (error) {
      console.error('❌ Failed to load preview:', error);
      this.currentPage = null;
    } finally {
      this.isLoading = false;
    }
  }
  async loadPageData(pageId) {
    try {
      this.isLoading = true;
      // Ensure ID is treated consistently (some backends return numbers, URL is string)
      const pageData = await loadPage(pageId);
      this.currentPage = pageData;
      console.log('✓ Preview page loaded:', this.currentPage);

      // Update Navigation State
      this.updateNavigationState(pageId);

      // Apply branding whenever page changes
      await this.applyBrandingColors();
    } catch (error) {
      console.error('❌ Failed to load page data:', error);
      this.currentPage = null;
    } finally {
      this.isLoading = false;
    }
  }
  updateNavigationState(activePageId) {
    this.sitePages = this.sitePages.map(page => ({
      ...page,
      isCurrent: String(page.id) === String(activePageId),
      class: String(page.id) === String(activePageId) ? 'nav-link active' : 'nav-link'
    }));
  }
  getPageIdFromUrl() {
    const path = window.location.pathname;
    // Handle /preview/ID format
    const match = path.match(/\/preview\/([^\/]+)/);
    return match ? match[1] : null;
  }
  handleNavigation(event) {
    event.preventDefault();
    const pageId = event.target.dataset.id;
    if (pageId) {
      // Update URL to match (optional, but good for refresh)
      window.history.pushState({}, '', `/preview/${pageId}`);
      this.loadPageData(pageId);
    }
  }
  handleBackToEditor() {
    // Close preview window if opened in new tab
    if (window.opener) {
      window.close();
    } else {
      // Navigate back to editor
      window.location.href = '/';
    }
  }
  get hasPage() {
    return !!this.currentPage;
  }
  get processedSections() {
    if (!this.currentPage || !this.currentPage.layout || !this.currentPage.layout.sections) {
      return [];
    }
    return this.currentPage.layout.sections.map(section => ({
      ...section,
      isHero: section.type === 'hero',
      isFeatures: section.type === 'features',
      isFooter: section.type === 'footer',
      isText: section.type === 'text',
      isImage: section.type === 'image',
      isCard: section.type === 'card',
      properties: section.props || section.properties || {},
      wrapperStyle: `min-height: ${(section.props || section.properties || {}).minHeight || 'auto'}; padding-top: ${(section.props || section.properties || {}).paddingTop || '0'}; padding-bottom: ${(section.props || section.properties || {}).paddingBottom || '0'};`
    }));
  }

  // Apply branding colors from database (with localStorage fallback) to CSS variables
  async applyBrandingColors() {
    try {
      let colors = null;
      let typography = {};
      let siteInfo = null;

      // Try to load from database first
      if (this.currentSiteId) {
        // We need site info for title/favicon, loadSiteTheme returns basic theme
        // But loadPreviewData already called loadSite() which returns full site object including theme?
        // Actually loadSiteTheme depends on endpoint /sites/:id/theme
        // Let's refactor: loadPreviewData calls loadSite(). loadSite returns "site" object.
        // We should store that site object to access name/favicon.

        // Fetch site details again or ensure we have them
        const siteData = await loadSite(this.currentSiteId);
        if (siteData) {
          siteInfo = siteData;
          if (siteData.theme && siteData.theme.colors) {
            colors = siteData.theme.colors;
            typography = siteData.theme.typography || {};
          }
        }
      }

      // Fallback to localStorage if database failed
      if (!colors) {
        const stored = localStorage.getItem('brandingColors');
        if (stored) {
          const data = JSON.parse(stored);
          colors = data;
          typography = data.typography || {};
          console.log('✓ Loaded theme from localStorage');
        }
      }

      // APPLY TITLE AND FAVICON
      if (siteInfo) {
        if (siteInfo.name) {
          document.title = siteInfo.name;
        }
        if (siteInfo.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = siteInfo.favicon;
        }
      }
      if (!colors) return; // No theme data available

      // CRITICAL: Apply to body instead of :root because framework uses [data-theme="labscoop"] on body
      // which has higher specificity than :root even with !important
      const root = document.body;

      // Primary Colors
      if (colors.primary) {
        root.style.setProperty('--s-bg-primary', colors.primary, 'important');
        root.style.setProperty('--s-bg-primary-hover', this.adjustColor(colors.primary, -20), 'important');
        root.style.setProperty('--p-color-brand-600', colors.primary, 'important');
        root.style.setProperty('--s-border-focus', colors.primary, 'important');
      }

      // Background Colors
      if (colors.background) {
        root.style.setProperty('--s-bg-page', colors.background, 'important');
        root.style.setProperty('--s-bg-surface', colors.background, 'important');
      }

      // Text Colors
      if (colors.text) {
        root.style.setProperty('--s-text-primary', colors.text, 'important');
        root.style.setProperty('--s-text-secondary', this.adjustColor(colors.text, 40), 'important');
      }

      // Typography
      if (typography.primary) {
        root.style.setProperty('--s-font-family-body', `${typography.primary}, sans-serif`, 'important');
        root.style.setProperty('--s-font-family', `${typography.primary}, sans-serif`, 'important');
      }
      if (typography.heading) {
        root.style.setProperty('--s-font-family-heading', `${typography.heading}, serif`, 'important');
      }
    } catch (e) {
      console.error('Failed to apply branding colors', e);
    }
  }

  // Helper to darken/lighten hex color
  adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  /**
   * Intercept all clicks to handle internal links within the preview sandbox
   */
  handleGlobalClick(event) {
    // Find closest anchor tag
    const anchor = event.composedPath().find(el => el.tagName === 'A');
    if (anchor && anchor.href) {
      const url = new URL(anchor.href);

      // If it's an internal link to this site
      if (url.origin === window.location.origin) {
        // If it points to a page like /p_about or just /about
        // We need to map it to /preview/<pageId>

        // Check if it's already a preview link (handled by handleNavigation)
        if (url.pathname.startsWith('/preview')) {
          return; // Let standard handling proceed
        }
        event.preventDefault();
        console.log('Intercepted link:', url.pathname);

        // Logic to find page ID from slug
        // This assumes we have the slug in sitePages
        const slug = url.pathname;
        const targetPage = this.sitePages.find(p => p.slug === slug || `/${p.slug}` === slug);
        if (targetPage) {
          console.log('Redirecting to preview page:', targetPage.id);
          window.history.pushState({}, '', `/preview/${targetPage.id}`);
          this.loadPageData(targetPage.id);
        } else {
          console.warn('Target page not found for slug:', slug);
        }
      }
    }
  }
  /*LWC compiler v8.28.0*/
}
_registerDecorators(Preview, {
  track: {
    pageData: 1,
    currentPage: 1,
    sitePages: 1,
    isLoading: 1,
    headerConfig: 1
  }
});
const __lwc_component_class_internal = _registerComponent(Preview, {
  tmpl: _tmpl,
  sel: "-preview",
  apiVersion: 66
});
export default __lwc_component_class_internal;