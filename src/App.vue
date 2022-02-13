<template>
  <v-app>
    <v-main>
      <CurrencyConverter/>
    </v-main>
  </v-app>
</template>

<script>
import CurrencyConverter from '@/components/CurrencyConverter'

export default {
  name: 'App',
  components: {
    CurrencyConverter
  }
}
</script>
