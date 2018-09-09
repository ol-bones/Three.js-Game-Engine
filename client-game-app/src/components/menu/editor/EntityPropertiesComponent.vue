<template>
  <div class="row entity-properties-container fill" v-if="this.entity">
    <div class="col-xs-12 col-sm-12 col-md-12 entity-properties-inner-container">
      <div class="row properties-tabs-row">
        <div v-bind:class="componentButtonClassList"
             v-b-tooltip.hover.topright title="General Properties"
             v-on:click="tabSelect('General')">
          <icon name="bars" scale="1"/>
        </div>
        <div 
        v-bind:class="componentButtonClassList"
        v-for="(component, index) in this.entity.m_Components" :key='index'
        v-b-tooltip.hover.topright :title="component.m_Name + ' Properties'"
        v-on:click="tabSelect(component.m_Name)">
          <icon :name="ComponentIcon(component)" scale="1"></icon>  
        </div>
      </div>
      <div class="row properties-options-row" id="properties-panel">
        <general-properties-component
          v-show="tabSelected === 'General'"
          :entity="this.entity"
        />
        <render-component-properties-component
          v-show="tabSelected === 'RenderComponent'"
          :entity="this.entity"
        />
      </div>
    </div>  
  </div>
</template>

<script>

import GeneralPropertiesComponent from "./EntityProperties/GeneralPropertiesComponent";
import RenderComponentPropertiesComponent from "./EntityProperties/RenderComponentPropertiesComponent";

export default {
  name: "EntityPropertiesComponent",
  components: {
    GeneralPropertiesComponent,
    RenderComponentPropertiesComponent
  },
  props: {
    entity: {
      type: Object,
      required: false
    }
  },
  computed: {
    componentButtonClassList() {
      let count = 12/(Object.keys(this.entity.m_Components).length + 1);
      return String(`properties-tabs-button
        col-xs-${count}
        col-sm-${count}
        col-md-${count}`
      );
    }
  },
  data() {
    return {
      tabSelected: "General"
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    tabSelect(tab) {
      this.tabSelected = tab;
    },
    ComponentIcon(component)
    {
      switch(component.m_Name)
      {
        case "WorldPieceComponent": return "puzzle-piece";
        case "WASDPlayerControlComponent": return "male";
        case "TriggerComponent": return "bolt";
        case "RenderComponent": return "draw-polygon";
        case "PhysicsComponent": return "magnet"
        default: return "cog";
      }
    }
  }
};
</script>

<style scoped>
  .entity-properties-container {
    width: 100%;
    height:100%;
    background-color: red;
  }

  .entity-properties-container > ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  .entity-properties-inner-container {
    overflow: scroll;
    width: 100%;
    height: 100%;
    background-color: #222;
    -webkit-box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
    -moz-box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
    box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
  }

  .entity-properties-inner-container > ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  .properties-tabs-row {
    height: 7.5%;
    background-color: green;
  }

  .properties-tabs-button {
    height: 100%;
    background-color: #333;
    border: 1px solid #444;
  }

  .properties-tabs-button:hover {
    height: 100%;
    background-color: #444;
    border: 1px solid #333;
  }

  .properties-options-row {
    padding-top: 5%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>