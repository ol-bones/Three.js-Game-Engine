<template>
  <div class="row header-row fill">
    <div class="col-xs-12 col-sm-12 col-md-12" style="margin:0;padding:0;">
      <div class="row fill header-buttons-row">
        <q-bar style="min-width: 100%;margin:0;" class="bg-darkgrey text-white">
        <div class="cursor-pointer non-selectable">
          File
          <q-menu style="overflow:hidden;">
            <q-list dense style="min-width: 100px">
              <q-item clickable>
                <q-item-section>Open...</q-item-section><q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start" style="overflow:hidden;">
                  <q-list dense>
                    <q-item
                      v-for="world in m_Worlds"
                      :key="world"
                      clickable
                    >
                      <q-item-section @click="listPieces(world)">
                        {{world}}
                      </q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start" style="overflow:hidden;">
                        <q-list dense>
                          <q-item
                            v-for="piece in m_Pieces"
                            :key="piece"
                            clickable
                          >
                            <q-item-section @click="loadPiece(world, piece)"  v-close-popup>
                              {{piece}}
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                  <q-list dense>
                    <q-item
                      v-for="n in 3"
                      :key="n"
                      clickable
                    >
                      <q-item-section>Submenu Label</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu auto-close anchor="top end" self="top start">
                        <q-list dense>
                          <q-item
                            v-for="n in 3"
                            :key="n"
                            clickable
                          >
                            <q-item-section>3rd level Label</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>

              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="SaveAs">Save As</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable" style="overflow:hidden;">
          Edit
          <q-menu>
            <q-list dense style="min-width: 100px;overflow:hidden;">
              <q-item clickable v-close-popup>
                <q-item-section>Cut</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Copy</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Paste</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Select All</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="DeleteSelectedEntity">Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable" style="overflow:hidden;">
          View
          <q-menu>
            <q-list dense style="min-width: 100px;overflow:hidden;">
              <q-item clickable v-close-popup>
                <q-item-section @click="ToggleDebugRenderer">
                  Debug Renderer
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section @click="ToggleHighlightMousePick">
                  Highlight Mouse Pick
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <q-space />
        <q-btn dense flat icon="minimize" />
        <q-btn dense flat icon="crop_square" />
        <q-btn dense flat icon="close" />
      </q-bar>
      </div>
    </div>
  </div>
</template>

<script>

const axios = require("axios");
import HeaderButtonComponent from "./HeaderButtonComponent";
import WorldBrowserComponent from "./../Modal/WorldBrowserComponent";

import DebugComponent from "./../../../../engine/entity/components/DebugComponent/DebugComponent";

export default {
  name: "HeaderComponent",
  components: {
    HeaderButtonComponent,
    WorldBrowserComponent
  },
  data() {
    return {
      m_DebugRendererToggled: false,
      m_HighlightMousePickToggled: false,
      m_ShowWorldBrowserComponent: false,
      m_Worlds: [],
      m_Pieces: [],
      m_SelectedWorld: "",
      m_SelectedPiece: "",
      m_ShowWorldBrowserComponent: false
    }
  },
  created() {
  },
  mounted() {
      axios.get(`http://${CONFIG.host}/worlds/`)
        .then(response => this.m_Worlds = response.data.worlds)
        .catch(error => console.error(error));
  },
  computed: {
    HighlightMousePick()
    {
      try
      {
        return this.m_HighlightMousePickToggled;
      } catch(e) { return false; }
    }
  },
  methods: {
    listPieces(world) {
      this.m_SelectedWorld = world;

      axios.get(`http://${CONFIG.host}/${world}/pieces`)
        .then(response => this.m_Pieces = response.data.pieces)
        .catch(error => console.error(error));
    },
    loadPiece(world, piece) {
      this.m_SelectedPiece = piece;

      EDITOR.AddEntity(`/data/${world}/${piece}`, false);
    },
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
    ToggleHighlightMousePick(e)
    {
      try
      {
          ENGINE.m_Mouse.m_HighlightMousePick = !ENGINE.m_Mouse.m_HighlightMousePick;
          this.m_HighlightMousePickToggled = ENGINE.m_Mouse.m_HighlightMousePick;
      }
      catch(e) {}
    },
    DeleteSelectedEntity()
    {
      try
      {
        EDITOR.DeleteEntity(EDITOR.m_SelectedEntity.m_ID);
      } catch(e) {}
    },
    OpenWorldBrowser()
    {
      this.m_ShowWorldBrowserComponent = true;
    },
    CloseWorldBrowser()
    {
      this.m_ShowWorldBrowserComponent = false;
    },
    worldbrowseropen()
    {
      try
      {
        return this.$refs.worldbrowser.m_ShowWorldBrowserComponent;
      } catch(e) { return false; }
    },
    NewWorldPiece()
    {
      EDITOR.AddNewWorldPiece();
    },
    SaveAs()
    {
      axios.post(`http://${CONFIG.host}/save`, {
        location: "./content/data/desert/",
        name: "new.json",
        world: entities()[0].DataModel().ToJSON()
      });
    }
  }
};
</script>

<style scoped>

.q-bar {
  overflow: hidden;
 }

.header-row {
    height:100%;
    width: 100%;
    background-image: linear-gradient(#333, #3a3a3a);
    color: white;
    top: 50%;
    margin: 0;
}

.header-buttons-row {
  height: 100%;
  margin: 0;
}
</style>