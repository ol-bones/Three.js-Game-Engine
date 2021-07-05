<template>
  <div class="row right-panel-row fill">
    <div class="right-side col-xs-12 col-sm-12 col-md-12">
      <div class="row fill" style="height:100%;padding:0;">
        <div class="col-xs-12 col-sm-12 col-md-12" style="padding:0;">
          <entity-select-component/>
        </div>
      </div>
    </div>
    <div class="handle"/>
  </div>
</template>

<script>

import EntitySelectComponent from "./../Generic/EntitySelectComponent";

export default {
  name: "RightPanelComponent",
  components: {
    EntitySelectComponent
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  }
};
</script>

<style scoped>

  .right-panel-row {
    position: absolute;
    height:100%;
    width: 100%;
    background-color: #333;
    color: white;
  }

  .right-side {
    width: 97.5%;
    height: 100%;
    padding-left:0;

    background-color: #222;
    color: white;
  }

  .handle {
    position:absolute;
    left: 0;
    width: 2.5%;
    height: 100%;
    background-color: #333;
    cursor: col-resize;
  }
</style>