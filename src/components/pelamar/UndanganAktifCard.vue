<template>
  <div class="card undangan">
    <h3>📢 Undangan Tes</h3>

    <div class="row">
      <strong>{{ undangan.judul }}</strong>
    </div>

    <div class="row">
      <span>📅 {{ undangan.tanggal }}</span>
      <span>⏰ {{ undangan.waktu }}</span>
    </div>

    <div class="row">
      <span>📍 {{ undangan.lokasi }}</span>
    </div>

    <p class="pesan">{{ undangan.pesan }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Undangan } from '@/types/Undangan'

defineProps<{
  undangan: Undangan
}>()
</script>

<style scoped>
.card {
  background: #fef3c7;
  border-left: 5px solid #f59e0b;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.pesan {
  margin-top: 1rem;
  color: #374151;
}
</style>
