import * as firebase from 'firebase/app'
import config from '@/firebase/config'

export default {
  init () {
    firebase.initializeApp(config)
  }
}
