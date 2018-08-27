<template>
  <div class="col-xs-12 col-sm-12 col-md-12">
    <div class="row" style="display:flex;align-items:center;">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="arrows-alt" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            x:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Position.x" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>  
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            y:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Position.y" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            z:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Position.z" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="display:flex;align-items:center;">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="sync" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            x:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Rotation.x" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>  
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            y:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Rotation.y" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            z:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Rotation.z" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="display:flex;align-items:center;">
      <div class="col-xs-2 col-sm-2 col-md-2 fill">
          <icon name="expand-arrows-alt" scale="1"/>
      </div> 
      <div class="col-xs-10 col-sm-10 col-md-10 fill number-entry">
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            x:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Scale.x" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>  
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            y:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Scale.y" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>
        <div class="row fill">
          <div class="col-xs-1 col-sm-1 col-md-1 fill">
            z:
          </div>
          <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
            <b-form-input :value="this.entity.m_Scale.z" type="number" class="number-entry-input"></b-form-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "GeneralPropertiesComponent",
  components: {
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
  methods: {
  }
};

</script>

<style scoped>
  .number-entry {
    text-align: left;
    white-space: nowrap;
    font-size: 75%;
  }

  .number-entry-input {
    height:33%;
    border-color: transparent;
    border-radius: 0;
    background-color: transparent;
    color: white;
    font-size: 12px;
  }
</style>