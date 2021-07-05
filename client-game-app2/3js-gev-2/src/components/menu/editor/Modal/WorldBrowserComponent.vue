<template>
  <div class="world-browser-modal" v-show="this.show" @mouseenter="OpenWorldBrowser" @mouseleave="CloseWorldBrowser">   
    <div class="col-xs-12 col-sm-12 col-md-12 browser-container">
      <div class="row" style="height: 100%;background-color:#333;">
        <div class="col-xs-4 col-sm-4 col-md-4 world-browser">
          <div class="row" v-for="(world, index) in this.m_Worlds" :key="index">
            <div class="col-xs-12 col-sm-12 col-md-12" @click="listPieces(world)">
              {{world}}
            </div>
          </div> 
        </div>
        <div class="col-xs-8 col-sm-8 col-md-8 piece-picker">
          <div class="row" v-for="(piece, index) in this.m_Pieces" :key="index">
            <div class="col-xs-12 col-sm-12 col-md-12" @click="loadPiece(piece)">
              {{piece}}
            </div>
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const axios = require("axios");

export default {
  name: "WorldBrowserComponent",
  components: {
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      m_Worlds: [],
      m_Pieces: [],
      m_SelectedWorld: "",
      m_SelectedPiece: "",
      m_ShowWorldBrowserComponent: false
    }
  },
  created() {
  },
  mounted() {
      axios.get(`http://${CONFIG.host}/worlds/`)
        .then(response => this.m_Worlds = response.data.worlds)
        .catch(error => console.error(error));
  },
  computed: {
  },
  methods: {
    listPieces(world) {
      this.m_SelectedWorld = world;

      axios.get(`http://${CONFIG.host}/${world}/pieces`)
        .then(response => this.m_Pieces = response.data.pieces)
        .catch(error => console.error(error));
    },
    loadPiece(piece) {
      this.m_SelectedPiece = piece;

      EDITOR.AddEntity(`/data/${this.m_SelectedWorld}/${piece}`, false);
    },
    OpenWorldBrowser()
    {
      this.m_ShowWorldBrowserComponent = true;
    },
    CloseWorldBrowser()
    {
      this.m_ShowWorldBrowserComponent = false;
    }
  }
};
</script>

<style scoped>

.world-browser-modal {
  width: 60vw;
  height: 60vh;
  background-image: linear-gradient(#333, #3a3a3a);
  color: white;

  top: -10%;
  left: 105%;
  position: absolute;
}

.browser-container {
  height: 100%;
  background-image: linear-gradient(#333, #3a3a3a);
}

.world-browser {
  background-color: #222;
  height: 100%;
}

.piece-picker {
  background-color: #222;
  height: 100%;
}

</style>