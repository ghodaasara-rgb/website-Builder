import _implicitStylesheets from "./dashboard.css";
import _implicitScopedStylesheets from "./dashboard.scoped.css?scoped=true";
import _customSearchbar from "custom/searchbar";
import _customFilterButtons from "custom/filterButtons";
import _customEmptystate from "custom/emptystate";
import _customSitecard from "custom/sitecard";
import {freezeTemplate, parseFragment, registerTemplate} from "lwc";
const $fragment1 = parseFragment`<header class="dashboard-header${0}"${2}><div class="header-content${0}"${2}><h1 class="dashboard-title${0}"${2}>SiteCentral</h1><p class="dashboard-subtitle${0}"${2}>Manage all your websites in one place</p></div><button class="btn btn-primary${0}"${2}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"${3}><path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"${3}/></svg>Create New Site</button></header>`;
const $fragment2 = parseFragment`<div class="view-toggle${0}"${2}><button${"c1"} data-mode="grid" title="Grid View"${2}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"${3}/></svg></button><button${"c4"} data-mode="table" title="Table View"${2}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M3 6h18M3 12h18M3 18h18"${3}/></svg></button></div>`;
const $fragment3 = parseFragment`<div class="loading-container${0}"${2}><div class="spinner${0}"${2}></div><p${3}>Loading your sites...</p></div>`;
const $fragment4 = parseFragment`<thead${3}><tr${3}><th${3}>Name</th><th${3}>Info</th><th${3}>Status</th><th${3}>Last Modified</th><th${3}>Actions</th></tr></thead>`;
const $fragment5 = parseFragment`<tr${3}><td${3}><div class="site-name-cell${0}"${"a2:data-id"}${2}><div class="site-icon${0}"${2}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M12 2L2 19h20L12 2z"${3}/></svg></div><span class="site-name${0}"${2}>${"t7"}</span></div></td><td${3}><div class="site-info${0}"${2}><span class="info-label${0}"${2}>Pages:</span>${"t12"}</div></td><td${3}><span class="status-badge status-draft${0}"${2}>${"t15"}</span></td><td${3}><span class="date-text${0}"${2}>${"t18"}</span></td><td${3}><div class="isActions${0}"${2}><button class="btn-icon${0}"${"a21:data-id"} title="Edit"${2}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"${3}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"${3}/></svg></button><button class="btn-icon${0}"${"a25:data-id"} title="Preview"${2}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"${3}/><circle cx="12" cy="12" r="3"${3}/></svg></button><button class="btn-icon btn-icon-delete${0}"${"a29:data-id"} title="Delete"${2}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${3}><polyline points="3 6 5 6 21 6"${3}/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"${3}/></svg></button></div></td></tr>`;
const $fragment6 = parseFragment`<div class="modal-overlay${0}"${2}><div class="modal-content${0}"${2}><div class="modal-header${0}"${2}><h2${3}>Delete Site</h2><button class="modal-close${0}"${2}>×</button></div><div class="modal-body${0}"${2}><p${3}>Are you sure you want to delete &quot;<strong${3}>${"t11"}</strong>&quot;?</p><p class="warning-text${0}"${2}>This action cannot be undone. All pages and components will be permanently deleted.</p></div><div class="modal-footer${0}"${2}><button class="btn btn-secondary${0}"${2}>Cancel</button><button class="btn btn-danger${0}"${2}>Delete Site</button></div></div></div>`;
const stc0 = {
  classMap: {
    "dashboard-container": true
  },
  key: 0
};
const stc1 = {
  classMap: {
    "toolbar": true
  },
  key: 3
};
const stc2 = {
  classMap: {
    "sites-table-container": true
  },
  key: 11
};
const stc3 = {
  classMap: {
    "sites-table": true
  },
  key: 12
};
const stc4 = {
  key: 15
};
const stc5 = {
  classMap: {
    "sites-grid": true
  },
  key: 18
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, sp: api_static_part, st: api_static_fragment, c: api_custom_element, ncls: api_normalize_class_name, h: api_element, k: api_key, d: api_dynamic_text, i: api_iterator} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9, _m10, _m11, _m12, _m13, _m14, _m15, _m16} = $ctx;
  return [api_element("div", stc0, [api_static_fragment($fragment1, 2, [api_static_part(6, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleCreateSite)
    })
  }, null)]), api_element("div", stc1, [api_custom_element("custom-searchbar", _customSearchbar, {
    key: 4,
    on: _m1 || ($ctx._m1 = {
      "search": api_bind($cmp.handleSearch)
    })
  }), api_custom_element("custom-filter-buttons", _customFilterButtons, {
    props: {
      "activeFilter": $cmp.filterStatus
    },
    key: 5,
    on: _m2 || ($ctx._m2 = {
      "filter": api_bind($cmp.handleFilter)
    })
  }), api_static_fragment($fragment2, 7, [api_static_part(1, {
    on: _m3 || ($ctx._m3 = {
      "click": api_bind($cmp.handleViewChange)
    }),
    className: api_normalize_class_name($cmp.isGridView)
  }, null), api_static_part(4, {
    on: _m4 || ($ctx._m4 = {
      "click": api_bind($cmp.handleViewChange)
    }),
    className: api_normalize_class_name($cmp.isTableView)
  }, null)])]), $cmp.isLoading ? api_static_fragment($fragment3, 9) : null, $cmp.showEmptyState ? api_custom_element("custom-emptystate", _customEmptystate, {
    key: 10,
    on: _m5 || ($ctx._m5 = {
      "create": api_bind($cmp.handleCreateSite)
    })
  }) : null, $cmp.shouldRenderTable ? api_element("div", stc2, [api_element("table", stc3, [api_static_fragment($fragment4, 14), api_element("tbody", stc4, api_iterator($cmp.filteredSites, function (site) {
    return api_static_fragment($fragment5, api_key(17, site.id), [api_static_part(2, {
      on: _m6 || ($ctx._m6 = {
        "click": api_bind($cmp.handleOpenBuilder)
      }),
      attrs: {
        "data-id": site.id
      }
    }, null), api_static_part(7, null, api_dynamic_text(site.name)), api_static_part(12, null, " " + api_dynamic_text(site.pageCount)), api_static_part(15, null, api_dynamic_text(site.status)), api_static_part(18, null, api_dynamic_text(site.updated_at)), api_static_part(21, {
      on: _m7 || ($ctx._m7 = {
        "click": api_bind($cmp.handleOpenBuilder)
      }),
      attrs: {
        "data-id": site.id
      }
    }, null), api_static_part(25, {
      on: _m8 || ($ctx._m8 = {
        "click": api_bind($cmp.handlePreview)
      }),
      attrs: {
        "data-id": site.id
      }
    }, null), api_static_part(29, {
      on: _m9 || ($ctx._m9 = {
        "click": api_bind($cmp.handleDelete)
      }),
      attrs: {
        "data-id": site.id
      }
    }, null)]);
  }))])]) : null, $cmp.isGridView ? api_element("div", stc5, api_iterator($cmp.filteredSites, function (site) {
    return api_custom_element("custom-sitecard", _customSitecard, {
      props: {
        "site": site
      },
      key: api_key(19, site.id),
      on: _m10 || ($ctx._m10 = {
        "open": api_bind($cmp.handleOpenBuilder),
        "preview": api_bind($cmp.handlePreview),
        "delete": api_bind($cmp.handleDelete)
      })
    });
  })) : null, $cmp.showDeleteModal ? api_static_fragment($fragment6, 21, [api_static_part(0, {
    on: _m12 || ($ctx._m12 = {
      "click": api_bind($cmp.handleCancelDelete)
    })
  }, null), api_static_part(1, {
    on: _m13 || ($ctx._m13 = {
      "click": api_bind($cmp.stopPropagation)
    })
  }, null), api_static_part(5, {
    on: _m14 || ($ctx._m14 = {
      "click": api_bind($cmp.handleCancelDelete)
    })
  }, null), api_static_part(11, null, api_dynamic_text($cmp.siteToDelete.name)), api_static_part(16, {
    on: _m15 || ($ctx._m15 = {
      "click": api_bind($cmp.handleCancelDelete)
    })
  }, null), api_static_part(18, {
    on: _m16 || ($ctx._m16 = {
      "click": api_bind($cmp.handleConfirmDelete)
    })
  }, null)]) : null])];
  /*LWC compiler v8.28.0*/
}
export default registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-5ailimivs0f";
tmpl.legacyStylesheetToken = "custom-dashboard_dashboard";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
if (_implicitScopedStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitScopedStylesheets);
}
freezeTemplate(tmpl);
