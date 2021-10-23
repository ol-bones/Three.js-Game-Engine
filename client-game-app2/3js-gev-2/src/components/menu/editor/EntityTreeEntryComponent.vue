<template>
  <div class="entity-tree-entry">
    
    <div class="q-pa-md q-gutter-sm">
      <q-tree
        :nodes="entity"
        accordion
        node-key="GetDisplayInfo().name"
        v-model:expanded="expanded"
      />
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
    /*
    <div class="entity-tree-entry-info" v-on:mouseover="onHover" v-on:click="onSelect" @contextmenu.prevent="context_show">
      {{this.GetDisplayInfo().name}}
      <span class="entity-tree-expand" v-on:click="expandChildren" v-show="!this.expanded && this.entity.m_Entities.length > 0">[+]</span>
      <span class="entity-tree-collapse" v-on:click="expandChildren" v-show="this.expanded && this.entity.m_Entities.length > 0">[-]</span>
      <b-dropdown ref="ddown" size="lg" variant="link" toggle-class="text-decoration-none" no-caret lazy class="entity-context-menu">
        <b-dropdown-header>
          Entity {{this.entity.m_ID}}
        </b-dropdown-header>
        <b-dropdown-item>Save</b-dropdown-item>
        <b-dropdown-item @click="CopyEntityData">Copy Data</b-dropdown-item>
        <b-dropdown-item @click="DeleteSelectedEntity">Delete</b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="entity-tree-entry-children" v-if="expanded">
      <div v-for="(entity, index) in this.entity.m_Entities" :key='index'>
        <entity-tree-entry-component
          :entity="entity"
          :depth="1"
          v-on:entitySelected="entitySelected"
        />
      </div>
      */
  },
  methods: {
    CopyEntityData() {
      navigator.clipboard.writeText(JSON.stringify(this.entity.DataModel().ToJSON())).then(this.context_hide.bind(this));
    },
    DeleteSelectedEntity() {
      try
      {
        this.$refs.ddown.visible = false;
        EDITOR.DeleteEntity(this.entity.m_ID);
      } catch(e) {}
    },
    context_show() {
      this.$refs.ddown.visible = true;
    },
    context_hide() {
      this.$refs.ddown.visible = false;
    },
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

  .entity-context-menu > .dropdown-menu {
    background: #2a2a2a;
    color: white;
  }

  .entity-context-menu > * > .dropdown-header {
    background: #2a2a2a;
    color: #444;
    outline: none;
  }

  .entity-context-menu > * > .dropdown-item {
    background: #2a2a2a;
    color: white;
    outline: none;
  }

  .entity-context-menu > * > .dropdown-item:hover {
    background: #2a2a2a;
    color: white;
    outline: none;
    font-weight: bolder;
  }
</style>

<style>

  .entity-context-menu > .dropdown-menu {
    background: #2a2a2a;
    color: white;
  }
</style>