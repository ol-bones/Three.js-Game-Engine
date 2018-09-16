<template>
  <div class="row header-row fill">
    <div class="col-xs-12 col-sm-12 col-md-12">
      <div class="row fill header-buttons-row">
        <header-button-component text="File"/>
        <header-button-component text="Edit"/>
        <header-button-component text="View"/>
      </div>
    </div>
  </div>
</template>

<script>

import HeaderButtonComponent from "./HeaderButtonComponent";

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
    background-image: linear-gradient(#333, #3a3a3a);
    color: white;
    top: 50%;
}

.header-buttons-row {
  height: 100%;
}
</style>