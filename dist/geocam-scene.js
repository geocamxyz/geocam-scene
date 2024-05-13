var N = typeof window < "u";
const W = {
  Promise: N ? window.Promise : void 0
};
var T = "4.25", k = "next";
function U(e) {
  if (e.toLowerCase() === k)
    return k;
  var t = e && e.match(/^(\d)\.(\d+)/);
  return t && {
    major: parseInt(t[1], 10),
    minor: parseInt(t[2], 10)
  };
}
function M(e) {
  return e === void 0 && (e = T), "https://js.arcgis.com/".concat(e, "/");
}
function R(e) {
  e === void 0 && (e = T);
  var t = M(e), o = U(e);
  if (o !== k && o.major === 3) {
    var n = o.minor <= 10 ? "js/" : "";
    return "".concat(t).concat(n, "esri/css/esri.css");
  } else
    return "".concat(t, "esri/themes/light/main.css");
}
function j(e) {
  var t = document.createElement("link");
  return t.rel = "stylesheet", t.href = e, t;
}
function H(e, t) {
  if (t) {
    var o = document.querySelector(t);
    o.parentNode.insertBefore(e, o);
  } else
    document.head.appendChild(e);
}
function J(e) {
  return document.querySelector('link[href*="'.concat(e, '"]'));
}
function V(e) {
  return !e || U(e) ? R(e) : e;
}
function $(e, t) {
  var o = V(e), n = J(o);
  return n || (n = j(o), H(n, t)), n;
}
var X = {};
function Z(e) {
  var t = document.createElement("script");
  return t.type = "text/javascript", t.src = e, t.setAttribute("data-esri-loader", "loading"), t;
}
function I(e, t, o) {
  var n;
  o && (n = z(e, o));
  var s = function() {
    t(e), e.removeEventListener("load", s, !1), n && e.removeEventListener("error", n, !1);
  };
  e.addEventListener("load", s, !1);
}
function z(e, t) {
  var o = function(n) {
    t(n.error || new Error("There was an error attempting to load ".concat(e.src))), e.removeEventListener("error", o, !1);
  };
  return e.addEventListener("error", o, !1), o;
}
function B() {
  return document.querySelector("script[data-esri-loader]");
}
function P() {
  var e = window.require;
  return e && e.on;
}
function K(e) {
  e === void 0 && (e = {});
  var t = {};
  [X, e].forEach(function(s) {
    for (var r in s)
      Object.prototype.hasOwnProperty.call(s, r) && (t[r] = s[r]);
  });
  var o = t.version, n = t.url || M(o);
  return new W.Promise(function(s, r) {
    var c = B();
    if (c) {
      var p = c.getAttribute("src");
      p !== n ? r(new Error("The ArcGIS API for JavaScript is already loaded (".concat(p, ")."))) : P() ? s(c) : I(c, s, r);
    } else if (P())
      r(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = t.css;
      if (i) {
        var w = i === !0;
        $(w ? o : i, t.insertCssBefore);
      }
      c = Z(n), I(c, function() {
        c.setAttribute("data-esri-loader", "loaded"), s(c);
      }, r), document.body.appendChild(c);
    }
  });
}
function q(e) {
  return new W.Promise(function(t, o) {
    var n = window.require.on("error", o);
    window.require(e, function() {
      for (var s = [], r = 0; r < arguments.length; r++)
        s[r] = arguments[r];
      n.remove(), t(s);
    });
  });
}
function Q(e, t) {
  if (t === void 0 && (t = {}), P())
    return q(e);
  var o = B(), n = o && o.getAttribute("src");
  return !t.url && n && (t.url = n), K(t).then(function() {
    return q(e);
  });
}
async function Y(e, t) {
  const o = {
    version: "4.27",
    css: !0
  };
  let n;
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
        expanded: (i, w, L, u) => {
          u.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, w, L, u) => {
          i === "measuring" ? u.view.emit("clickable", !1) : i !== "measuring" && w === "measuring" && u.view.emit("clickable", !0), console.log("viewmodel state change", i, u);
        }
      }
    }
  ], c = s ? s.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], p = r ? r.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await Q(
    [
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Expand",
      "esri/portal/Portal"
    ].concat(c).concat(p),
    o
  ).then(([i, w, L, u, ...A]) => {
    const D = new URLSearchParams(window.location.search.toLowerCase());
    let S;
    const E = t || D.get("websceneid");
    if (E) {
      const l = {
        id: E
      };
      if (E.startsWith("http")) {
        const d = E.split("/");
        l.id = d.pop();
        const y = d.join("/"), g = new u({
          url: y
        });
        l.portal = g;
      }
      S = new i({
        portalItem: l
      });
    } else
      S = new i({
        basemap: "satellite",
        ground: "world-elevation"
      });
    n = new w({
      container: e,
      map: S,
      ui: {
        components: ["attribution"]
      }
    });
    const b = document.getElementsByTagName(
      "geocam-viewer-arcgis-scene"
    )[0];
    b && b.link && (console.log("map linking to connector", n), b.link(n));
    const F = function(l) {
      return l.layers.items.map((d) => d.layers ? F(d) : d);
    }, G = function(l) {
      return F(l).flat();
    };
    n.when(async () => {
      let l = [], d = !1;
      const y = G(n.map);
      for (let f = 0; f < y.length; f++) {
        const a = y[f];
        if (await n.whenLayerView(a), a.editingEnabled && (d = !0), a.fields) {
          const v = a.fields.map((m) => m.name);
          l.push({ layer: a, searchFields: v });
        }
      }
      const g = [];
      c.forEach((f, a) => {
        const v = A[a], m = new v({
          view: n,
          container: document.createElement("div"),
          ...s[a].options
        });
        g.push(m);
      }), p.forEach((f, a) => {
        if (f === "esri/widgets/Editor" && !d)
          return;
        f === "esri/widgets/Search" && (r[a].options = r[a].options || {}, r[a].options.sources = r[a].options.sources || l);
        const v = A[a + c.length], m = new v({
          view: n,
          container: document.createElement("div"),
          ...r[a].options
        });
        console.log("loaded widget", {
          view: n,
          container: document.createElement("div"),
          ...r[a].options
        });
        const x = new L({
          view: n,
          group: "expands",
          autoCollapse: !0,
          content: m,
          expandIconClass: r[a].icon
        });
        r[a].watchWidgetFor && Object.keys(r[a].watchWidgetFor).forEach((h) => {
          m.watch(
            h,
            (...C) => r[a].watchWidgetFor[h].apply(m, C)
          );
        }), r[a].watchExpandFor && Object.keys(r[a].watchExpandFor).forEach((h) => {
          x.watch(
            h,
            (...C) => r[a].watchExpandFor[h].apply(x, C)
          );
        }), g.push(x);
      }), n.ui.add(g, "top-right"), console.log("All widgets added");
    });
  }), n;
}
class O extends HTMLElement {
  constructor() {
    super(), console.log("Scene init");
  }
  connectedCallback() {
    console.log("Scene connected");
    const t = this, o = t.getAttribute("data-websceneid");
    Y(t, o);
  }
  disconnectedCallback() {
    console.log("Scene disconnected");
  }
}
window.customElements.define("geocam-scene", O);
export {
  O as GeocamScene
};
