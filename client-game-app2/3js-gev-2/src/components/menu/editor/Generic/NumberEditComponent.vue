<template>
    <div class="row fill" style="display:flex;align-items:center;">
        <div class="col-xs-12 col-sm-12 col-md-12 fill number-entry">
            <div class="row fill">
                <div class="col-xs-12 col-sm-12 col-md-12 fill" style="height:0;">
                    <b-form-input
                        :value="this.NumberFixed"
                        type="number"
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
    name: "NumberEditComponent",
    components: {
    },
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    computed: {
        NumberFixed() {
            try
            {
                return this.value;
            }
            catch(Exception)
            {
                return 0;
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
        valueChanged(value) {
            try
            {
                const valueNumber = Number(value);
                if(value == void(0) || value === this.NumberFixed) return false;

                if(this.NumberFixed !== valueNumber)
                {
                    this.$emit("changed", valueNumber);
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