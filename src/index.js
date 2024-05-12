import { scene } from "./lib/scene.js";

export class GeocamScene extends HTMLElement {
  constructor() {
    super();
    // this.yaw = this.getAttribute('yaw') || 0;
    console.log("Scene init");
  }

  connectedCallback() {
    console.log("Scene connected");
    const node = this;
    const websceneid = node.getAttribute("data-websceneid");
    scene(node, websceneid);
  }

  disconnectedCallback() {
    console.log("Scene disconnected");
    // Clean up the viewer
  }
}

window.customElements.define("geocam-scene", GeocamScene);
