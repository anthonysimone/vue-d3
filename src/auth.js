import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'
import db from '@/main'

const auth = {
  context: null,
  uiConfig: null,
  ui: null,

  init (context) {
    this.context = context

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
      if (user) {
        // @TODO: create new user in firestore
        db.collection('users').doc(user.uid).get().then((querySnapshot) => {
          if (!querySnapshot.exists) {
            db.collection('users').doc(user.uid).set({
              firstname: 'test',
              lastname: 'test',
              email: 'test@test.com'
            })
              .then(function (docRef) {
                console.log('Document written with ID: ', docRef.id)
              })
              .catch(function (error) {
                console.error('Error adding document: ', error)
              })
          }
        })
      }
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
  },
  isNewUser (user) {
    return user.metadata.creationTime === user.metadata.lastSignInTime
  }
}

export default auth
