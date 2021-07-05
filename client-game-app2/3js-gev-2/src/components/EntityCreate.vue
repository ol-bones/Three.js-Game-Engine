<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 fill">
      <div class="row header-container fill">
        <header-component/>
      </div>
      <div class="row main-container fill">
        <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <left-panel-component>
            <div slot="top" style="height:100%;">
              <entity-tree-component
                v-on:entitySelected="entitySelected"
              />
            </div>
            <div slot="bottom" style="height:100%;">
              <entity-properties-component
                :entity="SelectedEntity"
              />
            </div>
          </left-panel-component>
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 fill">
          <div class="row game-container fill">
            <div class="game-canvas" id="main-canvas"></div>
          </div>
          <div class="row bottom-panel-container fill">
            <bottom-panel-component>
              <div slot="top" style="width:100%;height:100%;">
                <div class="row">
                  <div class="col-xs-4 col-sm-4 col-md-4">
                    <tr>
                      <th>
                        <b-button class="editor-button"
                          v-b-tooltip.hover.topright title="Position Tool"
                          v-on:click="onPositionToolButtonClicked"
                          v-model:pressed="ToolButtonStates.PositionEditButtonSelected">
                          <icon name="arrows-alt" scale="1"/>
                        </b-button>
                      </th>
                      <th>
                        <b-button class="editor-button"
                          v-b-tooltip.hover.topright title="Rotation Tool"
                          v-on:click="onRotationToolButtonClicked"
                          v-model:pressed="ToolButtonStates.RotationEditButtonSelected">
                          <icon name="sync" scale="1"/>
                        </b-button>
                      </th>
                      <th>
                        <b-button class="editor-button"
                          v-b-tooltip.hover.topright title="Scale Tool"
                          v-on:click="onScaleToolButtonClicked"
                          v-model:pressed="ToolButtonStates.ScaleEditButtonSelected">
                          <icon name="expand-arrows-alt" scale="1"/>
                        </b-button>
                      </th>
                    </tr>
                  </div>
                  <div class="col-xs-8 col-sm-8 col-md-8">
                    <tr>
                      <th style="width:100%;">
                        <b-form-input @submit="PhysModelParser"
                          v-model="OBJPhysPath"
                          placeholder="/entities/test_models/directors_chair/directors_chair.phys"
                        />
                      </th>
                      <th>
                        <b-button class="editor-button"
                          v-b-tooltip.hover.topright title="Load Phys Model"
                          v-on:click="PhysModelParser">
                          <icon name="download" scale="1"/>
                        </b-button>
                      </th>
                      <th>
                        <b-button class="editor-button"
                          v-b-tooltip.hover.topright title="Copy PhysJSON"
                          v-on:click="onCopyJSONPressed">
                          <icon name="code" scale="1"/>
                        </b-button>
                      </th>
                    </tr>
                  </div>
                </div>
              </div>
            </bottom-panel-component>
          </div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <right-panel-component/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "./menu/editor/Header/HeaderComponent";
import LeftPanelComponent from "./menu/editor/Panel/LeftPanelComponent";
import BottomPanelComponent from "./menu/editor/Panel/BottomPanelComponent";
import RightPanelComponent from "./menu/editor/Panel/RightPanelComponent";


import EntityTreeComponent from "./menu/editor/EntityTreeComponent";
import EntityPropertiesComponent from "./menu/editor/EntityPropertiesComponent";

import EntityCreator from "./../editor/entitycreate/EntityCreate";
import Entity from "./../engine/entity/entities/Entity";
import BasicBoxMeshRenderComponent from "./../engine/entity/components/RenderComponent/mixins/BasicBoxMeshRenderComponent";

