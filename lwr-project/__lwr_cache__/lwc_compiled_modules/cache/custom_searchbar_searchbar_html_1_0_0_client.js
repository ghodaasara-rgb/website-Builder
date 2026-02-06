import _implicitStylesheets from "./searchbar.css";
import _implicitScopedStylesheets from "./searchbar.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<svg class="search-icon${0}" width="20" height="20" viewBox="0 0 20 20" fill="none"${2}><path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM17.5 17.5l-4-4" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round"${3}/></svg>`;
const stc0 = {
  classMap: {
    "search-bar": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "search-input-wrapper": true
  },
  key: 1
};
const stc2 = {
  "search-input": true
};
const stc3 = {
  "type": "text",
  "placeholder": "Search sites by name..."
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, b: api_bind, h: api_element} = $api;
  const {_m0} = $ctx;
  return [api_element("div", stc0, [api_element("div", stc1, [api_static_fragment($fragment1, 3), api_element("input", {
    classMap: stc2,
    attrs: stc3,
    props: {
      "value": $cmp.searchValue
    },
    key: 4,
    on: _m0 || ($ctx._m0 = {
      "input": api_bind($cmp.handleSearchInput)
    })
  })])])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-3jjlqquhajs";
tmpl.legacyStylesheetToken = "custom-searchbar_searchbar";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
