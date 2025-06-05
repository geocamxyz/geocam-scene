var D = typeof window < "u";
const q = {
  Promise: D ? window.Promise : void 0
};
var R = "4.25", x = "next";
function W(e) {
  if (e.toLowerCase() === x)
    return x;
  var n = e && e.match(/^(\d)\.(\d+)/);
  return n && {
    major: parseInt(n[1], 10),
    minor: parseInt(n[2], 10)
  };
}
function G(e) {
  return e === void 0 && (e = R), "https://js.arcgis.com/".concat(e, "/");
}
function V(e) {
  e === void 0 && (e = R);
  var n = G(e), o = W(e);
  if (o !== x && o.major === 3) {
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
  return !e || W(e) ? V(e) : e;
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
function F(e, n, o) {
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
function M() {
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
  var o = n.version, t = n.url || G(o);
  return new q.Promise(function(s, r) {
    var c = M();
    if (c) {
      var p = c.getAttribute("src");
      p !== t ? r(new Error("The ArcGIS API for JavaScript is already loaded (".concat(p, ")."))) : I() ? s(c) : F(c, s, r);
    } else if (I())
      r(new Error("The ArcGIS API for JavaScript is already loaded."));
    else {
      var i = n.css;
      if (i) {
        var u = i === !0;
        $(u ? o : i, n.insertCssBefore);
      }
      c = Z(t), F(c, function() {
        c.setAttribute("data-esri-loader", "loaded"), s(c);
      }, r), document.body.appendChild(c);
    }
  });
}
function T(e) {
  return new q.Promise(function(n, o) {
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
    return T(e);
  var o = M(), t = o && o.getAttribute("src");
  return !n.url && t && (n.url = t), z(n).then(function() {
    return T(e);
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
        expanded: (i, u, L, f) => {
          f.content.viewModel.clear();
        }
      },
      watchWidgetFor: {
        "viewModel.state": (i, u, L, f) => {
          i === "measuring" ? f.view.emit("clickable", !1) : i !== "measuring" && u === "measuring" && f.view.emit("clickable", !0), console.log("viewmodel state change", i, f);
        }
      }
    }
  ], c = s ? s.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [], p = r ? r.map((i) => i.class ? i.class : `esri/widgets/${i.name}`) : [];
  return await O(
    [
      "esri/identity/IdentityManager",
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Expand",
      "esri/portal/Portal"
    ].concat(c).concat(p),
    o
  ).then(([i, u, L, f, U, ...A]) => {
    window.ARCGIS_TOKEN && i.registerToken({
      server: window.ARCGIS_SERVER,
      token: window.ARCGIS_TOKEN
    });
    const N = new URLSearchParams(window.location.search.toLowerCase());
    let S;
    const E = n || N.get("websceneid");
    if (E) {
      const d = {
        id: E
      };
      if (E.startsWith("http")) {
        const l = E.split("/");
        d.id = l.pop();
        const y = l.join("/"), g = new U({
          url: y
        });
        d.portal = g;
      }
      S = new u({
        portalItem: d
      });
    } else
      S = new u({
        basemap: "satellite",
        ground: "world-elevation"
      });
    t = new L({
      container: e,
      map: S,
      ui: {
        components: ["attribution"]
      }
    });
    const C = document.getElementsByTagName(
      "geocam-viewer-arcgis-scene"
    )[0];
    C && C.link && (console.log("map linking to connector", t), C.link(t));
    const P = function(d) {
      return d.layers.items.map((l) => l.layers ? P(l) : l);
    }, B = function(d) {
      return P(d).flat();
    };
    t.when(async () => {
      let d = [], l = !1;
      const y = B(t.map);
      for (let m = 0; m < y.length; m++) {
        const a = y[m];
        if (await t.whenLayerView(a), a.editingEnabled && (l = !0), a.fields) {
          const v = a.fields.map((w) => w.name);
          d.push({ layer: a, searchFields: v });
        }
      }
      const g = [];
      c.forEach((m, a) => {
        const v = A[a], w = new v({
          view: t,
          container: document.createElement("div"),
          ...s[a].options
        });
        g.push(w);
      }), p.forEach((m, a) => {
        if (m === "esri/widgets/Editor" && !l)
          return;
        m === "esri/widgets/Search" && (r[a].options = r[a].options || {}, r[a].options.sources = r[a].options.sources || d);
        const v = A[a + c.length], w = new v({
          view: t,
          container: document.createElement("div"),
          ...r[a].options
        });
        console.log("loaded widget", {
          view: t,
          container: document.createElement("div"),
          ...r[a].options
        });
        const b = new f({
          view: t,
          group: "expands",
          autoCollapse: !0,
          content: w,
          expandIconClass: r[a].icon
        });
        r[a].watchWidgetFor && Object.keys(r[a].watchWidgetFor).forEach((h) => {
          w.watch(
            h,
            (...k) => r[a].watchWidgetFor[h].apply(w, k)
          );
        }), r[a].watchExpandFor && Object.keys(r[a].watchExpandFor).forEach((h) => {
          b.watch(
            h,
            (...k) => r[a].watchExpandFor[h].apply(b, k)
          );
        }), g.push(b);
      }), t.ui.add(g, "top-right"), console.log("All widgets added");
    });
  }), t;
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
