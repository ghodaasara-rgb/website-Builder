import _implicitStylesheets from "./builder.css";
import _implicitScopedStylesheets from "./builder.scoped.css?scoped=true";
import _componentsHeader from "components/header";
import _customActivityBar from "custom/activityBar";
import _customSidePanel from "custom/sidePanel";
import _componentsHero from "components/hero";
import _componentsFeatures from "components/features";
import _componentsFooter from "components/footer";
import _componentsTextBlock from "components/textBlock";
import _componentsImageBlock from "components/imageBlock";
import _componentsCardBlock from "components/cardBlock";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<img${"a0:src"}${"a0:alt"}${3}>`;
const $fragment2 = parseFragment`<span class="logo-text${0}"${2}>${"t1"}</span>`;
const $fragment3 = parseFragment`<div style="display: flex; align-items: center; gap: 0.75rem;"${3}><img${"a1:src"}${"a1:alt"} style="max-height: 40px; width: auto;"${3}><span class="logo-text${0}"${2}>${"t3"}</span></div>`;
const $fragment4 = parseFragment`<li${3}><a href="#"${3}>${"t2"}</a></li>`;
const $fragment5 = parseFragment`<div class="empty-state${0}"${2}><h3${3}>Start Building</h3><p${3}>Drag and drop components from the left panel</p></div>`;
const $fragment6 = parseFragment`<div class="component-overlay${0}"${2}><span class="component-label${0}"${2}>${"t2"}</span><div class="component-controls${0}"${2}><button class="control-btn${0}" title="Move Up"${"a4:data-index"}${2}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M12 19V5M5 12l7-7 7 7"${3}/></svg></button><button class="control-btn${0}" title="Move Down"${"a7:data-index"}${2}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M12 5v14M5 12l7 7 7-7"${3}/></svg></button><button class="control-btn delete-btn${0}" title="Remove component"${"a10:data-index"}${2}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M18 6L6 18M6 6l12 12"${3}/></svg></button></div></div>`;
const $fragment7 = parseFragment`<div${"c0"}${2}>${"t1"}</div>`;
const stc0 = {
  classMap: {
    "builder-root": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "workspace": true
  },
  key: 2
};
const stc2 = {
  classMap: {
    "left-container": true
  },
  key: 3
};
const stc3 = {
  classMap: {
    "canvas-area": true
  },
  key: 6
};
const stc4 = {
  classMap: {
    "canvas-viewport": true
  },
  key: 7
};
const stc5 = {
  "site-header-preview": true
};
const stc6 = {
  classMap: {
    "header-content": true
  },
  key: 9
};
const stc7 = {
  classMap: {
    "header-logo": true
  },
  key: 10
};
const stc8 = {
  classMap: {
    "header-nav": true
  },
  key: 18
};
const stc9 = {
  key: 19
};
const stc10 = {
  "canvas-container": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, c: api_custom_element, h: api_element, sp: api_static_part, st: api_static_fragment, fr: api_fragment, d: api_dynamic_text, k: api_key, i: api_iterator, ncls: api_normalize_class_name, f: api_flatten} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7} = $ctx;
  return [api_element("div", stc0, [api_custom_element("components-header", _componentsHeader, {
    props: {
      "isSaving": $cmp.isSaving
    },
    key: 1,
    on: _m0 || ($ctx._m0 = {
      "save": api_bind($cmp.handleSave),
      "preview": api_bind($cmp.handlePreview),
      "dashboard": api_bind($cmp.handleDashboard)
    })
  }), api_element("div", stc1, [api_element("div", stc2, [api_custom_element("custom-activity-bar", _customActivityBar, {
    props: {
      "activeTab": $cmp.activeTab
    },
    key: 4,
    on: _m1 || ($ctx._m1 = {
      "tabselect": api_bind($cmp.handleTabSelect)
    })
  }), api_custom_element("custom-side-panel", _customSidePanel, {
    props: {
      "activeTab": $cmp.activeTab,
      "components": $cmp.componentList,
      "pages": $cmp.pagesList,
      "selectedComponent": $cmp.selectedComponent
    },
    key: 5,
    on: _m2 || ($ctx._m2 = {
      "componentdeletefromtree": api_bind($cmp.handleComponentDeleteFromTree),
      "componentselect": api_bind($cmp.handleComponentSelect),
      "componentdeselect": api_bind($cmp.handleComponentDeselect),
      "componentreorder": api_bind($cmp.handleComponentReorder),
      "propertychange": api_bind($cmp.handlePropertyChange),
      "pageadd": api_bind($cmp.handlePageAdd),
      "pageselect": api_bind($cmp.handlePageSelect),
      "pagerename": api_bind($cmp.handlePageRename),
      "pagedelete": api_bind($cmp.handlePageDelete),
      "exportsite": api_bind($cmp.handleExportSite),
      "themechange": api_bind($cmp.handleThemeChange),
      "headerchange": api_bind($cmp.handleHeaderChange),
      "componentimport": api_bind($cmp.handleComponentImport),
      "settingschange": api_bind($cmp.handleSettingsChange)
    })
  })]), api_element("div", stc3, [api_element("div", stc4, [api_element("div", {
    classMap: stc5,
    style: $cmp.headerStyle,
    key: 8
  }, [api_element("div", stc6, [api_element("div", stc7, [$cmp.isLogoImage ? api_fragment(11, [api_static_fragment($fragment1, 13, [api_static_part(0, {
    attrs: {
      "src": $cmp.headerConfig.logoSrc,
      "alt": $cmp.headerConfig.logoAlt
    }
  }, null)])], 0) : $cmp.isLogoText ? api_fragment(11, [api_static_fragment($fragment2, 15, [api_static_part(1, null, api_dynamic_text($cmp.headerConfig.logoText))])], 0) : $cmp.isLogoBoth ? api_fragment(11, [api_static_fragment($fragment3, 17, [api_static_part(1, {
    attrs: {
      "src": $cmp.headerConfig.logoSrc,
      "alt": $cmp.headerConfig.logoAlt
    }
  }, null), api_static_part(3, null, api_dynamic_text($cmp.headerConfig.logoText))])], 0) : null]), api_element("nav", stc8, [api_element("ul", stc9, api_iterator($cmp.headerConfig.navLinks, function (link) {
    return api_static_fragment($fragment4, api_key(21, link.id), [api_static_part(2, null, api_dynamic_text(link.label))]);
  }))])])]), api_element("div", {
    classMap: stc10,
    style: $cmp.canvasStyle,
    key: 22,
    on: _m3 || ($ctx._m3 = {
      "dragover": api_bind($cmp.handleDragOver),
      "drop": api_bind($cmp.handleCanvasDrop)
    })
  }, api_flatten([$cmp.isEmpty ? api_fragment(23, [api_static_fragment($fragment5, 25)], 0) : null, api_iterator($cmp.componentList, function (comp, index) {
    return api_element("div", {
      className: api_normalize_class_name(comp.containerClass),
      style: comp.wrapperStyle,
      attrs: {
        "draggable": "true",
        "data-index": index,
        "data-id": comp.id
      },
      key: api_key(26, comp.id),
      on: _m4 || ($ctx._m4 = {
        "dragstart": api_bind($cmp.handleItemDragStart),
        "dragover": api_bind($cmp.handleItemDragOver),
        "dragleave": api_bind($cmp.handleItemDragLeave),
        "drop": api_bind($cmp.handleItemDrop),
        "click": api_bind($cmp.handleComponentSelect)
      })
    }, [api_static_fragment($fragment6, 28, [api_static_part(2, null, api_dynamic_text(comp.type)), api_static_part(4, {
      on: _m5 || ($ctx._m5 = {
        "click": api_bind($cmp.handleMoveUp)
      }),
      attrs: {
        "data-index": index
      }
    }, null), api_static_part(7, {
      on: _m6 || ($ctx._m6 = {
        "click": api_bind($cmp.handleMoveDown)
      }),
      attrs: {
        "data-index": index
      }
    }, null), api_static_part(10, {
      on: _m7 || ($ctx._m7 = {
        "click": api_bind($cmp.handleComponentDeleteWrapper)
      }),
      attrs: {
        "data-index": index
      }
    }, null)]), comp.isHero ? api_fragment(29, [api_custom_element("components-hero", _componentsHero, {
      props: {
        "title": comp.props.title,
        "subtitle": comp.props.subtitle,
        "ctaText": comp.props.ctaText,
        "ctaSecondaryText": comp.props.ctaSecondaryText,
        "backgroundImage": comp.props.backgroundImage,
        "textColor": comp.props.textColor
      },
      key: 30
    })], 0) : null, comp.isFeatures ? api_fragment(31, [api_custom_element("components-features", _componentsFeatures, {
      props: {
        "title": comp.props.title
      },
      key: 32
    })], 0) : null, comp.isFooter ? api_fragment(33, [api_custom_element("components-footer", _componentsFooter, {
      props: {
        "copyright": comp.props.copyright
      },
      key: 34
    })], 0) : null, comp.isText ? api_fragment(35, [api_custom_element("components-text-block", _componentsTextBlock, {
      props: {
        "heading": comp.props.heading,
        "content": comp.props.content
      },
      key: 36
    })], 0) : null, comp.isImage ? api_fragment(37, [api_custom_element("components-image-block", _componentsImageBlock, {
      props: {
        "src": comp.props.src,
        "alt": comp.props.alt,
        "caption": comp.props.caption
      },
      key: 38
    })], 0) : null, comp.isCard ? api_fragment(39, [api_custom_element("components-card-block", _componentsCardBlock, {
      props: {
        "title": comp.props.title,
        "content": comp.props.content,
        "action": comp.props.action
      },
      key: 40
    })], 0) : null]);
  })]))])])]), $cmp.notification.show ? api_static_fragment($fragment7, 42, [api_static_part(0, {
    className: api_normalize_class_name($cmp.notificationClass)
  }, null), api_static_part(1, null, api_dynamic_text($cmp.notification.message))]) : null])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-vnpm67aa0i";
tmpl.legacyStylesheetToken = "custom-builder_builder";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
