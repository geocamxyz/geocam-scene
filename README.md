# Geocam Scene
Geocam scene web component - convenience component for loading and arcgis scene which can be connected to [geocamxyz/geocam-viewer](https://github.com/geocamxyz/geocam-vewier) web component via the - [geocamxyz/connector-arcgis-scene](https://github.com/geocamxyz/connector-arcgis-scene) web component

### NPM Installation:
```
npm install 'https://gitpkg.now.sh/geocamxyz/geocam-scene/src?v2.0.3'
```
or for a particual commit version:
```
npm install 'https://gitpkg.now.sh/geocamxyz/geocam-scene/src?564ef82'
```
### Import Scene (External Loading):
```
https://cdn.jsdelivr.net/gh/geocamxyz/geocam-scene@v2.0.3/dist/geocam-scene.js
```
or for a particual commit version:
```
https://cdn.jsdelivr.net/gh/geocamxyz/geocam-scene@564ef82/dist/geocam-scene.js
```

### Usage:
The .js file can be imported into your .html file using the below code (This can be ignored if your using the NPM package).
```
 <script type="module" src="https://cdn.jsdelivr.net/gh/geocamxyz/geocam-scene@2.0.3/dist/geocam-scene.js"></script>
 ```

 Or with an importmap
 ```
<script type="importmap">
      {
        "imports": {
          "geocam-scene": "https://cdn.jsdelivr.net/gh/geocamxyz/geocam-scene@2.0.3/dist/geocam-scene.js"
        }
      }
    </script>
```
The scene can then be imported via a module script or using the npm package and using the below import statement.
```
import "geocam-scene"
```
### Setup:
The module generates a custom  &lt;geocam-scene> html tag which can be used to display geocam captured shots.
```
 <geocam-scene websceneid="90be388c0dee4221b95f5490524aed86"></geocam-scene>
```

The following attributes define the shot and view to display:
- websceneid="90be388c0dee4221b95f5490524aed86" *id of base arcgis webscene to display over which the geocam manager features layers will be added.  This can be left blank for a default satellite scene.  When using arcgis enterprise you need to include the reference to the portal first eg: https://enterprise/portal/90be388c0dee4221b95f5490524aed86*

To dsiplay the scene correctly you need to use css to make sure the element appears on screen with a height as well as a width.

A full implementation of the scene including all the plugins would look like this:
```
  <geocam-viewer>
    <geocam-viewer-orbit-controls></geocam-viewer-orbit-controls>
    <geocam-viewer-compass-needle></geocam-viewer-compass-needle>
    <geocam-viewer-label></geocam-viewer-label>
    <geocam-viewer-url-fragments
      params="fov,facing,horizon,shot,sli,visible,left,top,width,height,mode,autorotate,autobrightness,zoom,center"></geocam-viewer-url-fragments>
    <geocam-viewer-loading-indicator></geocam-viewer-loading-indicator>
    <geocam-viewer-screen-shot></geocam-viewer-screen-shot>
    <geocam-viewer-prev-next-control></geocam-viewer-prev-next-control>
    <geocam-viewer-arcgis-scene
      src="http://localhost:3092/arcgis/rest/services/0wlsvpg/FeatureServer"></geocam-viewer-arcgis-scene>
    <geocam-viewer-multiview-window target="scene"></geocam-viewer-multiview-window>
  </geocam-viewer>
  <geocam-scene id="scene"> </geocam-scene>

```