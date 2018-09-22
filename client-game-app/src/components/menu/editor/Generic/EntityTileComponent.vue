<template>
  <div class="entity-select-preview-renderer"
  :id="'entity-preview-renderer'+this._uid"
  v-on:click="createEntity">
    <div class="entity-tile-overlay row fill">
      <div class="col-xs-12 col-sm-12 col-md-12 fill">
        <div class="row fill">
          {{entityType}}
        </div>
      </div>
    </div>
    <img :src="thumbnail" class="entity-preview-thumb"/>
  </div>
</template>

<script>

export default {
  name: "EntityTileComponent",
  props: {
    entityType: {
        type: String,
        required: true
    },
    entityJson: {
      type: String,
      required: true
    }
  },
  computed: {
    thumbnail() {
      return `http://${CONFIG.host}${this.entityJson.replace(".json", ".png")}`;
    }
  },
  methods: {
    createEntity() {
      try
      {
        if(!this.entityType || !this.entityJson) return;

        EDITOR.AddEntity(this.entityJson);
      } catch(e) { console.error(e); }
    }
  }
};

</script>

<style scoped>

  .entity-select-preview-renderer {
    width: 100%;
    height: 15vh;
    overflow: hidden;
  }

  .entity-preview-thumb {
    width: 100%;
    height: 100%;
  }

  .entity-tile-overlay {
    position: absolute;
    bottom: 0;

    background-color: black;
    opacity: 0.5;

    font-size: small;

    width: 100%;
    height: 50%;

    padding-left: 5%;
    transform: translateY(50%);
    overflow: hidden;
  }

  .entity-tile-overlay:hover {
    transition: transform 0.5s ease;
    transform: translate(0%, 0%);
  }

</style>
