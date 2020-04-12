<template>
    <div class="row fill" style="display:flex;align-items:center;">
        <div class="col-xs-12 col-sm-12 col-md-12 fill number-entry">
            <div class="row fill">
                <div class="col-xs-12 col-sm-12 col-md-12 fill" style="height:0;">
                    <b-form-checkbox switch
                        v-model="val"
                        class="number-entry-input"
                        v-on:input="valueChanged($event)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "BooleanEditComponent",
    components: {
    },
    props: {
        value: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            val: this.$props.value
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        valueChanged(value) {
            try
            {
                this.val = value;
                this.$emit("changed", value);
            }
            catch(Exception) {}
        }
    }
};

</script>

<style scoped>
  .number-entry {
    text-align: left;
    white-space: nowrap;
    font-size: 75%;
  }

  .number-entry-input {
    height:33%;
    border-color: transparent;
    border-radius: 0;
    background-color: transparent;
    color: white;
    font-size: 12px;
  }
</style>