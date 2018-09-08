<template>
  <div class="row right-panel-row fill">
    <div class="right-side col-xs-12 col-sm-12 col-md-12">
      <div class="row fill" style="height:50%;padding:0;">
        <div class="col-xs-12 col-sm-12 col-md-12" style="padding:0;">
          <slot name="top"/>
        </div>
      </div>
      <div class="row fill" style="height:50%;padding:0;">
        <div class="col-xs-12 col-sm-12 col-md-12" style="padding:0;">
          <slot name="bottom"/>
        </div>
      </div>
    </div>
    <div class="handle"/>
  </div>
</template>

<script>

export default {
  name: "RightPanelComponent",
  components: {
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