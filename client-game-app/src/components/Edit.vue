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
            <div class="game-canvas"></div>
          </div>
          <div class="row bottom-panel-container fill">
            <bottom-panel-component>
              <div slot="top" style="width:100%;height:100%;">
                <div class="row">
                  <div class="col-sm-1">
                    <b-button class="editor-button"
                      v-b-tooltip.hover.topright title="Position Tool"
                      v-on:click="onPositionToolButtonClicked">
                      <icon name="arrows-alt" scale="1"/>
                    </b-button>
                  </div>
                  <div class="col-sm-1">
                    <b-button class="editor-button">
                      <icon name="sync" scale="1"/>
                    </b-button>
                  </div>
                  <div class="col-sm-1">
                    <b-button class="editor-button">
                      <icon name="expand-arrows-alt" scale="1"/>
                    </b-button>
                  </div>
                </div>
              </div>
            </bottom-panel-component>
          </div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 fill">
            <!-- <right-panel-component/> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "./menu/editor/HeaderComponent";
import LeftPanelComponent from "./menu/editor/LeftPanelComponent";
import BottomPanelComponent from "./menu/editor/BottomPanelComponent";


import EntityTreeComponent from "./menu/editor/EntityTreeComponent";
import EntityPropertiesComponent from "./menu/editor/EntityPropertiesComponent";

import Editor from "./../editor/edit/Editor";

export default {
  name: "Edit",
  components: {
    HeaderComponent,
    LeftPanelComponent,
    BottomPanelComponent,

    EntityTreeComponent,
    EntityPropertiesComponent
  },
  data() {
    return {
      SelectedEntity: null
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
    this.Editor = new Editor();
  },
  mounted() {
    ENGINE.Initialise();

    this.Editor.m_UICallbacks.onEntitySelected = this.entitySelected;
  },
  methods: {
    entitySelected(entity) {
      this.SelectedEntity = entity;
    },
    onPositionToolButtonClicked() {
      EDITOR.SelectPositionEditTool();
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
    position: absolute;
    background-color: #333;
    border: 1px solid #444;
}
</style>