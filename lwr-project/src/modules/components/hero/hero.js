import { LightningElement, api } from 'lwc';

export default class Hero extends LightningElement {
    static renderMode = 'light';
    @api title = 'Welcome to FlexSite';
    @api subtitle = 'Built with the Custom CSS Framework';
    @api ctaText = 'Get Started';
    @api ctaSecondaryText = 'Learn More';
    @api backgroundImage = '';
    @api textColor = '#ffffff';

    get sectionStyle() {
        const baseStyle = 'padding: 4rem 0;';
        if (this.backgroundImage) {
            return `${baseStyle} background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${this.backgroundImage}'); background-size: cover; background-position: center; position: relative;`;
        }
        return baseStyle;
    }

    get headlineStyle() {
        return `font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; color: ${this.textColor}; text-shadow: 0 2px 4px rgba(0,0,0,0.5);`;
    }

    get subtitleStyle() {
        return `font-size: 1.25rem; margin-bottom: 2rem; color: ${this.textColor}; opacity: 0.95; text-shadow: 0 1px 2px rgba(0,0,0,0.5);`;
    }
}
