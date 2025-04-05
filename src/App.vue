<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

const handleLogout = () => {
  localStorage.removeItem('user')
  window.location.href = '/login'
}
</script>

<template>
  <div class="min-h-screen flex flex-col w-screen overflow-x-hidden">
    <AppHeader :user="user" @logout="handleLogout" />

    <!-- Main Content -->
    <main class="flex-grow bg-gray-50 w-full">
      <div class="w-full">
        <RouterView />
      </div>
    </main>

    <AppFooter />
  </div>
</template>
