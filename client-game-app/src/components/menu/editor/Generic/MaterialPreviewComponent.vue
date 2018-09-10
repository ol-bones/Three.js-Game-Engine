<template>
  <div class="col-xs-12 col-sm-12 col-md-12" style="height:100%;">
    <div class="row" style="height:100%;">
      <div class="col-xs-10 col-sm-10 col-md-10" style="height:100%;">
        <div class="row" style="height:100%;" >
          <div class="material-preview-renderer" id="material-preview-renderer">

          </div>
        </div>
      </div>
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
        <div class="row fill">
          <div class="material-button"
            v-b-tooltip.hover.topright title="Change Preview Model"
            v-on:click="CyclePreviewModel">
            <icon name="shapes" scale="1.5"/>
          </div>
        </div>
        <div class="row fill">
          <div class="material-button"
            v-b-tooltip.hover.topright title="Material Preset">
            <icon name="image" scale="1.5"/>
          </div>
        </div>
        <div class="row fill">
          <div class="material-button"
            v-on:mouseover="textureBrowserButtonHovered = true"
            v-on:mouseleave="onTextureBrowserButtonLeave"
            v-b-tooltip.hover.topright title="Texture Browser">
            <icon name="chess-board" scale="1.5"/>
          </div>
        </div>
        <div class="row fill">
          <div class="material-button"
              id="color-picker-button"
              v-b-tooltip.hover.topright title="Colour Palette"
              v-on:mouseover="colorPickerButtonHovered = true"
              v-on:mouseleave="onColorPickerButtonLeave">
            <icon name="palette" scale="1.5"/>
          </div>
        </div>
      </div>
      <div
        v-on:mouseover="colorPickerHovered = true"
        v-on:mouseleave="colorPickerHovered = false">
        <chrome-picker v-model="previewColour"
          class="material-color-picker"
          id="material-color-picker"
          v-bind:style="pickerPosition"
          v-if="shouldShowColorPicker"/>
        </div>
    </div>
    <div
      v-on:mouseover="textureBrowserHovered = true"
      v-on:mouseleave="textureBrowserHovered = false">
      <texture-browser-modal-component
        v-if="shouldShowTextureBrowser"
      />
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';
import TextureBrowserModalComponent from "./TextureBrowserModalComponent";

