  import fontFamilyUrl from '@/assets/Roboto-msdf.json?url'
  import fontTextureUrl from '@/assets/Roboto-msdf.png'
  import ThreeMeshUI, { type Block } from 'three-mesh-ui';
  import type { Entity } from 'aframe';
  
  export default function () {
    const blockLayoutSchema = {
      width: { type: "number", default: 1 },
      height: { type: "number", default: 0.6 },
      offset: { type: "number", default: 0 },
      margin: { type: "number", default: 0 },
      padding: { type: "number", default: 0 },
      fontSize: { type: "number", default: 0.03 },
      fontFamily: { type: "string", default: '' },
      fontTexture: { type: "string", default: '' },
      contentDirection: { type: "string", default: "column" },
      justifyContent: { type: "string", default: "center" },
      alignItems: { type: "string", default: "center" },
      // interLine: { type: 'number', default: undefined },
      // hiddenOverflow: { type: 'boolean', default: undefined },
    }
    
    const blockStyleSchema = {
      bestFit: { type: 'string', default: 'none'},
      backgroundColor: { type: 'color', default: '#000' },
      backgroundOpacity: { type: "number", default: 0.5 },
      // backGroundTexture,
      // backgroundSize,
      borderWidth: {type: 'number', default: 0.0},
      borderRadius: { type: 'array', default: ['0.04']},
      borderColor: { type: 'color', default: '#000'},
      borderOpacity: {type: 'number', default: 1},
    }
    
    const MESH_BLOCK_NAME = 'mesh-ui-block';
    
    function whenComponentInitedTryAttachToMeshUiBlock(parent: Entity, myMeshUiBlock: Block) {
          const meshComponent = parent.components[MESH_BLOCK_NAME];
          if(!meshComponent) return;
          if(meshComponent.initialized){
            meshComponent.block.add(myMeshUiBlock);
          }else {
            console.log('waiting for parent component to be ready');
            parent.addEventListener('componentinitialized', function(evt) {
              if(evt.detail.name === MESH_BLOCK_NAME){
                console.log('parent mesh block was initialized. Attaching to it');
                const meshComponent = parent.components[MESH_BLOCK_NAME]
                meshComponent.block.add(myMeshUiBlock);
              }
            })
          }
    }

    // type BlockComponent = typeof blockComponentConstructor
    AFRAME.registerComponent(MESH_BLOCK_NAME, {
      schema: {
        ...blockLayoutSchema,
        ...blockStyleSchema,
      },
      isUiRoot: false,
      block: undefined as unknown as Block,
      init: function () {
        // console.log('INIT MESH BLOCK');
        this.block = new ThreeMeshUI.Block(this.calculateOptionsObject())
        // @ts-ignore
        this.block['name'] = 'mesh-ui-block';

        // this.el.addEventListener('loaded', () => {
          // if(!this.block) {
          //   console.error('mesh-ui block was undefined. Cant add to entity\'s object3d');
          //   return;
          // }
        
          const parent = this.el.parentElement as Entity
          if(!parent.components[MESH_BLOCK_NAME]){
            console.log('parent has no mesh ui block component. Attaching to entity');
            this.isUiRoot = true;
            this.el.object3D.add(this.block);
          } else {
            whenComponentInitedTryAttachToMeshUiBlock(parent, this.block);
          }
          
          this.el.addEventListener('child-attached', (evt) => {
            evt.stopPropagation(); // We only care about direct children
            console.log('child attached:',evt.detail);
            const entity = evt.detail.el as Entity;

            // console.log(typeof el);
            // if(!hasMeshUIComponent(el)) return;
            // this.block.add(el.object3D)
            if(!hasMeshUIComponent(entity)){
              console.log('found child that isnt a mesh-ui component. Adding the entity\'s object3D to this components block');
              this.block.add(entity.object3D);
            } 
          });

          this.el.addEventListener('child-detached', (evt) => {
            evt.stopPropagation(); // We only care about direct children
            console.log('child detached:',evt.detail);
            const el = evt.detail.el as Entity
            if(!hasMeshUIComponent(el)) {
              console.log('child detached that isnt a mesh-ui component. Removing the entity\'s object3D from this components block');
              this.block.remove(el.object3D)
            }
          });

          const children = this.el.children;
          for(const child of children){
            const entity = child as Entity;
            if(!hasMeshUIComponent(entity)){
              console.log('found child that isnt a mesh-ui component. Adding the entity\'s object3D to this components block');
              this.block.add(entity.object3D);
            } 
          }
          
        // })
      },
      update: function () {
        if(!this.block) return;
        this.block.set(this.calculateOptionsObject());
      },
      calculateOptionsObject() {
        return {
          ...this.data,
          backgroundColor: new THREE.Color(this.data.backgroundColor),
          borderRadius: this.data.borderRadius.length > 1 ? this.data.borderRadius : this.data.borderRadius[0],
          borderColor: new THREE.Color(this.data.borderColor),
          fontFamily: this.data.fontFamily === '' ? fontFamilyUrl : this.data.fontFamily,
          fontTexture: this.data.fontTexture === '' ? fontTextureUrl : this.data.fontTexture,
        }
      },
      tick(_time, _timeDelta) {
        if(this.isUiRoot){
          ThreeMeshUI.update();
        }
      },
      remove() {
          if(!this.block) return;
          this.block.clear();
          this.block.removeFromParent();
      },
    });
    
    const textLayoutSchema = {
      content: {type: 'string', default: 'Please provide text!' },
      // fontKerning,
      // letterSpacing,
      textAlign: { type: "string", default: "center" },
      // whiteSpace,
      // breakOn,
    }
    
    const textStyleSchema = {
      fontColor: { type: 'color', default: '#fff'},
      fontOpacity: { type: 'number', default: 1},
      // fontSuperSampling,
    }
    const MESH_TEXT_NAME = 'mesh-ui-text';
    AFRAME.registerComponent(MESH_TEXT_NAME, {
      schema: {
        ...textLayoutSchema,
        ...textStyleSchema
      },
      block: undefined as unknown as Block,
      init: function () {
        console.log('INIT MESH Text');
        this.block = new ThreeMeshUI.Text(this.calculateOptionsObject())
        this.block['name'] = MESH_TEXT_NAME;

        const parent = this.el.parentElement as Entity
        // const meshComponent = getMeshUIComponent(parent);
        // if(!meshComponent){
        //   console.error('parent is not mesh block component. the mesh.text should be inside a mesh-block');
        // } else {
        //   console.log('parent has mesh ui component. Attaching to it');
        //   console.log(meshComponent);
        //   meshComponent.block.add(this.block);
        // }
        if(parent.components[MESH_BLOCK_NAME]){
          whenComponentInitedTryAttachToMeshUiBlock(parent, this.block);
        } 

        // this.el.addEventListener('loaded', () => {
          // if(!this.block) {
          //   console.error('mesh-ui block was undefined. Cant add to entity\'s object3d');
          //   return;
          // }
          // // this.el.object3D.add(this.block);
          // const parent: Entity | null = this.el.parentElement as Entity | null;
          // if(!parent) {
          //   console.error('no parent entity');
          //   return;
          // }
          // console.log(parent.object3D.children.length);
          // const parentBlock = parent.object3D.getObjectByName('mesh-ui-block');
          // if(!parentBlock){ console.error('no parent ui-block'); return;}
          // parentBlock.add(this.block);
        // })
      },
      update: function () {
        this.block.set(this.calculateOptionsObject());
      },
      calculateOptionsObject() {
        return {
          ...this.data,
          fontColor: new THREE.Color(this.data.fontColor),
        }
      },
      tick(_time, _timeDelta) {
      },
      remove() {
          this.block.clear();
          this.block.removeFromParent();
      },
    })
  }
  function hasMeshUIComponent(entity: Entity) {
    return entity.components["mesh-ui-block"] || entity.components["mesh-ui-text"];
  }
  
  // function getMeshUIComponent(entity: Entity){
  //   // console.log('Checking if entity has mesh components');
  //   // console.log(entity.components);
  //   const meshblock = entity.components["mesh-ui-block"];
	// 	const meshtext = entity.components["mesh-ui-text"];
  //   if(meshblock && meshtext) console.warn('an entity should only have either a mesh-ui-block or mesh-ui-text');
  //   else if(!meshblock && !meshblock) return false;
  //   // console.log(meshblock);
  //   // console.log(meshtext);
  //   return meshblock ? meshblock : meshtext;
  // }