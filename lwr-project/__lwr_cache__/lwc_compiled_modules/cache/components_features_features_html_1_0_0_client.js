import _implicitStylesheets from "./features.css";
import _implicitScopedStylesheets from "./features.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<section class="container${0}" style="padding: 4rem 0;"${2}><h2 style="text-align: center; margin-bottom: 2rem;"${3}>${"t2"}</h2><div class="grid${0}"${2}><div class="col-span-4${0}"${2}><div class="card${0}" style="height: 100%;"${2}><div class="card-header${0}"${2}><h3 class="card-title${0}"${2}>Drag &amp; Drop</h3></div><div class="card-body${0}"${2}><p style="color: var(--s-text-secondary);"${3}>Easily build pages by dragging components.</p></div></div></div><div class="col-span-4${0}"${2}><div class="card${0}" style="height: 100%;"${2}><div class="card-header${0}"${2}><h3 class="card-title${0}"${2}>Responsive</h3></div><div class="card-body${0}"${2}><p style="color: var(--s-text-secondary);"${3}>Layouts adapt perfectly to any device size.</p></div></div></div><div class="col-span-4${0}"${2}><div class="card${0}" style="height: 100%;"${2}><div class="card-header${0}"${2}><h3 class="card-title${0}"${2}>Customizable</h3></div><div class="card-body${0}"${2}><p style="color: var(--s-text-secondary);"${3}>Powered by your Custom CSS Framework.</p></div></div></div></div></section>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1, 1, [api_static_part(2, null, api_dynamic_text($cmp.title))])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-32bflh7ts20";
tmpl.legacyStylesheetToken = "components-features_features";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
