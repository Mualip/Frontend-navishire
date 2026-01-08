<template>
  <!-- CARD TAHAPAN -->
  <div class="card">
    <h3>Tahapan Seleksi</h3>

    <ul class="steps">
      <li v-for="(t, i) in tahapan" :key="i" :class="{ active: i <= active }">
        <span class="step">{{ i + 1 }}</span>
        {{ t }}
      </li>
    </ul>
  </div>

  <!-- CARD UNDANGAN -->
  <div class="card">
    <h3>Undangan</h3>

    <div v-if="loading" class="muted">Memuat undangan...</div>

    <div v-else-if="!undangan">
      <span class="badge gray">Belum ada undangan</span>
    </div>

    <div v-else class="undangan">
      <span class="badge blue">{{ undangan.judul }}</span>

      <div class="row">
        <strong>Tanggal:</strong>
        <span>{{ formatDate(undangan.tanggal) }}</span>
      </div>

      <div class="row">
        <strong>Waktu:</strong>
        <span>{{ undangan.waktu }}</span>
      </div>

      <div class="row">
        <strong>Lokasi:</strong>
        <span>{{ undangan.lokasi }}</span>
      </div>

      <div class="note">
        {{ undangan.pesan }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

/* ================= PROPS ================= */
const props = defineProps<{
  tahapan: string[]
  activeIndex?: number
}>()

const active = computed<number>(() => props.activeIndex ?? 0)

/* ================= TYPE ================= */
interface Undangan {
  _id: string
  judul: string
  tanggal: string
  waktu: string
  lokasi: string
  pesan: string
  status: 'terkirim' | 'dibaca'
}

/* ================= STATE ================= */
const undangan = ref<Undangan | null>(null)
const loading = ref<boolean>(true)

/* ================= API ================= */
const fetchUndangan = async (): Promise<void> => {
  try {
    const res = await axios.get<{
      adaUndangan: boolean
      data?: Undangan
    }>('http://localhost:5000/api/lamaran/undangan', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })

    if (res.data.adaUndangan && res.data.data) {
      undangan.value = res.data.data
    }
  } catch (error) {
    console.error('Gagal mengambil undangan', error)
  } finally {
    loading.value = false
  }
}

/* ================= LIFECYCLE ================= */
onMounted(fetchUndangan)

/* ================= HELPER ================= */
const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
</script>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

/* TAHAPAN */
.steps {
  list-style: none;
  padding: 0;
}

.steps li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #9ca3af;
}

.steps li.active {
  color: #2563eb;
  font-weight: 600;
}

.step {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #e5e7eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-size: 0.75rem;
}

.steps li.active .step {
  background: #2563eb;
  color: white;
}

/* UNDANGAN */
.undangan {
  margin-top: 0.75rem;
}

.row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.note {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

/* BADGE */
.badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.blue {
  background: #2563eb;
  color: white;
}

.badge.gray {
  background: #e5e7eb;
  color: #374151;
}

.muted {
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>
