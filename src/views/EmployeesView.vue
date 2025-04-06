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

    <EmployeeGrid
      v-else
      :employees="employees"
      @edit="handleEdit"
      @delete="handleDeleteClick"
      @refresh="fetchEmployees"
    />

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
    <Modal :show="showDeleteModal" title="Confirm Delete" @close="handleDeleteCancel">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
        >
          <svg
            class="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 class="text-base font-semibold leading-6 text-gray-900">Delete Employee</h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete {{ employeeToDelete?.firstName }}
              {{ employeeToDelete?.lastName }}? This action cannot be undone.
            </p>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              @click="handleDeleteConfirm"
            >
              Delete
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="handleDeleteCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EmployeeGrid from '@/components/EmployeeGrid.vue'
import Modal from '@/components/Modal.vue'
import EmployeeForm from '@/components/EmployeeForm.vue'

const employees = ref([])
const loading = ref(true)
const showModal = ref(false)
const selectedEmployee = ref(null)
const isEditMode = ref(false)

// Add new refs for delete confirmation
const showDeleteModal = ref(false)
const employeeToDelete = ref(null)

const fetchEmployees = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:3000/employees')
    employees.value = await response.json()
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchEmployees)

const isMobile = ref(false)
const router = useRouter()

onMounted(() => {
  isMobile.value = window.innerWidth < 640
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 640
  })
})

const handleCreate = () => {
  if (isMobile.value) {
    router.push('/employees/create')
  } else {
    showModal.value = true
    isEditMode.value = false
  }
}

const handleEdit = (employee) => {
  if (isMobile.value) {
    router.push(`/employees/${employee.id}/edit-mobile`)
  } else {
    selectedEmployee.value = employee
    isEditMode.value = true
    showModal.value = true
  }
}

const handleClose = () => {
  showModal.value = false
  selectedEmployee.value = null
}

const handleSave = async () => {
  await fetchEmployees()
  handleClose()
}

// Add delete handlers
const handleDeleteClick = (employee) => {
  employeeToDelete.value = employee
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  try {
    loading.value = true
    const response = await fetch(`http://localhost:3000/employees/${employeeToDelete.value.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      await fetchEmployees()
    }
  } catch (error) {
    console.error('Error deleting employee:', error)
  } finally {
    loading.value = false
    showDeleteModal.value = false
    employeeToDelete.value = null
  }
}

const handleDeleteCancel = () => {
  showDeleteModal.value = false
  employeeToDelete.value = null
}
</script>
