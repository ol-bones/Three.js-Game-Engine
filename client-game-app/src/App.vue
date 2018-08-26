<template>
  <div id="app" class="container">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
  width: 100%;
  height: 100%;
  max-width: 100% !important;
  position: fixed;
  padding: 0;
}

body {
  margin: 0;
}

.fill {
  margin: 0;
  padding:0;
}

</style>
