<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps<{
  user: { userName: string }
}>()

const isMenuOpen = ref(false)

const emit = defineEmits(['logout'])

const handleLogout = () => {
  emit('logout')
}
</script>

<template>
  <header class="bg-purple-600 text-white shadow-lg w-full">
    <div class="w-full px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-8" />
          <span class="text-xl font-bold">Purple Cross Ltd</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <RouterLink
            v-if="user.userName"
            to="/employees"
            class="hover:text-purple-200 transition-colors"
            active-class="text-white font-bold"
          >
            Employees
          </RouterLink>
          <template v-if="!user.userName">
            <RouterLink
              to="/login"
              class="hover:text-purple-200 transition-colors"
              active-class="text-white font-bold"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/signup"
              class="hover:text-purple-200 transition-colors"
              active-class="text-white font-bold"
            >
              Sign Up
            </RouterLink>
          </template>
          <div v-else class="flex items-center space-x-4">
            <span>Welcome, {{ user.userName }}!</span>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-purple-700 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!isMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="isMenuOpen" class="md:hidden pb-4">
        <RouterLink
          v-if="user.userName"
          to="/employees"
          class="block py-2 hover:text-purple-200 transition-colors"
        >
          Employees
        </RouterLink>
        <template v-if="!user.userName">
          <RouterLink to="/login" class="block py-2 hover:text-purple-200 transition-colors">
            Login
          </RouterLink>
          <RouterLink to="/signup" class="block py-2 hover:text-purple-200 transition-colors">
            Sign Up
          </RouterLink>
        </template>
        <div v-else class="py-2">
          <div class="mb-2">Welcome, {{ user.userName }}!</div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
