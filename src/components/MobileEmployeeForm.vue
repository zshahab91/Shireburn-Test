<script setup lang="ts">
import { useRouter } from 'vue-router'
import EmployeeForm from './EmployeeForm.vue'

defineProps<{
  isEditMode: boolean
}>()

const router = useRouter()

const handleBack = () => {
  router.push('/employees')
}

const handleSave = () => {
  // After successful save
  router.push('/employees')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <button @click="handleBack" class="flex items-center text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span class="ml-2">Back</span>
          </button>
          <h1 class="text-lg font-medium">
            {{ isEditMode ? 'Edit Employee' : 'Create Employee' }}
          </h1>
          <div class="w-12"><!-- Spacer --></div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="px-4 py-6">
      <EmployeeForm :is-edit-mode="isEditMode" @save="handleSave" @cancel="handleBack" />
    </div>
  </div>
</template>
