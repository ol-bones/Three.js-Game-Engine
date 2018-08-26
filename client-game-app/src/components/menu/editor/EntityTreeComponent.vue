<template>
  <div class="row entity-tree-container fill">
    <div class="col-xs-12 col-sm-12 col-md-12 entity-tree-inner-container">
      <div class="row" v-for="(entity, index) in EntityTree" :key='index'>
        <entity-tree-entry-component
          :entity="entity"
          :depth="0"  
        />
      </div>
    </div>
  </div>
</template>

<script>

import EntityTreeEntryComponent from "./EntityTreeEntryComponent";

export default {
  name: "EntityTreeComponent",
  components: {
    EntityTreeEntryComponent
  },
  data() {
    return {
      EntityTree: []
    }
  },
  created() {
  },
  mounted() {
    setTimeout(() => this.updateEntityTree(), 250);
  },
  methods: {
    updateEntityTree() {
      this.EntityTree = ENGINE.m_World.m_Entities;
    }
  }
};
</script>

<style scoped>
  .entity-tree-container {
    width: 100%;
    height:100%;
    background-color: #333;
  }

  .entity-tree-container > ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  .entity-tree-inner-container {
    overflow: scroll;
    width: 100%;
    height: 50%;
    background-color: #222;
    padding-left: 15%;
    -webkit-box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
    -moz-box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
    box-shadow: inset 0px -59px 79px -33px rgba(0,0,0,0.5);
  }

  .entity-tree-inner-container > ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
</style>