import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import NoteList from '@/components/NoteList.vue'
import NoteForm from '@/components/NoteForm.vue'
import NoteDetail from '@/components/NoteDetail.vue'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/notes',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm,
      meta: { requiresAuth: false },
    },
    {
      path: '/notes',
      name: 'notes',
      component: NoteList,
      meta: { requiresAuth: true },
    },
    {
      path: '/notes/new',
      name: 'new-note',
      component: NoteForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/notes/:id',
      name: 'note-detail',
      component: NoteDetail,
      meta: { requiresAuth: true },
    },
    {
      path: '/notes/:id/edit',
      name: 'edit-note',
      component: NoteForm,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.token) {
    next('/notes')
  } else {
    next()
  }
})

export default router
