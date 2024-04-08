import meshUi from "./aframe-components/mesh-ui";

let componentsRegistered = false;
export default async function registerComponents() {
  if(componentsRegistered) return;

  meshUi();
  // const troika = await import('./aframe-components/troika-text');
  // troika.default();
  await import('aframe-atlas-uvs-component');
  
  componentsRegistered = true;
}