import type { DetailEvent, Entity, THREE } from 'aframe';

export default function () {

  AFRAME.registerComponent('raycaster-update', {
    raycaster: null as null | Entity,
    // prev: new AFRAME.THREE.Vector3,
    // stashedCursorStyle: undefined as string | undefined,
    isIntersecting: false,
    init: function () {
      console.log('INIT raycaster-update');
      this.tick = AFRAME.utils.throttleTick(this.tick!, 10, this);
    },
    events: {
      'raycaster-intersection': function (evt: DetailEvent<{ el: Entity }>) {
        // this.raycaster = evt.detail.el;
        // const canvas = this.el.sceneEl!.canvas;
        // const canvasCursor = canvas.style.cursor;
        // if (canvasCursor !== '') {
        //   console.log('stashing canvasCursor:', canvasCursor);
        //   this.stashedCursorStyle = canvasCursor;
        //   canvas.style.cursor = 'pointer';
        // }
        this.isIntersecting = true;
        console.log(evt);
      },
      'raycaster-intersection-cleared': function (evt: DetailEvent<any>) {
        // this.raycaster = null;
        // const canvas = this.el.sceneEl!.canvas;
        // if (this.stashedCursorStyle) {
        //   canvas.style.cursor = this.stashedCursorStyle;
        // }
        // this.el.emit('raycast-out', evt);
        this.isIntersecting = false;
        console.log(evt);
      },
    },
    tick: function (t, dt) {
      if (this.isIntersecting) {
        const intersectedEl = this.el.components.raycaster.intersectedEls[0] as Entity | undefined;
        if (intersectedEl) {
          const intersection = this.el.components.raycaster.getIntersection(intersectedEl) as THREE.Intersection;
          this.el.emit('raycast-update', { intersection });
        }
      }
      // if (!this.raycaster) { return; }  // Not intersecting.

      // // @ts-ignore
      // const intersection = this.raycaster.components.raycaster.getIntersection(this.el);
      // if (!intersection.point) { return; }
      // if (AFRAME.utils.coordinates.stringify(intersection.point) !== AFRAME.utils.coordinates.stringify(this.prev)) {
      //   // console.log(intersection.point);
      //   this.el.emit('raycast-change', { intersection });
      // }
      // this.prev = intersection.point;
    },
  });
};