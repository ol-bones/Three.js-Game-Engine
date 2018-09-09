<template>
  <div class="col-xs-12 col-sm-12 col-md-12">
    <div class="row fill" style="height:45%;">
      <material-preview-component :entity="this.entity"/>
    </div>
  </div>
</template>

<script>

import MaterialPreviewComponent from "./../Generic/MaterialPreviewComponent";

export default {
  name: "RenderComponentPropertiesComponent",
  components: {
    MaterialPreviewComponent
  },
  props: {
    entity: {
      type: Object,
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
  },
  methods: {
  }
};

</script>

<style scoped>
</style>