<template>
  <v-container class="pa-2 converter-page__wrapper">
    <CurrentRate :currentRate="currentRate"/>
    <v-col class="ma-0 pa-2">
      <v-row class="ma-0 pa-0 justify-center">
        <MySelect
            v-if="firstActiveCurrency"
            :valutes="VALUTES"
            :dataCurrency="firstActiveCurrency"
            @change-currency="changeFirstCurrency"
        />
        <MyInput @keyup-calc-data="secondInputCalc" :valInput="firstInput"/>
      </v-row>
      <v-row class="ma-0 pa-0 justify-center">
        <MySelect
            v-if="secondActiveCurrency"
            :valutes="VALUTES"
            :dataCurrency="secondActiveCurrency"
            @change-currency="changeSecondCurrency"
        />
        <MyInput @keyup-calc-data="firstInputCalc" :valInput="secondInput"/>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import MySelect from '@/components/MySelect'
import CurrentRate from '@/components/CurrentRate'
import MyInput from '@/components/MyInput'

export default {
  name: "CurrencyConverter",
  components: {
    MySelect,
    CurrentRate,
    MyInput
  },

  data() {
    return {
      firstActiveCurrency: null,
      secondActiveCurrency: null,
      firstInput: null,
      secondInput: null
    };
  },

  computed: {
    ...mapGetters(["VALUTES"]),

    currentRate() {
      if (this.firstActiveCurrency && this.secondActiveCurrency) {
        return this.VALUTES[this.secondActiveCurrency] > this.VALUTES[this.firstActiveCurrency]
            ?
            `1 ${this.firstActiveCurrency} = ${(this.VALUTES[this.secondActiveCurrency]/this.VALUTES[this.firstActiveCurrency]).toFixed(2)} ${this.secondActiveCurrency}`
            :
            `1 ${this.secondActiveCurrency} = ${(this.VALUTES[this.firstActiveCurrency]/this.VALUTES[this.secondActiveCurrency]).toFixed(2)} ${this.firstActiveCurrency}`
      }
    }
  },

  watch: {
    firstInput() {
      if (!this.firstInput) {
        this.secondInput = null
      }
    },
    secondInput() {
      if (!this.secondInput) {
        this.firstInput = null
      }
    }
  },

  mounted() {
    this.GET_CURRENCIES_FROM_API();
  },

  methods: {
    async GET_CURRENCIES_FROM_API() {
      await this.$store.dispatch('GET_CURRENCIES_FROM_API')
      this.firstActiveCurrency = localStorage.getItem('firstActiveCurrency') ? localStorage.getItem('firstActiveCurrency') : "RUB"
      this.secondActiveCurrency = localStorage.getItem('secondActiveCurrency') ? localStorage.getItem('secondActiveCurrency') : "USD"
    },

    changeFirstCurrency(cur) {
      this.reset()
      this.firstActiveCurrency = cur
      localStorage.setItem('firstActiveCurrency', this.firstActiveCurrency)
    },

    changeSecondCurrency(cur) {
      this.reset()
      this.secondActiveCurrency = cur
      localStorage.setItem('secondActiveCurrency', this.secondActiveCurrency)
    },

    firstInputCalc(valInput) {
      this.secondInput = valInput
      if (valInput > 0) {
        this.firstInput = parseFloat(
            (
                (valInput * this.VALUTES[this.firstActiveCurrency]) /
                this.VALUTES[this.secondActiveCurrency]
            ).toFixed(2)
        )
        this.$forceUpdate()
      }
    },

    secondInputCalc(valInput) {
      this.firstInput = valInput
      if (valInput > 0) {
        this.secondInput = parseFloat(
            (
                (valInput * this.VALUTES[this.secondActiveCurrency]) /
                this.VALUTES[this.firstActiveCurrency]
            ).toFixed(2)
        )
        this.$forceUpdate()
      }
    },

    reset() {
      this.firstInput = null;
      this.secondInput = null;
    }
  }
};
</script>

<style>
.converter-page__wrapper {
  margin: 0 auto;
  height: calc(100% - 100px);
}
@media screen and (min-width: 600px) {
  .my-input, .my-select {
    max-width: 40%;
  }
}
</style>
