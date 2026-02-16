import _implicitStylesheets from "./hero.css";
import _implicitScopedStylesheets from "./hero.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<section class="container${0}"${"s0"}${2}><div class="grid${0}"${2}><div class="col-span-12${0}" style="text-align: center; z-index: 1; position: relative;"${2}><h1${"s3"}${3}>${"t4"}</h1><p${"s5"}${3}>${"t6"}</p><div style="display: flex; gap: 1rem; justify-content: center;"${3}><a href="#" class="btn btn--primary btn--lg${0}"${2}>${"t9"}</a><a href="#" class="btn btn--secondary btn--lg${0}"${2}>${"t11"}</a></div></div></div></section>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1, 1, [api_static_part(0, {
    style: $cmp.sectionStyle
  }, null), api_static_part(3, {
    style: $cmp.headlineStyle
  }, null), api_static_part(4, null, api_dynamic_text($cmp.title)), api_static_part(5, {
    style: $cmp.subtitleStyle
  }, null), api_static_part(6, null, api_dynamic_text($cmp.subtitle)), api_static_part(9, null, api_dynamic_text($cmp.ctaText)), api_static_part(11, null, api_dynamic_text($cmp.ctaSecondaryText))])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-chdq17c5gt";
tmpl.legacyStylesheetToken = "components-hero_hero";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
