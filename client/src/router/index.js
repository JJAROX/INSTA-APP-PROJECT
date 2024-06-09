import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import registerPage from '../views/RegisterPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import store from '../store/index.js'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: registerPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.GET_USER_TOKEN) {
      next({
        path: '/'
      })
      store.mutations.SET_TRIED
    } else {
      next()
    }
  } else {
    next()
  }
})


export default router
