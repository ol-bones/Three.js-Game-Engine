<template>
  <div class="row left-panel-row fill">
    <div class="left-side">
      <slot/>
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
    background-color: #222;
    color: white;
  }

  .handle {
    width: 2.5%;
    height: 100%;
    background-color: #333;
    cursor: col-resize;
  }
</style>