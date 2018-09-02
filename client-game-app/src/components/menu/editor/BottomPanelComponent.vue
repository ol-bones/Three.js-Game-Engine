<template>
  <div class="row bottom-panel-row fill">
    <div class="bottom col-xs-12 col-sm-12 col-md-12">
      <div class="row fill" style="height:50%;padding:0;">
        <div class="col-xs-12 col-sm-12 col-md-12" style="padding:0;">
          <slot name="top"/>
        </div>
      </div>
    </div>
    <div class="handle"/>
  </div>
</template>

<script>

export default {
  name: "BottomPanelComponent",
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

  .bottom-panel-row {
    position: absolute;
    height: 15%;
    width: 100%;
    background-color: #333;
    color: white;
  }

  .bottom {
    width: 100%;
    height: 97.5%;
    bottom: 0;
    background-color: #222;
    color: white;
  }

  .handle {
    position:absolute;
    top: 0;
    width: 100%;
    height: 2.5%;
    background-color: #333;
    cursor: col-resize;
  }
</style>