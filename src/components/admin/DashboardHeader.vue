<template>
  <section class="header-card">
    <h1 class="title" style="color: white">Selamat Datang {{ nama || '...' }} 👋</h1>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  nama: string
}>()
</script>

<style scoped>
.header-card {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}
</style>
