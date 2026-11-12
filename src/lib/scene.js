import { loadModules } from "esri-loader";

// --- ArcGIS identity (geocamxyz/geocam-viewer-development#8) ------------------
//
// Three layers, each silent until the last:
//
//   1. A token handed in by the Manager — the user signed into GeoCam with
//      Sign in with ArcGIS. Registered before anything loads, so they never see
//      a popup. Unchanged behaviour.
//   2. No token: register an OAuthInfo and ask, silently, whether this browser
//      already has an ArcGIS session. checkSignInStatus never prompts — it
//      resolves if signed in and rejects in milliseconds if not. This is what
//      lets a second map, or a scene after a map, open without asking again.
//   3. Nothing else. The Maps SDK raises its own challenge if and only if a
//      request comes back 499/498/403/401 (esri/request.js). A public item never
//      does, so a public map still opens with no popup for anyone, and a wrong
//      item id fails cleanly instead of demanding a sign-in.
//
// The point of registering the OAuthInfo is that when step 3 does fire, the
// challenge becomes an ArcGIS OAuth popup instead of the SDK's built-in
// username/password dialog — which enterprise/Entra orgs cannot use at all.
const setupArcgisIdentity = async function (IdentityManager, OAuthInfo) {
  if (window.ARCGIS_TOKEN) {
    IdentityManager.registerToken({
      server: window.ARCGIS_SERVER,
      token: window.ARCGIS_TOKEN,
    });
    return;
  }

  if (!window.ARCGIS_APP_ID) return; // nothing to register; SDK default applies

  // Without a callback on this origin the popup cannot hand its result back, and
  // Esri's relative default would resolve under /viewer/scene/cell+{slug}/ and
  // never match the redirect URI registered on the app. Better to leave the old
  // behaviour in place than to open a popup that cannot return.
  if (!window.ARCGIS_OAUTH_CALLBACK) {
    console.warn(
      "ARCGIS_APP_ID is set but ARCGIS_OAUTH_CALLBACK is not — skipping ArcGIS OAuth setup"
    );
    return;
  }

  const portalUrl =
    window.ARCGIS_PORTAL_URL || window.ARCGIS_SERVER || "https://www.arcgis.com";

  try {
    IdentityManager.registerOAuthInfos([
      new OAuthInfo({
        appId: window.ARCGIS_APP_ID,
        portalUrl: portalUrl,
        popup: true,
        popupCallbackUrl: window.ARCGIS_OAUTH_CALLBACK,
      }),
    ]);
    await IdentityManager.checkSignInStatus(`${portalUrl}/sharing`);
  } catch (e) {
    // No existing session, or registration failed. Neither is an error: carry on
    // and let the SDK challenge only if the item actually needs credentials.
  }
};

