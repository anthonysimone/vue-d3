import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseui from 'firebaseui'
import { db } from '@/firebase/firestore/index'

const auth = {
  context: null,
  uiConfig: null,
  ui: null,

  init (context) {
    this.context = context

    this.uiConfig = {
      signInSuccessUrl: 'dashboard',
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    this.ui = new firebaseui.auth.AuthUI(firebase.auth())
    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.isNewUser(user)) {
        db.collection('users').doc(user.uid).get().then((querySnapshot) => {
          if (!querySnapshot.exists) {
            let userProfile = {
              firstname: user.displayName.split(' ')[0],
              lastname: user.displayName.split(' ')[1] || '',
              email: user.email,
              photoUrl: user.photoURL
            }
            db.collection('users').doc(user.uid).set(userProfile)
              .then(function (docRef) {
                console.log('Document written')
                console.log(docRef)
                this.context.$store.dispatch('user/setCurrentUserProfile', userProfile)
              })
              .catch(function (error) {
                console.error('Error adding document: ', error)
              })
          }
        })
      } else if (user) {
        db.collection('users').doc(user.uid).get().then((querySnapshot) => {
          if (querySnapshot.exists) {
            this.context.$store.dispatch('user/setCurrentUserProfile', querySnapshot.data())
          }
        })
      }
      this.context.$store.dispatch('user/setCurrentUser')

      let requireAuth = this.context.$route.matched.some(record => record.meta.requiresAuth)
      let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)

      if (requireAuth && !user) this.context.$router.push({ name: 'sign-in' })
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
