<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Employee {
  id?: number
  code: string
  firstName: string
  lastName: string
  occupation: string
  department: string
  employmentDate: string
  terminationDate: string | null
}

interface FormErrors {
  code?: string
  firstName?: string
  lastName?: string
  occupation?: string
  department?: string
  employmentDate?: string
}

const props = defineProps<{
  employee?: Employee | null
  isEditMode: boolean
}>()

const emit = defineEmits(['save', 'cancel'])

const departments = [
  'IT',
  'Human Resources',
  'Marketing',
  'Sales',
  'R&D',
  'Finance',
  'Quality Control',
  'Product'
]

const form = ref<Employee>({
  code: '',
  firstName: '',
  lastName: '',
  occupation: '',
  department: '',
  employmentDate: new Date().toISOString().split('T')[0],
  terminationDate: null
})

const errors = ref<FormErrors>({})
const isLoading = ref(false)

// Validation
const validateForm = () => {
  const newErrors: FormErrors = {}

  if (!form.value.code) {
    newErrors.code = 'Employee code is required'
  } else if (!/^EMP\d{3}$/.test(form.value.code)) {
    newErrors.code = 'Code must be in format EMP followed by 3 digits (e.g., EMP001)'
  }

  if (!form.value.firstName.trim()) {
    newErrors.firstName = 'First name is required'
  }

  if (!form.value.lastName.trim()) {
    newErrors.lastName = 'Last name is required'
  }

  if (!form.value.occupation.trim()) {
    newErrors.occupation = 'Occupation is required'
  }

  if (!form.value.department) {
    newErrors.department = 'Department is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Initialize form with employee data if in edit mode
onMounted(() => {
  if (props.employee && props.isEditMode) {
    form.value = { ...props.employee }
  }
})

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const url = props.isEditMode
      ? `http://localhost:3000/employees/${props.employee?.id}`
      : 'http://localhost:3000/employees'

    const response = await fetch(url, {
      method: props.isEditMode ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (response.ok) {
      emit('save')
    }
  } catch (error) {
    console.error('Error saving employee:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Employee Code -->
    <div>
      <label for="code" class="block text-sm font-medium text-gray-700">
        Employee Code *
      </label>
      <input
        id="code"
        v-model="form.code"
        type="text"
        :placeholder="'EMP001'"
        :disabled="isEditMode"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 disabled:bg-gray-100"
        :class="{'border-red-500': errors.code}"
      />
      <p v-if="errors.code" class="mt-1 text-sm text-red-600">{{ errors.code }}</p>
    </div>

    <!-- Name Fields -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">
          First Name *
        </label>
        <input
          id="firstName"
          v-model="form.firstName"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          :class="{'border-red-500': errors.firstName}"
        />
        <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
          {{ errors.firstName }}
        </p>
      </div>

      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">
          Last Name *
        </label>
        <input
          id="lastName"
          v-model="form.lastName"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          :class="{'border-red-500': errors.lastName}"
        />
        <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
          {{ errors.lastName }}
        </p>
      </div>
    </div>

    <!-- Occupation -->
    <div>
      <label for="occupation" class="block text-sm font-medium text-gray-700">
        Occupation *
      </label>
      <input
        id="occupation"
        v-model="form.occupation"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        :class="{'border-red-500': errors.occupation}"
      />
      <p v-if="errors.occupation" class="mt-1 text-sm text-red-600">
        {{ errors.occupation }}
      </p>
    </div>

    <!-- Department -->
    <div>
      <label for="department" class="block text-sm font-medium text-gray-700">
        Department *
      </label>
      <select
        id="department"
        v-model="form.department"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        :class="{'border-red-500': errors.department}"
      >
        <option value="">Select a department</option>
        <option v-for="dept in departments" :key="dept" :value="dept">
          {{ dept }}
        </option>
      </select>
      <p v-if="errors.department" class="mt-1 text-sm text-red-600">
        {{ errors.department }}
      </p>
    </div>

    <!-- Employment Date -->
    <div>
      <label for="employmentDate" class="block text-sm font-medium text-gray-700">
        Employment Date *
      </label>
      <input
        id="employmentDate"
        v-model="form.employmentDate"
        type="date"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
      />
    </div>

    <!-- Termination Date -->
    <div>
      <label for="terminationDate" class="block text-sm font-medium text-gray-700">
        Termination Date
      </label>
      <input
        id="terminationDate"
        v-model="form.terminationDate"
        type="date"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isLoading"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
      </button>
    </div>
  </form>
</template>
