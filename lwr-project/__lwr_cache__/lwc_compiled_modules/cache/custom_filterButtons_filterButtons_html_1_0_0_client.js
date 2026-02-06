import _implicitStylesheets from "./filterButtons.css";
import _implicitScopedStylesheets from "./filterButtons.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="filter-buttons${0}"${2}><button${"c1"}${2}>All</button><button${"c3"}${2}>Draft</button><button${"c5"}${2}>Published</button></div>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0, _m1, _m2} = $ctx;
  return [api_static_fragment($fragment1, 1, [api_static_part(1, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleFilterAll)
    }),
    className: api_normalize_class_name($cmp.allButtonClass)
  }, null), api_static_part(3, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleFilterDraft)
    }),
    className: api_normalize_class_name($cmp.draftButtonClass)
  }, null), api_static_part(5, {
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleFilterPublished)
    }),
    className: api_normalize_class_name($cmp.publishedButtonClass)
  }, null)])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-4ehssqmg3qc";
tmpl.legacyStylesheetToken = "custom-filterButtons_filterButtons";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
