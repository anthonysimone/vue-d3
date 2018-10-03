import Vue from 'vue'
import App from './App.vue'
import { router } from '@/router'
import store from '@/store'
import auth from '@/auth'
import firebaseInit from '@/firebase/index'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.config.productionTip = false
Vue.use(VueFire)

new Vue({
  router,
  store,
  beforeCreate () {
    firebaseInit.init()
    auth.init(this)
  },
  render: h => h(App)
}).$mount('#app')

const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

export default db
