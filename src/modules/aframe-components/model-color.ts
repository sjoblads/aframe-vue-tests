import { THREE } from "aframe";

export default () => {

  AFRAME.registerComponent('model-color', {
    schema: {
      colors: {type: 'array'},
    },
    // threeColor: undefined as undefined | THREE.Color,
    init: function () {
      console.log(this.el);
      this.el.addEventListener('model-loaded', this.update.bind(this));
      this.update();
      // this.checkCustomProps(this.el.object3D);
      // this.checkCustomProps(this.el.getObject3D('mesh'));
      // console.log(this.el.object3D);
      // console.log(this.el.object3DMap);
    },
    update: function () {
      console.log('model-color updated:', this.data);
      // console.log(this.el.object3D);
      // console.log(this.el.object3DMap);
      const mesh = this.el.getObject3D('mesh');
      // console.log('mesh:', mesh);
      const colors: THREE.Color[] = [];
      for(let i = 0; i < this.data.colors.length; i++){
        colors[i] = new THREE.Color(this.data.colors[i]);
      }
      if (!mesh) { return; }
      // this.recursiveStoppableTraverse(mesh, function (node) {
      //     if(!node.isMesh) {
      //       return;
      //     }
      //     if(node.material?.name.startsWith('color')) return;
      //     // if('ColorableHairtie' in node.userData) {
      //     //   console.log('found colorable');
      //     //   node.material.color = new THREE.Color('green');
      //     //   return true;
      //     // }
      //     console.log('applying color to', node);
      //     // node.material.color = colors[0];
      // })
      mesh.traverse(function (node) {
          // console.log('node:', node.name, node.id, node.type);
          // console.log('children:', node.children);
          // console.log('userData:', node.userData);
        const mesh = node as THREE.Mesh;
        if (mesh.isMesh) {
          const material = mesh.material
          if(Array.isArray(material)) return;
          // if('ColorableHairtie' in mesh.userData) {
          //   console.log('found colorable');
          //   return;
          // }
          const keyword = 'color'
          if(material.name.startsWith(keyword)){
            const digit = Number.parseInt(material.name.substring(keyword.length));
            if('color' in material && colors[digit-1]){
              console.log('setting color!');
              material.color = colors[digit-1];
            }
          }
          // mesh.material.opacity = opacity;
          // mesh.material.transparent = opacity < 1.0;
          // mesh.material.needsUpdate = true;
        }
      });
    },
    checkCustomProps: function(root: THREE.Object3D) {
      console.log('checking custom props');
      if(!root) return;
      root.traverse( function (node) {
        // if(Object.keys(node.userData).length !== 0) {
          console.log('checking custom props in node');
          console.log('node name:', node.name, node.id, node.type);
          console.log('userData:', node.userData);
          // console.log(node.userData);
        // }
      })
    },
    recursiveStoppableTraverse: function(root: THREE.Object3D, callBack: (node: THREE.Object3D) => boolean) {
      console.log('travers is on node:', root);
      const shouldStop = callBack(root);
      if(shouldStop){
        console.log('callback gave stop signal');
        return;
      }
      const children = root.children;
      for(const child of children) {
        console.log('recursing on:', child);
        this.recursiveStoppableTraverse(child, callBack);
      }
    }
  });
};