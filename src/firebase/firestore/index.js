import * as firebase from 'firebase/app'
import config from '@/firebase/config'
import 'firebase/firestore'

firebase.initializeApp(config)

const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true })

// Create firebase collection references
// const usersCollection = db.collection('users')

export {
  db
  // usersCollection,
  // postsCollection,
  // commentsCollection,
  // likesCollection
}
