<template>
  <div class="card">
    <h3>Pesan</h3>

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

      <div class="note">{{ undangan.pesan }}</div>

      <button v-if="undangan.materi.length" @click="lihatTes" class="btn-blue mt-2">
        Lihat Tes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface Soal {
  _id: string
  pertanyaan: string
  tipe: 'pg' | 'esai'
  opsi?: string[]
}

interface Materi {
  _id: string
  judul: string
  durasi: number
  soal: Soal[]
}

interface Undangan {
  _id: string
  judul: string
  tanggal: string
  waktu: string
  lokasi: string
  pesan: string
  materi: Materi[]
  status: 'terkirim' | 'dibaca'
}

const undangan = ref<Undangan | null>(null)
const loading = ref(true)
const router = useRouter()

const fetchUndangan = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/api/lamaran/undangan', {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    })

    if (res.data.adaUndangan && res.data.data.length > 0) {
      undangan.value = res.data.data[0]
    } else {
      undangan.value = null
    }
  } catch (err) {
    console.error('Gagal mengambil undangan', err)
    undangan.value = null
  } finally {
    loading.value = false
  }
}

const lihatTes = () => {
  router.push({ name: 'mulaiTes' })
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

onMounted(fetchUndangan)
</script>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
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
.btn-blue {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.btn-blue:hover {
  background: #1d4ed8;
}
</style>
