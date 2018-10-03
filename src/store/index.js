import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  plugins: [createPersistedState({
    key: 'vuex-d3',
    paths: ['user']
  })],
  mutations: {

  },
  actions: {

  },
  modules: {
    user
  }
})
