<template>
    <div class="material-select-preview-renderer"
    :id="'material-preview-renderer'+this._uid">
    </div>
</template>

<script>

export default {
  name: "MaterialTileComponent",
  components: {
  },
  props: {
        material: {
            type: String,
            required: true
        }
  },
  data() {
    return {
        InstanceRendererID: null,
        RenderElement: null,
        RenderElementSize: {
            width: 0,
            height: 0
        },
        Scene: null,
        Camera: null,
        Geometry: null,
        Material: null,
        Plane: null,
        AmbientLight: null
    }
  },
  mounted() {
      try
      {
            this.InstanceRendererID = "material-preview-renderer"+this._uid;
            this.$nextTick(this.SetupRenderer);
      }
      catch(e) {}
  },
  methods: {
    SetupRenderer() {
        try
        {
            this.RenderElement = document.getElementById(this.InstanceRendererID);

            this.RenderElementSize.width = this.RenderElement.clientWidth;
            this.RenderElementSize.height = this.RenderElement.clientHeight;
            this.Scene = new THREE.Scene();
            this.Camera = new THREE.PerspectiveCamera(
                50, this.RenderElementSize.width / this.RenderElementSize.height, 0.1, 1000
            );
            
            this.AmbientLight = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
            this.Scene.add(this.AmbientLight);

            this.AddPlane().then(() => {
                this.Camera.position.z = 7.5;
                this.$emit("materialCanvasCreated", {
                    canvas: this.RenderElement,
                    camera: this.Camera,
                    plane: this.Plane,
                    rect: this.RenderElement.getBoundingClientRect(),
                    scene: this.Scene,
                    resize: () => this.onResize()
                });
            });
        }
        catch(e) { }
    },
    AddPlane() {
        try
        {
            return new Promise((resolve, reject) => {
                let interval = -1;
                const addPlane = () => { 
                    this.Geometry = new THREE.PlaneGeometry( 4, 4, 32 );
                    this.Plane = new THREE.Mesh(this.Geometry, material(this.material));
                    this.Scene.add(this.Plane);

                    this.CurrentShape = this.Plane;
                    clearInterval(interval)
                    resolve();
                };
                interval = setInterval(() => {
                    try
                    {
                        addPlane();
                    } catch(e) {}
                }, 100);
            });
        } catch(e) {}
    },
    onResize() {
        try
        {
            this.RenderElementSize.width = this.RenderElement.clientWidth;
            this.RenderElementSize.height = this.RenderElement.clientHeight;
            this.Camera.aspect = this.RenderElementSize.width / this.RenderElementSize.height;
            this.Camera.updateProjectionMatrix();
        } catch(e) {}
    },
    beforeDestroy() {
        try
        {
            this.Scene.remove(this.AmbientLight);
            this.Scene.remove(this.Plane);
            this.Scene.remove(this.Camera);
            delete this.Plane.material.map;
            delete this.Plane.material;
            delete this.Geometry;
            delete this.AmbientLight;
            delete this.Camera;
        } catch(e) {}
    }
  }
};

</script>

<style scoped>

  .material-select-preview-renderer {
    width: 100%;
    height: 100%;
  }

</style>
