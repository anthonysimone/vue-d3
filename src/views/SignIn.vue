<template>
  <div class="about">
    <h1>Sign In</h1>
    <p>Choose your sign in method. If you do not yet have an account, you can choose a method below to create one!</p>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import auth from '@/auth'

export default {
  name: 'signIn',
  mounted () {
    auth.authForm('#firebaseui-auth-container')
  }
}
</script>

<style>
  @import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>
