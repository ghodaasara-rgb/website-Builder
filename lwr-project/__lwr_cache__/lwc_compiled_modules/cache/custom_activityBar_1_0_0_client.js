import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./activityBar.html";
class ActivityBar extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeTab = 'panel-build';
  }
  get computedClassHeader() {
    return `activity-tab ${this.activeTab === 'panel-header' ? 'active' : ''}`;
  }
  handleTabClick(event) {
    const tabId = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('tabselect', {
      detail: tabId
    }));
  }
  get computedClassTheme() {
    return `activity-tab ${this.activeTab === 'panel-theme' ? 'active' : ''}`;
  }
  get computedClassBuild() {
    return `activity-tab ${this.activeTab === 'panel-build' ? 'active' : ''}`;
  }
  get computedClassStructure() {
    return `activity-tab ${this.activeTab === 'panel-structure' ? 'active' : ''}`;
  }
  get computedClassPages() {
    return `activity-tab ${this.activeTab === 'panel-pages' ? 'active' : ''}`;
  }
  get computedClassSettings() {
    return `activity-tab ${this.activeTab === 'panel-settings' ? 'active' : ''}`;
  }
  /*LWC compiler v8.28.0*/
}
ActivityBar.renderMode = 'light';
_registerDecorators(ActivityBar, {
  publicProps: {
    activeTab: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(ActivityBar, {
  tmpl: _tmpl,
  sel: "custom-activity-bar",
  apiVersion: 66
});
export default __lwc_component_class_internal;