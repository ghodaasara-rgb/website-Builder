import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./footer.html";
class Footer extends LightningElement {
  constructor(...args) {
    super(...args);
    this.copyright = '© 2026 FlexSite';
  }
  get year() {
    return new Date().getFullYear();
  }
  /*LWC compiler v8.28.0*/
}
Footer.renderMode = 'light';
_registerDecorators(Footer, {
  publicProps: {
    copyright: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(Footer, {
  tmpl: _tmpl,
  sel: "components-footer",
  apiVersion: 66
});
export default __lwc_component_class_internal;