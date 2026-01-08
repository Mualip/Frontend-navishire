<template>
  <div class="card">
    <h3>Notifikasi</h3>

    <div v-for="n in data" :key="n._id" class="notif" :class="{ unread: !n.isRead }">
      <strong>{{ n.title }}</strong>
      <p>{{ n.message }}</p>
      <small>{{ formatDate(n.createdAt) }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notifikasi } from '@/types/Notifikasi'

defineProps<{
  data: Notifikasi[]
}>()

const formatDate = (d: string) => new Date(d).toLocaleString('id-ID')
</script>

<style scoped>
.notif {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.unread {
  background: #eef2ff;
}
</style>