export async function scene(node, websceneid) {
  const esriLoaderOptions = {
    version: "4.27",
    css: true,
  };

  let view;

  const widgets = [{ name: "Zoom" }];
  const expands = [
    {
      name: "Search",
      icon: "esri-icon-search",
      options: { includeDefaultSources: true },
    },
    { name: "BasemapGallery", icon: "esri-icon-basemap" },
    { name: "LayerList", icon: "esri-icon-layer-list" },
    { name: "Legend", icon: "esri-icon-feature-layer" },
    { name: "Editor", icon: "esri-icon-edit" },
    {
      name: "DirectLineMeasurement3D",
      icon: "esri-icon-measure",
      watchExpandFor: {
        expanded: (nV, oV, expProp, expObj) => {
          expObj.content.viewModel.clear();
        },
      },
      watchWidgetFor: {
        "viewModel.state": (nV, oV, expProp, expObj) => {
          if (nV === "measuring") {
            expObj.view.emit("clickable", false);
          } else if (nV !== "measuring" && oV === "measuring") {
            expObj.view.emit("clickable", true);
          }
          console.log("viewmodel state change", nV, expObj);
        },
      },
    },
  ];

  const widgetList = widgets
    ? widgets.map((w) => (w.class ? w.class : `esri/widgets/${w.name}`))
    : [];
  const expandList = expands
    ? expands.map((w) => (w.class ? w.class : `esri/widgets/${w.name}`))
    : [];

  await loadModules(
    [
      "esri/identity/IdentityManager",
      "esri/identity/OAuthInfo",
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/widgets/Expand",
      "esri/portal/Portal",
    ]
      .concat(widgetList)
      .concat(expandList),
    esriLoaderOptions
  ).then(
    async ([
      IdentityManager,
      OAuthInfo,
      WebScene,
      SceneView,
      Expand,
      Portal,
      ...widgetArray
    ]) => {
      await setupArcgisIdentity(IdentityManager, OAuthInfo);
      const params = new URLSearchParams(window.location.search.toLowerCase());
      let map;
      const webSceneId = websceneid || params.get("websceneid");
      if (webSceneId) {
        const portalItem = {
          id: webSceneId,
        };

        if (webSceneId.startsWith("http")) {
          const parts = webSceneId.split("/");
          portalItem.id = parts.pop();
          const portalUrl = parts.join("/");
          const portal = new Portal({
            url: portalUrl,
          });
          portalItem.portal = portal;
        }

        map = new WebScene({
          portalItem,
        });
      } else {
        map = new WebScene({
          basemap: "satellite",
          ground: "world-elevation",
        });
      }

      map
        .load()
        .then(() => {
          view = new SceneView({
            container: node,
            map: map,
            ui: {
              components: ["attribution"],
            },
          });

          const connector = document.getElementsByTagName(
            "geocam-viewer-arcgis-scene"
          )[0];
          if (connector && connector.link) {
            console.log("map linking to connector", view);
            connector.link(view);
          }

          const destructureLayers = function (obj) {
            return obj.layers.items.map((l) => {
              return l.layers ? destructureLayers(l) : l;
            });
          };

          const ungroupLayers = function (obj) {
            return destructureLayers(obj).flat();
          };

          view.when(async () => {
            let allLayers = [];
            let hasEditableLayers = false;
            const layers = ungroupLayers(view.map);
            for (let i = 0; i < layers.length; i++) {
              const layer = layers[i];
              await view.whenLayerView(layer);
              if (layer.editingEnabled) hasEditableLayers = true;
              if (layer.fields) {
                const fieldNames = layer.fields.map((f) => f.name);
                allLayers.push({ layer, searchFields: fieldNames });
              }
            }

            const allWidgets = [];

            widgetList.forEach((w, i) => {
              const loadedWidget = widgetArray[i];
              const widget = new loadedWidget({
                view: view,
                container: document.createElement("div"),
                ...widgets[i].options,
              });
              allWidgets.push(widget);
            });

            expandList.forEach((w, i) => {
              if (w === "esri/widgets/Editor" && !hasEditableLayers) return;
              if (w === "esri/widgets/Search") {
                expands[i].options = expands[i].options || {};
                expands[i].options.sources =
                  expands[i].options.sources || allLayers;
              }
              const loadedWidget = widgetArray[i + widgetList.length];
              const widget = new loadedWidget({
                view: view,
                container: document.createElement("div"),
                ...expands[i].options,
              });
              console.log("loaded widget", {
                view: view,
                container: document.createElement("div"),
                ...expands[i].options,
              });
              const expand = new Expand({
                view: view,
                group: "expands",
                autoCollapse: true,
                content: widget,
                expandIconClass: expands[i].icon,
              });
              if (expands[i].watchWidgetFor) {
                Object.keys(expands[i].watchWidgetFor).forEach((prop) => {
                  // for some reason widget is null here even if assign to temp var so using this doesn't work
                  widget.watch(prop, (...args) =>
                    expands[i].watchWidgetFor[prop].apply(widget, args)
                  );
                });
              }
              if (expands[i].watchExpandFor) {
                Object.keys(expands[i].watchExpandFor).forEach((prop) => {
                  // for some reason widget is null here even if assign to temp var so using this doesn't work
                  expand.watch(prop, (...args) =>
                    expands[i].watchExpandFor[prop].apply(expand, args)
                  );
                });
              }
              // expand.watch("expanded", setActiveExpand);
              allWidgets.push(expand);
            });

            view.ui.add(allWidgets, "top-right");
            console.log("All widgets added");
          });
        })
        .catch((error) => {
          const msg =
            error && error.message
              ? error?.message + "\n" + error?.details?.error?.message
              : "An unknown erro occurred trying to load the map.";
          alert(msg);
          console.error("Error loading scene:", msg);
        });
    }
  );

  return view;
}
