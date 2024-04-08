  import fontFamilyUrl from '@/assets/Roboto-msdf.json?url'
  import fontTextureUrl from '@/assets/Roboto-msdf.png'
  import ThreeMeshUI, { type Block } from 'three-mesh-ui';
  import type { Entity } from 'aframe';
  
  const MESH_BLOCK_NAME = 'mesh-ui-block';
  const MESH_TEXT_NAME = 'mesh-ui-text';
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
    
    function whenComponentInitedAddToMeshUiBlock(child: Entity, parentBlock: Block) {
      const meshComponent = getMeshUIComponent(child);
      if(!meshComponent) return;
      if(meshComponent.initialized){
        parentBlock.add(meshComponent.block);
      }else {
        console.log('waiting for child component to be ready');
        child.addEventListener('componentinitialized', function(evt) {
          const name = evt.detail.name
          if(name === MESH_BLOCK_NAME || name === MESH_TEXT_NAME){
            console.log(`child mesh block ${name} was initialized. adding it as child`);
            const meshComponent = child.components[name]
            parentBlock.add(meshComponent.block);
          }
        })
      }
    }

    AFRAME.registerComponent(MESH_BLOCK_NAME, {
      schema: {
        ...blockLayoutSchema,
        ...blockStyleSchema,
      },
      isUiRoot: false,
      block: undefined as unknown as Block,
      init: function () {
        console.log('INIT MESH BLOCK');
        this.block = new ThreeMeshUI.Block(this.calculateOptionsObject())
        // @ts-ignore
        this.block['name'] = 'mesh-ui-block';

        const parent = this.el.parentElement as Entity
        if(!parent.components[MESH_BLOCK_NAME]){
          console.log('parent has no mesh ui block component. Attaching to entity');
          this.isUiRoot = true;
          this.el.object3D.add(this.block);
        }        

        this.el.addEventListener('child-attached', (evt) => {
          evt.stopPropagation(); // We only care about direct children
          // console.log('child attached:',evt.detail);
          rebuildChildren();
        });

        this.el.addEventListener('child-detached', (evt) => {
          evt.stopPropagation(); // We only care about direct children
          // console.log('child detached:',evt.detail);
          const childEntity = evt.detail.el as Entity
          // Dont know why we need to do this. Thought "normal" entities would also be removed by the .clear() in rebuildChildren
          if(!hasMeshUIComponent(childEntity)) {
            // console.log('child detached that isnt a mesh-ui component. Removing the entity\'s object3D from this components block');
            this.block.remove(childEntity.object3D)
          }
          rebuildChildren();
        });

        // NOTE: three-mesh-ui relies on the order of the children for calculating the layout.
        // Specifically it seems that what matters is the order of calls to .add()
        // I tried to change the children order manually but doesnt seem to have any impact.
        // Thus we take the brute force way and remove all the children and rebuild it.
        const rebuildChildren = () => {
          console.log('rebuilding childList');
          this.block.clear();
          const children = this.el.children;
          for(const child of children){
            const childEntity = child as Entity;
            if(!hasMeshUIComponent(childEntity)){
              console.log('found child that isnt a mesh-ui component. Adding the entity\'s object3D to this components block');
              this.block.add(childEntity.object3D);
            } else {
              whenComponentInitedAddToMeshUiBlock(childEntity, this.block);
            }
          }
        }
        rebuildChildren();
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
  
  function getMeshUIComponent(entity: Entity){
    const meshblock = entity.components[MESH_BLOCK_NAME];
		const meshtext = entity.components[MESH_TEXT_NAME];
    if(meshblock && meshtext) console.warn('an entity should only have either a mesh-ui-block or mesh-ui-text');
    return meshblock ? meshblock : meshtext;
  }