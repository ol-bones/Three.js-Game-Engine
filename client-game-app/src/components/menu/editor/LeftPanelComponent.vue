<template>
  <div class="row left-panel-row fill">
    <div class="left-side col-xs-12 col-sm-12 col-md-12">
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
  name: "LeftPanelComponent",
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

  .left-panel-row {
    height:100%;
    width: 100%;
    background-color: #333;
    color: white;
  }

  .left-side {
    width: 97.5%;
    height: 100%;
    padding-right:0;

    background-color: #222;
    color: white;
  }

  .handle {
    position:absolute;
    right: 0;
    width: 2.5%;
    height: 100%;
    background-color: #333;
    cursor: col-resize;
  }
</style>