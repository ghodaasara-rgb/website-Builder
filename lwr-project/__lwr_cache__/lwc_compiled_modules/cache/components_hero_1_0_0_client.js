import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./hero.html";
class Hero extends LightningElement {
  constructor(...args) {
    super(...args);
    this.title = 'Welcome to FlexSite';
    this.subtitle = 'Built with the Custom CSS Framework';
    this.ctaText = 'Get Started';
    this.ctaSecondaryText = 'Learn More';
    this.backgroundImage = '';
    this.textColor = '#ffffff';
  }
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
  /*LWC compiler v8.28.0*/
}
Hero.renderMode = 'light';
_registerDecorators(Hero, {
  publicProps: {
    title: {
      config: 0
    },
    subtitle: {
      config: 0
    },
    ctaText: {
      config: 0
    },
    ctaSecondaryText: {
      config: 0
    },
    backgroundImage: {
      config: 0
    },
    textColor: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(Hero, {
  tmpl: _tmpl,
  sel: "components-hero",
  apiVersion: 66
});
export default __lwc_component_class_internal;