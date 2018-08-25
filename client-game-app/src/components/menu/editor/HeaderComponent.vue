<template>
  <div class="row header-row fill">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <div class="row fill header-buttons-row">
        <header-button-component text="Home"/>
        <header-button-component text="Play"/>
        <header-button-component text="EntityCreate"/>
      </div>
    </div>
  </div>
</template>

<script>

import HeaderButtonComponent from "./Header/HeaderButtonComponent";

export default {
  name: "HeaderComponent",
  components: {
    HeaderButtonComponent
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

.header-row {
    height:100%;
    width: 100%;
    background-color: #333;
    color: white;
    top: 50%;
}

.header-buttons-row {
  height: 100%;
}
</style>