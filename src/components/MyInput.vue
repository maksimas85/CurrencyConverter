<template>
  <v-text-field
      v-model.number="dataInput"
      class="ma-3 pa-0 my-input"
      :error-messages="amountErrors"
      label="Введите количество"
      required
      filled
      solo
      @input="$v.dataInput.$touch()"
      @blur="$v.dataInput.$touch()"
      @keyup="InputCalc"
  ></v-text-field>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { decimal, minValue } from 'vuelidate/lib/validators'

export default {
  name: "MyInput",
  mixins: [validationMixin],
  props: {
    valInput: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      amount: null
    }
  },

  validations: {
    dataInput: { decimal, minValue: minValue(0) }
  },

  computed: {
    amountErrors () {
      const errors = []
      if (!this.$v.dataInput.$dirty) return errors
      !this.$v.dataInput.decimal && errors.push('Введите число')
      !this.$v.dataInput.minValue && errors.push('Введите положительное число')
      return errors
    },
    dataInput: {
      get() {
        this.amount = this.valInput
        return this.valInput
      },
      set(val) {
        this.amount = val
      }
    }
  },

  methods: {
    InputCalc() {
      this.$emit('keyup-calc-data', this.amount)
    }
  }
}
</script>
