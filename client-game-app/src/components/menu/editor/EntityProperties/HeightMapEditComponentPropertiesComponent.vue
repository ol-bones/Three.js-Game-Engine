<template>
  <div class="col-xs-12 col-sm-12 col-md-12">
    <div class="row vector-properties">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="expand-arrows-alt" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <vector3-edit-component
            :vector="this.m_HeightMapStep"
            v-on:changed="stepChanged"/>
        </div>
        <div class="row fill">
          <b-button @click="regeneratePhys">
            regeneratePhys
          </b-button>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12">
      <div class="row material-properties">
        <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
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
        <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
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
</template>

<script>

import Vector3EditComponent from "./../Generic/Vector3EditComponent.vue";
import NumberEditComponent from "./../Generic/NumberEditComponent.vue";

export default {
  name: "HeightMapEditComponentPropertiesComponent",
  components: {
    Vector3EditComponent,
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
      m_HeightMapStep: new THREE.Vector3(0, 0, 1),
      Size: 0,
      Divisions: 0,
      m_RecreationTimer: null
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
    renderComponent() {
      return this.entity.m_Components.RenderComponent;
    },
    physicsComponent() {
      return this.entity.m_Components.PhysicsComponent;
    },
    editComponent() {
      return this.entity.m_Components.HeightmapEditComponent;
    }
  },
  methods: {
    stepChanged(vectorComponent, value) {
      try
      {
        switch(vectorComponent)
        {
          case "x": this.editComponent.SetStepX(value); break;
          case "y": this.editComponent.SetStepY(value); break;
          case "z": this.editComponent.SetStepZ(value); break;
          default: return;
        }

        this.m_HeightMapStep = this.editComponent.m_Step.clone();
      }
      catch(Exception) {}
    },
    regeneratePhys() {
      try
      {
        this.editComponent.regeneratePhys();
      }
      catch(Exception) {}
    },
    sizeChanged(value) {
      if(this.physicsComponent.m_BodySettings.Size === value && this.Size === value) return;

      this.physicsComponent.m_BodySettings.Size = value;
      this.physicsComponent.m_Args.BodySettings.Size = value;
      this.renderComponent.m_Args.Size = value;
      this.Size = value;

      if(this.m_RecreationTimer != void(0))
      {
        clearTimeout(this.m_RecreationTimer);
        this.m_RecreationTimer = null;
      }
      this.m_RecreationTimer = setTimeout(this.reCreateEntity.bind(this), 100);
    },
    divsChanged(value) {
      if(this.physicsComponent.m_BodySettings.Divisions === value && this.Divisions === value) return;
      
      const previous = this.physicsComponent.m_Args.BodySettings.Divisions;

      this.physicsComponent.m_BodySettings.Divisions = value;
      this.physicsComponent.m_Args.BodySettings.Divisions = value;
      this.renderComponent.m_Args.Divisions = value;
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

      if(this.m_RecreationTimer != void(0))
      {
        clearTimeout(this.m_RecreationTimer);
        this.m_RecreationTimer = null;
      }
      this.m_RecreationTimer = setTimeout(this.reCreateEntity.bind(this), 100);
    },
    reCreateEntity() {
      const debugComponent = this.physicsComponent.m_Parent.m_Components.DebugComponent;

      if(debugComponent != void(0)) debugComponent.Remove();
      this.renderComponent.Remove();
      this.physicsComponent.Remove();

      this.renderComponent.Initialise();
      setTimeout(() =>
      {
        this.physicsComponent.Initialise();
        this.physicsComponent.SetRotation(-Math.PI/2, 0, 0);

        if(debugComponent != void(0)) debugComponent.Initialise();
      }, 1000);
    }
  }
};

</script>

<style scoped>
  .vector-properties {
    display:flex;
    align-items:center;
    border-bottom: 1px solid #333;
  }
</style>