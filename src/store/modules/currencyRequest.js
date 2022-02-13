import axios from 'axios'

const state = {
    val: null
}

const mutations = {
    SET_CURRENCIES_TO_STATE: (state, res) => {
        state.val = res.rates
    }
}

const actions = {
    async GET_CURRENCIES_FROM_API({ commit }) {
        const key = process.env.VUE_APP_FIXER
        const currency = await axios(`http://data.fixer.io/api/latest?access_key=${key}`);
        commit("SET_CURRENCIES_TO_STATE", currency.data)
    }
}

const getters = {
    VALUTES(state) {
        return state.val
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}