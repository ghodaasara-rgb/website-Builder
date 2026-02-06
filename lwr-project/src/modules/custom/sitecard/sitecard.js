import { LightningElement, api } from 'lwc';

export default class SiteCard extends LightningElement {
    @api site;

    get statusBadgeClass() {
        const status = this.site?.status || 'draft';
        return `status-badge status-${status}`;
    }

    get statusLabel() {
        const status = this.site?.status || 'draft';
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    get lastModified() {
        if (!this.site?.updated_at && !this.site?.created_at) {
            return 'Never';
        }

        const date = new Date(this.site.updated_at || this.site.created_at);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    get pageCountText() {
        const count = this.site?.pageCount || 0;
        return `${count} page${count !== 1 ? 's' : ''}`;
    }

    handleOpen() {
        this.dispatchEvent(new CustomEvent('open', {
            detail: { siteId: this.site.id }
        }));
    }

    handlePreview() {
        this.dispatchEvent(new CustomEvent('preview', {
            detail: { siteId: this.site.id }
        }));
    }

    handleDelete() {
        this.dispatchEvent(new CustomEvent('delete', {
            detail: { siteId: this.site.id }
        }));
    }
}
