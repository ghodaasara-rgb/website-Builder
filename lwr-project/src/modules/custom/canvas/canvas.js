import { LightningElement, api } from 'lwc';

export default class Canvas extends LightningElement {
    static renderMode = 'light';
    @api components = [];

    get isEmpty() {
        return !this.components || this.components.length === 0;
    }

    /**
     * Public method to get the current canvas state
     * Called by the parent builder component when saving
     */
    @api
    getCanvasState() {
        return {
            version: '1.0.0',
            pages: [
                {
                    id: 'page-1',
                    name: 'Home',
                    slug: '/',
                    layout: {
                        sections: this.components.map(comp => ({
                            id: comp.id?.toString() || `section-${Date.now()}`,
                            type: comp.type,
                            properties: comp.props || {},
                            rows: []
                        }))
                    },
                    metadata: {
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                }
            ],
            activePageId: 'page-1'
        };
    }

    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    handleDrop(event) {
        event.preventDefault();
        const type = event.dataTransfer.getData('type');
        // Only handle new component drops here. Reordering is handled by handleItemDrop
        if (type && !event.dataTransfer.getData('reorder-index')) {
            this.dispatchEvent(new CustomEvent('componentdrop', { detail: { type } }));
        }
    }

    handleItemDragStart(event) {
        const index = event.currentTarget.dataset.index;
        event.dataTransfer.setData('reorder-index', index);
        event.dataTransfer.effectAllowed = 'move';
        // Need to set type to null or something to avoid conflict? 
        // Actually, main loop handles 'type'. Reordering uses 'reorder-index'.
    }

    handleItemDragOver(event) {
        event.preventDefault();
        event.stopPropagation(); // Stop bubbling to container
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.classList.add('drop-target');
    }

    handleItemDrop(event) {
        event.preventDefault();
        event.stopPropagation(); // Stop bubbling to container
        event.currentTarget.classList.remove('drop-target');

        const fromIndex = event.dataTransfer.getData('reorder-index');
        const toIndex = event.currentTarget.dataset.index;
        const type = event.dataTransfer.getData('type');

        if (fromIndex !== undefined && fromIndex !== null && fromIndex !== '' && fromIndex !== toIndex) {
            // Reordering
            this.dispatchEvent(new CustomEvent('componentreorder', {
                detail: {
                    fromIndex: parseInt(fromIndex, 10),
                    toIndex: parseInt(toIndex, 10)
                }
            }));
        } else if (type && !fromIndex) {
            // Insertion between components
            // Dropping ON a component inserts it AFTER that component (or before, depending on logic, let's say AFTER for now or based on drop position)
            // For simplicity, let's insert AFTER.
            this.dispatchEvent(new CustomEvent('componentdrop', {
                detail: {
                    type,
                    index: parseInt(toIndex, 10) + 1 // Insert after
                }
            }));
        }
    }

    @api selectedComponentId = null;

    handleComponentClick(event) {
        event.stopPropagation();
        const index = event.currentTarget.dataset.index;
        const component = this.components[index];
        if (component) {
            this.dispatchEvent(new CustomEvent('componentselect', {
                detail: { componentId: component.id }
            }));
        }
    }

    handleDelete(event) {
        event.stopPropagation();
        const index = event.currentTarget.dataset.index;
        this.dispatchEvent(new CustomEvent('componentdelete', {
            detail: { index: parseInt(index, 10) }
        }));
    }
}
