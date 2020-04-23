<template>
  <div class="col-xs-12 col-sm-12 col-md-12 entity-select-container">
    <div class="entity-group"
      v-for="(group, groupIndex) in EntityGroups" :key="groupIndex">
      <button
        @click="group.show = !group.show"
        class="entity-group-accordion-btn btn-block">
          {{group.name}}
      </button>
      <b-collapse v-model="group.show" :id="`${group.name}-collapse`">
        <div class="row fill">
          <div class="col-xs-6 col-sm-6 col-md-6 fill" style="overflow:hidden;"
            v-for="(entity, entityIndex) in group.entities" :key="entityIndex">
            <entity-tile-component :entityType="entity.name" :entityJson="entity.json"/>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import EntityTileComponent from "./EntityTileComponent";

export default {
  name: "EntitySelectComponent",
  components: {
    EntityTileComponent
  },
  data() {
    return {
      showCollapse: false,
      EntityGroups: []
    }
  },
  mounted() {
    try
    {

      axios.get(`http://${CONFIG.host}/entityCategories`)
        .then(response => this.EntityGroups = response.data.map(
          group => ({
            name: group,
            show: false,
            entities: []
          })
        ))
        .then(() => {
          this.EntityGroups[0].show = true;
          this.GetAllEntities();
        })
        .catch(error => console.error(error));
    } catch(e) { console.error(e); }
  },
  methods: {
    GetAllEntities() {
      try
      {
        axios.get(`http://${CONFIG.host}/entities`)
          .then(response => response.data.forEach(entity => {
            const ents = this.EntityGroups.find(group => group.name === entity.category)
            if(!ents || !ents.entities) return;
        
            ents.entities.push({
                name: entity.name,
                json: entity.url
            });
            
          }))
          .catch(error => console.error(error));
      } catch(e) {}
    },
  }
};

</script>

<style scoped>
  .entity-select-container {
    height: 100%;
    padding: 0;
    padding-left: 2.75%;
  }

  .entity-group {
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: #333;
    border: 0;
    border-radius: 0;
  }

  .entity-group-accordion {
    border: 0;
    border-radius: 0;
    padding: 0;
    margin: 0;
  }

  .entity-group-accordion-btn {
    text-transform: capitalize;
    border: 0 !important;
    border-radius: 0 !important;
    background-color: #333 !important;
    user-select: none !important;
    outline:none !important;
    box-shadow: none !important;
    color: #FFF;
  }


  .entity-group-accordion-btn:focus,
  .entity-group-accordion-btn:hover,
  .entity-group-accordion-btn:active {
    border: 0 !important;
    border-radius: 0 !important;
    background-color: #333 !important;
    user-select: none !important;
    outline:none !important;
    box-shadow: none !important;
  }
</style>