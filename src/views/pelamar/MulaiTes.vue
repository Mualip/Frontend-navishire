<template>
  <div class="page">
    <h2>📋 Daftar Tes</h2>

    <div v-if="loading">Memuat materi...</div>
    <div v-else-if="materiList.length === 0">Belum ada tes tersedia</div>

    <ul v-else>
      <li v-for="m in materiList" :key="m._id">
        <div>
          <strong>{{ m.judul }}</strong>
          <span> ({{ m.durasi }} menit)</span>
        </div>

        <!-- 🔥 SATU MATERI = SATU TES -->
        <button @click="mulaiTes(m._id)">Mulai</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

/* =====================
   TYPES
===================== */
interface Materi {
  _id: string
  judul: string
  durasi: number
}

interface Undangan {
  materi: Materi[]
}

interface UndanganResponse {
  adaUndangan: boolean
  data: Undangan[]
}

/* =====================
   STATE
===================== */
const router = useRouter()
const materiList = ref<Materi[]>([])
const loading = ref<boolean>(true)

/* =====================
   LOAD MATERI
===================== */
const loadMateri = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const res = await axios.get<UndanganResponse>('http://localhost:5000/api/lamaran/undangan', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.data.adaUndangan || res.data.data.length === 0) {
      materiList.value = []
      return
    }

    materiList.value = res.data.data[0].materi
  } catch (err) {
    console.error('Gagal memuat materi:', err)
    materiList.value = []
  } finally {
    loading.value = false
  }
}

/* =====================
   MULAI TES (1 MATERI)
===================== */
const mulaiTes = (materiId: string): void => {
  router.push({
    name: 'tesPelamar',
    params: { materiId },
  })
}

onMounted(loadMateri)
</script>

<style scoped>
.page {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #fff;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}
</style>
