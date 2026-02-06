import _tmpl from "./emptystate.html";
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class EmptyState extends LightningElement {
  handleCreate() {
    this.dispatchEvent(new CustomEvent('create'));
  }
  /*LWC compiler v8.28.0*/
}
const __lwc_component_class_internal = _registerComponent(EmptyState, {
  tmpl: _tmpl,
  sel: "custom-emptystate",
  apiVersion: 66
});
export default __lwc_component_class_internal;