<template>
  <div class="layout">
    <div v-if="sidebarOpen && isMobile" class="overlay" @click="closeSidebar"></div>

    <AppSidebar :open="sidebarOpen" @close="closeSidebar" class="sidebar" />

    <main class="main" :class="{ shifted: !isMobile && sidebarOpen }">
      <AppNavbar :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppNavbar from '@/components/admin/AppNavbar.vue'
import AppSidebar from '@/components/admin/AppSidebar.vue'

const sidebarOpen = ref<boolean>(false)
const isMobile = ref<boolean>(false)

const checkScreen = (): void => {
  isMobile.value = window.innerWidth < 1024
  sidebarOpen.value = !isMobile.value // desktop always open
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
})

const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = (): void => {
  if (isMobile.value) sidebarOpen.value = false
}
</script>

<style scoped>
.layout {
  display: flex;
}

/* SIDEBAR POSISI */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  transform: translateX(-100%);
  transition: 0.3s;
}
.sidebar.open {
  transform: translateX(0);
}

/* MAIN CONTENT */
.main {
  width: 100%;
  min-height: 100vh;
  background: #f7faff;
  transition: margin-left 0.3s;
}
.main.shifted {
  margin-left: 260px;
}

/* OVERLAY MOBILE */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 500;
}

/* DESKTOP MODE */
@media (min-width: 1024px) {
  .sidebar {
    transform: translateX(0) !important;
  }
  .main {
    margin-left: 260px;
  }
}
</style>
