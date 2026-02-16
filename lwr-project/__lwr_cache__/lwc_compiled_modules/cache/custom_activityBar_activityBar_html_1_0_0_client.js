import _implicitStylesheets from "./activityBar.css";
import _implicitScopedStylesheets from "./activityBar.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="activity-bar${0}"${2}><div${"c1"} data-id="panel-theme" title="Branding"${2}><svg viewBox="0 0 24 24"${3}><path d="M7,2V13H10V22L17,10H13L17,2H7Z"${3}/></svg></div><div${"c4"} data-id="panel-build" title="Components"${2}><svg viewBox="0 0 24 24"${3}><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"${3}/></svg></div><div${"c7"} data-id="panel-structure" title="Structure"${2}><svg viewBox="0 0 24 24"${3}><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"${3}/></svg></div><div${"c10"} data-id="panel-pages" title="Pages"${2}><svg viewBox="0 0 24 24"${3}><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"${3}/></svg></div><div${"c13"} data-id="panel-header" title="Header"${2}><svg viewBox="0 0 24 24"${3}><path d="M3,4H21V8H3V4M3,10H21V12H3V10M3,14H21V16H3V14M3,18H21V20H3V18Z"${3}/></svg></div><div style="flex: 1;"${3}></div><div${"c17"} data-id="panel-settings" title="Settings"${2}><svg viewBox="0 0 24 24"${3}><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"${3}/></svg></div></div>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5} = $ctx;
  return [api_static_fragment($fragment1, 1, [api_static_part(1, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleTabClick)
    }),
    className: api_normalize_class_name($cmp.computedClassTheme)
  }, null), api_static_part(4, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleTabClick)
    }),
    className: api_normalize_class_name($cmp.computedClassBuild)
  }, null), api_static_part(7, {
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleTabClick)
    }),
    className: api_normalize_class_name($cmp.computedClassStructure)
  }, null), api_static_part(10, {
    on: _m3 || ($ctx._m3 = {
      "click": api_bind($cmp.handleTabClick)
    }),
    className: api_normalize_class_name($cmp.computedClassPages)
  }, null), api_static_part(13, {
    on: _m4 || ($ctx._m4 = {
      "click": api_bind($cmp.handleTabClick)
    }),
    className: api_normalize_class_name($cmp.computedClassHeader)
  }, null), api_static_part(17, {
    on: _m5 || ($ctx._m5 = {
      "click": api_bind($cmp.handleTabClick)
    }),
    className: api_normalize_class_name($cmp.computedClassSettings)
  }, null)])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-4lnk5tjturq";
tmpl.legacyStylesheetToken = "custom-activityBar_activityBar";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
