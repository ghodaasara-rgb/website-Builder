import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./header.html";
class Header extends LightningElement {
  constructor(...args) {
    super(...args);
    this.isSaving = false;
  }
  handleSave() {
    this.dispatchEvent(new CustomEvent('save'));
  }
  handleDashboard() {
    this.dispatchEvent(new CustomEvent('dashboard'));
  }
  handlePreview() {
    this.dispatchEvent(new CustomEvent('preview'));
  }
  /*LWC compiler v8.28.0*/
}
Header.renderMode = 'light';
_registerDecorators(Header, {
  publicProps: {
    isSaving: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(Header, {
  tmpl: _tmpl,
  sel: "components-header",
  apiVersion: 66
});
export default __lwc_component_class_internal;