<template>
    <b-button class="header-button"
    v-on:mouseover="hovered = true"
    v-on:mouseleave="hovered = false"
    :id="`header-button-${String(uid)}`">
      {{text}}
      <div class="header-menu" v-if="hovered"
      v-bind:style="menuPosition">
        <slot name="options"/>
      </div>
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
      hovered: false,
      uid: _.uniqueId()
    }
  },
  computed: {
    menuPosition() {
      try
      {
        const buttonElement = document.getElementById(`header-button-${String(this.uid)}`);
        return {
          left: `${buttonElement.getClientRects()[0].left}px`,
          top: `${buttonElement.clientTop + buttonElement.clientHeight}px`
        }
      }
      catch(e) {
        return {
          left: `0px`,
          top: `0px`
        }
      }
    }
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
    background-image: linear-gradient(black, #222);
    color: white;
  }

  .header-menu {
    position: fixed;
    z-index: 9999;
    background-image: linear-gradient(#222, #2e2e2e);
    border: 1px solid #222;
    min-width: 10vw;
    width: fit-content;
    padding: 0.5%;
    -webkit-box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.75);
    box-shadow: 0px 5px 24px 0px rgba(0,0,0,0.75);
  }
</style>