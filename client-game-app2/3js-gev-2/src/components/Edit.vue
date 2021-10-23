<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 fill">
      <div class="row fill header-container">
        <header-component/>
      </div>
      <div class="row main-container fill">
        <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <left-panel-component>
            <template v-slot:top>
              <entity-tree-component
                v-on:entitySelected="entitySelected"
              />
            </template>
            <template v-slot:bottom>
              <entity-properties-component
                :entity="currentSelectedEntity"
              />
            </template>
          </left-panel-component>
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 fill">
          <div class="row game-container fill">
            <div class="game-canvas" id="main-canvas"></div>
          </div>
          <div class="row bottom-panel-container fill">
            <bottom-panel-component>
        <!--      <div slot="top" style="width:100%;height:100%;">
                <div class="row">
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
                    <th v-if="SelectedEntity && SelectedEntity.m_Components && SelectedEntity.m_Components.PhysicsComponent && SelectedEntity.m_Components.PhysicsComponent.constructor.name === 'HeightmapPhysicsComponent'">
                      <b-button class="editor-button"
                        v-b-tooltip.hover.topright title="Heightmap Tool"
                        v-on:click="onHeightmapToolButtonClicked"
                        v-model:pressed="ToolButtonStates.HeightmapEditButtonSelected">
                        <icon name="chess-board" scale="1"/>
                      </b-button>
                    </th>
                    <th v-if="SelectedEntity && SelectedEntity.m_Components && SelectedEntity.m_Components.RenderComponent && SelectedEntity.m_Components.RenderComponent.constructor.name === 'HeightmapPlaneMeshRenderComponent'">
                      <b-button class="editor-button"
                        v-b-tooltip.hover.topright title="Plane Paint Tool"
                        v-on:click="onPlanePaintToolButtonClicked"
                        v-model:pressed="ToolButtonStates.PlanePaintEditButtonSelected">
                        <icon name="chess-board" scale="1"/>
                      </b-button>
                    </th>
                  </tr>
                </div>
              </div>-->
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

import Editor from "./../editor/edit/Editor";

export default {
  name: "Edit",
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
        ScaleEditButtonSelected: false,
        HeightmapEditButtonSelected: false,
        PlanePaintEditButtonSelected: false
      }
    }
  },
  computed: {
    currentSelectedEntity() {
      return this.SelectedEntity;
    }
  },
  watch: {
    SelectedEntity: {
      immediate: true,
      handler(changed, previous) {
        console.error(changed, previous);
      }
    }
  },
  created() {
    this.Editor = new Editor();
  },
  mounted() {
    ENGINE.Initialise();

    this.Editor.m_UICallbacks.onEntitySelected = this.entitySelected;
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
    onHeightmapToolButtonClicked() {
      if(this.ToolButtonStates.HeightmapEditButtonSelected) {
        this.UntoggleAllToolsExcept("HeightmapEditButtonSelected");
        EDITOR.SelectHeightmapEditTool();
      }
      else
      {
        this.UntoggleAllToolsExcept();
        EDITOR.NoTool();
      }
    },
    onPlanePaintToolButtonClicked() {
      if(this.ToolButtonStates.PlanePaintEditButtonSelected) {
        this.UntoggleAllToolsExcept("PlanePaintEditButtonSelected");
        EDITOR.SelectPlanePaintEditTool();
      }
      else
      {
        this.UntoggleAllToolsExcept();
        EDITOR.NoTool();
      }
    }
  }
};
</script>

<style scoped>
.header-container {

  width: 100%;
  margin: 0;
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