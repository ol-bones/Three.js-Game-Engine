<template>
  <div class="col-xs-12 col-sm-12 col-md-12"
  v-if="this.entity && this.physicsComponent">
    <div class="row fill" style="height:100%;overflow-y:scroll;"
    v-if="this.physicsComponent.constructor">
      <div class="col-xs-12 col-sm-12 col-md-12">
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Friction
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.material.friction"
                v-on:changed="frictionChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Restitution
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.material.restitution"
                v-on:changed="restitutionChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Stiffness
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.material.stiffness"
                v-on:changed="stiffnessChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Relaxation
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.material.relaxation"
                v-on:changed="relaxationChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Friction Stiffness
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.material.frictionstiffness"
                v-on:changed="frictionstiffnessChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Mass
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.mass"
                v-on:changed="massChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Angular Damping
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.angularDamping"
                v-on:changed="angularDampingChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Linear Damping
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <number-edit-component
                :value="this.physicsComponent.m_BodySettings.linearDamping"
                v-on:changed="linearDampingChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Fixed Rotation
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <boolean-edit-component
                :value="this.physicsComponent.m_BodySettings.fixedRotation"
                v-on:changed="fixedRotationChanged"
              />
            </div>
          </div>
        </div>
        <div class="row material-properties">
          <div class="col-xs-4 col-sm-4 col-md-4 fill" style="font-size: 12px;">
            Static
          </div> 
          <div class="col-xs-8 col-sm-8 col-md-8 fill number-entry">
            <div class="row fill">
              <boolean-edit-component
                :value="Boolean(this.physicsComponent.m_Args.Type - 1)"
                v-on:changed="bodyTypeChanged"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MaterialPreviewComponent from "./../Generic/MaterialPreviewComponent";
import NumberEditComponent from "./../Generic/NumberEditComponent.vue";
import BooleanEditComponent from "./../Generic/BooleanEditComponent.vue";

export default {
  name: "PhysicsComponentPropertiesComponent",
  components: {
    MaterialPreviewComponent,
    NumberEditComponent,
    BooleanEditComponent
  },
  props: {
    entity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
    physicsComponent() {
      return this.entity.m_Components.PhysicsComponent;
    },
    isHeightfield() {
      return this.physicsComponent !== void(0) && this.physicsComponent.constructor.name === "HeightmapPhysicsComponent";
    }
  },
  methods: {
    frictionChanged(value) {
      this.physicsComponent.m_BodySettings.material.friction = value;
      this.physicsComponent.m_Args.BodySettings.material.friction = value;
    },
    restitutionChanged(value) {
      this.physicsComponent.m_BodySettings.material.restitution = value;
      this.physicsComponent.m_Args.BodySettings.material.restitution = value;
    },
    stiffnessChanged(value) {
      this.physicsComponent.m_BodySettings.material.stiffness = value;
      this.physicsComponent.m_Args.BodySettings.material.stiffness = value;
    },
    relaxationChanged(value) {
      this.physicsComponent.m_BodySettings.material.relaxation = value;
      this.physicsComponent.m_Args.BodySettings.material.relaxation = value;
    },
    frictionstiffnessChanged(value) {
      this.physicsComponent.m_BodySettings.material.frictionstiffness = value;
      this.physicsComponent.m_Args.BodySettings.material.frictionstiffness = value;
    },
    massChanged(value) {
      this.physicsComponent.m_BodySettings.mass = value;
      this.physicsComponent.m_Args.BodySettings.mass = value;
    },
    angularDampingChanged(value) {
      this.physicsComponent.m_BodySettings.angularDamping = value;
      this.physicsComponent.m_Args.BodySettings.angularDamping = value;
    },
    linearDampingChanged(value) {
      this.physicsComponent.m_BodySettings.linearDamping = value;
      this.physicsComponent.m_Args.BodySettings.linearDamping = value;
    },
    fixedRotationChanged(value) {
      this.physicsComponent.m_BodySettings.fixedRotation = value;
      this.physicsComponent.m_Args.BodySettings.fixedRotation = value;
    },
    bodyTypeChanged(value) {
      this.physicsComponent.m_Args.Type = Number(value+1);
    }
  }
};

</script>

<style scoped>
  .material-properties {
    display:flex;
    align-items:center;
    border-bottom: 1px solid #333;
  }
</style>