import _implicitStylesheets from "./textBlock.css";
import _implicitScopedStylesheets from "./textBlock.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<h2${3}>${"t1"}</h2>`;
const stc0 = {
  classMap: {
    "text-block-wrapper": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "text-content": true
  },
  context: {
    lwc: {
      dom: "manual"
    }
  },
  key: 3
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, h: api_element} = $api;
  return [api_element("div", stc0, [$cmp.heading ? api_static_fragment($fragment1, 2, [api_static_part(1, null, api_dynamic_text($cmp.heading))]) : null, api_element("div", stc1)])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-45ig5r15g8s";
tmpl.legacyStylesheetToken = "components-textBlock_textBlock";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
