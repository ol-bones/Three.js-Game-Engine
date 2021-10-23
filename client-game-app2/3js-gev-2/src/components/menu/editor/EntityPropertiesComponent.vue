<template>
  <div class="row entity-properties-container fill" v-if="entity">
    <div class="col-xs-12 col-sm-12 col-md-12 entity-properties-inner-container">
      <div class="row">
        <q-card style="width:100%;">
          <q-tabs
            v-model="tab"
            dense
            class="bg-grey-3 text-grey-7"
            active-color="primary"
            indicator-color="purple"
            align="justify"
          >
            <q-tab name="General">
                <q-icon
                  name="settings"
                  :color="'grey'"
                  class="q-mr-sm"
                />
            </q-tab>
            
            <q-tab
              v-for="(component, index) in entity.m_Components" :key='index'
              :name="component.m_Name">
                <q-icon
                  :name="ComponentIcon(component) || 'settings'"
                  :color="'grey'"
                  class="q-mr-sm"
                />
            </q-tab>
          </q-tabs>

          <q-separator></q-separator>

          <q-tab-panels v-model="tab" animated class="bg-primary text-white">

            <q-tab-panel name="General">
                <div class="text-h6">Mails</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel
              v-for="(component, index) in entity.m_Components" :key='index'
              :name="component.m_Name">
                <div class="text-h6">Mails</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>

import GeneralPropertiesComponent from "./EntityProperties/GeneralPropertiesComponent";
import RenderComponentPropertiesComponent from "./EntityProperties/RenderComponentPropertiesComponent";
import PhysicsComponentPropertiesComponent from "./EntityProperties/PhysicsComponentPropertiesComponent";
import HeightMapEditComponentPropertiesComponent from "./EntityProperties/HeightMapEditComponentPropertiesComponent";
import PlanePaintEditComponentPropertiesComponent from "./EntityProperties/PlanePaintEditComponentPropertiesComponent";

import { ref } from 'vue'

export default {
  name: "EntityPropertiesComponent",
  components: {
    GeneralPropertiesComponent,
    RenderComponentPropertiesComponent,
    PhysicsComponentPropertiesComponent,
    HeightMapEditComponentPropertiesComponent,
    PlanePaintEditComponentPropertiesComponent
  },
  props: {
    entity: {
      type: Object,
      required: false
    }
  },
  watch: {
    entity: {
      immediate: true,
      handler(changed, previous) {
        this.tab = ref("General");
      }
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
      tab: ref("General"),
      showPropertiesContext: false,
      propertiesContextClickPos: {x: 0, y: 0},
      propertiesContextSelectedComponent: String(""),
      propertiesContextDummyObject: false,
      addComponentsListHovered: false,
      componentsListHovered: false

    }
  },
  setup(props) {

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
      console.error(component.m_Name)
      switch(component.m_Name)
      {
        case "WorldPieceComponent": return "public";
        case "FPSPlayerControl": return "person";
        case "TriggerComponent": return "notification_important";
        case "RenderComponent": return "extension";
        case "PhysicsComponent": return "format_shapes";
        case "LightComponent": return "wb_twilight";
        default: return "settings";
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
    margin-left: 0;
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
    margin-left: 0;
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