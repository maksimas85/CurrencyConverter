<template>
  <v-row class="my-4 mx-0 justify-center">
    <h3>{{$props.currentRate}}</h3>
  </v-row>
</template>

<script>
export default {
  name: "CurrentRate",
  props: {
    currentRate: {
      type: String,
      required: false
    }
  }
}
</script>