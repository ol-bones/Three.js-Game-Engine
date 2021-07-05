<template>
  <div class="col-xs-12 col-sm-12 col-md-12" v-if="this.entity">
    <div class="row fill" style="height:45%;" v-if="!this.isVegetation">
      <material-preview-component :entity="this.entity"
        v-if="this.entity && this.materialObject && this.materialObject.type === 'MeshPhongMaterial'"
      />
    </div>
    <div class="row fill" style="height:100%;overflow-y:scroll;">
      <div class="col-xs-12 col-sm-12 col-md-12" v-if="this.entity && this.isVegetation">
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
            Distribution
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <b-dropdown dropright block :text="this.vegetationDistribution" class="map-size-dropdown">
                <b-dropdown-item @click="distributionChanged(`uniform`)">
                  Uniform
                </b-dropdown-item>
                <b-dropdown-item @click="distributionChanged(`random`)">
                  Random
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill">
            Type
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <b-dropdown dropright block :text="this.vegetationType" class="map-size-dropdown">
                <b-dropdown-item @click="typeChanged(`lathe`)">
                  Lathe
                </b-dropdown-item>
                <b-dropdown-item @click="typeChanged(`obj`)">
                  OBJ
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
        <div class="row vector-properties" v-if="this.vegetationType === 'obj'">
          <div class="col-xs-2 col-sm-2 col-md-2 fill">
              <icon name="expand-arrows-alt" scale="1"/>
          </div> 
          <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
            <div class="row fill">
              <vector3-edit-component
                :vector="this.vegetationObjScale"
                v-on:changed="vegetationObjScaleChanged"/>
            </div>
          </div>
        </div>
        <div class="row vector-properties" v-if="this.vegetationType === 'obj'">
          <div class="col-xs-2 col-sm-2 col-md-2 fill">
            .obj
          </div> 
          <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
            <div class="row fill">
              <b-form-input v-model="renderComponent.m_Args.obj.model" placeholder="model"></b-form-input>
            </div>
          </div>
        </div>
        <div class="row vector-properties" v-if="this.vegetationType === 'obj'">
          <div class="col-xs-2 col-sm-2 col-md-2 fill">
            texture
          </div> 
          <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
            <div class="row fill">
              <b-form-input v-model="renderComponent.m_Args.obj.texture" placeholder="texture"></b-form-input>
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
import Vector3EditComponent from "./../Generic/Vector3EditComponent.vue";
import NumberEditComponent from "./../Generic/NumberEditComponent.vue";

export default {
  name: "RenderComponentPropertiesComponent",
  components: {
    MaterialPreviewComponent,
    Vector2EditComponent,
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
      flag: false,
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
      return this.renderComponent.m_Mesh == void(0) ? null : this.renderComponent.m_Mesh.material;
    },
    isVegetation() {
      return this.renderComponent
      && this.materialObject
      && this.materialObject.map.image.src.endsWith("/vegetationseed.jpg");
    },
    vegetationDistribution()
    {
      this.flag;
      return this.renderComponent.m_Args.distribution;
    },
    vegetationType()
    {
      this.flag;
      return Object.keys(this.renderComponent.m_Args).includes("lathe") ? "lathe" : "obj";
    },
    vegetationObjScale()
    {
      this.flag;
      return this.vegetationType === "obj" ? 
        new THREE.Vector3(
          this.renderComponent.m_Args.obj.scale.x,
          this.renderComponent.m_Args.obj.scale.y,
          this.renderComponent.m_Args.obj.scale.z
        ) : new THREE.Vector3();
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
    },
    distributionChanged(value)
    {
      try
      {
        if(!this.isVegetation || value == void(0) || value.length < 3) return;

        this.renderComponent.m_Args.distribution = value;
        this.flag = !this.flag;
      } catch(e) {}
    },
    typeChanged(value)
    {
      try
      {
        if(!this.isVegetation || value == void(0) || value.length < 3) return;
        if(this.vegetationType === value) return;

        if(value === "lathe")
        {
          if(this.vegetationType === "obj") delete this.renderComponent.m_Args.obj;
          this.renderComponent.m_Args.lathe = {
            heightSegments: 1,
            vegHeight: 25,
            vegWidth: 8.5
          };
        }
        else if(value === "obj")
        {
          if(this.vegetationType === "lathe") delete this.renderComponent.m_Args.lathe;
          this.renderComponent.m_Args.obj = {
            model: "tree_swamp_A_leaves.obj",
            texture:  "/tree_swamp_A_leaves_texture.png",
            scale: {x: 1, y: 1, z: 1}
          };
        }

        this.flag = !this.flag;
      } catch(e){}
    },
    vegetationObjScaleChanged(vectorComponent, value) {
      try
      {
        switch(vectorComponent)
        {
          case "x": this.renderComponent.m_Args.obj.scale.x = value; break;
          case "y": this.renderComponent.m_Args.obj.scale.y = value; break;
          case "z": this.renderComponent.m_Args.obj.scale.z = value; break;
          default: return;
        }

        this.flag = !this.flag;
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

<style>

  .map-size-dropdown > .dropdown-menu {
    background-color: #222 !important;
    color: white !important;
    max-height: 25vh;

    overflow-y: scroll;
    box-shadow: 0px 0px 0.25vh 0.25vh #333;
    border-color: #333;
  }

  .map-size-dropdown > * > .dropdown-item {
    background-color: #222 !important;
    color: white !important;
  }
</style>