export default {
  name: "EntityCreate",
  components: {
    HeaderComponent,
    LeftPanelComponent,
    BottomPanelComponent,
    RightPanelComponent,

    EntityTreeComponent,
    EntityPropertiesComponent
  },
  data() {
    return {
      SelectedEntity: null,
      ToolButtonStates: {
        PositionEditButtonSelected: false,
        RotationEditButtonSelected: false,
        ScaleEditButtonSelected: false
      },
      OBJPhysPath: String()
    }
  },
  watch: {
    SelectedEntity: {
      immediate: true,
      handler(changed, previous) {
        //console.log(changed, previous);
      }
    }
  },
  created() {
    this.EntityCreator = new EntityCreator();
  },
  mounted() {
    ENGINE.Initialise();

    this.EntityCreator.m_UICallbacks.onEntitySelected = this.entitySelected;
  },
  methods: {
    entitySelected(entity, suppressCallback) {
      this.SelectedEntity = entity;
      if(!suppressCallback) EDITOR.SetSelectedEntity(entity, true);
    },
    UntoggleAllToolsExcept(currentButton) {
      Object.keys(this.ToolButtonStates)
        .filter(stateKey => stateKey !== currentButton)
        .forEach(buttonState => this.ToolButtonStates[buttonState] = false)
    },
    onPositionToolButtonClicked() {
      if(this.ToolButtonStates.PositionEditButtonSelected) {
        this.UntoggleAllToolsExcept("PositionEditButtonSelected");
        EDITOR.SelectPositionEditTool();
      }
      else
      {
        this.UntoggleAllToolsExcept();
        EDITOR.NoTool();
      }
    },
    onRotationToolButtonClicked() {
      if(this.ToolButtonStates.RotationEditButtonSelected) {
        this.UntoggleAllToolsExcept("RotationEditButtonSelected");
        EDITOR.SelectRotateEditTool();
      }
      else
      {
        this.UntoggleAllToolsExcept();
        EDITOR.NoTool();
      }
    },
    onScaleToolButtonClicked() {
      if(this.ToolButtonStates.ScaleEditButtonSelected) {
        this.UntoggleAllToolsExcept("ScaleEditButtonSelected");
        EDITOR.SelectScaleEditTool();
      }
      else
      {
        this.UntoggleAllToolsExcept();
        EDITOR.NoTool();
      }
    },
    onCopyJSONPressed() {
      if(entities().length > 0)
      {
        const root = entities()[0];
        if(root && root.m_Components.RenderComponent.m_Meshes && root.m_Components.RenderComponent.m_Meshes.length > 0)
        {
          if(root.m_Entities && root.m_Entities.length > 0)
          {
            console.log("copyin some json");
            console.log(this.ExportJSON());
            navigator.clipboard.writeText(JSON.stringify(this.ExportJSON()));
          }
          else
          {
            console.error("no phys shapes attached");
          }
        }
        else
        {
          console.error("not a valid root");
        }   
      }
    },
    
    ExportJSON()
    {
      let phys_list = entities()[0].m_Entities.map(e =>
      {
        const component = e.m_Components.RenderComponent;
        let curType = this.PhysTypeEnumeration(component);
        let curScale;
        switch(curType)
        {
            case 1:
            {
              curScale =
              {
                  x: (e.__physscale?e.__physscale.x:1) * e.m_Scale.x,
                  y: (e.__physscale?e.__physscale.y:1) * e.m_Scale.y,
                  z: (e.__physscale?e.__physscale.z:1) * e.m_Scale.z
              };
              break;
            }
            case 2:
            {
              const curParams = component.mesh.geometry.parameters;
              curScale =
              {
                hs: curParams.heightSegments,
                r: curParams.radius,
                ws: curParams.widthSegments
              };
              break;
            }
            case 3:
            {
              let curParams = e.m_Components.RenderComponent.m_Mesh.geometry.parameters;
              curScale =
              {
                  rt: curParams.radiusTop,
                  rb: curParams.radiusBottom,
                  h: curParams.height,
                  s: curParams.radialSegments
              };
              break;
            }
            default:
          throw ("No phys type in exporter");
          break;
        }
        return {[e.__physname || "rigid_shape"]:
        {
            type: curType,
            pos: e.m_Position,
            scale: curScale,
            rot: {axis:{
              x: new THREE.Vector4().setAxisAngleFromQuaternion(
            e.m_Components.RenderComponent.m_Mesh.quaternion).x,
              y: new THREE.Vector4().setAxisAngleFromQuaternion(
            e.m_Components.RenderComponent.m_Mesh.quaternion).y,
              z: new THREE.Vector4().setAxisAngleFromQuaternion(
            e.m_Components.RenderComponent.m_Mesh.quaternion).z
          },
          r: new THREE.Vector4().setAxisAngleFromQuaternion(
              e.m_Components.RenderComponent.m_Mesh.quaternion).w
            + (curType === 3 ? Math.PI/2 : 0)
            }
        }}
      });

      let _phys_export = {};
      phys_list.forEach(json =>
      {
        let name = Object.keys(json)[0];
        if(_phys_export[name] != void(0)) name = name.concat(`_${Object.keys(_phys_export).filter(j => j.startsWith(name)).length}`);
        _phys_export[name] = json[Object.keys(json)[0]];
      });

      return _phys_export;
    },

    PhysTypeEnumeration(component) {
      try
      {
        if(component && component.Name())
        {
          switch(component.Name())
          {
            case "BasicBoxMeshRenderComponent": return 1;
            case "BasicSphereMeshRenderComponent": return 2;
            default: return -1;
          }

          return -1;
        }

        return -1;
      }
      catch(Exception) { return -1; }
    },

    PhysModelParser()
    {
      try
      {
          let _phys = json(this.OBJPhysPath);
          console.log(_phys);
          Object.keys(_phys).forEach(p =>
          {
            if(_phys[p].type === 1) { this.AddBox(p, _phys[p]); }
            //if(_phys[p].type === 2) { this.AddCylinder(p, _phys[p]); }
          });
      }
      catch(e) { setTimeout(_=>this.PhysModelParser(this.OBJPhysPath), 50); }
    },

    AddBox(name, p)
    {
      if(entities().length <= 0) return;

      let e = new Entity(
        p.pos.x, p.pos.y, p.pos.z,
        0,0,0,
        p.scale.x, p.scale.y, p.scale.z,
        null
      );

      e.__physname = name;
      e.__phystype = p.type;
      e.__physscale = p.scale;
      e.__postInitialised = false;

      e.AddComponent(new BasicBoxMeshRenderComponent({
          Parent: e,
          Scale: {x: p.scale.x/10, y: p.scale.y/10, z:p.scale.z/10}
      }));

      e.__OnInitialised = () =>
      {
          if(!p.rot || e.__postInitialised) return;
          e.m_Components.RenderComponent.m_Mesh.quaternion.setFromAxisAngle(
            new THREE.Vector3(p.rot.axis.x, p.rot.axis.y, p.rot.axis.z),
            p.rot.r
          );
          
          e.m_Components.RenderComponent.SetScale(
            p.scale.x, p.scale.y, p.scale.z
          );

          if(e.m_Components.PhysicsComponent) e.m_Components.PhysicsComponent.m_PhysicsBody.sleep();
          e.__postInitialised = true;
      };

      entities()[0].m_Entities.push(e);
    }
  }
};
</script>

<style scoped>
.header-container {
  height: 5%;
  width: 100%;
}

.game-container {
  height: 85%;
  width: 100%;
}

.bottom-panel-container {
  height: 15%;
  width: 100%;
}

.game-canvas {
  width: 100%;
  height:100%;
  overflow: hidden;
}

.editor-button {
    background-color: #333;
    border: 1px solid #444;
}
</style>