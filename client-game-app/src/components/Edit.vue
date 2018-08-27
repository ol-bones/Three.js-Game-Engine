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
            <!-- <bottom-panel-component/> -->
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

import EntityTreeComponent from "./menu/editor/EntityTreeComponent";
import EntityPropertiesComponent from "./menu/editor/EntityPropertiesComponent";

import Editor from "./../editor/edit/Editor";

export default {
  name: "Edit",
  components: {
    HeaderComponent,
    LeftPanelComponent,
    EntityTreeComponent,
    EntityPropertiesComponent
  },
  data() {
    return {
      SelectedEntity: null
    }
  },
  created() {
    this.Editor = new Editor();
  },
  mounted() {
    ENGINE.Initialise();
  },
  methods: {
    entitySelected(entity) {
      this.SelectedEntity = entity;
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
</style>