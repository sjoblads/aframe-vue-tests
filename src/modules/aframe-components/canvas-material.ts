export default function () {

  AFRAME.registerComponent('canvas-material', {
    schema: {
      autoUpdate: { type: 'boolean', default: false },
      src: { type: 'selector' }
    },
    dependencies: ['geometry', 'material'],
    events: {
      update: function (evt: CustomEvent) {
        console.log('update riggered');
        this.updateMaterial();
      }
    },
    init(data) {
      const canvas = this.data.src as HTMLCanvasElement
      // console.log(this.data.src);
    },
    update: function (_oldData) {
      console.log(this.data.src);
    },
    updateMaterial: function () {
      var el = this.el;
      var material;
      const canvas = this.data.src as HTMLCanvasElement;
      if (canvas.width === 0) { return; }

      this.el.setAttribute('material', { src: this.data.src });
      material = el.getObject3D('mesh').material;
      if (!material.map) {
        console.error('no material map. exiting');
        return;
      }
      console.log('marking material for update');
      material.map.needsUpdate = true;
    },
    tick: function () {
      if (this.data.autoUpdate) {
        this.updateMaterial();
      }
    }
  });
}