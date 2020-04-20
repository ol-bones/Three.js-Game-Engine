<template>
  <div class="col-xs-12 col-sm-12 col-md-12" v-if="this.entity">
    <div class="row fill" style="height:45%;" v-if="!this.isVegetation">
      <material-preview-component :entity="this.entity"
        v-if="this.entity && this.materialObject && this.materialObject.type === 'MeshPhongMaterial'"
      />
    </div>
    <div class="row fill" style="height:100%;overflow-y:scroll;">
      <div class="col-xs-12 col-sm-12 col-md-12"
      v-if="this.entity && this.isVegetation">
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill">
            Count
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.renderComponent.m_Args.count"
                v-on:changed="vegetationCountChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill">
            Repeat
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <vector2-edit-component
                :vector="this.repeatReference"
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
import NumberEditComponent from "./../Generic/NumberEditComponent.vue";

export default {
  name: "RenderComponentPropertiesComponent",
  components: {
    MaterialPreviewComponent,
    Vector2EditComponent,
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
    },
    isVegetation() {
      return this.renderComponent
      && this.materialObject
      && this.materialObject.map.image.src.endsWith("/vegetationseed.jpg");
    },
    repeatReference() {
      if(this.isVegetation)
      {
        return new THREE.Vector2(
          this.renderComponent.m_Args.material.repeat[0],
          this.renderComponent.m_Args.material.repeat[1]
        )
      }
      else if(this.materialObject.map != void(0)
      && this.materialObject.map.value.repeat != void(0))
      {
        return this.materialObject.map.value.repeat;
      }
      else if(this.materialObject.uniforms != void(0)
      && this.materialObject.uniforms.map.value != void(0)
      && this.materialObject.uniforms.map2.value != void(0))
      {
        return this.materialObject.uniforms.repeat.value;
      }
    }
  },
  methods: {
    repeatChanged(component, value)
    {
      this.repeat[component] = value;

      if(this.isVegetation)
      {
        this.renderComponent.m_Args.material.repeat[0] = this.repeat.x;
        this.renderComponent.m_Args.material.repeat[1] = this.repeat.y;
      }
      else if(this.materialObject.map != void(0)
      && this.materialObject.map.value.repeat != void(0))
      {
        this.materialObject.map.value.repeat.set(
          this.repeat.x, this.repeat.y
        );

        if(this.repeat.x > 1 || this.repeat.y > 1)
        {
          this.materialObject.map.value.wrapS = THREE.RepeatWrapping;
          this.materialObject.map.value.wrapT = THREE.RepeatWrapping;
        }
      }
      else if(this.materialObject.uniforms != void(0)
      && this.materialObject.uniforms.map.value != void(0)
      && this.materialObject.uniforms.map2.value != void(0))
      {
        this.materialObject.uniforms.repeat.value.set(
          this.repeat.x, this.repeat.y
        );
      }
      
      this.materialPropertyChanged();
    },
    materialPropertyChanged()
    {
      if(this.isVegetation) return;

      if(this.materialObject.map != void(0))
      {
        this.materialObject.map.value.needsUpdate = true;
      }
      else if(this.materialObject.uniforms != void(0))
      {
        this.materialObject.uniforms.map.value.needsUpdate = true;
        this.materialObject.uniforms.map2.value.needsUpdate = true;
      }

      this.materialObject.needsUpdate = true;
			this.materialObject.uniformsNeedUpdate = true;

      this.renderComponent.m_Args.material = this.renderComponent.InlineMaterialArgs();
    },
    vegetationCountChanged(value)
    {
      try
      {
        if(!this.isVegetation || value == void(0) || value < 1) return;

        this.renderComponent.m_Args.count = value;
      } catch(e) {}
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