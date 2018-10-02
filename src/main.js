import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from '@/store'
import GSignInButton from 'vue-google-signin-button'
import auth from '@/auth'

Vue.config.productionTip = false
Vue.use(GSignInButton)

new Vue({
  router,
  store,
  beforeCreate () {
    auth.init(this)
  },
  render: h => h(App)
}).$mount('#app')
