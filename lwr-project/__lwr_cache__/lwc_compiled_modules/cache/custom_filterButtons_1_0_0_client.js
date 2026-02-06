import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./filterButtons.html";
class FilterButtons extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeFilter = 'all';
  }
  handleFilterAll() {
    this.dispatchFilterEvent('all');
  }
  handleFilterDraft() {
    this.dispatchFilterEvent('draft');
  }
  handleFilterPublished() {
    this.dispatchFilterEvent('published');
  }
  dispatchFilterEvent(status) {
    this.dispatchEvent(new CustomEvent('filter', {
      detail: {
        status
      }
    }));
  }
  get allButtonClass() {
    return `filter-button ${this.activeFilter === 'all' ? 'active' : ''}`;
  }
  get draftButtonClass() {
    return `filter-button ${this.activeFilter === 'draft' ? 'active' : ''}`;
  }
  get publishedButtonClass() {
    return `filter-button ${this.activeFilter === 'published' ? 'active' : ''}`;
  }
  /*LWC compiler v8.28.0*/
}
_registerDecorators(FilterButtons, {
  publicProps: {
    activeFilter: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(FilterButtons, {
  tmpl: _tmpl,
  sel: "custom-filter-buttons",
  apiVersion: 66
});
export default __lwc_component_class_internal;