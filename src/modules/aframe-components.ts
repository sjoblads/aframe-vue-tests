// import meshUi from "./aframe-components/mesh-ui";
// import * as THREE from 'three';

// Polyfill Three's rename of Math->MathUtils after the super-three fork
// (function(ThreedleDum) {
//   if (!ThreedleDum.MathUtils) {
//     ThreedleDum.MathUtils = ThreedleDum.Math
//   }
// })(THREE)

let componentsRegistered = false;
export default async function registerComponents() {
  if(componentsRegistered) return;

  // meshUi();
  const troika = await import('./aframe-components/troika-text');
  troika.default();
  await import('aframe-atlas-uvs-component');
  
  // await import('aframe-mesh-ui-components');

  componentsRegistered = true;

}