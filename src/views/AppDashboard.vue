<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="{ '-translate-x-full': !sidebarOpen }"
      class="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r z-50 transition-transform duration-300"
    >
      <AppSidebar @close="sidebarOpen = false" />
    </aside>

    <!-- Konten utama -->
    <main
      :class="sidebarOpen ? 'ml-64' : 'ml-0'"
      class="flex-1 min-h-screen flex flex-col transition-all duration-300"
    >
      <!-- Navbar -->
      <div class="relative z-10">
        <AppNavbar @toggle-sidebar="toggleSidebar" />
      </div>

      <!-- Konten dashboard -->
      <div class="relative z-20 -mt-24 px-6 pb-6 flex-1">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Widget Total Pelamar -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-2">Total Pelamar</h3>
            <p class="text-3xl font-semibold text-blue-600">150</p>
          </div>

          <!-- Widget Pelamar Hari Ini -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-2">Pelamar Hari Ini</h3>
            <p class="text-3xl font-semibold text-green-600">12</p>
          </div>

          <!-- Widget Posisi Tersedia -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-2">Posisi Tersedia</h3>
            <p class="text-3xl font-semibold text-red-600">8</p>
          </div>

          <!-- Contoh Tabel Pelamar -->
          <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-bold mb-4">Daftar Pelamar Terbaru</h3>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 border">Nama</th>
                  <th class="px-4 py-2 border">Email</th>
                  <th class="px-4 py-2 border">Posisi</th>
                  <th class="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="px-4 py-2 border">Rudi Santoso</td>
                  <td class="px-4 py-2 border">rudi@email.com</td>
                  <td class="px-4 py-2 border">Frontend Developer</td>
                  <td class="px-4 py-2 border text-green-600">Diterima</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 border">Siti Aminah</td>
                  <td class="px-4 py-2 border">siti@email.com</td>
                  <td class="px-4 py-2 border">Backend Developer</td>
                  <td class="px-4 py-2 border text-yellow-600">Pending</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 border">Andi Pratama</td>
                  <td class="px-4 py-2 border">andi@email.com</td>
                  <td class="px-4 py-2 border">UI/UX Designer</td>
                  <td class="px-4 py-2 border text-red-600">Ditolak</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <AppFooter
        class="relative z-10 border-t border-gray-200 bg-white py-4 text-center text-gray-600 text-sm"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AppSidebar from '@/components/admin/AppSidebar.vue'
import AppFooter from '@/components/AppFooter.vue'

const sidebarOpen = ref(true)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<style scoped>
main {
  overflow-x: hidden;
}
</style>
