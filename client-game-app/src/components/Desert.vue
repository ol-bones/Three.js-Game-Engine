<template>
  <div class="game-container">
    <div id="blocker"
      @click="requestPointerLock"
      v-if="!hasPointerLock">
      <div id="instructions" class="escape-menu container">
        <div class="col-xs-12 col-sm-12 col-md-12">
          <div class="row resume-text justify-content-center" v-if="!loading">
            RESUME
          </div>
          <div class="row loading-bar justify-content-center" v-if="loading">
            LOADING PLEASE WAIT
            <b-progress :value="progress" :max="max" animated></b-progress>
          </div>
        </div>
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
      hasPointerLock: false,
      loading: true,
      loadTestInterval: null,
      progress: 0,
      max: 1
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

    setTimeout(() => {
      this.loadTestInterval = setInterval(() => {
        try
        {
          const ents = entities();
          const entsLoading = ents.filter(e => !e.IsInitialised()).length;
          const sceneloaded = ENGINE.m_World.m_Scene.children.length;

          const entprogress = (ents.length-entsLoading)/ents.length;
          const sceneprogress = sceneloaded / 63;
          this.progress = (entprogress/2)+(sceneprogress/2);

          if(ents.length > 0 && entsLoading === 0 && this.progress >= 1)
          {
            clearInterval(this.loadTestInterval);
            setTimeout(() => {
              this.loading = false;
            }, 2500);
          }
        } catch(e) {}
      }, 50);
    }, 2500);
  },
  methods:{
    requestPointerLock() {
      if(this.loading) return;
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

.escape-menu {
  color: white;
  font-weight: bolder;
  
  display: flex;
  align-self: center;
  align-items: center;
  align-content: center;
}

.resume-text {
  width: 100%;
  display: flex;
  align-self: center;
  align-items: center;
  align-content: center;
}

.loading-bar {
  width: 100%;
  display: flex;
  align-self: center;
  align-items: center;
  align-content: center;
}

.loading-bar > * {
  width: 100%;
}
</style>