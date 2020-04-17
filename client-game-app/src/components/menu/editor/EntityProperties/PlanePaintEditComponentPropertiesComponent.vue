<template>
  <div class="col-xs-12 col-sm-12 col-md-12" style="padding-top:15%;"
  v-if="this.editComponent">
    <div class="row vector-properties">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="expand-arrows-alt" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill">
        <b-dropdown dropright block :text="this.blendMapSizeString" class="map-size-dropdown">
          <b-dropdown-item v-for="(row, rowIndex) in this.m_MapSizes" :key='rowIndex'
          @click="sizeChanged(row.x, row.y)">
            {{row.x}}x{{row.y}}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12">
      <div class="row material-properties">
        <div class="col-xs-8 col-sm-8 col-md-8 fill" style="font-size: 12px;">
          Paint Strength
        </div> 
        <div class="col-xs-4 col-sm-4 col-md-4 fill number-entry">
          <div class="row fill">
            <number-edit-component
              :value="paintStrength"
              v-on:changed="strengthChanged"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Vector2EditComponent from "./../Generic/Vector2EditComponent.vue";
import NumberEditComponent from "./../Generic/NumberEditComponent.vue";

export default {
  name: "PlanePaintEditComponentPropertiesComponent",
  components: {
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
      m_MapSizes: [],
      reactFlag: false
    }
  },
  created() {
  },
  mounted() {
    this.m_MapSizes = new Array(11).fill(0).map((_, i) => new THREE.Vector2(2**i, 2**i));
  },
  computed: {
    renderComponent() {
        this.reactFlag;
      return this.entity.m_Components.RenderComponent;
    },
    editComponent() {
        this.reactFlag;
      return this.entity.m_Components.PlanePaintEditComponent;
    },
    paintStrength() {
      try
      {
        this.reactFlag;
        return this.editComponent.m_PaintStrength;
      } catch(e) { return 0; }
    },
    blendMapArgRef() {
        this.reactFlag;
      return this.renderComponent.m_Args.material.blendmap;
    },
    blendMapUniformRef() {
      return this.renderComponent.m_Mesh.material.uniforms.blendmap.value;
    },
    blendMapSize() {
      try
      {
        this.reactFlag;
        return new THREE.Vector2(
          this.blendMapArgRef.length,
          this.blendMapArgRef[0].length
        )
      } catch(e) { return new THREE.Vector2(); }
    },
    blendMapSizeString() {
      try
      {
        this.reactFlag;
        return `${this.blendMapSize.x}x${this.blendMapSize.y}`;
      } catch(e) { return "0x0"; } 
    }
  },
  methods: {
    sizeChanged(x,y) {
      try
      {
        let targetSize = new THREE.Vector2(x,y);
        if(targetSize.x > this.blendMapSize.x && targetSize.y > this.blendMapSize.y)
        {
          this.renderComponent.m_Args.material.blendmap = this.blendMapArgRef
            .concat(new Array(targetSize.x - this.blendMapSize.x).fill(new Array(targetSize.y).fill(0)))
            .map(r => r.concat(new Array(targetSize.y - r.length).fill(0))
          );
        }
        else if(targetSize.x < this.blendMapSize.x && targetSize.y < this.blendMapSize.y)
        {
          this.renderComponent.m_Args.material.blendmap = this.renderComponent.m_Args.material.blendmap
            .slice(0, targetSize.y)
            .map(r => r.slice(0, targetSize.y));
        } else { return; }

        this.renderComponent.m_Mesh.material.uniforms.blendmap.value.needsUpdate = true;
        this.renderComponent.m_Mesh.material.uniformsNeedUpdate = true;

        this.editComponent.UpdateMaterial();
        this.editComponent.DeleteBlendMapMesh();
        this.editComponent.AddBlendMapMeshToEditorScene(
          this.editComponent.CreateBlendMapMesh(targetSize.x, targetSize.y)
        );

        this.reactFlag = !this.reactFlag;
      }
      catch(Exception) { console.log(Exception); }
    },
    strengthChanged(value) {
      try
      {
        this.editComponent.m_PaintStrength = value;
      }
      catch(Exception) { console.log(Exception); }
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