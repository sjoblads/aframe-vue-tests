import meshUi from "./aframe-components/mesh-ui";
import 'aframe'
import 'aframe-troika-text'

let componentsRegistered = false;
export default async function registerComponents() {
  if(componentsRegistered) return;
  // await import('aframe');

  meshUi();
  // const troika = await import('./aframe-components/troika-text');
  // troika.default();
  // await import('aframe-troika-text');
  await import('aframe-atlas-uvs-component');
  
  componentsRegistered = true;
}