import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'

const config = {
  apiKey: 'AIzaSyDx20tLC66Q91N7T5MfrOfp5Jq-DVCpqfI',
  authDomain: 'vue-d3-project.firebaseapp.com',
  databaseURL: 'https://vue-d3-project.firebaseio.com',
  projectId: 'vue-d3-project',
  storageBucket: 'vue-d3-project.appspot.com',
  messagingSenderId: '716579756694'
}

const auth = {
  context: null,
  uiConfig: null,
  ui: null,

  init (context) {
    this.context = context

    firebase.initializeApp(config)
    this.uiConfig = {
      signInSuccessUrl: 'dashboard',
      // signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    this.ui = new firebaseui.auth.AuthUI(firebase.auth())

    firebase.auth().onAuthStateChanged((user) => {
      console.log('auth state change')
      this.context.$store.dispatch('user/setCurrentUser')

      let requireAuth = this.context.$route.matched.some(record => record.meta.requireAuth)
      let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)

      if (requireAuth && !user) this.context.$router.push({ name: 'signIn' })
      else if (guestOnly && user) this.context.$router.push({ name: 'dashboard' })
    })
  },
  authForm (container) {
    this.ui.start(container, this.uiConfig)
  },
  user () {
    return this.context ? firebase.auth().currentUser : null
  },
  logout () {
    return firebase.auth().signOut()
  }
}

export default auth
