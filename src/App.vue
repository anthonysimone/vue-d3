<template>
  <div id="app">

    <!-- begin header and menu -->
    <section class="hero is-primary is-small">
      <!-- Hero head: will stick at the top -->
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <router-link class="navbar-item" :to="{ name: 'home' }" exact>D3 Helper</router-link>
              <span @click="toggleMenu" :class="{ 'navbar-burger burger': true, 'is-active': menuIsActive }" data-target="navbarMenuHeroA">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroA" :class="{ 'navbar-menu': true, 'is-active' : menuIsActive }">
              <div class="navbar-end">
                <router-link v-if="!isLogged" class="navbar-item" :to="{ name: 'sign-in'}">Sign In</router-link>
                <div v-if="isLogged" :class="['navbar-item dropdown', 'is-right', {'is-active' : dropdownIsActive}]" v-on-clickaway="closeDropdown">
                  <div class="dropdown-trigger">
                    <button class="button is-inverted" @click="toggleDropdown" aria-haspopup="true" aria-controls="dropdown-menu">
                      <span class="icon is-small tiny-button-avatar" :style="{backgroundImage: 'url('+userProfile.photoUrl+')' }"></span>
                      <span>{{ userProfile.firstname }}</span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <router-link class="dropdown-item" :to="{ name: 'dashboard' }">Dashboard</router-link>
                      <router-link class="dropdown-item" :to="{ name: 'add-visualization' }">Add</router-link>
                      <hr class="dropdown-divider">
                      <router-link class="dropdown-item" :to="{ name: 'edit-profile' }">Edit Profile</router-link>
                      <a class="dropdown-item" @click.prevent="logout">Logout</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </section>
    <!-- end header and menu -->

    <router-view/>

    <footer class="footer hero is-primary is-small">
      <div class="container">
        <p>D3 Helper, <a href="https://github.com/anthonysimone/vue-d3" target="_blank">view the project</a> on Github!</p>
      </div>
    </footer>

    <v-dialog></v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { mixin as clickaway } from 'vue-clickaway';
import { directive as onClickaway } from 'vue-clickaway'
import auth from '@/firebase/auth/index'

export default {
  directives: {
    onClickaway
  },
  data () {
    return {
      // user: this.$store.state.user,
      menuIsActive: false,
      dropdownIsActive: false
    }
  },
  computed: {
    ...mapGetters('user', ['isLogged', 'user', 'userProfile'])
  },
  methods: {
    logout () {
      auth.logout()
    },
    toggleMenu () {
      this.menuIsActive = !this.menuIsActive
    },
    toggleDropdown () {
      this.dropdownIsActive = !this.dropdownIsActive
    },
    closeDropdown () {
      this.dropdownIsActive = false
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $black;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: $black;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.tiny-button-avatar {
  background-size: cover;
  border-radius: 100%;
}
footer.footer {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
