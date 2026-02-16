import _implicitStylesheets from "./sidePanel.css";
import _implicitScopedStylesheets from "./sidePanel.scoped.css?scoped=true";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="panel-header${0}"${2}><h3 class="panel-title${0}"${2}>Components</h3><button class="btn-icon${0}" title="Import Component"${2}><svg style="width: 16px; height: 16px;" viewBox="0 0 24 24"${3}><path d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,20V8L14,2M14,18H10V14H6L12,8L18,14H14V18Z" fill="currentColor"${3}/></svg></button><input type="file" class="file-input-hidden${0}" accept=".zip" style="visibility: hidden; position: absolute; width: 0; height: 0;"${2}></div>`;
const $fragment2 = parseFragment`<div class="component-item${0}" draggable="true"${"a0:data-type"}${2}><div class="component-icon${0}"${2}><svg style="width: 16px; height: 16px;" viewBox="0 0 24 24"${3}><path${"a3:d"}${3}/></svg></div><div${3}><strong style="display: block; font-size: 0.875rem;"${3}>${"t6"}</strong><small style="color: var(--s-text-secondary);"${3}>${"t8"}</small></div></div>`;
const $fragment3 = parseFragment`<div class="panel-header${0}"${2}><h3 class="panel-title${0}"${2}>Branding</h3></div>`;
const $fragment4 = parseFragment`<label class="form-label${0}"${2}>Active Brand Set</label>`;
const $fragment5 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment6 = parseFragment`<button class="btn-outline-full${0}"${2}>Save as New Smart Set</button>`;
const $fragment7 = parseFragment`<hr class="panel-divider${0}"${2}>`;
const $fragment8 = parseFragment`<h4 class="section-title${0}"${2}>COLORS</h4>`;
const $fragment9 = parseFragment`<label${3}>Primary Color</label>`;
const $fragment10 = parseFragment`<label${3}>Background</label>`;
const $fragment11 = parseFragment`<label${3}>Text Color</label>`;
const $fragment12 = parseFragment`<br${3}>`;
const $fragment13 = parseFragment`<h4 class="section-title${0}"${2}>TYPOGRAPHY</h4>`;
const $fragment14 = parseFragment`<label class="form-label${0}"${2}>Primary Font</label>`;
const $fragment15 = parseFragment`<option${"a0:value"}${3}>${"t1"}</option>`;
const $fragment16 = parseFragment`<label class="form-label${0}"${2}>Heading Font</label>`;
const $fragment17 = parseFragment`<option${"a0:value"}${3}>${"t1"}</option>`;
const $fragment18 = parseFragment`<div class="panel-header${0}"${2}><h3 class="panel-title${0}"${2}>Page Structure</h3></div>`;
const $fragment19 = parseFragment`<button class="btn-back${0}"${2}><svg style="width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24"${3}><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"${3}/></svg>Back to Structure</button>`;
const $fragment20 = parseFragment`<h4 class="editor-title${0}"${2}>${"t1"}</h4>`;
const $fragment21 = parseFragment`<label class="form-label${0}"${2}>${"t1"}</label>`;
const $fragment22 = parseFragment`<textarea class="form-input${0}" rows="4"${"a0:data-name"}${2}>${"t1"}</textarea>`;
const $fragment23 = parseFragment`<label class="form-label${0}" style="margin-bottom: 0;"${2}>${"t1"}</label>`;
const $fragment24 = parseFragment`<hr class="panel-divider${0}" style="margin: 1.5rem 0;"${2}>`;
const $fragment25 = parseFragment`<h4 class="section-title${0}"${2}>DIMENSIONS</h4>`;
const $fragment26 = parseFragment`<label class="form-label${0}"${2}>Min Height</label>`;
const $fragment27 = parseFragment`<label class="form-label${0}"${2}>Padding Top</label>`;
const $fragment28 = parseFragment`<label class="form-label${0}"${2}>Padding Bottom</label>`;
const $fragment29 = parseFragment`<div class="tree-item${0}"${2}><div class="tree-item-content${0}"${"a1:data-id"}${2}><div class="tree-icon${0}"${2}><svg style="width: 14px; height: 14px;" viewBox="0 0 24 24"${3}><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"${3}/></svg></div><div class="tree-label${0}"${2}><strong${3}>${"t7"}</strong><small${3}>${"t9"}</small><small class="tree-preview${0}"${2}>${"t11"}</small></div><div class="tree-actions${0}" style="display: flex; gap: 2px;"${2}><button class="tree-btn${0}" title="Move Up"${"a13:data-index"} style="background: none; border: none; cursor: pointer; color: #64748b; padding: 2px;"${2}><svg style="width: 14px; height: 14px;" viewBox="0 0 24 24"${3}><path d="M7,14L12,9L17,14H7Z" fill="currentColor"${3}/></svg></button><button class="tree-btn${0}" title="Move Down"${"a16:data-index"} style="background: none; border: none; cursor: pointer; color: #64748b; padding: 2px;"${2}><svg style="width: 14px; height: 14px;" viewBox="0 0 24 24"${3}><path d="M7,10L12,15L17,10H7Z" fill="currentColor"${3}/></svg></button><button class="tree-delete${0}"${"a19:data-id"}${2}><svg style="width: 12px; height: 12px;" viewBox="0 0 24 24"${3}><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"${3}/></svg></button></div></div></div>`;
const $fragment30 = parseFragment`<div class="empty-panel${0}"${2}><svg style="width: 48px; height: 48px; opacity: 0.3;" viewBox="0 0 24 24"${3}><path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19Z"${3}/></svg><p${3}>No components added yet</p><small${3}>Drag components from the Components tab to get started</small></div>`;
const $fragment31 = parseFragment`<div class="panel-header${0}"${2}><h3 class="panel-title${0}"${2}>Site Pages</h3><button class="btn-icon${0}" title="Add New Page"${2}><svg style="width: 16px; height: 16px;" viewBox="0 0 24 24"${3}><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"${3}/></svg></button></div>`;
const $fragment32 = parseFragment`<div class="page-icon${0}"${2}><svg style="width: 16px; height: 16px;" viewBox="0 0 24 24"${3}><path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"${3}/></svg></div>`;
const $fragment33 = parseFragment`<div class="page-details${0}"${2}><strong${3}>${"t2"}</strong><small${3}>${"t4"}</small></div>`;
const $fragment34 = parseFragment`<button class="page-action-btn${0}"${"a0:data-id"} title="Rename" style="margin-right: 4px; background: none; border: none; cursor: pointer; color: var(--s-text-secondary);"${2}><svg style="width: 14px; height: 14px;" viewBox="0 0 24 24"${3}><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" fill="currentColor"${3}/></svg></button>`;
const $fragment35 = parseFragment`<span class="badge-active${0}"${2}>Active</span>`;
const $fragment36 = parseFragment`<button class="page-delete${0}"${"a0:data-id"}${2}><svg style="width: 12px; height: 12px;" viewBox="0 0 24 24"${3}><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"${3}/></svg></button>`;
const $fragment37 = parseFragment`<div class="panel-header${0}"${2}><h3 class="panel-title${0}"${2}>Settings</h3></div>`;
const $fragment38 = parseFragment`<h4 class="section-title${0}"${2}>SITE INFORMATION</h4>`;
const $fragment39 = parseFragment`<label class="form-label${0}"${2}>Site Title</label>`;
const $fragment40 = parseFragment`<div class="form-group${0}"${2}><label class="form-label${0}"${2}>Site Description</label><textarea class="form-input${0}" rows="3"${"a3:value"} data-field="description" placeholder="A brief description of your site"${2}></textarea></div>`;
const $fragment41 = parseFragment`<label class="form-label${0}"${2}>Favicon</label>`;
const $fragment42 = parseFragment`<input type="file" accept=".ico,.png,.jpg,.jpeg,.svg" class="form-input${0}" style="padding: 4px;"${2}>`;
const $fragment43 = parseFragment`<img${"a0:src"} alt="Favicon" style="width: 32px; height: 32px; object-fit: contain; border: 1px solid #ccc; border-radius: 4px;"${3}>`;
const $fragment44 = parseFragment`<small style="color: var(--s-text-secondary);"${3}>Recommended: 32x32px or 64x64px (ICO/PNG)</small>`;
const $fragment45 = parseFragment`<hr class="panel-divider${0}"${2}>`;
const $fragment46 = parseFragment`<h4 class="section-title${0}"${2}>EXPORT &amp; DEPLOY</h4>`;
const $fragment47 = parseFragment`<div class="form-group${0}"${2}><label class="form-label${0}"${2}>Export Format</label><select class="form-select${0}" data-field="exportFormat"${2}><option value="html"${3}>Static HTML</option><option value="zip"${3}>ZIP Archive</option><option value="json"${3}>JSON Data</option></select></div>`;
const $fragment48 = parseFragment`<button class="btn-primary-full${0}"${2}><svg style="width: 14px; height: 14px; margin-right: 6px;" viewBox="0 0 24 24"${3}><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"${3}/></svg>Export Website</button>`;
const $fragment49 = parseFragment`<hr class="panel-divider${0}"${2}>`;
const $fragment50 = parseFragment`<h4 class="section-title${0}"${2}>ADVANCED</h4>`;
const $fragment51 = parseFragment`<div class="form-group${0}"${2}><label class="form-label${0}"${2}>Viewport Width (Preview)</label><select class="form-select${0}" data-field="viewportWidth"${2}><option value="100%"${3}>Full Width</option><option value="1440px"${3}>Desktop (1440px)</option><option value="768px"${3}>Tablet (768px)</option><option value="375px"${3}>Mobile (375px)</option></select></div>`;
const $fragment52 = parseFragment`<div class="panel-header${0}"${2}><h3 class="panel-title${0}"${2}>Global Header</h3></div>`;
const $fragment53 = parseFragment`<h4 class="section-title${0}"${2}>LOGO</h4>`;
const $fragment54 = parseFragment`<div class="form-group${0}"${2}><label class="form-label${0}"${2}>Logo Type</label><select class="form-select${0}" data-field="logoType"${2}><option value="text"${"a4:selected"}${3}>Text</option><option value="image"${"a6:selected"}${3}>Image</option><option value="both"${"a8:selected"}${3}>Image &amp; Text</option></select></div>`;
const $fragment55 = parseFragment`<label class="form-label${0}"${2}>Logo Text</label>`;
const $fragment56 = parseFragment`<label class="form-label${0}"${2}>Logo Image URL</label>`;
const $fragment57 = parseFragment`<label class="form-label${0}"${2}>Alt Text</label>`;
const $fragment58 = parseFragment`<hr class="panel-divider${0}"${2}>`;
const $fragment59 = parseFragment`<h4 class="section-title${0}"${2}>NAVIGATION</h4>`;
const $fragment60 = parseFragment`<div style="display: flex; justify-content: space-between; margin-bottom: 4px;"${3}><span style="font-weight: 600; font-size: 0.75rem;"${3}>${"t2"}</span><button${"a3:data-index"} style="background: none; border: none; cursor: pointer; color: var(--s-text-secondary);"${3}><svg style="width: 14px; height: 14px;" viewBox="0 0 24 24"${3}><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" fill="currentColor"${3}/></svg></button></div>`;
const $fragment61 = parseFragment`<button class="btn-outline-full${0}" style="margin-top: 8px;"${2}>+ Add Link</button>`;
const $fragment62 = parseFragment`<hr class="panel-divider${0}"${2}>`;
const $fragment63 = parseFragment`<h4 class="section-title${0}"${2}>STYLE</h4>`;
const $fragment64 = parseFragment`<label${3}>Background Color</label>`;
const $fragment65 = parseFragment`<label${3}>Text Color</label>`;
const $fragment66 = parseFragment`<label class="form-label${0}"${2}>Header Height</label>`;
const $fragment67 = parseFragment`<small style="color: var(--s-text-secondary); display: block; margin-top: 4px;"${3}>Default is auto/fit to content</small>`;
const stc0 = {
  classMap: {
    "side-panel": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "panel-content": true
  },
  key: 9
};
const stc2 = {
  classMap: {
    "form-group": true
  },
  key: 10
};
const stc3 = {
  "form-select": true
};
const stc4 = {
  classMap: {
    "color-item": true
  },
  key: 22
};
const stc5 = {
  "type": "color",
  "data-id": "primary"
};
const stc6 = {
  classMap: {
    "color-item": true
  },
  key: 26
};
const stc7 = {
  "type": "color",
  "data-id": "background"
};
const stc8 = {
  classMap: {
    "color-item": true
  },
  key: 30
};
const stc9 = {
  "type": "color",
  "data-id": "text"
};
const stc10 = {
  classMap: {
    "form-group": true
  },
  key: 38
};
const stc11 = {
  "data-id": "primary"
};
const stc12 = {
  classMap: {
    "form-group": true
  },
  key: 44
};
const stc13 = {
  "data-id": "heading"
};
const stc14 = {
  classMap: {
    "panel-content": true
  },
  key: 53
};
const stc15 = {
  classMap: {
    "property-editor": true
  },
  key: 55
};
const stc16 = {
  "form-group": true
};
const stc17 = {
  classMap: {
    "color-picker-wrapper": true
  },
  styleDecls: [["display", "flex", false], ["gap", "8px", false], ["align-items", "center", false]],
  key: 66
};
const stc18 = {
  "form-input-color": true
};
const stc19 = [["width", "40px", false], ["height", "40px", false], ["padding", "0", false], ["border", "none", false], ["cursor", "pointer", false]];
const stc20 = {
  "form-input": true
};
const stc21 = [["flex", "1", false]];
const stc22 = {
  classMap: {
    "form-group": true
  },
  styleDecls: [["flex-direction", "row", false], ["align-items", "center", false]],
  key: 69
};
const stc23 = [["margin-right", "8px", false]];
const stc24 = {
  classMap: {
    "form-group": true
  },
  key: 79
};
const stc25 = {
  "type": "text",
  "data-name": "minHeight",
  "placeholder": "e.g. 300px"
};
const stc26 = {
  classMap: {
    "form-group": true
  },
  key: 83
};
const stc27 = {
  "type": "text",
  "data-name": "paddingTop",
  "placeholder": "e.g. 2rem"
};
const stc28 = {
  classMap: {
    "form-group": true
  },
  key: 87
};
const stc29 = {
  "type": "text",
  "data-name": "paddingBottom",
  "placeholder": "e.g. 2rem"
};
const stc30 = {
  classMap: {
    "structure-tree": true
  },
  key: 91
};
const stc31 = {
  classMap: {
    "panel-content": true
  },
  key: 99
};
const stc32 = {
  "page-item": true
};
const stc33 = {
  "page-item-content": true
};
const stc34 = {
  classMap: {
    "panel-content": true
  },
  key: 115
};
const stc35 = {
  classMap: {
    "form-group": true
  },
  key: 118
};
const stc36 = {
  "type": "text",
  "data-field": "title",
  "placeholder": "My Awesome Site"
};
const stc37 = {
  classMap: {
    "form-group": true
  },
  key: 124
};
const stc38 = {
  styleDecls: [["display", "flex", false], ["gap", "10px", false], ["align-items", "center", false]],
  key: 127
};
const stc39 = {
  classMap: {
    "form-group": true
  },
  key: 147
};
const stc40 = {
  classMap: {
    "form-label": true
  },
  key: 148
};
const stc41 = {
  "type": "checkbox",
  "data-field": "responsiveMode"
};
const stc42 = {
  classMap: {
    "form-group": true
  },
  key: 150
};
const stc43 = {
  classMap: {
    "form-label": true
  },
  key: 151
};
const stc44 = {
  "type": "checkbox",
  "data-field": "autoSave"
};
const stc45 = {
  classMap: {
    "panel-content": true
  },
  key: 158
};
const stc46 = {
  classMap: {
    "form-group": true
  },
  key: 164
};
const stc47 = {
  "type": "text",
  "data-field": "logoText"
};
const stc48 = {
  classMap: {
    "form-group": true
  },
  key: 169
};
const stc49 = {
  "type": "text",
  "data-field": "logoSrc",
  "placeholder": "https://..."
};
const stc50 = {
  classMap: {
    "form-group": true
  },
  key: 173
};
const stc51 = {
  "type": "text",
  "data-field": "logoAlt"
};
const stc52 = {
  "nav-link-item": true
};
const stc53 = [["border", "1px solid var(--s-border-default)", false], ["padding", "8px", false], ["margin-bottom", "8px", false], ["border-radius", "4px", false], ["background", "var(--s-bg-surface)", false]];
const stc54 = [["margin-bottom", "4px", false]];
const stc55 = {
  classMap: {
    "color-item": true
  },
  key: 192
};
const stc56 = {
  classMap: {
    "color-picker-wrapper": true
  },
  styleDecls: [["display", "flex", false], ["gap", "8px", false], ["align-items", "center", false]],
  key: 195
};
const stc57 = {
  "type": "color",
  "data-field": "backgroundColor"
};
const stc58 = {
  "type": "text",
  "data-field": "backgroundColor"
};
const stc59 = {
  classMap: {
    "color-item": true
  },
  key: 198
};
const stc60 = {
  classMap: {
    "color-picker-wrapper": true
  },
  styleDecls: [["display", "flex", false], ["gap", "8px", false], ["align-items", "center", false]],
  key: 201
};
const stc61 = {
  "type": "color",
  "data-field": "textColor"
};
const stc62 = {
  "type": "text",
  "data-field": "textColor"
};
const stc63 = {
  classMap: {
    "form-group": true
  },
  styleDecls: [["margin-top", "1rem", false]],
  key: 204
};
const stc64 = {
  "type": "text",
  "data-field": "height",
  "placeholder": "e.g. 80px"
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, sp: api_static_part, st: api_static_fragment, k: api_key, d: api_dynamic_text, i: api_iterator, f: api_flatten, fr: api_fragment, h: api_element, t: api_text} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9, _m10, _m11, _m12, _m13, _m14, _m15, _m16, _m17, _m18, _m19, _m20, _m21, _m22, _m23, _m24, _m25, _m26, _m27, _m28, _m29, _m30, _m31, _m32, _m33, _m34, _m35, _m36, _m37, _m38, _m39, _m40, _m41, _m42, _m43, _m44, _m45, _m46, _m47, _m48, _m49, _m50, _m51, _m52, _m53, _m54, _m55, _m56, _m57} = $ctx;
  return [api_element("div", stc0, [$cmp.isBuildTab ? api_fragment(1, api_flatten([api_static_fragment($fragment1, 3, [api_static_part(3, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleImportClick)
    })
  }, null), api_static_part(6, {
    on: _m1 || ($ctx._m1 = {
      "change": api_bind($cmp.handleFileChange)
    })
  }, null)]), api_iterator($cmp.availableComponents, function (comp) {
    return api_static_fragment($fragment2, api_key(5, comp.type), [api_static_part(0, {
      on: _m3 || ($ctx._m3 = {
        "dragstart": api_bind($cmp.handleDragStart)
      }),
      attrs: {
        "data-type": comp.type
      }
    }, null), api_static_part(3, {
      attrs: {
        "d": comp.icon
      }
    }, null), api_static_part(6, null, api_dynamic_text(comp.label)), api_static_part(8, null, api_dynamic_text(comp.subtitle))]);
  })]), 0) : null, $cmp.isThemeTab ? api_fragment(6, [api_static_fragment($fragment3, 8), api_element("div", stc1, [api_element("div", stc2, [api_static_fragment($fragment4, 12), api_element("select", {
    classMap: stc3,
    key: 13,
    on: _m4 || ($ctx._m4 = {
      "change": api_bind($cmp.handleBrandSetChange)
    })
  }, api_iterator($cmp.brandSetOptions, function (option) {
    return api_static_fragment($fragment5, api_key(15, option.value), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_static_fragment($fragment6, 17, [api_static_part(0, {
    on: _m6 || ($ctx._m6 = {
      "click": api_bind($cmp.handleSaveSmartSet)
    })
  }, null)]), api_static_fragment($fragment7, 19), api_static_fragment($fragment8, 21), api_element("div", stc4, [api_static_fragment($fragment9, 24), api_element("input", {
    attrs: stc5,
    props: {
      "value": $cmp.colors.primary
    },
    key: 25,
    on: _m7 || ($ctx._m7 = {
      "input": api_bind($cmp.handleColorChange)
    })
  })]), api_element("div", stc6, [api_static_fragment($fragment10, 28), api_element("input", {
    attrs: stc7,
    props: {
      "value": $cmp.colors.background
    },
    key: 29,
    on: _m8 || ($ctx._m8 = {
      "input": api_bind($cmp.handleColorChange)
    })
  })]), api_element("div", stc8, [api_static_fragment($fragment11, 32), api_element("input", {
    attrs: stc9,
    props: {
      "value": $cmp.colors.text
    },
    key: 33,
    on: _m9 || ($ctx._m9 = {
      "input": api_bind($cmp.handleColorChange)
    })
  })]), api_static_fragment($fragment12, 35), api_static_fragment($fragment13, 37), api_element("div", stc10, [api_static_fragment($fragment14, 40), api_element("select", {
    classMap: stc3,
    attrs: stc11,
    key: 41,
    on: _m10 || ($ctx._m10 = {
      "change": api_bind($cmp.handleFontChange)
    })
  }, api_iterator($cmp.fontOptions, function (option) {
    return api_static_fragment($fragment15, api_key(43, option.value), [api_static_part(0, {
      attrs: {
        "value": option.value
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("div", stc12, [api_static_fragment($fragment16, 46), api_element("select", {
    classMap: stc3,
    attrs: stc13,
    key: 47,
    on: _m11 || ($ctx._m11 = {
      "change": api_bind($cmp.handleFontChange)
    })
  }, api_iterator($cmp.fontOptions, function (option) {
    return api_static_fragment($fragment17, api_key(49, option.value), [api_static_part(0, {
      attrs: {
        "value": option.value
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))])])], 0) : null, $cmp.isStructureTab ? api_fragment(50, [api_static_fragment($fragment18, 52), api_element("div", stc14, [$cmp.isEditing ? api_fragment(54, [api_element("div", stc15, api_flatten([api_static_fragment($fragment19, 57, [api_static_part(0, {
    on: _m13 || ($ctx._m13 = {
      "click": api_bind($cmp.handleBackToStructure)
    })
  }, null)]), api_static_fragment($fragment20, 59, [api_static_part(1, null, "Edit " + api_dynamic_text($cmp.selectedComponentLabel))]), api_iterator($cmp.propertyFields, function (field) {
    return api_element("div", {
      classMap: stc16,
      key: api_key(60, field.name)
    }, [api_static_fragment($fragment21, 62, [api_static_part(1, null, api_dynamic_text(field.label))]), field.isTextarea ? api_fragment(63, [api_static_fragment($fragment22, 65, [api_static_part(0, {
      on: _m15 || ($ctx._m15 = {
        "input": api_bind($cmp.handlePropertyChange)
      }),
      attrs: {
        "data-name": field.name
      }
    }, null), api_static_part(1, null, api_dynamic_text(field.value))])], 0) : field.isColor ? api_fragment(63, [api_element("div", stc17, [api_element("input", {
      classMap: stc18,
      styleDecls: stc19,
      attrs: {
        "type": "color",
        "data-name": field.name
      },
      props: {
        "value": field.value
      },
      key: 67,
      on: _m16 || ($ctx._m16 = {
        "input": api_bind($cmp.handlePropertyChange)
      })
    }), api_element("input", {
      classMap: stc20,
      styleDecls: stc21,
      attrs: {
        "type": "text",
        "data-name": field.name,
        "placeholder": "#000000"
      },
      props: {
        "value": field.value
      },
      key: 68,
      on: _m17 || ($ctx._m17 = {
        "input": api_bind($cmp.handlePropertyChange)
      })
    })])], 0) : field.isCheckbox ? api_fragment(63, [api_element("div", stc22, [api_element("input", {
      styleDecls: stc23,
      attrs: {
        "type": "checkbox",
        "data-name": field.name
      },
      props: {
        "checked": field.value
      },
      key: 70,
      on: _m18 || ($ctx._m18 = {
        "change": api_bind($cmp.handlePropertyChange)
      })
    }), api_static_fragment($fragment23, 72, [api_static_part(1, null, api_dynamic_text(field.label))])])], 0) : field.isNumber ? api_fragment(63, [api_element("input", {
      classMap: stc20,
      attrs: {
        "type": "number",
        "data-name": field.name
      },
      props: {
        "value": field.value
      },
      key: 73,
      on: _m19 || ($ctx._m19 = {
        "input": api_bind($cmp.handlePropertyChange)
      })
    })], 0) : api_fragment(63, [api_element("input", {
      classMap: stc20,
      attrs: {
        "type": "text",
        "data-name": field.name
      },
      props: {
        "value": field.value
      },
      key: 74,
      on: _m20 || ($ctx._m20 = {
        "input": api_bind($cmp.handlePropertyChange)
      })
    })], 0)]);
  }), api_static_fragment($fragment24, 76), api_static_fragment($fragment25, 78), api_element("div", stc24, [api_static_fragment($fragment26, 81), api_element("input", {
    classMap: stc20,
    attrs: stc25,
    props: {
      "value": $cmp.selectedComponent.props.minHeight
    },
    key: 82,
    on: _m21 || ($ctx._m21 = {
      "input": api_bind($cmp.handlePropertyChange)
    })
  })]), api_element("div", stc26, [api_static_fragment($fragment27, 85), api_element("input", {
    classMap: stc20,
    attrs: stc27,
    props: {
      "value": $cmp.selectedComponent.props.paddingTop
    },
    key: 86,
    on: _m22 || ($ctx._m22 = {
      "input": api_bind($cmp.handlePropertyChange)
    })
  })]), api_element("div", stc28, [api_static_fragment($fragment28, 89), api_element("input", {
    classMap: stc20,
    attrs: stc29,
    props: {
      "value": $cmp.selectedComponent.props.paddingBottom
    },
    key: 90,
    on: _m23 || ($ctx._m23 = {
      "input": api_bind($cmp.handlePropertyChange)
    })
  })])]))], 0) : api_fragment(54, [$cmp.hasComponents ? api_element("div", stc30, api_iterator($cmp.componentStructure, function (component) {
    return api_static_fragment($fragment29, api_key(93, component.id), [api_static_part(1, {
      on: _m24 || ($ctx._m24 = {
        "click": api_bind($cmp.handleComponentSelect)
      }),
      attrs: {
        "data-id": component.id
      }
    }, null), api_static_part(7, null, api_dynamic_text(component.label)), api_static_part(9, null, api_dynamic_text(component.type)), api_static_part(11, null, api_dynamic_text(component.preview)), api_static_part(13, {
      on: _m25 || ($ctx._m25 = {
        "click": api_bind($cmp.handleMoveUp)
      }),
      attrs: {
        "data-index": component.index
      }
    }, null), api_static_part(16, {
      on: _m26 || ($ctx._m26 = {
        "click": api_bind($cmp.handleMoveDown)
      }),
      attrs: {
        "data-index": component.index
      }
    }, null), api_static_part(19, {
      on: _m27 || ($ctx._m27 = {
        "click": api_bind($cmp.handleComponentDeleteFromTree)
      }),
      attrs: {
        "data-id": component.id
      }
    }, null)]);
  })) : null, !$cmp.hasComponents ? api_static_fragment($fragment30, 95) : null], 0)])], 0) : null, $cmp.isPagesTab ? api_fragment(96, [api_static_fragment($fragment31, 98, [api_static_part(3, {
    on: _m28 || ($ctx._m28 = {
      "click": api_bind($cmp.handleAddPage)
    })
  }, null)]), api_element("div", stc31, api_iterator($cmp.pages, function (page) {
    return api_element("div", {
      classMap: stc32,
      attrs: {
        "data-id": page.id
      },
      key: api_key(100, page.id)
    }, [api_element("div", {
      classMap: stc33,
      key: 101,
      on: _m29 || ($ctx._m29 = {
        "click": api_bind($cmp.handlePageSelect)
      })
    }, [api_static_fragment($fragment32, 103), api_static_fragment($fragment33, 105, [api_static_part(2, null, api_dynamic_text(page.name)), api_static_part(4, null, api_dynamic_text(page.slug))]), api_static_fragment($fragment34, 107, [api_static_part(0, {
      on: _m31 || ($ctx._m31 = {
        "click": api_bind($cmp.handlePageRename)
      }),
      attrs: {
        "data-id": page.id
      }
    }, null)]), page.isActive ? api_static_fragment($fragment35, 109) : null]), !page.isActive ? api_static_fragment($fragment36, 111, [api_static_part(0, {
      on: _m33 || ($ctx._m33 = {
        "click": api_bind($cmp.handlePageDelete)
      }),
      attrs: {
        "data-id": page.id
      }
    }, null)]) : null]);
  }))], 0) : null, $cmp.isSettingsTab ? api_fragment(112, [api_static_fragment($fragment37, 114), api_element("div", stc34, [api_static_fragment($fragment38, 117), api_element("div", stc35, [api_static_fragment($fragment39, 120), api_element("input", {
    classMap: stc20,
    attrs: stc36,
    props: {
      "value": $cmp.siteSettings.title
    },
    key: 121,
    on: _m34 || ($ctx._m34 = {
      "change": api_bind($cmp.handleSettingChange)
    })
  })]), api_static_fragment($fragment40, 123, [api_static_part(3, {
    on: _m35 || ($ctx._m35 = {
      "change": api_bind($cmp.handleSettingChange)
    }),
    attrs: {
      "value": $cmp.siteSettings.description
    }
  }, null)]), api_element("div", stc37, [api_static_fragment($fragment41, 126), api_element("div", stc38, [api_static_fragment($fragment42, 129, [api_static_part(0, {
    on: _m37 || ($ctx._m37 = {
      "change": api_bind($cmp.handleFaviconUpload)
    })
  }, null)]), $cmp.siteSettings.favicon ? api_fragment(130, [api_static_fragment($fragment43, 132, [api_static_part(0, {
    attrs: {
      "src": $cmp.siteSettings.favicon
    }
  }, null)])], 0) : null]), api_static_fragment($fragment44, 134)]), api_static_fragment($fragment45, 136), api_static_fragment($fragment46, 138), api_static_fragment($fragment47, 140, [api_static_part(3, {
    on: _m38 || ($ctx._m38 = {
      "change": api_bind($cmp.handleSettingChange)
    })
  }, null)]), api_static_fragment($fragment48, 142, [api_static_part(0, {
    on: _m40 || ($ctx._m40 = {
      "click": api_bind($cmp.handleExportSite)
    })
  }, null)]), api_static_fragment($fragment49, 144), api_static_fragment($fragment50, 146), api_element("div", stc39, [api_element("label", stc40, [api_element("input", {
    attrs: stc41,
    props: {
      "checked": $cmp.siteSettings.responsiveMode
    },
    key: 149,
    on: _m41 || ($ctx._m41 = {
      "change": api_bind($cmp.handleCheckboxChange)
    })
  }), api_text("Enable Responsive Mode")])]), api_element("div", stc42, [api_element("label", stc43, [api_element("input", {
    attrs: stc44,
    props: {
      "checked": $cmp.siteSettings.autoSave
    },
    key: 152,
    on: _m42 || ($ctx._m42 = {
      "change": api_bind($cmp.handleCheckboxChange)
    })
  }), api_text("Auto-save Changes")])]), api_static_fragment($fragment51, 154, [api_static_part(3, {
    on: _m43 || ($ctx._m43 = {
      "change": api_bind($cmp.handleSettingChange)
    })
  }, null)])])], 0) : null, $cmp.isHeaderTab ? api_fragment(155, [api_static_fragment($fragment52, 157), api_element("div", stc45, api_flatten([api_static_fragment($fragment53, 160), api_static_fragment($fragment54, 162, [api_static_part(3, {
    on: _m44 || ($ctx._m44 = {
      "change": api_bind($cmp.handleHeaderChange)
    })
  }, null), api_static_part(4, {
    attrs: {
      "selected": $cmp.isLogoTextOnly ? "" : null
    }
  }, null), api_static_part(6, {
    attrs: {
      "selected": $cmp.isLogoImageOnly ? "" : null
    }
  }, null), api_static_part(8, {
    attrs: {
      "selected": $cmp.isLogoBoth ? "" : null
    }
  }, null)]), $cmp.showLogoText ? api_fragment(163, [api_element("div", stc46, [api_static_fragment($fragment55, 166), api_element("input", {
    classMap: stc20,
    attrs: stc47,
    props: {
      "value": $cmp.headerConfig.logoText
    },
    key: 167,
    on: _m45 || ($ctx._m45 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  })])], 0) : null, $cmp.showLogoImage ? api_fragment(168, [api_element("div", stc48, [api_static_fragment($fragment56, 171), api_element("input", {
    classMap: stc20,
    attrs: stc49,
    props: {
      "value": $cmp.headerConfig.logoSrc
    },
    key: 172,
    on: _m46 || ($ctx._m46 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  })]), api_element("div", stc50, [api_static_fragment($fragment57, 175), api_element("input", {
    classMap: stc20,
    attrs: stc51,
    props: {
      "value": $cmp.headerConfig.logoAlt
    },
    key: 176,
    on: _m47 || ($ctx._m47 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  })])], 0) : null, api_static_fragment($fragment58, 178), api_static_fragment($fragment59, 180), api_iterator($cmp.headerConfig.navLinks, function (link, index) {
    return api_element("div", {
      classMap: stc52,
      styleDecls: stc53,
      key: api_key(181, link.id)
    }, [api_static_fragment($fragment60, 183, [api_static_part(2, null, "Link " + api_dynamic_text(index)), api_static_part(3, {
      on: _m48 || ($ctx._m48 = {
        "click": api_bind($cmp.handleDeleteNavLink)
      }),
      attrs: {
        "data-index": index
      }
    }, null)]), api_element("input", {
      classMap: stc20,
      styleDecls: stc54,
      attrs: {
        "type": "text",
        "data-index": index,
        "data-field": "label",
        "placeholder": "Label"
      },
      props: {
        "value": link.label
      },
      key: 184,
      on: _m49 || ($ctx._m49 = {
        "input": api_bind($cmp.handleNavLinkChange)
      })
    }), api_element("input", {
      classMap: stc20,
      attrs: {
        "type": "text",
        "data-index": index,
        "data-field": "url",
        "placeholder": "URL (/home)"
      },
      props: {
        "value": link.url
      },
      key: 185,
      on: _m50 || ($ctx._m50 = {
        "input": api_bind($cmp.handleNavLinkChange)
      })
    })]);
  }), api_static_fragment($fragment61, 187, [api_static_part(0, {
    on: _m52 || ($ctx._m52 = {
      "click": api_bind($cmp.handleAddNavLink)
    })
  }, null)]), api_static_fragment($fragment62, 189), api_static_fragment($fragment63, 191), api_element("div", stc55, [api_static_fragment($fragment64, 194), api_element("div", stc56, [api_element("input", {
    classMap: stc18,
    styleDecls: stc19,
    attrs: stc57,
    props: {
      "value": $cmp.headerConfig.backgroundColor
    },
    key: 196,
    on: _m53 || ($ctx._m53 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  }), api_element("input", {
    classMap: stc20,
    styleDecls: stc21,
    attrs: stc58,
    props: {
      "value": $cmp.headerConfig.backgroundColor
    },
    key: 197,
    on: _m54 || ($ctx._m54 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  })])]), api_element("div", stc59, [api_static_fragment($fragment65, 200), api_element("div", stc60, [api_element("input", {
    classMap: stc18,
    styleDecls: stc19,
    attrs: stc61,
    props: {
      "value": $cmp.headerConfig.textColor
    },
    key: 202,
    on: _m55 || ($ctx._m55 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  }), api_element("input", {
    classMap: stc20,
    styleDecls: stc21,
    attrs: stc62,
    props: {
      "value": $cmp.headerConfig.textColor
    },
    key: 203,
    on: _m56 || ($ctx._m56 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  })])]), api_element("div", stc63, [api_static_fragment($fragment66, 206), api_element("input", {
    classMap: stc20,
    attrs: stc64,
    props: {
      "value": $cmp.headerConfig.height
    },
    key: 207,
    on: _m57 || ($ctx._m57 = {
      "input": api_bind($cmp.handleHeaderChange)
    })
  }), api_static_fragment($fragment67, 209)])]))], 0) : null])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-46b1l71n2mc";
tmpl.legacyStylesheetToken = "custom-sidePanel_sidePanel";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
