<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmployeeForm from './EmployeeForm.vue'

interface Employee {
  id: number
  code: string
  firstName: string
  lastName: string
  occupation: string
  department: string
  employmentDate: string
  terminationDate: string | null
}

defineProps<{
  mode: 'view' | 'edit'
}>()

const route = useRoute()
const router = useRouter()
const employee = ref<Employee | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/employees/${route.params.id}`)
    if (!response.ok) {
      throw new Error('Employee not found')
    }
    employee.value = await response.json()
  } catch (error) {
    console.error('Error fetching employee:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (date: string | null) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getEmploymentStatus = (employee: Employee) => {
  if (employee.terminationDate) {
    const terminationDate = new Date(employee.terminationDate)
    return terminationDate > new Date() ? 'To be terminated' : 'Terminated'
  }
  const employmentDate = new Date(employee.employmentDate)
  return employmentDate > new Date() ? 'Starting soon' : 'Active'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800'
    case 'Starting soon':
      return 'bg-blue-100 text-blue-800'
    case 'To be terminated':
      return 'bg-yellow-100 text-yellow-800'
    case 'Terminated':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const handleSave = async () => {
  try {
    loading.value = true
    // Navigate to employees list after successful save
    router.push('/employees')
  } catch (error) {
    console.error('Error saving employee:', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/employees')
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <!-- Back button -->
    <button
      @click="router.push('/employees')"
      class="mb-6 flex items-center text-gray-600 hover:text-gray-900"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back to Employees
    </button>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <template v-else-if="employee">
      <!-- Edit Mode -->
      <div v-if="mode === 'edit'" class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">Edit Employee</h1>
        </div>

        <div class="p-6">
          <EmployeeForm
            :employee="employee"
            :is-edit-mode="true"
            @save="handleSave"
            @cancel="handleCancel"
          />
        </div>
      </div>

      <!-- View Mode -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-8 border-b border-gray-200">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ employee.firstName }} {{ employee.lastName }}
              </h1>
              <p class="mt-1 text-sm text-gray-500">{{ employee.code }}</p>
            </div>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                getStatusColor(getEmploymentStatus(employee)),
              ]"
            >
              {{ getEmploymentStatus(employee) }}
            </span>
          </div>
        </div>

        <!-- Details -->
        <div class="px-6 py-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Occupation</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.occupation }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Department</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.department }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Employment Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(employee.employmentDate) }}
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-500">Termination Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(employee.terminationDate) }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-end space-x-3">
            <button
              @click="router.push(`/employees/${employee.id}/edit`)"
              class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Employee not found</p>
    </div>
  </div>
</template>
