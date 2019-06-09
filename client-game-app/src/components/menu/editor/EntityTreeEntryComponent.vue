<template>
  <div class="entity-tree-entry" :style="style">
    <div class="entity-tree-entry-info" v-on:mouseover="onHover" v-on:click="onSelect">
      {{this.GetDisplayInfo().name}}
      <span class="entity-tree-expand" v-on:click="expandChildren" v-show="!this.expanded && this.entity.m_Entities.length > 0">[+]</span>
      <span class="entity-tree-collapse" v-on:click="expandChildren" v-show="this.expanded && this.entity.m_Entities.length > 0">[-]</span>
    </div>
    <div class="entity-tree-entry-children" v-if="expanded">
      <div v-for="(entity, index) in this.entity.m_Entities" :key='index'>
        <entity-tree-entry-component
          :entity="entity"
          :depth="1"
          v-on:entitySelected="entitySelected"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "EntityTreeEntryComponent",
  components: {
  },
  props: {
    entity: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  computed: {
    style () {
      return `margin-left: ${this.depth*50}px`;
    }
  },
  data() {
    return {
      expanded: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onHover() {
	    entities().forEach((entity) =>
	    {
        if(entity.m_Renderable && entity.m_Components.RenderComponent && entity.m_Components.RenderComponent.m_Meshes)
        {
            entity.m_Components.RenderComponent.Unhighlight();
        }
	    });

      if(this.entity.m_Renderable && this.entity.m_Components.RenderComponent && this.entity.m_Components.RenderComponent.m_Meshes)
      {
        this.entity.m_Components.RenderComponent.Highlight();
      }
    },
    onSelect(entity) {
      this.$emit("entitySelected", this.entity);
    },
    entitySelected(entity) { this.$emit("entitySelected", entity); },
    expandChildren() {
      this.expanded = !this.expanded;
    },
    GetDisplayInfo()
    {
      if(this.HasComponent("WorldPieceComponent"))
      {
          return {name: "WorldPiece", icon: "glyphicon-globe"};
      }
      if(this.HasComponent("WASDPlayerControlComponent"))
      {
          return {name: "LocalPlayer", icon: "glyphicon-user"};
      }
      if(this.HasComponent("TriggerComponent"))
      {
          return {name: "Trigger", icon: "glyphicon-text-width"};
      }
      return {name: "Entity", icon:"glyphicon-cog"};
    },
    HasComponent(name) {
      return Object.keys(this.entity.m_Components).find(c => c === name);
    }
  }
};
</script>

<style scoped>
  .entity-tree-container {
    width: 100%;
    height:100%;
    
    background-color: #222;
  }

  .entity-tree-entry-info {
    white-space: nowrap;
   -moz-user-select: none;
   -khtml-user-select: none;
   -webkit-user-select: none;
   -ms-user-select: none;
   user-select: none;
  }
</style>