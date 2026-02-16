import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./imageBlock.html";
class ImageBlock extends LightningElement {
  constructor(...args) {
    super(...args);
    this.src = '';
    this.alt = '';
    this.caption = '';
  }
  /*LWC compiler v8.28.0*/
}
ImageBlock.renderMode = 'light';
_registerDecorators(ImageBlock, {
  publicProps: {
    src: {
      config: 0
    },
    alt: {
      config: 0
    },
    caption: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(ImageBlock, {
  tmpl: _tmpl,
  sel: "components-image-block",
  apiVersion: 66
});
export default __lwc_component_class_internal;