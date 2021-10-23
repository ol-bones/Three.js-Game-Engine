<template>
  <div class="row entity-tree-container fill">
    <div class="col-xs-12 col-sm-12 col-md-12 entity-tree-inner-container">
      <q-tree
        :nodes="GetEntities"
        node-key="label"
        v-model:selected="selected"
        v-model:expanded="expanded"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center q-gutter-sm q-tree-tree-slot-1"
            @mouseover="onMouseOver(prop.node.id)"
            @click="entitySelected(prop.node.id)">
            <q-icon
              :name="prop.node.icon || 'share'"
              :color="prop.node.iconColor || 'grey'"
              class="q-mr-sm"
            />
            <div class="text-weight-bold text-primary text-white entity-properties-label">
              {{ prop.node.label }}
            </div>
          </div>
        </template>
      </q-tree>
    </div>
  </div>
</template>

<script>

import { ref } from 'vue'
import EntityTreeEntryComponent from "./EntityTreeEntryComponent";

export default {
  name: "EntityTreeComponent",
  components: {
    EntityTreeEntryComponent
  },
  data() {
    return {
      expanded: ref(),
      selected: ref(),
      EntityTree: [],
      ticker: 0
    }
  },
  created() {
  },
  mounted() {
    setInterval(() => {
      this.ticker = Date.now();
      this.$forceUpdate();
    }, 250);
  },
  computed:
  {
    GetEntities:
    {
      cache: false,
      get: function() {
        let x = this.ticker;
        try
        {
          const firstEntity = ENGINE.m_World.m_Entities[0];

          const entData = firstEntity.GetSavableData();

          const HasComponent = (entity, name) => {
            return entity.components.find(c => c.name === name);
          }
          
          const GetDisplayInfo = (entity) =>
          {
            if(HasComponent(entity, "VegetationMeshRenderComponent"))
            {
                return {name: "Vegetation", icon: "local_florist"};
            }
            if(HasComponent(entity, "WorldPieceComponent"))
            {
                return {name: "WorldPiece", icon: "public"};
            }
            if(HasComponent(entity, "FPSPlayerControl"))
            {
                return {name: "LocalPlayer", icon: "person"};
            }
            if(HasComponent(entity, "TriggerComponent"))
            {
                return {name: "Trigger", icon: "notification_important"};
            }
            if(HasComponent(entity, "HeightmapPhysicsComponent"))
            {
                return {name: "Height Map Terrain", icon: "grid_4x4"};
            }
            if(HasComponent(entity, "PointLightComponent"))
            {
                return {name: "Point Light", icon: "wb_twilight"};
            }
            if(HasComponent(entity, "SlidingDoorComponent"))
            {
                return {name: "Sliding Door", icon: "door_sliding"};
            }
            if(HasComponent(entity, "BasicNodeComponent"))
            {
                return {name: "Basic Node", icon: "traffic"};
            }
            if(HasComponent(entity, "BasicTrainComponent"))
            {
                return {name: "Basic Train", icon: "train"};
            }
            return {name: "Entity", icon:"settings"};
          }


          const mapEntitiesToChildren = (ent) => {
            if(EDITOR.m_SelectedEntity?.m_ID === ent.id)
            {
              ent.iconColor = "red";
            }

            ent.children = ent.entities;
            const displayInfo = GetDisplayInfo(ent);
            ent.label = `${displayInfo.name} (${ent.id})`;
            ent.icon = displayInfo.icon;
            ent.entities.forEach(mapEntitiesToChildren);
          };

          mapEntitiesToChildren(entData);

          return [entData];
        }
        catch(e) { return []; }
      }
    }
  },
  methods: {
    entitySelected(id)
    {
      const targetEntity = entities().find(e => e.m_ID === Number(id));
      this.$emit("entitySelected", targetEntity);
    },
    onMouseOver(id)
    {
      const targetEntity = entities().find(e => e.m_ID === Number(id));

      if(targetEntity == void(0)) return;

	    entities().forEach((entity) =>
	    {
        if(entity.m_Renderable && entity.m_Components.RenderComponent && entity.m_Components.RenderComponent.m_Meshes)
        {
            entity.m_Components.RenderComponent.Unhighlight();
        }
	    });

      if(targetEntity.m_Renderable && targetEntity.m_Components.RenderComponent && targetEntity.m_Components.RenderComponent.m_Meshes)
      {
        targetEntity.m_Components.RenderComponent.Highlight();
      }
    }
  }
};
</script>

<style scoped>
  .entity-tree-container {
    width: 100%;
    height:100% !important;
    max-height: 100% !important;
    background-color: #333;

    margin: 0;
  }

  .entity-tree-container > ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  .entity-tree-inner-container {
    overflow: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    background-color: #222;
    padding-left: 5%;
    -webkit-box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
    -moz-box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
    box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
  }

  .entity-tree-inner-container > ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  .entity-properties-label:hover {
    color: red !important;
  }

</style>