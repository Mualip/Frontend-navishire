<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 class="font-bold text-xl">MyCompany</h1>
      <button @click="goLogin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </button>
    </nav>

    <!-- Hero Section -->
    <section class="flex-1 flex flex-col justify-center items-center text-center px-6">
      <h2 class="text-4xl font-bold mb-4">Selamat Datang di Sistem Kami</h2>
      <p class="text-gray-700 mb-6">Informasi dan layanan untuk calon karyawan</p>
      <button @click="goLogin" class="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
        Login Sekarang
      </button>
    </section>

    <!-- Footer -->
    <footer class="bg-white py-6 text-center text-gray-600 border-t border-gray-200">
      &copy; 2025 MyCompany. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

const goLogin = () => {
  router.push('/login')
}
</script>
