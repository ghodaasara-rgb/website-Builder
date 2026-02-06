import _implicitStylesheets from "./emptystate.css";
import _implicitScopedStylesheets from "./emptystate.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="empty-state${0}"${2}><div class="empty-icon${0}"${2}><svg width="64" height="64" viewBox="0 0 64 64" fill="none"${3}><path d="M32 58.667C46.728 58.667 58.667 46.728 58.667 32S46.728 5.333 32 5.333 5.333 17.272 5.333 32 17.272 58.667 32 58.667Z" fill="#eef2ff" stroke="#4f46e5" stroke-width="2"${3}/><path d="M32 24v16M24 32h16" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"${3}/></svg></div><h2 class="empty-title${0}"${2}>No Sites Yet</h2><p class="empty-description${0}"${2}>Create your first website to get started with SiteCentral</p><button class="btn btn-primary${0}"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"${3}/></svg>Create Your First Site</button></div>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0} = $ctx;
  return [api_static_fragment($fragment1, 1, [api_static_part(9, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleCreate)
    })
  }, null)])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-7tpbsm2kfla";
tmpl.legacyStylesheetToken = "custom-emptystate_emptystate";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
