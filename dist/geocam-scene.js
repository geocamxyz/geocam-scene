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
  var n = M(e), o = G(e);
  if (o !== A && o.major === 3) {
    var t = o.minor <= 10 ? "js/" : "";
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
    var o = document.querySelector(n);
    o.parentNode.insertBefore(e, o);
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
  var o = K(e), t = J(o);
  return t || (t = j(o), H(t, n)), t;
}
var X = {};
function Z(e) {
  var n = document.createElement("script");
  return n.type = "text/javascript", n.src = e, n.setAttribute("data-esri-loader", "loading"), n;
}
function T(e, n, o) {
  var t;
  o && (t = _(e, o));
  var s = function() {
    n(e), e.removeEventListener("load", s, !1), t && e.removeEventListener("error", t, !1);
  };
  e.addEventListener("load", s, !1);
}
function _(e, n) {
  var o = function(t) {
    n(t.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", o, !1);
  };
  return e.addEventListener("error", o, !1), o;
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
  var o = n.version, t = n.url || M(o);
  return new R.Promise(function(s, r) {
    var c = U();
    if (c) {
      var h = c.getAttribute("src");
      h !== t ? r(new Error("The ArcGIS API for JavaScript is already loaded (".concat(h, ")."))) : I() ? s(c) : T(c, s, r);
    } else if (I())
      r(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = n.css;
      if (i) {
        var f = i === !0;
        $(f ? o : i, n.insertCssBefore);
      }
      c = Z(t), T(c, function() {
        c.setAttribute("data-esri-loader", "loaded"), s(c);
      }, r), document.body.appendChild(c);
    }
  });
}
function q(e) {
  return new R.Promise(function(n, o) {
    var t = window.require.on("error", o);
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
  var o = U(), t = o && o.getAttribute("src");
  return !n.url && t && (n.url = t), z(n).then(function() {
    return q(e);
  });
}
async function Q(e, n) {
  const o = {
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
        expanded: (i, f, S, m) => {
          m.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, f, S, m) => {
          i === "measuring" ? m.view.emit("clickable", !1) : i !== "measuring" && f === "measuring" && m.view.emit("clickable", !0), console.log("viewmodel state change", i, m);
        }
      }
    }
  ], c = s ? s.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], h = r ? r.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await O(
    [
      "esri/identity/IdentityManager",
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Expand",
      "esri/portal/Portal"
    ].concat(c).concat(h),
    o
  ).then(
    ([
      i,
      f,
      S,
      m,
      N,
      ...P
    ]) => {
      window.ARCGIS_TOKEN && i.registerToken({
        server: window.ARCGIS_SERVER,
        token: window.ARCGIS_TOKEN
      });
      const B = new URLSearchParams(window.location.search.toLowerCase());
      let y;
      const L = n || B.get("websceneid");
      if (L) {
        const d = {
          id: L
        };
        if (L.startsWith("http")) {
          const l = L.split("/");
          d.id = l.pop();
          const C = l.join("/"), u = new N({
            url: C
          });
          d.portal = u;
        }
        y = new f({
          portalItem: d
        });
      } else
        y = new f({
          basemap: "satellite",
          ground: "world-elevation"
        });
      y.load().then(() => {
        t = new S({
          container: e,
          map: y,
          ui: {
            components: ["attribution"]
          }
        });
        const d = document.getElementsByTagName(
          "geocam-viewer-arcgis-scene"
        )[0];
        d && d.link && (console.log("map linking to connector", t), d.link(t));
        const l = function(u) {
          return u.layers.items.map((p) => p.layers ? l(p) : p);
        }, C = function(u) {
          return l(u).flat();
        };
        t.when(async () => {
          let u = [], p = !1;
          const F = C(t.map);
          for (let w = 0; w < F.length; w++) {
            const a = F[w];
            if (await t.whenLayerView(a), a.editingEnabled && (p = !0), a.fields) {
              const v = a.fields.map((g) => g.name);
              u.push({ layer: a, searchFields: v });
            }
          }
          const b = [];
          c.forEach((w, a) => {
            const v = P[a], g = new v({
              view: t,
              container: document.createElement("div"),
              ...s[a].options
            });
            b.push(g);
          }), h.forEach((w, a) => {
            if (w === "esri/widgets/Editor" && !p) return;
            w === "esri/widgets/Search" && (r[a].options = r[a].options || {}, r[a].options.sources = r[a].options.sources || u);
            const v = P[a + c.length], g = new v({
              view: t,
              container: document.createElement("div"),
              ...r[a].options
            });
            console.log("loaded widget", {
              view: t,
              container: document.createElement("div"),
              ...r[a].options
            });
            const k = new m({
              view: t,
              group: "expands",
              autoCollapse: !0,
              content: g,
              expandIconClass: r[a].icon
            });
            r[a].watchWidgetFor && Object.keys(r[a].watchWidgetFor).forEach((E) => {
              g.watch(
                E,
                (...x) => r[a].watchWidgetFor[E].apply(g, x)
              );
            }), r[a].watchExpandFor && Object.keys(r[a].watchExpandFor).forEach((E) => {
              k.watch(
                E,
                (...x) => r[a].watchExpandFor[E].apply(k, x)
              );
            }), b.push(k);
          }), t.ui.add(b, "top-right"), console.log("All widgets added");
        });
      }).catch((d) => {
        const l = d && d.message ? d?.message + `
` + d?.details?.error?.message : "An unknown erro occurred trying to load the map.";
        alert(l), console.error("Error loading scene:", l);
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
    const n = this, o = n.getAttribute("data-websceneid");
    Q(n, o);
  }
  disconnectedCallback() {
    console.log("Scene disconnected");
  }
}
window.customElements.define("geocam-scene", Y);
export {
  Y as GeocamScene
};
