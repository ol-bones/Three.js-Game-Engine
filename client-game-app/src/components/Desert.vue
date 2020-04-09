<template>
  <div class="game-container">
    <div id="blocker"
      @click="requestPointerLock"
      v-if="!hasPointerLock">
      <div id="instructions">
        PRESS TO PLAY
      </div>
    </div>
    <div class="game-canvas"></div>
  </div>
</template>

<script>
import Desert from "./../Desert";

export default {
  name: "Play",
  data() {
    return {
      hasPointerLock: false
    }
  },
  created() {
    this.Desert = new Desert();
  },
  mounted() {
    console.log(this.Desert);
    ENGINE.Initialise();
  },
  methods:{
    requestPointerLock() {
      document.body.requestPointerLock();
      this.hasPointerLock = true;
      document.body.addEventListener("pointerlockchange", e => this.hasPointerLock = false, false);
      document.addEventListener( 'pointerlockerror', e => this.hasPointerLock = false, false );
      document.addEventListener( 'webkitpointerlockerror', e => this.hasPointerLock = false, false );
    }
  }
};
</script>

<style scoped>

.game-container {
  position: absolute;
  width: 100%;
  height:100%;
  overflow: hidden;
}

#blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
}

#instructions {
  width: 100%;
  height: 100%;
  text-align: center;
  cursor: pointer;
}

.game-canvas {
  width: 100%;
  height:100%;
  overflow: hidden;
}
</style>