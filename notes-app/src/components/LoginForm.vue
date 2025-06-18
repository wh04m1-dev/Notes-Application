<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    await authStore.login(username.value, password.value)
    router.push('/notes')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </div>
      <div v-if="authStore.error" class="text-red-500 text-sm">
        {{ authStore.error }}
      </div>
    </form>
    <div class="mt-4 text-center">
      <router-link to="/register" class="text-indigo-600 hover:text-indigo-800 text-sm">
        Don't have an account? Register
      </router-link>
    </div>
  </div>
</template>
