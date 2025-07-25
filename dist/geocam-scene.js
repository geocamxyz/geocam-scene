var D = typeof window < "u";
const R = {
  Promise: D ? window.Promise : void 0
};
var W = "4.25", A = "next";
function G(e) {
  if (e.toLowerCase() === A)
    return A;
  var n = e && e.match(/^(\d)\.(\d+)/);
  return n && {
    major: parseInt(n[1], 10),
    minor: parseInt(n[2], 10)
  };
}
function M(e) {
  return e === void 0 && (e = W), "https://js.arcgis.com/".concat(e, "/");
}
function V(e) {
  e === void 0 && (e = W);
  var n = M(e), a = G(e);
  if (a !== A && a.major === 3) {
    var t = a.minor <= 10 ? "js/" : "";
    return "".concat(n).concat(t, "esri/css/esri.css");
  } else
    return "".concat(n, "esri/themes/light/main.css");
}
function j(e) {
  var n = document.createElement("link");
  return n.rel = "stylesheet", n.href = e, n;
}
function H(e, n) {
  if (n) {
    var a = document.querySelector(n);
    a.parentNode.insertBefore(e, a);
  } else
    document.head.appendChild(e);
}
function J(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function K(e) {
  return !e || G(e) ? V(e) : e;
}
function $(e, n) {
  var a = K(e), t = J(a);
  return t || (t = j(a), H(t, n)), t;
}
var X = {};
function Z(e) {
  var n = document.createElement("script");
  return n.type = "text/javascript", n.src = e, n.setAttribute("data-esri-loader", "loading"), n;
}
function T(e, n, a) {
  var t;
  a && (t = _(e, a));
  var s = function() {
    n(e), e.removeEventListener("load", s, !1), t && e.removeEventListener("error", t, !1);
  };
  e.addEventListener("load", s, !1);
}
function _(e, n) {
  var a = function(t) {
    n(t.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", a, !1);
  };
  return e.addEventListener("error", a, !1), a;
}
function U() {
  return document.querySelector("script[data-esri-loader]");
}
function I() {
  var e = window.require;
  return e && e.on;
}
function z(e) {
  e === void 0 && (e = {});
  var n = {};
  [X, e].forEach(function(s) {
    for (var r in s)
      Object.prototype.hasOwnProperty.call(s, r) && (n[r] = s[r]);
  });
  var a = n.version, t = n.url || M(a);
  return new R.Promise(function(s, r) {
    var d = U();
    if (d) {
      var v = d.getAttribute("src");
      v !== t ? r(new Error("The ArcGIS API for JavaScript is already loaded (".concat(v, ")."))) : I() ? s(d) : T(d, s, r);
    } else if (I())
      r(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = n.css;
      if (i) {
        var f = i === !0;
        $(f ? a : i, n.insertCssBefore);
      }
      d = Z(t), T(d, function() {
        d.setAttribute("data-esri-loader", "loaded"), s(d);
      }, r), document.body.appendChild(d);
    }
  });
}
function q(e) {
  return new R.Promise(function(n, a) {
    var t = window.require.on("error", a);
    window.require(e, function() {
      for (var s = [], r = 0; r < arguments.length; r++)
        s[r] = arguments[r];
      t.remove(), n(s);
    });
  });
}
function O(e, n) {
  if (n === void 0 && (n = {}), I())
    return q(e);
  var a = U(), t = a && a.getAttribute("src");
  return !n.url && t && (n.url = t), z(n).then(function() {
    return q(e);
  });
}
async function Q(e, n) {
  const a = {
    version: "4.27",
    css: !0
  };
  let t;
  const s = [{ name: "Zoom" }], r = [
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
        expanded: (i, f, C, m) => {
          m.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, f, C, m) => {
          i === "measuring" ? m.view.emit("clickable", !1) : i !== "measuring" && f === "measuring" && m.view.emit("clickable", !0), console.log("viewmodel state change", i, m);
        }
      }
    }
  ], d = s ? s.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], v = r ? r.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await O(
    [
      "esri/identity/IdentityManager",
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Expand",
      "esri/portal/Portal"
    ].concat(d).concat(v),
    a
  ).then(
    ([
      i,
      f,
      C,
      m,
      N,
      ...P
    ]) => {
      window.ARCGIS_TOKEN && i.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const B = new URLSearchParams(window.location.search.toLowerCase());
      let L;
      const S = n || B.get("websceneid");
      if (S) {
        const c = {
          id: S
        };
        if (S.startsWith("http")) {
          const u = S.split("/");
          c.id = u.pop();
          const p = u.join("/"), l = new N({
            url: p
          });
          c.portal = l;
        }
        L = new f({
          portalItem: c
        });
      } else
        L = new f({
          basemap: "satellite",
          ground: "world-elevation"
        });
      L.load().then(() => {
        t = new C({
          container: e,
          map: L,
          ui: {
            components: ["attribution"]
          }
        });
        const c = document.getElementsByTagName(
          "geocam-viewer-arcgis-scene"
        )[0];
        c && c.link && (console.log("map linking to connector", t), c.link(t));
        const u = function(l) {
          return l.layers.items.map((h) => h.layers ? u(h) : h);
        }, p = function(l) {
          return u(l).flat();
        };
        t.when(async () => {
          let l = [], h = !1;
          const F = p(t.map);
          for (let w = 0; w < F.length; w++) {
            const o = F[w];
            if (await t.whenLayerView(o), o.editingEnabled && (h = !0), o.fields) {
              const E = o.fields.map((g) => g.name);
              l.push({ layer: o, searchFields: E });
            }
          }
          const b = [];
          d.forEach((w, o) => {
            const E = P[o], g = new E({
              view: t,
              container: document.createElement("div"),
              ...s[o].options
            });
            b.push(g);
          }), v.forEach((w, o) => {
            if (w === "esri/widgets/Editor" && !h)
              return;
            w === "esri/widgets/Search" && (r[o].options = r[o].options || {}, r[o].options.sources = r[o].options.sources || l);
            const E = P[o + d.length], g = new E({
              view: t,
              container: document.createElement("div"),
              ...r[o].options
            });
            console.log("loaded widget", {
              view: t,
              container: document.createElement("div"),
              ...r[o].options
            });
            const k = new m({
              view: t,
              group: "expands",
              autoCollapse: !0,
              content: g,
              expandIconClass: r[o].icon
            });
            r[o].watchWidgetFor && Object.keys(r[o].watchWidgetFor).forEach((y) => {
              g.watch(
                y,
                (...x) => r[o].watchWidgetFor[y].apply(g, x)
              );
            }), r[o].watchExpandFor && Object.keys(r[o].watchExpandFor).forEach((y) => {
              k.watch(
                y,
                (...x) => r[o].watchExpandFor[y].apply(k, x)
              );
            }), b.push(k);
          }), t.ui.add(b, "top-right"), console.log("All widgets added");
        });
      }).catch((c) => {
        var p, l;
        const u = c && c.message ? (c == null ? void 0 : c.message) + `
` + ((l = (p = c == null ? void 0 : c.details) == null ? void 0 : p.error) == null ? void 0 : l.message) : "An unknown erro occurred trying to load the map.";
        alert(u), console.error("Error loading scene:", u);
      });
    }
  ), t;
}
class Y extends HTMLElement {
  constructor() {
    super(), console.log("Scene init");
  }
  connectedCallback() {
    console.log("Scene connected");
    const n = this, a = n.getAttribute("data-websceneid");
    Q(n, a);
  }
  disconnectedCallback() {
    console.log("Scene disconnected");
  }
}
window.customElements.define("geocam-scene", Y);
export {
  Y as GeocamScene
};
