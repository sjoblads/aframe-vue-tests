export default function () {

  AFRAME.registerComponent('canvas-material', {
    schema: {
      autoUpdate: { type: 'boolean', default: false },
      src: { type: 'selector' }
    },
    // dependencies: ['geometry'],
    canvasReady: false,
    events: {
      canvasReady: function () {
        if (this.canvasReady) return;
        console.log('canvas ready triggered');
        this.canvasReady = true;
        const canvas = this.data.src as HTMLCanvasElement;
        const ratio = canvas.height / canvas.width;
        // console.log(ratio);
        this.el.setAttribute('geometry', { primitive: 'plane', width: 1, height: ratio });
        this.el.setAttribute('material', { src: this.data.src });
        // const geometry = this.el.components.geometry;
        // console.log(geometry);
        // geometry.height = ratio;
      },
      update: function (evt: CustomEvent) {
        // console.log('update riggered');
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
      if (!this.canvasReady) return;
      var el = this.el;
      var material;

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