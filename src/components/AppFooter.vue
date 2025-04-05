<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 text-white py-6 w-full">
    <div class="w-full px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Company Info -->
        <div>
          <h3 class="text-lg font-semibold mb-2">Purple Cross Ltd</h3>
          <p class="text-gray-400">Leading pharmaceutical company</p>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-2">Contact</h3>
          <p class="text-gray-400">Email: zshahab91@gmail.com</p>
          <p class="text-gray-400">Phone: +420 776 721 682</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-2">Quick Links</h3>
          <ul class="text-gray-400">
            <li><a href="https://www.linkedin.com/in/zshahab91/" class="hover:text-white">About Me</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400">
        <p>&copy; {{ currentYear }} Purple Cross Ltd. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
