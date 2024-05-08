export default function () {

  AFRAME.registerComponent('canvas-material', {
    schema: {
      autoUpdate: { type: 'boolean', default: false },
      src: { type: 'selector' }
    },
    dependencies: ['geometry', 'material'],
    events: {
      update: function (evt: CustomEvent) {
        this.updateMaterial();
      }
    },
    update: function (_oldData) {
      this.el.setAttribute('material', { src: this.data.src });
      // this.el.components.material.src = 
    },
    updateMaterial: function () {
      var el = this.el;
      var material;

      material = el.getObject3D('mesh').material;
      if (!material.map) { return; }
      material.map.needsUpdate = true;
    },
    tick: function () {
      if (this.data.autoUpdate) {
        this.updateMaterial();
      }
    }
  });
}