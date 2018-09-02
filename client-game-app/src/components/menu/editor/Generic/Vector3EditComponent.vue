<template>
    <div class="row fill" style="display:flex;align-items:center;">
        <div class="col-xs-12 col-sm-12 col-md-12 fill number-entry">
            <div class="row fill">
                <div class="col-xs-1 col-sm-1 col-md-1 fill">
                    x:
                </div>
                <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
                    <b-form-input
                        :value="this.Vector3Fixed.x"
                        type="number"
                        class="number-entry-input"
                        v-on:input="vectorComponentChanged('x', $event)"
                    />
                </div>
            </div>  
            <div class="row fill">
                <div class="col-xs-1 col-sm-1 col-md-1 fill">
                    y:
                </div>
                <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
                    <b-form-input
                        :value="this.Vector3Fixed.y"
                        type="number"
                        class="number-entry-input"
                        v-on:input="vectorComponentChanged('y', $event)"
                    />
                </div>
            </div>
            <div class="row fill">
                <div class="col-xs-1 col-sm-1 col-md-1 fill">
                    z:
                </div>
                <div class="col-xs-11 col-sm-11 col-md-11 fill" style="height:0;">
                    <b-form-input
                        :value="this.Vector3Fixed.z"
                        type="number"
                        class="number-entry-input"
                        v-on:input="vectorComponentChanged('z', $event)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "GeneralPropertiesComponent",
    components: {
    },
    props: {
        vector: {
            type: Object,
            required: true
        }
    },
    computed: {
        Vector3Fixed() {
            try
            {
                return {
                    x: this.vector && this.vector.x ? this.vector.x : 0,
                    y: this.vector && this.vector.y ? this.vector.y : 0,
                    z: this.vector && this.vector.z ? this.vector.z : 0
                }
            }
            catch(Exception)
            {
                return {x: 0, y: 0, z: 0}
            }
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
        vectorComponentChanged(vectorComponent, value) {
            try
            {
                const valueNumber = Number(value);
                if(this.Vector3Fixed[vectorComponent] !== valueNumber)
                {
                    this.$emit("changed", vectorComponent, valueNumber);
                }
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