<template>
  <div class="edit-profile">
    <page-header pageTitle="Edit Profile"></page-header>
    <section class="section">
      <div class="container">
        <h2 class="title is-3">Edit your profile information below</h2>
        <form @submit.prevent="updateProfile" @change="updateChangedStatus">
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label" for="firstName">First Name</label>
                <div class="control">
                  <input class="input" type="text" placeholder="First Name" id="firstName" v-model="currentValues.firstname">
                </div>
              </div>
              <div class="field">
                <label class="label" for="lastName">Last Name</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Last Name" id="lastName" v-model="currentValues.lastname">
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="text" disabled v-model="userProfile.email">
                  <p class="help">Your email is your unique identifier for your account, you cannot change this after creation.</p>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label" for="photoUrl">Photo Url</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Photo Url" id="photoUrl" v-model="currentValues.photoUrl">
                </div>
                <div v-if="showTestPhoto" class="field has-addons photo-test-buttons">
                  <p class="control">
                    <button @click.prevent="updateTestPhoto" class="button is-small">Test New Photo Url</button>
                  </p>
                  <p class="control">
                    <button @click.prevent="removeTestPhoto" class="button is-small is-danger">Remove</button>
                  </p>
                </div>
                <div :class="['profile-photos', { 'testing-photo' : testPhotoUrl }]">
                  <div class="profile-photo current-photo">
                    <div class="profile-avatar" :style="{ backgroundImage: 'url(' + userProfile.photoUrl + ')'}"></div>
                  </div>
                  <div class="profile-photo new-photo" v-if="testPhotoUrl">
                    <div class="profile-avatar" :style="{ backgroundImage: 'url(' + testPhotoUrl + ')'}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button :class="['button', 'is-primary', { 'is-loading' : isLoading}]">Update Profile</button>
          <p class="help is-danger" v-show="isChanged">You have unsaved changes, make sure to save your updates if you would like to keep them!</p>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import auth from '@/firebase/auth/index'
import { db } from '@/firebase/firestore/index'
import PageHeader from '@/components/elements/layout/PageHeader'

export default {
  components: {
    PageHeader
  },
  data () {
    return {
      isLoading: false,
      isChanged: false,
      testPhotoUrl: '',
      currentValues: {
        firstname: '',
        lastname: '',
        photoUrl: ''
      }
    }
  },
  computed: {
    ...mapGetters('user', ['userProfile']),
    showTestPhoto () {
      return this.currentValues.photoUrl !== this.userProfile.photoUrl
    }
  },
  methods: {
    updateProfile () {
      this.isLoading = true
      let profileRef = db.collection('users').doc(auth.user().uid)
      profileRef.set({
        firstname: this.currentValues.firstname,
        lastname: this.currentValues.lastname,
        photoUrl: this.currentValues.photoUrl
      }, { merge: true }).then(() => {
        this.isLoading = false
        this.$store.dispatch('user/updateCurrentUserProfile', this.currentValues)
        this.updateChangedStatus()
      }).catch((error) => {
        this.isLoading = false
        console.log(`There was an error: ${error}`)
      })
    },
    updateChangedStatus () {
      for (let key in this.currentValues) {
        if (this.currentValues[key] !== this.userProfile[key]) {
          this.isChanged = true
          return
        }
      }
      this.isChanged = false
    },
    updateTestPhoto () {
      this.testPhotoUrl = this.currentValues.photoUrl
    },
    removeTestPhoto () {
      this.currentValues.photoUrl = this.userProfile.photoUrl
      this.testPhotoUrl = ''
      this.updateChangedStatus()
    }
  },
  mounted () {
    // On component mount, fill all the "currentValues" with the default items
    for (let key in this.currentValues) {
      this.currentValues[key] = this.userProfile[key] || ''
    }
  }
}
</script>

<style lang="scss">
.profile-photos {
  margin-top: 10px;
  display: flex;
  .profile-photo {
    width: 60px;
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
  .profile-avatar {
    width: 100%;
    height: 0;
    padding-top: 100%;
    background-size: cover;
    background-position: center center;
    border-radius: 100%;
  }
}
.profile-avatar {
  position: relative;
  overflow: hidden;
}
.photo-test-buttons {
  margin-top: 10px;
}
.testing-photo {
  .current-photo .profile-avatar {
    opacity: 0.5;
    &:after {
      content: '';
      position: absolute;
      border: 2px solid red;
      border-radius: 100%;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: -50%;
      width: 200%;
      height: 2px;
      transform: rotate(45deg);
      background: red;
      z-index: 1;
    }
  }
  .new-photo .profile-avatar:after {
    content: '';
    position: absolute;
    border: 2px solid green;
    border-radius: 100%;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
