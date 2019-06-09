<template>
  <div class="row entity-properties-container fill" v-if="this.entity">
    <div class="col-xs-12 col-sm-12 col-md-12 entity-properties-inner-container">
      <div class="row properties-tabs-row"
        @contextmenu.prevent="propertiesRightClick">
        <div v-bind:class="componentButtonClassList"
             v-b-tooltip.hover.topright title="General Properties"
             v-on:click="tabSelect('General')">
          <icon style="pointer-events: none;" name="bars" scale="1"/>
        </div>
        <div 
          v-bind:class="componentButtonClassList"
          v-for="(component, index) in this.entity.m_Components" :key='index'
          v-b-tooltip.hover.topright :title="component.m_Name + ' Properties'"
          v-on:click="tabSelect(component.m_Name)">
          <icon style="pointer-events: none;" :name="ComponentIcon(component)" scale="1"></icon>  
        </div>
      </div>
      <div class="properties-context col"
        v-if="showPropertiesContext"
        v-on:mouseleave="showPropertiesContext = false"
        v-bind:style="propertesContextStyle">
        <div class="properties-context-row row"
          @click="removeComponent">
          <div class="col-xs-12 col-sm-12 col-md-12">
            Remove
          </div>
        </div>
        <div class="properties-context-row row">
          <div class="col-xs-6 col-sm-6 col-md-6">
            <div style="float:left;"
            v-on:mouseover="addComponentsListHovered = true">
              Add
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6">
            <icon style="float:right;transform:translateY(20%);" name="caret-right" scale="1"/>
          </div>
        </div>
        <div class="componentsList"
          v-on:mouseover="componentsListHovered = true"
          v-if="showComponentsList">
          <div class="col-xs-12 col-sm-12 col-md-12 fill"
            v-for="(component, componentIndex) in componentTypes" :key="componentIndex">
              {{component.name}}
          </div>
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
        <physics-component-properties-component
          v-show="tabSelected === 'PhysicsComponent'"
          :entity="this.entity"
        />
      </div>
    </div>  
  </div>
</template>

<script>

import GeneralPropertiesComponent from "./EntityProperties/GeneralPropertiesComponent";
import RenderComponentPropertiesComponent from "./EntityProperties/RenderComponentPropertiesComponent";
import PhysicsComponentPropertiesComponent from "./EntityProperties/PhysicsComponentPropertiesComponent";

export default {
  name: "EntityPropertiesComponent",
  components: {
    GeneralPropertiesComponent,
    RenderComponentPropertiesComponent,
    PhysicsComponentPropertiesComponent
  },
  props: {
    entity: {
      type: Object,
      required: false
    }
  },
  computed: {
    componentButtonClassList() {
      this.propertiesContextDummyObject;
      let count = 12/(Object.keys(this.entity.m_Components).length + 1);
      return String(`properties-tabs-button
        col-xs-${count}
        col-sm-${count}
        col-md-${count}`
      );
    },
    propertesContextStyle() {
      return {
        left: String(`${this.propertiesContextClickPos.x-10}px`),
        top: String(`${this.propertiesContextClickPos.y-10}px`),
      }
    },
    componentTypes() { return ComponentTypes || []; },
    showComponentsList() { return this.componentsListHovered || this.addComponentsListHovered; }
  },
  data() {
    return {
      tabSelected: "General",
      showPropertiesContext: false,
      propertiesContextClickPos: {x: 0, y: 0},
      propertiesContextSelectedComponent: String(""),
      propertiesContextDummyObject: false,
      addComponentsListHovered: false,
      componentsListHovered: false

    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    removeComponent(event) {
      this.entity.RemoveComponent(this.propertiesContextSelectedComponent);
      this.propertiesContextDummyObject = !this.propertiesContextDummyObject;
    },
    tabSelect(tab) {
      this.tabSelected = tab;
    },
    propertiesRightClick(event) {
      this.propertiesContextSelectedComponent = event.target.dataset.originalTitle.replace(" Properties","");
      this.showPropertiesContext = true;
      this.propertiesContextClickPos.x = event.clientX;
      this.propertiesContextClickPos.y = event.clientY;
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

  .properties-context {
    position: fixed;
    width: fit-content;
    height: fit-content;
    z-index: 99999;
    background-image: linear-gradient(#222, #2e2e2e);
    border: 1px solid #222;
    -webkit-box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.75);
  }

  .properties-context-row {
    padding: 2.5%;
  }

  .properties-context-row:hover {
    padding: 2.5%;
    background-image: linear-gradient(#333, #3e3e3e);
  }

  .componentsList {
    position:absolute;
    z-index: 99999;
    transform:translate(85%, -50%);
    width: 100%;
    height: 300%;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: red;
    color: white;
  }
</style>