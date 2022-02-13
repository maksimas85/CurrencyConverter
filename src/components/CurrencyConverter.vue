<template>
  <v-container class="pa-2 converter-page__wrapper">
    <CurrentRate :currentRate="currentRate"/>
    <v-col class="ma-0 pa-2">
      <v-row class="ma-0 pa-0 justify-center">
        <MySelect
            v-if="firstActiveCurrency"
            class="ma-3 my-select"
            :valutes="VALUTES"
            :dataCurrency="firstActiveCurrency"
            @change-currency="changeFirstCurrency"
        />
        <v-text-field
            v-model="firstInput"
            class="ma-3 pa-0 my-input"
            :error-messages="amountFirstErrors"
            label="Введите количество"
            required
            filled
            solo
            @input="$v.firstInput.$touch()"
            @blur="$v.firstInput.$touch()"
            @keyup="secondInputCalc()"
        ></v-text-field>
      </v-row>
      <v-row class="ma-0 pa-0 justify-center">
        <MySelect
            v-if="secondActiveCurrency"
            class="ma-3 my-select"
            :valutes="VALUTES"
            :dataCurrency="secondActiveCurrency"
            @change-currency="changeSecondCurrency"
        />
        <v-text-field
            v-model="secondInput"
            class="ma-3 pa-0 my-input"
            :error-messages="amountSecondErrors"
            label="Введите количество"
            required
            filled
            solo
            @input="$v.secondInput.$touch()"
            @blur="$v.secondInput.$touch()"
            @keyup="firstInputCalc()"
        ></v-text-field>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import MySelect from '@/components/MySelect'
import CurrentRate from '@/components/CurrentRate'
import { validationMixin } from 'vuelidate'
import { decimal, minValue } from 'vuelidate/lib/validators'

export default {
  name: "CurrencyConverter",
  mixins: [validationMixin],
  components: {
    MySelect,
    CurrentRate
  },

  data() {
    return {
      firstActiveCurrency: null,
      secondActiveCurrency: null,
      firstInput: null,
      secondInput: null
    };
  },

  validations: {
    firstInput: { decimal, minValue: minValue(0) },
    secondInput: { decimal, minValue: minValue(0) }
  },

  computed: {
    ...mapGetters(["VALUTES"]),

    amountFirstErrors () {
      const errors = []
      if (!this.$v.firstInput.$dirty) return errors
      !this.$v.firstInput.decimal && errors.push('Введите число')
      !this.$v.firstInput.minValue && errors.push('Введите положительное число')
      return errors
    },

    amountSecondErrors () {
      const errors = []
      if (!this.$v.secondInput.$dirty) return errors
      !this.$v.secondInput.decimal && errors.push('Введите число')
      !this.$v.secondInput.minValue && errors.push('Введите положительное число')
      return errors
    },

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
      if (Number(this.firstInput) === 0 || Number(this.firstInput) == null) {
        this.secondInput = null
      }
    },
    secondInput() {
      if (Number(this.secondInput) === 0 || Number(this.secondInput) == null) {
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

    firstInputCalc() {
      if (Number(this.secondInput) > 0 && (typeof Number(this.secondInput)) === 'number') {
        this.firstInput = parseFloat(
            (
                (Number(this.secondInput) * this.VALUTES[this.firstActiveCurrency]) /
                this.VALUTES[this.secondActiveCurrency]
            ).toFixed(2)
        )
        this.$forceUpdate()
      }
    },

    secondInputCalc() {
      if (Number(this.firstInput) > 0 && (typeof Number(this.firstInput)) === 'number') {
        this.secondInput = parseFloat(
            (
                (Number(this.firstInput) * this.VALUTES[this.secondActiveCurrency]) /
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
