<template>
  <div class="col-xs-12 col-sm-12 col-md-12"
  v-if="this.entity && this.physicsComponent">
    <div class="row fill" style="height:100%;overflow-y:scroll;"
    v-if="this.physicsComponent.constructor">
      <div class="col-xs-12 col-sm-12 col-md-12"
      v-if="isHeightfield">
      <div class="row material-properties">
        <div class="col-xs-4 col-sm-4 col-md-4 fill"
          style="font-size: 12px;">
            Size
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.Size"
                v-on:changed="sizeChanged"
              />
            </div>
          </div>
        </div>
      <div class="row material-properties">
        <div class="col-xs-4 col-sm-4 col-md-4 fill"
          style="font-size: 12px;">
            Divs
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.Divisions"
                v-on:changed="divsChanged"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MaterialPreviewComponent from "./../Generic/MaterialPreviewComponent";
import NumberEditComponent from "./../Generic/NumberEditComponent.vue";

export default {
  name: "PhysicsComponentPropertiesComponent",
  components: {
    MaterialPreviewComponent,
    NumberEditComponent
  },
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      Size: 0,
      Divisions: 0
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
    physicsComponent() {
      return this.entity.m_Components.PhysicsComponent;
    },
    isHeightfield() {
      return this.physicsComponent !== void(0) && this.physicsComponent.constructor.name === "HeightmapPhysicsComponent";
    }
  },
  methods: {
    sizeChanged(value) {
      if(this.physicsComponent.m_BodySettings.Size === value && this.Size === value) return;

      this.physicsComponent.m_BodySettings.Size = value;
      this.physicsComponent.m_Args.Size = value;
      this.Size = value;
      this.reCreateEntity();
    },
    divsChanged(value) {
      if(this.physicsComponent.m_BodySettings.Divisions === value && this.Divisions === value) return;
      
      const previous = this.physicsComponent.m_Args.BodySettings.Divisions;

      this.physicsComponent.m_BodySettings.Divisions = value;
      this.physicsComponent.m_Args.BodySettings.Divisions = value;
      this.Divisions = value;

      const heightMap = this.physicsComponent.m_Args.BodySettings.HeightMap;

      if(value < previous)
      {
        this.physicsComponent.m_Args.BodySettings.HeightMap = heightMap
          .slice(0, value+1)
          .map(r => r.slice(0, value+1));
      }
      else
      {
        this.physicsComponent.m_Args.BodySettings.HeightMap = heightMap
          .concat(new Array((value+1) - heightMap.length).fill(new Array(value+1).fill(0)))
          .map(r => r.concat(new Array((value+1) - r.length).fill(0)));
      }

      this.reCreateEntity();
    },
    reCreateEntity() {
      const renderComponent = this.physicsComponent.m_Parent.m_Components.RenderComponent;

      renderComponent.m_Args.Size = this.Size;
      renderComponent.m_Args.Divisions = this.Divisions;
      renderComponent.Remove();
      renderComponent.Initialise();

      this.physicsComponent.Remove();
      this.physicsComponent.Initialise();


     // this.physicsComponent.Initialise();
      this.physicsComponent.SetRotation(-Math.PI/2, 0, 0);

      const debugComponent = this.physicsComponent.m_Parent.m_Components.DebugComponent;
      if(debugComponent != void(0))
      {
        debugComponent.Remove();
        debugComponent.Initialise();
      }
    }
  }
};

</script>

<style scoped>
  .material-properties {
    display:flex;
    align-items:center;
    border-bottom: 1px solid #333;
  }
</style>