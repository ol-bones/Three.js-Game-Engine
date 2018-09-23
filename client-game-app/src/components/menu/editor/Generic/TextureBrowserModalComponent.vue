<template>
  <div class="row texture-browser-container fill"
    v-bind:style="getPosition">
    <div class="col-xs-2 col-sm-2 col-md-2 texture-categories">
      <div class="row">
        <b-form-input v-model.trim="UserSearchInput"
                      type="text"
                      placeholder="Search..."
                      class="texture-search-input">
        </b-form-input>
      </div>
      <b-form-group>
        <b-form-checkbox-group buttons stacked
          class="texture-category-checkbutton"
          v-model="SelectedTextureCategories"
          :options="this.TextureCategories">
        </b-form-checkbox-group>
      </b-form-group>
    </div>
    <div class="col-xs-10 col-sm-10 col-md-10">
      <div class="row texture-tiles">
        <div v-for="(row, rowIndex) in this.textureRows" :key='rowIndex' class="col-xs-2 col-sm-2 col-md-2 fill">
          <div v-for="(texture, colIndex) in row" :key='colIndex' class="row fill">
            <div class="col-xs-12 col-sm-12 col-md-12 fill" style="overflow:hidden;">
              <div class="texture-tile-overlay row fill">
                <div class="col-xs-12 col-sm-12 col-md-12 fill">
                  <div class="row fill">
                    {{texture.name}}
                  </div>
                  <div class="row fill">
                    512x512
                  </div>
                </div>
              </div>
              <b-img center fluid
                :src="`http://localhost:9090/textures` + texture.url"
                :alt="texture.url"
                class="texture-tile"
                v-on:mouseover="textureTileHovered(texture.url)"
                v-on:mouseleave="textureTileLeave(texture.url)"
                v-on:click="textureTileClick(texture.url)"/>
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
  name: "TextureBrowserModalComponent",
  components: {
  },
  props: {
    entity: {
      type: Object,
      required: true
    },
    preview: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      TextureCategories: [],
      Textures: [],
      SelectedTextureCategories: [],
      UserSearchInput: ""
    }
  },
  watch: {
    SelectedTextureCategories: {
      immediate: true,
      handler(current, previous) {
        try
        {
          this.GetTexturesFiltered();
        } catch(e) {}
      }
    },
    UserSearchInput: {
      immediate: true,
      handler(current, previous) {
        try
        {
          if(current === previous) return;
          if(current.length === 0)
          {
            this.GetAllTextures();
          }
          else
          {
            this.GetTexturesFiltered();
          }
        } catch(e) {}
      }
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
  mounted() {
    try
    {
      this.GetAllTextures();

      axios.get(`http://${CONFIG.host}/textureCategories`)
        .then(response => this.TextureCategories = response.data)
        .catch(error => console.error(error));
    } catch(e) {}
  },
  methods: {
    GetAllTextures() {
      try
      {
        axios.get(`http://${CONFIG.host}/textures`)
          .then(response => this.Textures = response.data)
          .catch(error => console.error(error));
      } catch(e) {}
    },
    GetTexturesFiltered() {
      try
      {
        const params = {params: {
          search: this.UserSearchInput,
          categories: this.SelectedTextureCategories.join(",")
        }};
        axios.get(`http://${CONFIG.host}/textures`, params)
          .then(response => this.Textures = response.data)
          .catch(error => console.error(error));
      } catch(e) {}
    },
    textureTileHovered(texture) {
      try
      {
        this.preview.material.map = window.texture(texture);
        this.preview.material.map.needsUpdate = true;
        this.preview.material.needsUpdate = true;
      } catch(e) {}

    },
    textureTileLeave(texture) {
      try
      {
        const entityTextureSrc = this.entity.m_Components.RenderComponent.m_Mesh.material.map.image.currentSrc;
        this.preview.material.map = window.texture(entityTextureSrc.split("/textures")[1]);
        this.preview.material.map.needsUpdate = true;
        this.preview.material.needsUpdate = true;
      } catch(e) {}
    },
    textureTileClick(texture) {
      try
      {
        this.entity.m_Components.RenderComponent.SetTexture(texture);
      } catch(e) {}
    }
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
    overflow-y: hidden;
  }

  .texture-tiles {
    overflow-y: scroll;
    height:100%;
  }

  .texture-categories {
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

  .texture-search-input {
    border: 0;
    border-radius: 0;
    margin: 5%;
    background-color: #333;
    color: white;
  }
  
  .texture-category-checkbutton{
    width: 100%;
    border-radius: 0 !important;
    border: 0 !important;
    background-color: #333 !important;
  }
</style>

<style>
  .texture-category-checkbutton > label {
    width: 100%;
    border-radius: 0 !important;
    border: 0 !important;
    color: #888;
    font-weight: 100;
    background-color: #222 !important;
    padding: 2%;
    text-align: left;
    -webkit-appearance: none !important;
    outline: none !important; 
    border: 0 !important;
    outline-width: 0 !important;
    outline-style: none !important;
    box-shadow: none !important;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }

  .texture-category-checkbutton > .active {
    color: white !important;
    font-weight: bolder;
  }
</style>
