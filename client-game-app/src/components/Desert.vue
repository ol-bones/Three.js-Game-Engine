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

    document.addEventListener("pointerlockchange", this.pointerLockEvent.bind(this), false );
    document.addEventListener("mozpointerlockchange", this.pointerLockEvent.bind(this), false );
    document.addEventListener("webkitpointerlockchange", this.pointerLockEvent.bind(this), false );
    document.addEventListener("pointerlockerror", this.pointerLockEvent.bind(this), false );
    document.addEventListener("mozpointerlockerror", this.pointerLockEvent.bind(this), false );
    document.addEventListener("webkitpointerlockerror", this.pointerLockEvent.bind(this), false );

    ENGINE.Initialise();
  },
  methods:{
    requestPointerLock() {
      document.body.requestPointerLock();
      this.hasPointerLock = true;
    },
    pointerLockEvent() {
      if(document.pointerLockElement === document.body
      || document.mozPointerLockElement === document.body
      || document.webkitPointerLockElement === document.body)
      {
        this.hasPointerLock = true;
      }
      else
      {
        this.hasPointerLock = false;
      }
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