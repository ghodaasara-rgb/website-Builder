import _implicitStylesheets from "./header.css";
import _implicitScopedStylesheets from "./header.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="branding${0}"${2}><div class="logo-icon${0}"${2}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"${3}><path d="M12 2L2 19H22L12 2Z" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${3}/></svg></div><span class="brand-name${0}"${2}>FlexSite</span></div>`;
const $fragment2 = parseFragment`<button class="btn btn-secondary${0}"${2}>Dashboard</button>`;
const $fragment3 = parseFragment`<button class="btn btn-secondary${0}"${2}>Preview</button>`;
const stc0 = {
  classMap: {
    "site-header": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "actions": true
  },
  key: 3
};
const stc2 = {
  "btn": true,
  "btn-primary": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {st: api_static_fragment, b: api_bind, sp: api_static_part, t: api_text, h: api_element} = $api;
  const {_m0, _m1, _m2, _m3, _m4} = $ctx;
  return [api_element("header", stc0, [api_static_fragment($fragment1, 2), api_element("div", stc1, [api_static_fragment($fragment2, 5, [api_static_part(0, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleDashboard)
    })
  }, null)]), api_element("button", {
    classMap: stc2,
    attrs: {
      "disabled": $cmp.isSaving ? "" : null
    },
    key: 6,
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleSave)
    })
  }, [$cmp.isSaving ? api_text("Saving...") : null, !$cmp.isSaving ? api_text("Save") : null]), api_static_fragment($fragment3, 8, [api_static_part(0, {
    on: _m4 || ($ctx._m4 = {
      "click": api_bind($cmp.handlePreview)
    })
  }, null)])])])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-4v8hkok2cm8";
tmpl.legacyStylesheetToken = "components-header_header";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
