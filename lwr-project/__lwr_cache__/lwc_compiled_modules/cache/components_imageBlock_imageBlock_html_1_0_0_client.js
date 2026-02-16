import _implicitStylesheets from "./imageBlock.css";
import _implicitScopedStylesheets from "./imageBlock.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<img${"a0:src"}${"a0:alt"} class="img-responsive${0}"${2}>`;
const $fragment2 = parseFragment`<figcaption${3}>${"t1"}</figcaption>`;
const stc0 = {
  classMap: {
    "image-block": true
  },
  key: 0
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {sp: api_static_part, st: api_static_fragment, d: api_dynamic_text, fr: api_fragment, h: api_element} = $api;
  return [api_element("figure", stc0, [api_static_fragment($fragment1, 2, [api_static_part(0, {
    attrs: {
      "src": $cmp.src,
      "alt": $cmp.alt
    }
  }, null)]), $cmp.caption ? api_fragment(3, [api_static_fragment($fragment2, 5, [api_static_part(1, null, api_dynamic_text($cmp.caption))])], 0) : null])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-12le0dtu3tq";
tmpl.legacyStylesheetToken = "components-imageBlock_imageBlock";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
