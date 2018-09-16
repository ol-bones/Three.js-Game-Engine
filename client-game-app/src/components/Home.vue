<template>
  <div>
    <div class="container menu-container">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <div class="row menu-option"
            v-on:click="goToMinigolf">
            Minigolf Demo
          </div>
          <div class="row menu-option"
            v-on:click="goToEditor">
            Editor
          </div>
          <div class="row menu-option">
            Entity Creator
          </div>
        </div>
      </div>
    </div>
    <div class="game-canvas"></div>
  </div>
</template>

<script>
import Home from "./../home/Home.js";

export default {
  name: "Home",
  data() {
    return {
    }
  },
  created() {
    this.Home = new Home();
  },
  mounted() {
    ENGINE.Initialise();
    ENGINE.m_World.m_Controls.enabled = false;
  },
  methods: {
    goToMinigolf() {
      this.$router.push("/Play");
    },
    goToEditor() {
      this.$router.push("/Editor");
    }
  },
  beforeDestroy() {
    this.Home.Destroy();
  }
};
</script>

<style scoped>
.game-canvas {
  width: 100%;
  height:100%;
  overflow: hidden;
}

.menu-container {
  position: absolute;
  left: 15%;
  top: 30%;
  width: 25%;
}

.menu-option {
  padding: 7.5%;
  color: #DDDDDD;
}

.menu-option:hover {
  padding: 7.5%;
  color: white;
}
</style>