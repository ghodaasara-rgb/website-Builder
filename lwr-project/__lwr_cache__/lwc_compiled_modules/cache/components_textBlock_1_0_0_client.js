import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./textBlock.html";
class TextBlock extends LightningElement {
  constructor(...args) {
    super(...args);
    this.heading = void 0;
    this._content = void 0;
  }
  get content() {
    return this._content;
  }
  set content(value) {
    this._content = value;
    this.renderHtml();
  }
  renderedCallback() {
    this.renderHtml();
  }
  renderHtml() {
    if (this._content) {
      const container = this.querySelector('.text-content');
      if (container) {
        // eslint-disable-next-line @lwc/lwc/no-inner-html
        container.innerHTML = this._content;
      }
    }
  }
  /*LWC compiler v8.28.0*/
}
TextBlock.renderMode = 'light';
_registerDecorators(TextBlock, {
  publicProps: {
    heading: {
      config: 0
    },
    content: {
      config: 3
    }
  },
  fields: ["_content"]
});
const __lwc_component_class_internal = _registerComponent(TextBlock, {
  tmpl: _tmpl,
  sel: "components-text-block",
  apiVersion: 66
});
export default __lwc_component_class_internal;