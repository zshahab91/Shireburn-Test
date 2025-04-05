<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Employees</h1>
      <button
        @click="handleCreate"
        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Create Employee
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <EmployeeGrid v-else :employees="employees" @edit="handleEdit" @delete="fetchEmployees" />

    <Modal
      :show="showModal"
      :title="isEditMode ? 'Edit Employee' : 'Create Employee'"
      @close="handleClose"
    >
      <EmployeeForm
        :employee="selectedEmployee"
        :is-edit-mode="isEditMode"
        @save="handleSave"
        @cancel="handleClose"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EmployeeGrid from '@/components/EmployeeGrid.vue'
import Modal from '@/components/Modal.vue'
import EmployeeForm from '@/components/EmployeeForm.vue'

const employees = ref([])
const loading = ref(true)
const showModal = ref(false)
const selectedEmployee = ref(null)
const isEditMode = ref(false)

onMounted(async () => {
  await fetchEmployees()
})

const fetchEmployees = async () => {
  try {
    const response = await fetch('http://localhost:3000/employees')
    employees.value = await response.json()
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  selectedEmployee.value = null
  isEditMode.value = false
  showModal.value = true
}

const handleEdit = (employee) => {
  selectedEmployee.value = employee
  isEditMode.value = true
  showModal.value = true
}

const handleClose = () => {
  showModal.value = false
  selectedEmployee.value = null
}

const handleSave = async () => {
  await fetchEmployees()
  handleClose()
}
</script>
