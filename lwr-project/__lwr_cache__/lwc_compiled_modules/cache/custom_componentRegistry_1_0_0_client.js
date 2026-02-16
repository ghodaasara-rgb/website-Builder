let COMPONENT_REGISTRY = [{
  type: 'hero',
  label: 'Hero Section',
  subtitle: 'Headline & CTA',
  icon: 'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z',
  defaultProps: {
    title: 'New Hero Section',
    subtitle: 'Subtitle goes here',
    ctaText: 'Get Started',
    ctaSecondaryText: 'Learn More',
    backgroundImage: '',
    textColor: '#ffffff'
  },
  fields: [{
    name: 'title',
    label: 'Headline',
    type: 'text'
  }, {
    name: 'subtitle',
    label: 'Subtitle',
    type: 'text'
  }, {
    name: 'ctaText',
    label: 'Primary Button Text',
    type: 'text'
  }, {
    name: 'ctaSecondaryText',
    label: 'Secondary Button Text',
    type: 'text'
  }, {
    name: 'backgroundImage',
    label: 'Background Image URL',
    type: 'text'
  }, {
    name: 'textColor',
    label: 'Text Color',
    type: 'color'
  }]
}, {
  type: 'features',
  label: 'Features Grid',
  subtitle: '3 Columns',
  icon: 'M3,3H11V11H3V3M13,3H21V11H13V3M3,13H11V21H3V13M13,13H21V21H13V13Z',
  defaultProps: {
    title: 'Features',
    items: []
  },
  fields: [{
    name: 'title',
    label: 'Section Title',
    type: 'text'
  }]
}, {
  type: 'text',
  label: 'Text Block',
  subtitle: 'Rich Text Content',
  icon: 'M21,6V8H3V6H21M3,18H12V16H3V18M3,13H21V11H3V13Z',
  defaultProps: {
    content: '<h2>Rich Text Block</h2><p>Add your custom content here. This block supports basic HTML formatting.</p>'
  },
  fields: [{
    name: 'content',
    label: 'Content (HTML)',
    type: 'textarea'
  }]
}, {
  type: 'image',
  label: 'Image',
  subtitle: 'Responsive Image',
  icon: 'M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z',
  defaultProps: {
    src: 'https://via.placeholder.com/1200x600',
    alt: 'Placeholder Image',
    caption: 'Image Caption'
  },
  fields: [{
    name: 'src',
    label: 'Image URL',
    type: 'text'
  }, {
    name: 'alt',
    label: 'Alt Text',
    type: 'text'
  }, {
    name: 'caption',
    label: 'Caption',
    type: 'text'
  }]
}, {
  type: 'card',
  label: 'Card',
  subtitle: 'Container with Shadow',
  icon: 'M3,5H21V19H3V5M3,3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3H3M5,7V9H19V7H5M5,11V17H19V11H5Z',
  defaultProps: {
    title: 'Card Title',
    content: 'Card content goes here.',
    action: 'Read More'
  },
  fields: [{
    name: 'title',
    label: 'Title',
    type: 'text'
  }, {
    name: 'content',
    label: 'Content',
    type: 'textarea'
  }, {
    name: 'action',
    label: 'Action Button',
    type: 'text'
  }]
}, {
  type: 'footer',
  label: 'Footer',
  subtitle: 'Simple Layout',
  icon: 'M5,21H19A2,2 0 0,0 21,19V17H3V19A2,2 0 0,0 5,21M5,15H19V5H5V15Z',
  defaultProps: {
    copyright: '© 2026 LWR Site Builder'
  },
  fields: [{
    name: 'copyright',
    label: 'Copyright Text',
    type: 'text'
  }]
}];

// Allow dynamic registration
export function registerComponent(config) {
  const existingIndex = COMPONENT_REGISTRY.findIndex(c => c.type === config.type);
  if (existingIndex !== -1) {
    COMPONENT_REGISTRY[existingIndex] = config;
  } else {
    COMPONENT_REGISTRY.push(config);
  }
}

// Fetch custom components from backend
export async function fetchCustomComponents() {
  try {
    const API_URL = location.hostname === 'localhost' ? 'http://localhost:3001' : '';
    const response = await fetch(`${API_URL}/api/components/custom`);
    if (!response.ok) return;
    const customComponents = await response.json();
    customComponents.forEach(comp => {
      registerComponent({
        type: comp.name,
        // The component name (folder name)
        label: comp.label || comp.name,
        subtitle: 'Custom Component',
        icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Zm0,18A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20ZM11,7H13V11H17V13H13V17H11V13H7V11H11V7Z',
        // Plus icon
        defaultProps: comp.defaultProps || {},
        fields: comp.fields || []
      });
    });
    console.log('✅ Custom components loaded:', customComponents.length);
  } catch (error) {
    console.warn('⚠️ Failed to load custom components:', error);
  }
}
export { COMPONENT_REGISTRY };