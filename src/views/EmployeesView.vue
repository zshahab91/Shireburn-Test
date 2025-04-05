<template>
  <div class="space-y-6 p-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Employees</h1>
      <button
        @click="router.push('/employees/create')"
        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Create Employee
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
    </div>

    <EmployeeGrid v-else :employees="employees" @delete="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EmployeeGrid from '@/components/EmployeeGrid.vue'

const router = useRouter()
const employees = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/employees')
    employees.value = await response.json()
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
})

const handleDelete = async (id: number) => {
  try {
    await fetch(`http://localhost:3000/employees/${id}`, {
      method: 'DELETE',
    })
    employees.value = employees.value.filter((emp) => emp.id !== id)
  } catch (error) {
    console.error('Error deleting employee:', error)
  }
}
</script>
<style scoped></style>
