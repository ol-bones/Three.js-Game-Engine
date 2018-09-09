<template>
  <div class="col-xs-12 col-sm-12 col-md-12">
    <div class="row vector-properties">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="arrows-alt" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <vector3-edit-component
            :vector="this.entity.m_Position"
            v-on:changed="positionChanged"
          />
        </div>
      </div>
    </div>
    <div class="row vector-properties">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="sync" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <vector3-edit-component
            :vector="{
              x: this.entity.m_Rotation.x * (180 / Math.PI),
              y: this.entity.m_Rotation.y * (180 / Math.PI),
              z: this.entity.m_Rotation.z * (180 / Math.PI),
            }"
            v-on:changed="rotationChanged"
          />
        </div>
      </div>
    </div>
    <div class="row vector-properties">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="expand-arrows-alt" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <vector3-edit-component
            :vector="this.entity.m_Scale"
            v-on:changed="scaleChanged"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Vector3EditComponent from "./../Generic/Vector3EditComponent.vue";

export default {
  name: "GeneralPropertiesComponent",
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
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    positionChanged(vectorComponent, value) {
      try
      {
        switch(vectorComponent)
        {
          case "x": this.entity.SetPositionX(value); break;
          case "y": this.entity.SetPositionY(value); break;
          case "z": this.entity.SetPositionZ(value); break;
          default: return;
        }
      }
      catch(Exception) {}
    },
    rotationChanged(vectorComponent, value) {
      try
      {
        switch(vectorComponent)
        {
          case "x": this.entity.SetRotationX(value * (Math.PI/180)); break;
          case "y": this.entity.SetRotationY(value * (Math.PI/180)); break;
          case "z": this.entity.SetRotationZ(value * (Math.PI/180)); break;
          default: return;
        }
      }
      catch(Exception) {}
    },
    scaleChanged(vectorComponent, value) {
      try
      {
        switch(vectorComponent)
        {
          case "x": this.entity.SetScaleX(value); break;
          case "y": this.entity.SetScaleY(value); break;
          case "z": this.entity.SetScaleZ(value); break;
          default: return;
        }
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