<template>
  <div class="entity-tree-entry" :style="style">
    <div class="entity-tree-entry-info" v-on:click="onClick">
      {{this.GetDisplayInfo().name}}
    </div>
    <div class="entity-tree-entry-children" v-if="expanded">
      <div v-for="(entity, index) in this.entity.m_Entities" :key='index'>
        <entity-tree-entry-component
          :entity="entity"
          :depth="1"   
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
    onClick() {
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
  }
</style>