<template>
  <div class="about">
    <page-header pageTitle="Sign In" subTitle="Choose your sign in method. If you do not yet have an account, you can choose a method below to create one!"></page-header>
    <div class="container">
      <section class="section">
        <div id="firebaseui-auth-container"></div>
      </section>
    </div>
  </div>
</template>

<script>
import auth from '@/firebase/auth/index'
import PageHeader from '@/components/elements/layout/PageHeader'

export default {
  name: 'signIn',
  components: {
    PageHeader
  },
  mounted () {
    auth.authForm('#firebaseui-auth-container')
  }
}
</script>

<style>
@import "../../node_modules/firebaseui/dist/firebaseui.css";
</style>
