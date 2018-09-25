<template>
  <div class="row material-browser-container fill"
    v-bind:style="getPosition">
    <div class="col-xs-2 col-sm-2 col-md-2 material-categories">
      <div class="row">
        <b-form-input v-model.trim="UserSearchInput"
                      type="text"
                      placeholder="Search..."
                      class="material-search-input">
        </b-form-input>
      </div>
      <b-form-group>
        <b-form-checkbox-group buttons stacked
          class="material-category-checkbutton"
          v-model="SelectedMaterialCategories"
          :options="this.MaterialCategories">
        </b-form-checkbox-group>
      </b-form-group>
    </div>
    <div class="col-xs-10 col-sm-10 col-md-10">
      <div class="row material-tiles" id="material-tiles-renderer">
        <div v-for="(row, rowIndex) in this.materialRows" :key='rowIndex' class="col-xs-2 col-sm-2 col-md-2 fill">
          <div v-for="(material, colIndex) in row" :key='colIndex' class="row fill" style="height:100px;">
            <div class="col-xs-12 col-sm-12 col-md-12 fill" style="overflow:hidden;"
              v-on:mouseover="materialTileHovered(material.name)"
              v-on:mouseleave="materialTileLeave(material.url)"
              v-on:click="materialTileClick(material.name)">
              <div class="material-tile-overlay row fill">
                <div class="col-xs-12 col-sm-12 col-md-12 fill">
                  <div class="row fill">
                    {{material.name}}
                  </div>
                  <div class="row fill">
                    512x512
                  </div>
                </div>
              </div>
              <material-tile-component
                :material="material.name"
                v-on:materialCanvasCreated="materialCanvasCreated"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
import MaterialTileComponent from "./MaterialTileComponent";

export default {
  name: "MaterialBrowserModalComponent",
  components: {
    MaterialTileComponent
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
      MaterialCategories: [],
      Materials: [],
      SelectedMaterialCategories: [],
      UserSearchInput: "",

      Renderer: null,
      RenderElement: null,
      RenderElementSize: {
          width: 0,
          height: 0
      },
      MaterialCanvases: []
    }
  },
  watch: {
    SelectedMaterialCategories: {
      immediate: true,
      handler(current, previous) {
        try
        {
          this.GetMaterialsFiltered();
        } catch(e) {}
      }
    },
    UserSearchInput: {
      immediate: true,
      handler(current, previous) {
        try
        {
          if(current === previous) return;
          this.Materials = [];
          if(current.length === 0)
          {
            this.GetAllMaterials();
          }
          else
          {
            this.GetMaterialsFiltered();
          }
        } catch(e) {}
      }
    }
  },
  computed: {
    materialRows() {
      try
      {
        const cols = 6;
        let it = 0;
        return _.groupBy(this.Materials, () => it++ > cols**2 ? "rem" : (it-1)%cols);
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
      this.GetAllMaterials();

      axios.get(`http://${CONFIG.host}/materialCategories`)
        .then(response => this.MaterialCategories = response.data)
        .then(this.SetupRenderer)
        .catch(error => console.error(error));
    } catch(e) {}
  },
  methods: {
    SetupRenderer() {
      try
      {
        this.RenderElement = document.getElementById("material-tiles-renderer");
        this.RenderElementSize.width = this.RenderElement.clientWidth;
        this.RenderElementSize.height = this.RenderElement.clientHeight;

        this.Renderer = new THREE.WebGLRenderer({ alpha: true });
        this.Renderer.setClearColor( 0xffffff, 0 );
        this.RenderElement.appendChild(this.Renderer.domElement);
        this.ResizeRenderer();

        this.Render();
      }
      catch(e) {}
    },
    GetAllMaterials() {
      try
      {
        axios.get(`http://${CONFIG.host}/materials`)
          .then(response => this.Materials = response.data)
          .catch(error => console.error(error));
      } catch(e) {}
    },
    GetMaterialsFiltered() {
      try
      {
        const params = {params: {
          search: this.UserSearchInput,
          categories: this.SelectedMaterialCategories.join(",")
        }};
        axios.get(`http://${CONFIG.host}/materials`, params)
          .then(response => this.Materials = response.data)
          .catch(error => console.error(error));
      } catch(e) {}
    },
    materialTileHovered(material) {
      try
      {
        this.preview.material = window.material(material);
        this.preview.material.map.needsUpdate = true;
        this.preview.material.needsUpdate = true;
      } catch(e) {}
    },
    materialTileLeave(material) {
      try
      {
        this.preview.material = this.entity.m_Components.RenderComponent.m_Mesh.material.clone();
        this.preview.material.map.needsUpdate = true;
        this.preview.material.needsUpdate = true;
      } catch(e) {}
    },
    materialTileClick(material) {
      try
      {
        this.entity.m_Components.RenderComponent.SetMaterial(material);
      } catch(e) {}
    },
    ResizeRenderer() {
      try
      {
        this.RenderElementSize.width = this.RenderElement.clientWidth;
        this.RenderElementSize.height = this.RenderElement.clientHeight;

        this.Renderer.setSize(
          this.RenderElementSize.width,
          this.RenderElementSize.height,
          false
        );
      }
      catch(e) {}
    },
    Render() {
      try
      {
        requestAnimationFrame(this.Render.bind(this));

        if(this.RenderElement.clientWidth !== this.RenderElementSize.width
        || this.RenderElement.clientHeight !== this.RenderElementSize.clientHeight)
        {
          this.ResizeRenderer();
        }

				this.Renderer.setScissorTest( false );
				this.Renderer.clear();
				this.Renderer.setScissorTest( true );

        const rrect =  this.RenderElement.getBoundingClientRect();

        this.MaterialCanvases.forEach(canvas => {
          canvas.resize();
          canvas.plane.rotation.y = Math.sin(Date.now() * 0.001);
          const rect = canvas.canvas.getBoundingClientRect();
          this.Renderer.setViewport(rect.left - rrect.left, rect.top - rrect.top, rect.width, rect.height);
          this.Renderer.setScissor(rect.left - rrect.left, rect.top - rrect.top, rect.width, rect.height);

          this.Renderer.render(canvas.scene, canvas.camera);
        });
      }
      catch(e) {}
    },
    materialCanvasCreated(canvas) {
      try
      {
        this.MaterialCanvases.push(canvas);
      } catch(e) {}
    }
  }
};
</script>

<style scoped>

  .material-browser-container {
    position:fixed;
    z-index: 99999;
  
    width: 10%;

    background-color: #222;
    border-top: 2px solid #333;
    overflow-x: hidden; 
    overflow-y: hidden;
  }

  .material-tiles {
    overflow-y: scroll;
    height:100%;
  }

  .material-categories {
    border-right: 1px solid #333;
    text-align: left;
  }

  .material-folder:hover {
    background-color: #333;
  }

  .material-tile {
    border: 2px solid #222;
  }

  .material-tile-overlay {
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

  .material-tile-overlay:hover {
    transition: transform 0.5s ease;
    transform: translate(0%, 0%);
  }

  .material-search-input {
    border: 0;
    border-radius: 0;
    margin: 5%;
    background-color: #333;
    color: white;
  }
  
  .material-category-checkbutton{
    width: 100%;
    border-radius: 0 !important;
    border: 0 !important;
    background-color: #333 !important;
  }

</style>

<style>
  #material-tiles-renderer > canvas {
    position: absolute;
  }
  
  .material-category-checkbutton > label {
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

  .material-category-checkbutton > .active {
    color: white !important;
    font-weight: bolder;
  }
</style>
