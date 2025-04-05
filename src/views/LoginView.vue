<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900">Purple Cross Ltd</h1>
        <h2 class="mt-2 text-center text-xl text-gray-600">Sign in to your account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              v-model="username"
              id="username"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              :class="{ 'border-red-500': errors.username }"
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <router-link to="/signup" class="text-sm text-purple-600 hover:text-purple-500">
          Don't have an account? Sign up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errors = ref({
  username: '',
  password: '',
})

const handleLogin = async () => {
  // Reset errors
  errors.value = {
    username: '',
    password: '',
  }

  // Validation
  if (!username.value) {
    errors.value.username = 'Username is required'
    return
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }

  loading.value = true

  try {
    const response = await fetch('http://localhost:3000/users')
    const users = await response.json()

    const user = users.find((u) => u.userName === username.value && u.password === password.value)

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/employees')
    } else {
      errors.value.username = 'Invalid username or password'
    }
  } catch (error) {
    console.error('Login error:', error)
    errors.value.username = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
