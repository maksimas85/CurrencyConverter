<template>
  <v-autocomplete
    v-model="value"
    :items="items"
    hide-details
    filled
    solo
    @change="changeCurrency"
  ></v-autocomplete>
</template>

<script>
export default {
  name: "MySelect",
  props: {
    valutes: {
      type: Object,
      required: true
    },
    dataCurrency: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      items: Object.keys(this.$props.valutes),
      value: this.$props.dataCurrency
    }
  },

  methods: {
    changeCurrency() {
      this.$emit('change-currency', this.value)
    }
  }
}
</script>
