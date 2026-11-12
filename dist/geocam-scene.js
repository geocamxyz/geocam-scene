var N = typeof window < "u";
const T = {
  Promise: N ? window.Promise : void 0
};
var U = "4.25", b = "next";
function F(e) {
  if (e.toLowerCase() === b)
    return b;
  var n = e && e.match(/^(\d)\.(\d+)/);
  return n && {
    major: parseInt(n[1], 10),
    minor: parseInt(n[2], 10)
  };
}
function q(e) {
  return e === void 0 && (e = U), "https://js.arcgis.com/".concat(e, "/");
}
function H(e) {
  e === void 0 && (e = U);
  var n = q(e), r = F(e);
  if (r !== b && r.major === 3) {
    var t = r.minor <= 10 ? "js/" : "";
    return "".concat(n).concat(t, "esri/css/esri.css");
  } else
    return "".concat(n, "esri/themes/light/main.css");
}
function K(e) {
  var n = document.createElement("link");
  return n.rel = "stylesheet", n.href = e, n;
}
function M(e, n) {
  if (n) {
    var r = document.querySelector(n);
    r.parentNode.insertBefore(e, r);
  } else
    document.head.appendChild(e);
}
function V(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function $(e) {
  return !e || F(e) ? H(e) : e;
}
function j(e, n) {
  var r = $(e), t = V(r);
  return t || (t = K(r), M(t, n)), t;
}
var J = {};
function X(e) {
  var n = document.createElement("script");
  return n.type = "text/javascript", n.src = e, n.setAttribute("data-esri-loader", "loading"), n;
}
function _(e, n, r) {
  var t;
  r && (t = Z(e, r));
  var s = function() {
    n(e), e.removeEventListener("load", s, !1), t && e.removeEventListener("error", t, !1);
  };
  e.addEventListener("load", s, !1);
}
function Z(e, n) {
  var r = function(t) {
    n(t.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", r, !1);
  };
  return e.addEventListener("error", r, !1), r;
}
function B() {
  return document.querySelector("script[data-esri-loader]");
}
function k() {
  var e = window.require;
  return e && e.on;
}
function z(e) {
  e === void 0 && (e = {});
  var n = {};
  [J, e].forEach(function(s) {
    for (var o in s)
      Object.prototype.hasOwnProperty.call(s, o) && (n[o] = s[o]);
  });
  var r = n.version, t = n.url || q(r);
  return new T.Promise(function(s, o) {
    var c = B();
    if (c) {
      var h = c.getAttribute("src");
      h !== t ? o(new Error("The ArcGIS API for JavaScript is already loaded (".concat(h, ")."))) : k() ? s(c) : _(c, s, o);
    } else if (k())
      o(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = n.css;
      if (i) {
        var p = i === !0;
        j(p ? r : i, n.insertCssBefore);
      }
      c = X(t), _(c, function() {
        c.setAttribute("data-esri-loader", "loaded"), s(c);
      }, o), document.body.appendChild(c);
    }
  });
}
function x(e) {
  return new T.Promise(function(n, r) {
    var t = window.require.on("error", r);
    window.require(e, function() {
      for (var s = [], o = 0; o < arguments.length; o++)
        s[o] = arguments[o];
      t.remove(), n(s);
    });
  });
}
function Q(e, n) {
  if (n === void 0 && (n = {}), k())
    return x(e);
  var r = B(), t = r && r.getAttribute("src");
  return !n.url && t && (n.url = t), z(n).then(function() {
    return x(e);
  });
}
const Y = async function(e, n) {
  if (window.ARCGIS_TOKEN) {
    e.registerToken({
      server: window.ARCGIS_SERVER,
      token: window.ARCGIS_TOKEN
    });
    return;
  }
  if (!window.ARCGIS_APP_ID) return;
  if (!window.ARCGIS_OAUTH_CALLBACK) {
    console.warn(
      "ARCGIS_APP_ID is set but ARCGIS_OAUTH_CALLBACK is not — skipping ArcGIS OAuth setup"
    );
    return;
  }
  const r = window.ARCGIS_PORTAL_URL || window.ARCGIS_SERVER || "https://www.arcgis.com";
  try {
    e.registerOAuthInfos([
      new n({
        appId: window.ARCGIS_APP_ID,
        portalUrl: r,
        popup: !0,
        popupCallbackUrl: window.ARCGIS_OAUTH_CALLBACK
      })
    ]), await e.checkSignInStatus(`${r}/sharing`);
  } catch {
  }
};
async function ee(e, n) {
  const r = {
    version: "4.27",
    css: !0
  };
  let t;
  const s = [{ name: "Zoom" }], o = [
    {
      name: "Search",
      icon: "esri-icon-search",
      options: { includeDefaultSources: !0 }
    },
    { name: "BasemapGallery", icon: "esri-icon-basemap" },
    { name: "LayerList", icon: "esri-icon-layer-list" },
    { name: "Legend", icon: "esri-icon-feature-layer" },
    { name: "Editor", icon: "esri-icon-edit" },
    {
      name: "DirectLineMeasurement3D",
      icon: "esri-icon-measure",
      watchExpandFor: {
        expanded: (i, p, A, w) => {
          w.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, p, A, w) => {
          i === "measuring" ? w.view.emit("clickable", !1) : i !== "measuring" && p === "measuring" && w.view.emit("clickable", !0), console.log("viewmodel state change", i, w);
        }
      }
    }
  ], c = s ? s.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], h = o ? o.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await Q(
    [
      "esri/identity/IdentityManager",
      "esri/identity/OAuthInfo",
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Expand",
      "esri/portal/Portal"
    ].concat(c).concat(h),
    r
  ).then(
    async ([
      i,
      p,
      A,
      w,
      W,
      D,
      ...P
    ]) => {
      await Y(i, p);
      const O = new URLSearchParams(window.location.search.toLowerCase());
      let S;
      const y = n || O.get("websceneid");
      if (y) {
        const d = {
          id: y
        };
        if (y.startsWith("http")) {
          const l = y.split("/");
          d.id = l.pop();
          const L = l.join("/"), u = new D({
            url: L
          });
          d.portal = u;
        }
        S = new A({
          portalItem: d
        });
      } else
        S = new A({
          basemap: "satellite",
          ground: "world-elevation"
        });
      S.load().then(() => {
        t = new w({
          container: e,
          map: S,
          ui: {
            components: ["attribution"]
          }
        });
        const d = document.getElementsByTagName(
          "geocam-viewer-arcgis-scene"
        )[0];
        d && d.link && (console.log("map linking to connector", t), d.link(t));
        const l = function(u) {
          return u.layers.items.map((g) => g.layers ? l(g) : g);
        }, L = function(u) {
          return l(u).flat();
        };
        t.when(async () => {
          let u = [], g = !1;
          const G = L(t.map);
          for (let f = 0; f < G.length; f++) {
            const a = G[f];
            if (await t.whenLayerView(a), a.editingEnabled && (g = !0), a.fields) {
              const v = a.fields.map((m) => m.name);
              u.push({ layer: a, searchFields: v });
            }
          }
          const C = [];
          c.forEach((f, a) => {
            const v = P[a], m = new v({
              view: t,
              container: document.createElement("div"),
              ...s[a].options
            });
            C.push(m);
          }), h.forEach((f, a) => {
            if (f === "esri/widgets/Editor" && !g) return;
            f === "esri/widgets/Search" && (o[a].options = o[a].options || {}, o[a].options.sources = o[a].options.sources || u);
            const v = P[a + c.length], m = new v({
              view: t,
              container: document.createElement("div"),
              ...o[a].options
            });
            console.log("loaded widget", {
              view: t,
              container: document.createElement("div"),
              ...o[a].options
            });
            const I = new W({
              view: t,
              group: "expands",
              autoCollapse: !0,
              content: m,
              expandIconClass: o[a].icon
            });
            o[a].watchWidgetFor && Object.keys(o[a].watchWidgetFor).forEach((E) => {
              m.watch(
                E,
                (...R) => o[a].watchWidgetFor[E].apply(m, R)
              );
            }), o[a].watchExpandFor && Object.keys(o[a].watchExpandFor).forEach((E) => {
              I.watch(
                E,
                (...R) => o[a].watchExpandFor[E].apply(I, R)
              );
            }), C.push(I);
          }), t.ui.add(C, "top-right"), console.log("All widgets added");
        });
      }).catch((d) => {
        const l = d && d.message ? d?.message + `
` + d?.details?.error?.message : "An unknown erro occurred trying to load the map.";
        alert(l), console.error("Error loading scene:", l);
      });
    }
  ), t;
}
class ne extends HTMLElement {
  constructor() {
    super(), console.log("Scene init");
  }
  connectedCallback() {
    console.log("Scene connected");
    const n = this, r = n.getAttribute("data-websceneid");
    ee(n, r);
  }
  disconnectedCallback() {
    console.log("Scene disconnected");
  }
}
window.customElements.define("geocam-scene", ne);
export {
  ne as GeocamScene
};
