<template>
  <div class="row header-row fill">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <div class="row fill header-buttons-row">
        <header-button-component text="File">
          <div slot="options" class="col">
            <div class="row">
              New
            </div>
            <div class="row">
              Save
            </div>
            <div class="row">
              Save As
            </div>
            <div class="row">
              Exit
            </div>
          </div>
        </header-button-component>
        <header-button-component text="Edit">
          <div slot="options" class="col">
            <div class="row" @click="DeleteSelectedEntity">
              Delete
            </div>
          </div>
        </header-button-component>
        <header-button-component text="View">
          <div slot="options" class="col">
            <div class="row" @click="ToggleDebugRenderer">
              Debug Renderer
            </div>
          </div>
        </header-button-component>
      </div>
    </div>
  </div>
</template>

<script>

import HeaderButtonComponent from "./HeaderButtonComponent";

import DebugComponent from "./../../../../engine/entity/components/DebugComponent/DebugComponent";

export default {
  name: "HeaderComponent",
  components: {
    HeaderButtonComponent
  },
  data() {
    return {
      m_DebugRendererToggled: false
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ToggleDebugRenderer(e)
    {
      if(this.m_DebugRendererToggled)
      {
          entities().forEach(e => e.RemoveComponent("DebugComponent"));
          ENGINE.m_World.m_DebugRenderer._material.visible = false;
          ENGINE.StopUpdating(3, () => ENGINE.m_World.m_DebugRenderer.update());
          this.m_DebugRendererToggled = false;
      }
      else
      {
          entities().forEach(e =>
          {
            if(e.m_Components.RenderComponent && e.m_Components.RenderComponent.m_Debuggable
          )//&& e.m_Components.RenderComponent.constructor.name !== "OBJRenderComponent")
            {
                try
                { 
                  e.AddComponent(new DebugComponent({Parent: e}));
                } catch(Exception) { console.log(Exception, e);}
            }
          });
          ENGINE.m_World.m_DebugRenderer._material.visible = true;
          ENGINE.BeginUpdating(3, () => ENGINE.m_World.m_DebugRenderer.update());
          this.m_DebugRendererToggled = true;
      }
    },
    DeleteSelectedEntity()
    {
      try
      {
        EDITOR.DeleteEntity(EDITOR.m_SelectedEntity.m_ID);
      } catch(e) {}
    }
  }
};
</script>

<style scoped>

.header-row {
    height:100%;
    width: 100%;
    background-image: linear-gradient(#333, #3a3a3a);
    color: white;
    top: 50%;
}

.header-buttons-row {
  height: 100%;
}
</style>