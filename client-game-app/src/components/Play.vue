<template>
<div class="game-canvas"></div>
</template>

<script>
import Game from "./../Game";

export default {
  name: "Play",
  data() {
    return {
    }
  },
  created() {
    this.Game = new Game();
  },
  mounted() {
    console.log(this.Game);
    ENGINE.Initialise();
  }
};
</script>

<style scoped>
.game-canvas {
  width: 100vw;
  height:100vh;
  overflow: hidden;
}
</style>