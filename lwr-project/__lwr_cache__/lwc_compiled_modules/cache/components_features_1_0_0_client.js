import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./features.html";
class Features extends LightningElement {
  constructor(...args) {
    super(...args);
    this.title = 'Features';
  }
  /*LWC compiler v8.28.0*/
}
Features.renderMode = 'light';
_registerDecorators(Features, {
  publicProps: {
    title: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(Features, {
  tmpl: _tmpl,
  sel: "components-features",
  apiVersion: 66
});
export default __lwc_component_class_internal;