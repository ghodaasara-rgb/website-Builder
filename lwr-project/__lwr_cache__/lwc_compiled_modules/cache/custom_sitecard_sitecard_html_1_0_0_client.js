import _implicitStylesheets from "./sitecard.css";
import _implicitScopedStylesheets from "./sitecard.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="site-card${0}"${2}><div class="site-card-header${0}"${2}><h3 class="site-name${0}"${2}>${"t3"}</h3><span${"c4"}${2}>${"t5"}</span></div><div class="site-meta${0}"${2}><div class="meta-item${0}"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" stroke="currentColor" stroke-width="1.5"${3}/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"${3}/></svg><span${3}>${"t12"}</span></div><div class="meta-item${0}"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M2 4.667C2 3.747 2.746 3 3.667 3h8.666C13.253 3 14 3.746 14 4.667v6.666c0 .92-.746 1.667-1.667 1.667H3.667A1.667 1.667 0 0 1 2 11.333V4.667Z" stroke="currentColor" stroke-width="1.5"${3}/><path d="M6 3v10M2 8h12" stroke="currentColor" stroke-width="1.5"${3}/></svg><span${3}>${"t18"}</span></div></div><div class="site-actions${0}"${2}><button class="btn btn-primary${0}"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M11.333 2H4.667C3.747 2 3 2.746 3 3.667v8.666C3 13.253 3.746 14 4.667 14h6.666c.92 0 1.667-.746 1.667-1.667V3.667C13 2.747 12.254 2 11.333 2Z" stroke="currentColor" stroke-width="1.5"${3}/><path d="M6 5.333h4M6 8h4M6 10.667h2.667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"${3}/></svg>Open Builder</button><button class="btn btn-secondary${0}"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M8 5.333c-2.667 0-4.88 1.827-5.64 4.334.76 2.506 2.973 4.333 5.64 4.333s4.88-1.827 5.64-4.333C12.88 7.16 10.667 5.333 8 5.333Z" stroke="currentColor" stroke-width="1.5"${3}/><circle cx="8" cy="9.667" r="1.667" stroke="currentColor" stroke-width="1.5"${3}/></svg>Preview</button><button class="btn btn-icon btn-danger${0}" title="Delete site"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M3.333 5.333h9.334M6.667 7.333v4M9.333 7.333v4M5.333 5.333V3.667a1 1 0 0 1 1-1h3.334a1 1 0 0 1 1 1v1.666m-6.667 0v7.667a1 1 0 0 0 1 1h5.333a1 1 0 0 0 1-1V5.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"${3}/></svg></button></div></div>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, ncls: api_normalize_class_name, b: api_bind, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0, _m1, _m2} = $ctx;
  return [api_static_fragment($fragment1, 1, [api_static_part(3, null, api_dynamic_text($cmp.site.name)), api_static_part(4, {
    className: api_normalize_class_name($cmp.statusBadgeClass)
  }, null), api_static_part(5, null, api_dynamic_text($cmp.statusLabel)), api_static_part(12, null, api_dynamic_text($cmp.lastModified)), api_static_part(18, null, api_dynamic_text($cmp.pageCountText)), api_static_part(20, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleOpen)
    })
  }, null), api_static_part(25, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handlePreview)
    })
  }, null), api_static_part(30, {
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleDelete)
    })
  }, null)])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-2q7dn1madp2";
tmpl.legacyStylesheetToken = "custom-sitecard_sitecard";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
