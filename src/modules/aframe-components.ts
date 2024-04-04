import meshUi from "./aframe-components/mesh-ui";

let componentsRegistered = false;
export default function registerComponents() {
  if(componentsRegistered) return;

  meshUi();
  import('aframe-atlas-uvs-component');

  componentsRegistered = true;

}