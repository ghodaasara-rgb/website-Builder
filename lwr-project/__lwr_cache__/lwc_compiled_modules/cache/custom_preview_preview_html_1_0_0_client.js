import _implicitStylesheets from "./preview.css";
import _implicitScopedStylesheets from "./preview.scoped.css?scoped=true";
import _componentsHero from "components/hero";
import _componentsFeatures from "components/features";
import _componentsFooter from "components/footer";
import _componentsTextBlock from "components/textBlock";
import _componentsImageBlock from "components/imageBlock";
import _componentsCardBlock from "components/cardBlock";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<div class="loading${0}"${2}><div class="spinner${0}"${2}></div><p${3}>Loading preview...</p></div>`;
const $fragment2 = parseFragment`<img${"a0:src"}${"a0:alt"}${3}>`;
const $fragment3 = parseFragment`<span class="logo-text${0}"${2}>${"t1"}</span>`;
const $fragment4 = parseFragment`<div style="display: flex; align-items: center; gap: 0.75rem;"${3}><img${"a1:src"}${"a1:alt"} style="max-height: 40px; width: auto;"${3}><span class="logo-text${0}"${2}>${"t3"}</span></div>`;
const $fragment5 = parseFragment`<li${3}><a${"a1:href"}${3}>${"t2"}</a></li>`;
const $fragment6 = parseFragment`<div class="empty-state${0}"${2}><h2${3}>Page Not Found</h2><p${3}>The requested page could not be found.</p><button class="btn-primary${0}"${2}>Back to Editor</button></div>`;
const stc0 = {
  "preview-container": true
};
const stc1 = {
  classMap: {
    "preview-content": true
  },
  key: 1
};
const stc2 = {
  classMap: {
    "page-preview": true
  },
  key: 4
};
const stc3 = {
  "site-header": true
};
const stc4 = {
  classMap: {
    "header-content": true
  },
  key: 6
};
const stc5 = {
  classMap: {
    "header-logo": true
  },
  key: 7
};
const stc6 = {
  classMap: {
    "header-nav": true
  },
  key: 15
};
const stc7 = {
  key: 16
};
const stc8 = {
  "preview-section": true
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, st: api_static_fragment, sp: api_static_part, fr: api_fragment, d: api_dynamic_text, h: api_element, k: api_key, i: api_iterator, c: api_custom_element, f: api_flatten} = $api;
  const {_m0, _m1, _m2} = $ctx;
  return [api_element("div", {
    classMap: stc0,
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleGlobalClick)
    })
  }, [api_element("div", stc1, [$cmp.isLoading ? api_static_fragment($fragment1, 3) : null, !$cmp.isLoading ? $cmp.hasPage ? api_element("div", stc2, api_flatten([api_element("header", {
    classMap: stc3,
    style: $cmp.headerStyle,
    key: 5
  }, [api_element("div", stc4, [api_element("div", stc5, [$cmp.isLogoImage ? api_fragment(8, [api_static_fragment($fragment2, 10, [api_static_part(0, {
    attrs: {
      "src": $cmp.headerConfig.logoSrc,
      "alt": $cmp.headerConfig.logoAlt
    }
  }, null)])], 0) : $cmp.isLogoText ? api_fragment(8, [api_static_fragment($fragment3, 12, [api_static_part(1, null, api_dynamic_text($cmp.headerConfig.logoText))])], 0) : $cmp.isLogoBoth ? api_fragment(8, [api_static_fragment($fragment4, 14, [api_static_part(1, {
    attrs: {
      "src": $cmp.headerConfig.logoSrc,
      "alt": $cmp.headerConfig.logoAlt
    }
  }, null), api_static_part(3, null, api_dynamic_text($cmp.headerConfig.logoText))])], 0) : null]), api_element("nav", stc6, [api_element("ul", stc7, api_iterator($cmp.headerConfig.navLinks, function (link) {
    return api_static_fragment($fragment5, api_key(18, link.id), [api_static_part(1, {
      on: _m1 || ($ctx._m1 = {
        "click": api_bind($cmp.handleGlobalClick)
      }),
      attrs: {
        "href": link.url
      }
    }, null), api_static_part(2, null, api_dynamic_text(link.label))]);
  }))])])]), api_iterator($cmp.processedSections, function (section) {
    return api_element("div", {
      classMap: stc8,
      style: section.wrapperStyle,
      key: api_key(19, section.id)
    }, [section.isHero ? api_custom_element("components-hero", _componentsHero, {
      props: {
        "title": section.properties.title,
        "subtitle": section.properties.subtitle,
        "ctaText": section.properties.ctaText,
        "ctaSecondaryText": section.properties.ctaSecondaryText,
        "backgroundImage": section.properties.backgroundImage,
        "textColor": section.properties.textColor
      },
      key: 20
    }) : null, section.isFeatures ? api_custom_element("components-features", _componentsFeatures, {
      props: {
        "title": section.properties.title,
        "items": section.properties.items
      },
      key: 21
    }) : null, section.isFooter ? api_custom_element("components-footer", _componentsFooter, {
      props: {
        "copyright": section.properties.copyright
      },
      key: 22
    }) : null, section.isText ? api_custom_element("components-text-block", _componentsTextBlock, {
      props: {
        "content": section.properties.content
      },
      key: 23
    }) : null, section.isImage ? api_custom_element("components-image-block", _componentsImageBlock, {
      props: {
        "src": section.properties.src,
        "alt": section.properties.alt
      },
      key: 24
    }) : null, section.isCard ? api_custom_element("components-card-block", _componentsCardBlock, {
      props: {
        "title": section.properties.title,
        "description": section.properties.description
      },
      key: 25
    }) : null]);
  })])) : null : null, !$cmp.isLoading ? !$cmp.hasPage ? api_static_fragment($fragment6, 27, [api_static_part(5, {
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleBackToEditor)
    })
  }, null)]) : null : null])])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6qjd57cigl2";
tmpl.legacyStylesheetToken = "custom-preview_preview";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
