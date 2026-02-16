import _implicitStylesheets from "./footer.css";
import _implicitScopedStylesheets from "./footer.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<footer class="container${0}" style="padding: 2rem 0; border-top: 1px solid var(--s-border-default); margin-top: 4rem;"${2}><div class="grid${0}"${2}><div class="col-span-6${0}"${2}><strong style="color: var(--s-text-primary);"${3}>FlexSite</strong><p style="color: var(--s-text-secondary); font-size: 0.875rem;"${3}>${"t6"}</p></div><div class="col-span-6${0}" style="text-align: right;"${2}><a href="#" style="color: var(--s-text-secondary); margin-left: 1rem; text-decoration: none;"${3}>Privacy</a><a href="#" style="color: var(--s-text-secondary); margin-left: 1rem; text-decoration: none;"${3}>Terms</a></div></div></footer>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1, 1, [api_static_part(6, null, api_dynamic_text($cmp.copyright))])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6rvlaincsff";
tmpl.legacyStylesheetToken = "components-footer_footer";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
