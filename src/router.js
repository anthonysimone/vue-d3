import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import auth from '@/auth'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: () => import('./views/SignIn.vue')
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: () => import('./views/SignUp.vue')
    },
    {
      path: '/404',
      name: 'error404',
      component: () => import('./views/Error404.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = auth.user()
  let requireAuth = to.matched.some(record => record.meta.requireAuth)
  let guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requireAuth && !currentUser) next('signIn')
  else if (guestOnly && currentUser) next('dashboard')
  else next()
})
