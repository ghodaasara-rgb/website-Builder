import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./cardBlock.html";
class CardBlock extends LightningElement {
  constructor(...args) {
    super(...args);
    this.title = '';
    this.content = '';
    this.action = '';
  }
  handleAction() {
    console.log('Card action clicked');
  }
  /*LWC compiler v8.28.0*/
}
CardBlock.renderMode = 'light';
_registerDecorators(CardBlock, {
  publicProps: {
    title: {
      config: 0
    },
    content: {
      config: 0
    },
    action: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(CardBlock, {
  tmpl: _tmpl,
  sel: "components-card-block",
  apiVersion: 66
});
export default __lwc_component_class_internal;