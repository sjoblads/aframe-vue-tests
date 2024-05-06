import { THREE } from "aframe";

export default function () {
  AFRAME.registerComponent('box-helper', {
    boxHelper: undefined as unknown as THREE.BoxHelper,
    currentColor: undefined as undefined | THREE.Color,
    schema: {
      enabled: { type: 'boolean', default: true },
      color: { type: 'color', default: '#ffffff' }
    },
    init: function () {
      this.boxHelper = new THREE.BoxHelper(this.el.object3D)
      this.boxHelper.material.linewidth = 5;
      const scene = this.el.sceneEl?.object3D
      if (scene) {
        scene.add(this.boxHelper);
      }
    },

    update: function () {
      this.boxHelper.visible = this.data.enabled;
      if (this.data.color && this.boxHelper) {
        const color = new THREE.Color(this.data.color);
        this.boxHelper.material.color = color;
      }
    },

    remove: function () {
      // if (this.boxHelper) {
      this.el.sceneEl?.object3D.remove(this.boxHelper);
      this.boxHelper.dispose();
      // }
    },
  })
}