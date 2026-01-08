<template>
  <nav class="navbar">
    <!-- HAMBURGER (MOBILE ONLY) -->
    <button class="hamburger" @click="emit('toggle-sidebar')">
      <span :class="{ open: sidebarOpen }"></span>
      <span :class="{ open: sidebarOpen }"></span>
      <span :class="{ open: sidebarOpen }"></span>
    </button>

    <!-- TITLE -->
    <h1 class="title">Dashboard Admin</h1>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  sidebarOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<style scoped>
/* ======================
   NAVBAR
====================== */
.navbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #2563eb;
  color: white;
}

/* ======================
   TITLE
====================== */
.title {
  color: #ffffff;
  padding-left: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  margin: 0;
}

/* ======================
   HAMBURGER
====================== */
.hamburger {
  width: 30px;
  height: 22px;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
}

/* GARIS */
.hamburger span {
  position: absolute;
  width: 100%;
  height: 3px;
  background: white;
  left: 0;
  transition: 0.3s;
}

.hamburger span:nth-child(1) {
  top: 0;
}
.hamburger span:nth-child(2) {
  top: 9px;
}
.hamburger span:nth-child(3) {
  bottom: 0;
}

/* ======================
   ANIMASI ☰ → ✖
====================== */
.hamburger span.open:nth-child(1) {
  transform: rotate(45deg);
  top: 9px;
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg);
  bottom: 9px;
}

/* ======================
   DESKTOP
====================== */
@media (min-width: 1024px) {
  .hamburger {
    display: none;
  }
}
</style>
