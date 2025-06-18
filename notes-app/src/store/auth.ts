import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'

interface User {
  username: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  function setAuthData(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  async function register(username: string, email: string, password: string) {
    try {
      isLoading.value = true
      const response = await axios.post('/auth/register', { username, email, password })
      await login(username, password)
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function login(username: string, password: string) {
    try {
      isLoading.value = true
      const response = await axios.post('/auth/login', { username, password })
      setAuthData(response.data.token, { username, email: '' })
      router.push('/notes')
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    router.push('/login')
  }

  return { user, token, error, isLoading, register, login, logout, setAuthData }
})
