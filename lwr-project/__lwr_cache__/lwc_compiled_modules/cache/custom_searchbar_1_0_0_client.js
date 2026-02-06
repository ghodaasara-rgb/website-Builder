import { registerDecorators as _registerDecorators, LightningElement, registerComponent as _registerComponent } from "lwc";
import _tmpl from "./searchbar.html";
class SearchBar extends LightningElement {
  constructor(...args) {
    super(...args);
    this.searchValue = '';
    this.searchValue = '';
  }
  handleSearchInput(event) {
    this.searchValue = event.target.value;

    // Debounced search
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('search', {
        detail: {
          query: this.searchValue
        }
      }));
    }, 300);
  }
  disconnectedCallback() {
    clearTimeout(this.searchTimeout);
  }
  /*LWC compiler v8.28.0*/
}
_registerDecorators(SearchBar, {
  track: {
    searchValue: 1
  }
});
const __lwc_component_class_internal = _registerComponent(SearchBar, {
  tmpl: _tmpl,
  sel: "custom-searchbar",
  apiVersion: 66
});
export default __lwc_component_class_internal;