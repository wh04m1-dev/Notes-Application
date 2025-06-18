<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Initialize axios with token if exists
  if (authStore.token) {
    authStore.setAuthData(authStore.token, authStore.user)
  }
})

const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-indigo-600">Notes App</router-link>
        <div v-if="authStore.token" class="flex items-center gap-4">
          <span class="text-sm text-gray-600">Hello, {{ authStore.user?.username }}</span>
          <button
            @click="logout"
            class="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
        <div v-else class="flex gap-4">
          <router-link to="/login" class="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">
            Login
          </router-link>
          <router-link
            to="/register"
            class="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Register
          </router-link>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>
