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
      Size: 0
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
      console.log(value);
    },
    divsChanged(value) {
      console.log(value);
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