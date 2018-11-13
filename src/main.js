import Vue from 'vue'
import App from './App.vue'
import { router } from '@/router'
import store from '@/store'
import auth from '@/firebase/auth/index'
import '@/firebase/firestore/index'
import VueFire from 'vuefire'
import VModal from 'vue-js-modal'
import createUuid from '@/mixins/createUuid'

Vue.config.productionTip = false
Vue.use(VueFire)
Vue.use(VModal, { dialog: true, dynamic: true })
Vue.mixin(createUuid)

new Vue({
  router,
  store,
  beforeCreate () {
    auth.init(this)
  },
  render: h => h(App)
}).$mount('#app')
