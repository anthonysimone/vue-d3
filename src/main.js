import Vue from 'vue'
import App from './App.vue'
import { router } from '@/router'
import store from '@/store'
import auth from '@/firebase/auth/index'
import '@/firebase/firestore/index'
import VueFire from 'vuefire'

Vue.config.productionTip = false
Vue.use(VueFire)

new Vue({
  router,
  store,
  beforeCreate () {
    auth.init(this)
  },
  render: h => h(App)
}).$mount('#app')