export default {
  name: "MaterialPreviewComponent",
  components: {
    "ChromePicker": Chrome,
    TextureBrowserModalComponent
  },
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      RenderElement: null,
      RenderElementSize: {
        width: 0,
        height: 0
      },
      Scene: null,
      Camera: null,
      Renderer: null,
      Geometry: null,
      Material: null,
      Sphere: null,
      Cube: null,
      Cone: null,
      Plane: null,
      CurrentShape: null,
      CurrentShapeID: 0,
      AmbientLight: null,

      previewColour:  { r: 1, g: 1, b: 1 },
      colorPickerButtonHovered: false,
      colorPickerHovered: false,
      textureBrowserButtonHovered: false,
      textureBrowserHovered: false
    }
  },
  watch: {
    entity: {
      immediate: true,
      handler(changed, previous) {
        try
        {
          if(!changed) return;

          this.previewColour = changed.m_Components.RenderComponent.m_Colour;
          this.UpdatePreviewModelColour(this.previewColour);
        } catch(e) {}
      }
    },
    previewColour: {
      immediate: true,
      handler(changed, previous) {
        try
        {
          if(changed && this.CurrentShape)
          {
            const colour = new THREE.Color(
              changed.rgba.r/255,
              changed.rgba.g/255,
              changed.rgba.b/255
            );
            this.UpdatePreviewModelColour(colour);
            this.UpdateEditorModelColour(colour);
          }
        } catch(e) {}
      }
    }
  },
  computed: {
    shouldShowColorPicker() {
      return this.colorPickerButtonHovered || this.colorPickerHovered;
    },
    shouldShowTextureBrowser() {
      return this.textureBrowserButtonHovered || this.textureBrowserHovered;
    },
    pickerPosition() {
      const bottomPanel = document.getElementById("bottom-panel");
      const bottomRect = bottomPanel.getBoundingClientRect();
      const picker = document.getElementById("material-color-picker");
      const pickerRect = bottomPanel.getBoundingClientRect();
      return {
        left: (bottomRect.x) + "px",
        top: (bottomRect.y - pickerRect.height*2) + "px"
      }
    }
  },
  created() {
  },
  mounted() {
      try
      {
        this.$nextTick(this.SetupRenderer);
      }
      catch(e) {}
  },
  methods: {
    SetupRenderer() {
      try
      {
        this.RenderElement = document.getElementById("material-preview-renderer");
        this.RenderElementSize.width = this.RenderElement.clientWidth;
        this.RenderElementSize.height = this.RenderElement.clientHeight;

        this.Scene = new THREE.Scene();
        this.Camera = new THREE.PerspectiveCamera(
          50, this.RenderElementSize.width / this.RenderElementSize.height, 0.1, 1000
        );

        this.Renderer = new THREE.WebGLRenderer({ alpha: true });
        this.Renderer.setClearColor( 0xffffff, 0 );
        this.ResizeRenderer();
        this.RenderElement.appendChild(this.Renderer.domElement);

        this.AmbientLight = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        this.Scene.add(this.AmbientLight);

        this.AddSphere();

        this.Camera.position.z = 7.5;
        this.Render();
      }
      catch(e) {}
    },
    UpdatePreviewModelColour(colour) {
      try
      {
        this.CurrentShape.material.color.set(
          colour ? colour : this.entity.m_Components.RenderComponent.m_Colour
        );
      }
      catch(e) {}
    },
    UpdateEditorModelColour(colour) {
      try
      {
        this.entity.m_Components.RenderComponent.SetColor(colour);
      }
      catch(e) {}
    },
    AddSphere() {
      try
      {
        this.Geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
        this.Sphere = new THREE.Mesh(this.Geometry, material("default"));
        this.Scene.add(this.Sphere);

        this.CurrentShape = this.Sphere;
        this.UpdatePreviewModelColour();
        this.CurrentShapeID = 0;
      }
      catch(e) {}
    },
    AddCube() {
      try
      {
        this.Geometry = new THREE.BoxGeometry( 4, 4, 4 );
        this.Cube = new THREE.Mesh(this.Geometry, material("default"));
        this.Scene.add(this.Cube);

        this.CurrentShape = this.Cube;
        this.UpdatePreviewModelColour();
        this.CurrentShapeID = 1;
      }
      catch(e) {}
    },
    AddCone() {
      try
      {
        this.Geometry = new THREE.ConeBufferGeometry( 2.5, 4, 15 );
        this.Cone = new THREE.Mesh(this.Geometry, material("default"));
        this.Scene.add(this.Cone);

        this.CurrentShape = this.Cone;
        this.UpdatePreviewModelColour();
        this.CurrentShapeID = 2;
      }
      catch(e) {}
    },  
    AddPlane() {
      try
      {
        this.Geometry = new THREE.PlaneGeometry( 4, 4, 32 );
        this.Plane = new THREE.Mesh(this.Geometry, material("default"));
        this.Scene.add(this.Plane);

        this.CurrentShape = this.Plane;
        this.UpdatePreviewModelColour();
        this.CurrentShapeID = 3;
      }
      catch(e) {}
    },
    CyclePreviewModel() {
      try
      {
        this.Scene.remove(this.CurrentShape);
        switch(this.CurrentShapeID)
        {
          case 0: this.AddCube(); break;
          case 1: this.AddCone(); break;
          case 2: this.AddPlane(); break;
          case 3: this.AddSphere(); break;
          default: this.AddSphere(); break;
        }
      }
      catch(e) {}
    },
    ResizeRenderer() {
      try
      {
        this.RenderElementSize.width = this.RenderElement.clientWidth;
        this.RenderElementSize.height = this.RenderElement.clientHeight;

        this.Renderer.setSize(
          this.RenderElementSize.width,
          this.RenderElementSize.height
        );

        this.Camera.aspect = this.RenderElementSize.width / this.RenderElementSize.height;
        this.Camera.updateProjectionMatrix();
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

        this.CurrentShape.rotation.y += 0.02;

        this.Renderer.render(this.Scene, this.Camera);
      }
      catch(e) {}
    },
    onColorPickerButtonLeave() {
      setTimeout(() => this.colorPickerButtonHovered = false, 1000);
    },
    onTextureBrowserButtonLeave() {
      setTimeout(() => this.textureBrowserButtonHovered = false, 1000);
    }
  }
};

</script>

<style scoped>

  .material-preview-renderer {
    width: 100%;
    height: 100%;
  }

  .material-button {
    padding: 20%;
    background-color: rgba(0, 0, 0, 0);
    border: 0;
  }

  .material-color-picker {
    position: fixed;
    z-index: 9999;
    border: 2px solid #333;
  }
</style>

<style>
  .vc-chrome-body {
    background-color: #222 !important;
  }

  .vc-input__input {
    color: #AAA !important;
    background-color: #222 !important;
    box-shadow: inset 0 0 0 1px #333 !important;
  }

  .vc-input__label {
    color: #AAAAAA !important;
  }
</style>