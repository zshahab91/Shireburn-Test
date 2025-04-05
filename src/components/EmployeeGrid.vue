<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

// Props and emits
const props = defineProps<{
  employees: Employee[]
}>()

defineEmits(['delete', 'loadMore'])

// Router
const router = useRouter()

// State
const searchQuery = ref('')
const selectedDepartment = ref('')
const currentSort = ref('firstName')
const sortDirection = ref('asc')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const pagesToShow = ref(5)

// Computed properties
const filteredEmployees = computed(() => {
  return props.employees.filter((employee) => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.value.toLowerCase()) ||
      employee.occupation.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDepartment =
      !selectedDepartment.value || employee.department === selectedDepartment.value
    return matchesSearch && matchesDepartment
  })
})

const sortedEmployees = computed(() => {
  return [...filteredEmployees.value].sort((a, b) => {
    let aValue = a[currentSort.value as keyof Employee]
    let bValue = b[currentSort.value as keyof Employee]

    if (currentSort.value === 'fullName') {
      aValue = `${a.firstName} ${a.lastName}`
      bValue = `${b.firstName} ${b.lastName}`
    }

    const direction = sortDirection.value === 'asc' ? 1 : -1
    return aValue < bValue ? -direction : direction
  })
})

const totalItems = computed(() => filteredEmployees.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedEmployees.value.slice(start, end)
})

const pageNumbers = computed(() => {
  const pages = []
  const halfWay = Math.floor(pagesToShow.value / 2)
  let startPage = Math.max(currentPage.value - halfWay, 1)
  const endPage = Math.min(startPage + pagesToShow.value - 1, totalPages.value)

  if (endPage - startPage + 1 < pagesToShow.value) {
    startPage = Math.max(endPage - pagesToShow.value + 1, 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

const displayedEmployees = computed(() => paginatedEmployees.value)

// Methods
const handleSort = (column: string) => {
  if (currentSort.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value = column
    sortDirection.value = 'asc'
  }
}

const changePage = (page: number) => {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
}

const formatEmploymentStatus = (date: string) => {
  const employmentDate = new Date(date)
  const today = new Date()
  return employmentDate > today ? 'employed soon' : 'currently employed'
}

const formatTerminationStatus = (date: string | null) => {
  if (!date) return '-'
  const terminationDate = new Date(date)
  const today = new Date()
  return terminationDate > today ? 'to be terminated' : 'terminated'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Search and Filter Section -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search employees..."
        class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 flex-grow"
      />
      <select
        v-model="selectedDepartment"
        class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All Departments</option>
        <option v-for="dept in [...new Set(employees.map((e) => e.department))]" :key="dept">
          {{ dept }}
        </option>
      </select>
    </div>

    <!-- Employee Grid -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in [
                { key: 'fullName', label: 'Employee Name' },
                { key: 'occupation', label: 'Occupation' },
                { key: 'department', label: 'Department' },
                { key: 'employmentDate', label: 'Employment Date' },
                { key: 'terminationDate', label: 'Termination Date' },
                { key: 'actions', label: 'Actions' },
              ]"
              :key="header.key"
              @click="header.key !== 'actions' && handleSort(header.key)"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              {{ header.label }}
              <span v-if="currentSort === header.key" class="ml-1">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="employee in displayedEmployees" :key="employee.id" class="hover:bg-gray-50">
            <!-- Employee row content -->
            <td class="px-6 py-4 whitespace-nowrap">
              {{ employee.firstName }} {{ employee.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.occupation }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.department }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatEmploymentStatus(employee.employmentDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatTerminationStatus(employee.terminationDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="router.push(`/employees/${employee.id}`)"
                class="text-purple-600 hover:text-purple-900"
              >
                View
              </button>
              <button
                @click="router.push(`/employees/${employee.id}/edit`)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button @click="$emit('delete', employee)" class="text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Items per page selector -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Show</label>
          <select
            v-model="itemsPerPage"
            class="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="text-sm text-gray-600">entries</span>
        </div>

        <!-- Pagination info -->
        <div class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} entries
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center gap-2">
          <button
            @click="changePage(1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            v-for="page in pageNumbers"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 border rounded-lg hover:bg-gray-50',
              currentPage === page ? 'bg-purple-100 text-purple-600 border-purple-200' : '',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
