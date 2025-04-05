<template>
  <div class="employees">
    <h1>This is an employees page</h1>
    <div v-for="employee in employees" :key="employee.id">
      <h2>{{ employee.firstName }} {{ employee.lastName }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const employees = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/employees')
    employees.value = await response.json()
  } catch (error) {
    console.error('Error fetching employees:', error)
  }
})
</script>
<style scoped></style>
