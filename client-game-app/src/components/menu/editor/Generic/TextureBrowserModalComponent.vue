<template>
  <div class="row texture-browser-container fill"
    v-bind:style="getPosition">
    <div class="col-xs-2 col-sm-2 col-md-2 texture-folders">
      <div v-for="(folder, index) in this.Folders" :key="index" class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 texture-folder">
          {{folder}}
        </div>
      </div>
    </div>
    <div class="col-xs-10 col-sm-10 col-md-10">
      <div class="row">
        <div v-for="(row, rowIndex) in this.textureRows" :key='rowIndex' class="col-xs-2 col-sm-2 col-md-2 fill">
          <div v-for="(texture, colIndex) in row" :key='colIndex' class="row fill">
            <div class="col-xs-12 col-sm-12 col-md-12 fill" style="overflow:hidden;">
              <div class="texture-tile-overlay row fill">
                <div class="col-xs-12 col-sm-12 col-md-12 fill">
                  <div class="row fill">
                    {{texture.url.split("/").find((sub, i, arr) => i === arr.length-1)}}
                  </div>
                  <div class="row fill">
                    512x512
                  </div>
                </div>
              </div>
              <b-img center fluid
                :src="texture.url"
                :alt="texture.url"
                class="texture-tile"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "TextureBrowserModalComponent",
  components: {
  },
  data() {
    return {
      Folders: [
        "All",
        "private",
        "cube"
      ],
      Textures: [
        {url: "http://localhost:9090/textures/1.png"},
        {url: "http://localhost:9090/textures/2.png"},
        {url: "http://localhost:9090/textures/5.png"},
        {url: "http://localhost:9090/textures/6.png"},
        {url: "http://localhost:9090/textures/7.png"},
        {url: "http://localhost:9090/textures/8.png"},
        {url: "http://localhost:9090/textures/9.png"},
        {url: "http://localhost:9090/textures/10.png"},
        {url: "http://localhost:9090/textures/11.png"},
        {url: "http://localhost:9090/textures/12.png"},
        {url: "http://localhost:9090/textures/default.jpg"},
        {url: "http://localhost:9090/textures/waternormals.jpg"},
        {url: "http://localhost:9090/textures/private/check.png"},
        {url: "http://localhost:9090/textures/private/swirl.jpg"},
        {url: "http://localhost:9090/textures/cube/skyboxsun/nx.jpg"},
        {url: "http://localhost:9090/textures/cube/skyboxsun/ny.jpg"},
        {url: "http://localhost:9090/textures/cube/skyboxsun/nz.jpg"},
        {url: "http://localhost:9090/textures/cube/skyboxsun/px.jpg"},
        {url: "http://localhost:9090/textures/cube/skyboxsun/py.jpg"},
        {url: "http://localhost:9090/textures/cube/skyboxsun/pz.jpg"}
      ]
    }
  },
  computed: {
    textureRows() {
      try
      {
        const cols = 6;
        let it = 0;
        return _.groupBy(this.Textures, () => it++ > cols**2 ? "rem" : (it-1)%cols);
      } catch(e) {}
    },
    getPosition() {
      try
      {
        const bottomPanel = document.getElementById("bottom-panel");
        const bottomPanelRect = bottomPanel.getBoundingClientRect();

        const leftPanel = document.getElementById("left-panel");
        const leftPanelRect = leftPanel.getBoundingClientRect();

        const mainCanvas = document.getElementById("main-canvas");
        const mainCanvasRect = mainCanvas.getBoundingClientRect();

        return {
          left: leftPanelRect.right + "px",
          top: (mainCanvasRect.bottom - mainCanvasRect.height*0.3) + "px",
          height: (mainCanvasRect.height*0.3) + "px",
          width: mainCanvasRect.width + "px"
        }
      } catch(e) {}
    }
  },
  created() {
  },
  mounted() {
    console.table(this.textureRows);
  }
};
</script>

<style scoped>

  .texture-browser-container {
    position:fixed;
    z-index: 99999;
  
    width: 10%;

    background-color: #222;
    border-top: 2px solid #333;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .texture-folders {
    border-right: 1px solid #333;
    text-align: left;
  }

  .texture-folder:hover {
    background-color: #333;
  }

  .texture-tile {
    border: 2px solid #222;
  }

  .texture-tile-overlay {
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

  .texture-tile-overlay:hover {
    transition: transform 0.5s ease;
    transform: translate(0%, 0%);
  }
</style>