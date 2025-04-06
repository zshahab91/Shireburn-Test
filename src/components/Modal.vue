<script setup lang="ts">
defineOptions({
  name: 'CustomModal',
})
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  show: boolean
  title: string
}>()

const emit = defineEmits(['close'])

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640
}

// Handle escape key to close modal
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <!-- Mobile Version -->
  <MobileEmployeeForm v-if="isMobile && show" :is-edit-mode="title.includes('Edit')">
    <slot></slot>
  </MobileEmployeeForm>

  <!-- Desktop Modal -->
  <Transition name="modal">
    <div
      v-if="!isMobile && show"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Background backdrop -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="$emit('close')"
      />

      <!-- Modal panel -->
      <div class="flex min-h-full justify-center p-4 text-center sm:items-center">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl"
        >
          <!-- Header -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                {{ title }}
              </h3>
              <button
                type="button"
                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                @click="$emit('close')"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-4 pb-4 sm:p-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
