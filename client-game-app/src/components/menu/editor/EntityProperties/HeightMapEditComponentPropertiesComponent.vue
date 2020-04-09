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
  </div>
</template>

<script>

import Vector3EditComponent from "./../Generic/Vector3EditComponent.vue";

export default {
  name: "HeightMapEditComponentPropertiesComponent",
  components: {
    Vector3EditComponent
  },
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      m_HeightMapStep: new THREE.Vector3(0, 0, 1)
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
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