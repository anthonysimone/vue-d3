<template>
  <div id="app">
    <div id="nav">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li v-if="!isLogged"><router-link to="/sign-in">Sign In</router-link></li>
        <li v-if="!isLogged"><router-link to="/sign-up">Sign Up</router-link></li>
        <li v-if="isLogged"><router-link to="/dashboard">Dashboard</router-link></li>
        <li v-if="isLogged" @click="logout"><button>Logout</button></li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import auth from '@/auth'

export default {
  data () {
    console.log(this.$store.state)
    return {
      user: this.$store.state.user
    }
  },
  computed: {
    ...mapGetters('user', ['isLogged'])
  },
  methods: {
    logout () {
      auth.logout()
      // .then(() => {
      //   this.$router.replace({name: 'home'});
      // });
      // this.$router.push({name: 'home'});
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
</style>
