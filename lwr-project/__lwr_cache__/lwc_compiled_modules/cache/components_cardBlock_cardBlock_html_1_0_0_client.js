import _implicitStylesheets from "./cardBlock.css";
import _implicitScopedStylesheets from "./cardBlock.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<h3 class="card-title${0}"${2}>${"t1"}</h3>`;
const $fragment2 = parseFragment`<p class="card-text${0}"${2}>${"t1"}</p>`;
const $fragment3 = parseFragment`<button class="btn btn--primary${0}"${2}>${"t1"}</button>`;
const stc0 = {
  classMap: {
    "card-block": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "card-body": true
  },
  key: 1
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, b: api_bind, fr: api_fragment, h: api_element} = $api;
  const {_m0, _m1} = $ctx;
  return [api_element("div", stc0, [api_element("div", stc1, [api_static_fragment($fragment1, 3, [api_static_part(1, null, api_dynamic_text($cmp.title))]), api_static_fragment($fragment2, 5, [api_static_part(1, null, api_dynamic_text($cmp.content))]), $cmp.action ? api_fragment(6, [api_static_fragment($fragment3, 8, [api_static_part(0, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleAction)
    })
  }, null), api_static_part(1, null, api_dynamic_text($cmp.action))])], 0) : null])])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-1b4mq7pplq";
tmpl.legacyStylesheetToken = "components-cardBlock_cardBlock";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
