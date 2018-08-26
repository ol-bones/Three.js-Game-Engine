<template>
    <b-button class="header-button">
      {{this.text}}
    </b-button>
</template>

<script>

export default {
  name: "HeaderButtonComponent",
  props: {
    text: {
      type: String,
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
  }
};
</script>

<style scoped>
  .header-button {
    color: #c4c4c4;
    background-color: transparent;

    border-radius: 0;
    border: 0;
    margin: 0;

    height: 100%;
    -webkit-appearance: unset;
    font-size: small;
  }

  .header-button:hover {
    background-color: black;
    color: white;
  }
</style>