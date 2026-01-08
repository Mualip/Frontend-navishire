<template>
  <div class="page">
    <div v-if="loading">Memuat soal...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="!materi">Materi tidak ditemukan</div>

    <div v-else>
      <h2>{{ materi.judul }}</h2>
      <p>Durasi: {{ materi.durasi }} menit</p>
      <hr />

      <div v-for="(s, index) in materi.soal" :key="s._id" class="soal-card">
        <p class="pertanyaan">{{ index + 1 }}. {{ s.pertanyaan }}</p>

        <img v-if="s.gambar" :src="resolveImage(s.gambar, 'soal')" class="img-soal" />

        <div v-if="s.tipe === 'pg'">
          <label v-for="(opsi, i) in s.opsi" :key="i" class="opsi">
            <input type="radio" :name="'soal-' + s._id" :value="i" v-model="jawaban[s._id]" />
            {{ opsi }}

            <img
              v-if="s.opsiGambar?.[i]"
              :src="resolveImage(s.opsiGambar[i], 'opsi')"
              class="img-opsi"
            />
          </label>
        </div>

        <div v-else>
          <textarea v-model="jawaban[s._id]" placeholder="Jawaban kamu..." />
        </div>
      </div>

      <button class="submit" :disabled="submitting" @click="submitTes">
        {{ submitting ? 'Mengirim...' : 'Kirim Jawaban' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

/* ================= TYPES ================= */
interface Soal {
  _id: string
  pertanyaan: string
  tipe: 'pg' | 'esai'
  opsi: string[]
  gambar?: string | null
  opsiGambar?: (string | null)[]
}

interface MateriResponse {
  _id: string
  judul: string
  durasi: number
  soal: Soal[]
}

/* ================= STATE ================= */
const route = useRoute()
const materi = ref<MateriResponse | null>(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const jawaban = ref<Record<string, number | string>>({})

const API_BASE = 'http://localhost:5000'

/* ================= HELPERS ================= */
const resolveImage = (filename?: string | null, type: 'soal' | 'opsi' = 'soal') => {
  if (!filename) return ''
  return filename.startsWith('http') ? filename : `${API_BASE}/uploads/${type}/${filename}`
}

/* ================= LOAD SOAL ================= */
const loadMateri = async (): Promise<void> => {
  try {
    const materiId = route.params.materiId
    if (!materiId || typeof materiId !== 'string') throw new Error('ID materi tidak valid')

    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await axios.get<MateriResponse>(`${API_BASE}/api/lamaran/tes/${materiId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    materi.value = res.data
  } catch (err: unknown) {
    console.error(err)
    error.value = err instanceof Error ? err.message : 'Gagal memuat soal tes'
  } finally {
    loading.value = false
  }
}

/* ================= SUBMIT JAWABAN ================= */
const submitTes = async (): Promise<void> => {
  const materiId = route.params.materiId
  const token = localStorage.getItem('token')
  if (!token) return alert('Token tidak ditemukan')

  try {
    const res = await axios.post(
      `${API_BASE}/api/lamaran/tes/${materiId}`,
      { jawaban: jawaban.value },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    alert(res.data.message)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.message || 'Gagal mengirim jawaban')
      console.error(err.response?.data)
    } else {
      console.error(err)
    }
  }
}

onMounted(loadMateri)
</script>

<style scoped>
.page {
  padding: 20px;
}
.soal-card {
  background: #fff;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}
.pertanyaan {
  font-weight: bold;
  margin-bottom: 6px;
}
.opsi {
  display: block;
  margin: 6px 0;
}
textarea {
  width: 100%;
  min-height: 80px;
}
.submit {
  margin-top: 20px;
  background: #16a34a;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.img-soal {
  max-width: 300px;
  margin: 8px 0;
  border-radius: 6px;
}
.img-opsi {
  display: block;
  max-width: 120px;
  margin-top: 4px;
  border-radius: 4px;
}
.error {
  color: #dc2626;
  font-weight: 600;
}
</style>
