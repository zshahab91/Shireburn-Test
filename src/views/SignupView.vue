<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
      <div>
        <h1 class="text-center text-3xl font-extrabold text-gray-900">Purple Cross Ltd</h1>
        <h2 class="mt-2 text-center text-xl text-gray-600">Create an account</h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
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
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              id="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              :class="{ 'border-red-500': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {{ loading ? 'Creating account...' : 'Sign up' }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <router-link to="/login" class="text-sm text-purple-600 hover:text-purple-500">
          Already have an account? Sign in
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
const confirmPassword = ref('')
const loading = ref(false)
const errors = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const handleSignup = async () => {
  // Reset errors
  errors.value = {
    username: '',
    password: '',
    confirmPassword: '',
  }

  // Validation
  if (!username.value) {
    errors.value.username = 'Username is required'
    return
  }
  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    // Check if username already exists
    const checkResponse = await fetch('http://localhost:3000/users')
    const users = await checkResponse.json()

    if (users.some((u) => u.userName === username.value)) {
      errors.value.username = 'Username already exists'
      loading.value = false
      return
    }

    // Create new user
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: username.value,
        password: password.value,
      }),
    })

    if (response.ok) {
      router.push('/login')
    }
  } catch (error) {
    console.error('Signup error:', error)
    errors.value.username = 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
