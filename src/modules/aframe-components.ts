import meshUi from "./aframe-components/mesh-ui";
import makeGltfSwappable from "./aframe-components/make-gltf-swappable";
import 'aframe'
import modelColor from './aframe-components/model-color';
import raycasterListen from "./aframe-components/raycaster-listen";
import raycasterUpdate from "./aframe-components/raycaster-update";
import boxHelper from "./aframe-components/box-helper";
import laserPointer from "./aframe-components/laser-pointer";
import canvasMaterial from "./aframe-components/canvas-material";

// import 'aframe-troika-text'
// import 'https://github.com/PyryM/aframe-pano-portal/raw/master/dist/aframe-pano-portal.min.js'
// import './aframe-pano-portal';
// import gltfShadow from "./aframe-components/gltf-shadow";

let componentsRegistered = false;
export default async function registerComponents() {
  if(componentsRegistered) return;
  // await import('aframe');

  meshUi();
  modelColor();
  makeGltfSwappable();
  raycasterListen();
  raycasterUpdate();
  boxHelper();
  laserPointer();
  canvasMaterial();
  // gltfShadow();
  // const troika = await import('./aframe-components/troika-text');
  // troika.default();
  // await import('aframe-troika-text');
  await import('aframe-atlas-uvs-component');
  await import('aframe-orbit-controls');
  
  componentsRegistered = true;
}