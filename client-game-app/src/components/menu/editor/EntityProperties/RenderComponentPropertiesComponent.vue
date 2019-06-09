<template>
  <div class="col-xs-12 col-sm-12 col-md-12"
  v-if="this.entity">
    <div class="row fill" style="height:45%;">
      <material-preview-component :entity="this.entity"/>
    </div>
    <div class="row fill" style="height:100%;overflow-y:scroll;">
  <div class="col-xs-12 col-sm-12 col-md-12">
      <div class="row material-properties">
        <div class="col-xs-4 col-sm-4 col-md-4 fill">
          Repeat
        </div> 
        <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
          <div class="row fill">
            <vector2-edit-component
              :vector="this.materialObject.map.repeat"
              v-on:changed="repeatChanged"/>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>

import MaterialPreviewComponent from "./../Generic/MaterialPreviewComponent";
import Vector2EditComponent from "./../Generic/Vector2EditComponent.vue";

export default {
  name: "RenderComponentPropertiesComponent",
  components: {
    MaterialPreviewComponent,
    Vector2EditComponent
  },
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      repeat: new THREE.Vector2(0,0)
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
    renderComponent() {
      return this.$props.entity.m_Components.RenderComponent;
    },
    materialObject() {
      return this.renderComponent.m_Mesh.material;
    }
  },
  methods: {
    repeatChanged(component, value)
    {
      this.repeat[component] = value;

      this.materialObject.map.repeat.set(
        this.repeat.x, this.repeat.y
      );

      if(this.repeat.x > 1 || this.repeat.y > 1)
      {
        this.materialObject.map.wrapS = THREE.RepeatWrapping;
        this.materialObject.map.wrapT = THREE.RepeatWrapping;
      }

      this.materialPropertyChanged();
    },
    materialPropertyChanged()
    {
      this.materialObject.map.needsUpdate = true;
      this.materialObject.needsUpdate = true;

      this.renderComponent.m_Args.material = this.renderComponent.InlineMaterialArgs();
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