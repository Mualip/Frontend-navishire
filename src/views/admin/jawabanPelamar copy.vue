<template>
  <div class="container">
    <h1>Jawaban Pelamar</h1>

    <!-- FILTER NAMA -->
    <div class="filter">
      <label>Nama Pelamar</label>
      <select v-model="selectedName">
        <option value="">Semua Pelamar</option>
        <option v-for="n in namaList" :key="n" :value="n">
          {{ n }}
        </option>
      </select>
    </div>

    <section>
      <h2>Semua Jawaban (Admin / Testing)</h2>

      <div v-if="loadingAll">Memuat jawaban...</div>

      <div v-else>
        <div v-if="filteredJawaban.length === 0">Tidak ada data</div>

        <div v-for="j in filteredJawaban" :key="j._id" class="card">
          <p>
            <strong>Nama</strong>
            <span>{{ j.pelamar?.name }}</span>
            <span class="email">{{ j.pelamar?.email }}</span>
          </p>

          <p>
            <strong>Materi</strong>
            <span>{{ j.materi?.judul }}</span>
            <span></span>
          </p>

          <div class="jawaban-wrapper">
            <div class="jawaban-row header">
              <span>No</span>
              <span>Jawaban</span>
              <span>Benar / Salah</span>
            </div>

            <div v-for="(jawab, nomor, index) in j.jawaban" :key="nomor" class="jawaban-row">
              <span>{{ index + 1 }}</span>
              <span>{{ jawab }}</span>
              <span>
                <span class="badge" :class="index % 2 === 0 ? 'benar' : 'salah'">
                  {{ index % 2 === 0 ? 'benar' : 'salah' }}
                </span>
              </span>
            </div>

            <div class="jawaban-row total">
              <span></span>
              <span>Total</span>
              <span>{{ Object.keys(j.jawaban).length }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

interface Pelamar {
  _id: string
  name: string
  email: string
}

interface Materi {
  _id: string
  judul: string
  durasi: number
}

interface Jawaban {
  _id: string
  pelamar?: Pelamar
  materi?: Materi
  jawaban: Record<string, string>
  createdAt: string
  updatedAt: string
}

const token = localStorage.getItem('token') || ''
const API_BASE = 'http://localhost:5000/api/lamaran'

const allJawaban = ref<Jawaban[]>([])
const loadingAll = ref(false)
const selectedName = ref('')

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('Fetch error')
  return res.json()
}

const loadAllJawaban = async () => {
  loadingAll.value = true
  try {
    const res = await fetchJSON<{ data: Jawaban[] }>(`${API_BASE}/jawaban/all`)
    allJawaban.value = res.data
  } finally {
    loadingAll.value = false
  }
}

/* ===== LIST NAMA UNIK ===== */
const namaList = computed(() => {
  return [...new Set(allJawaban.value.map((j) => j.pelamar?.name).filter(Boolean))]
})

/* ===== FILTER BERDASARKAN NAMA ===== */
const filteredJawaban = computed(() => {
  if (!selectedName.value) return allJawaban.value
  return allJawaban.value.filter((j) => j.pelamar?.name === selectedName.value)
})

onMounted(loadAllJawaban)
</script>

<style scoped>
/* ================= PAGE BACKGROUND ================= */

.container {
  min-height: 100vh;
  padding: 32px;
  font-family: Arial, Helvetica, sans-serif;

  /* background biru smooth */
  background: linear-gradient(180deg, #3b82f6 0%, #60a5fa 50%, #bfdbfe 100%);
  background-attachment: fixed;
}

/* ================= TITLE ================= */
h1 {
  color: #ffffff;
  margin-bottom: 24px;
}

h2 {
  color: #1f2937;
}

/* ================= FILTER ================= */
.filter {
  margin-bottom: 32px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter label {
  color: #ffffff;
  font-weight: 600;
}

.filter select {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: #ffffff;
}

/* ================= LIST ================= */
section > div {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ================= CARD ================= */
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* ================= INFO ================= */
.card p {
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  margin: 0;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
}

.email {
  font-size: 12px;
  color: #6b7280;
}

/* ================= JAWABAN ================= */
.jawaban-wrapper {
  padding: 12px;
}

/* ================= ROW ================= */
.jawaban-row {
  display: grid;
  grid-template-columns: 60px 1fr 140px;
  border-bottom: 1px solid #e5e7eb;
}

/* ================= CELL ================= */
.jawaban-row span {
  padding: 8px;
  text-align: center;
  font-size: 12px;
}

/* ================= HEADER ================= */
.jawaban-row.header span {
  background: #f9fafb;
  font-weight: bold;
}

/* ================= TOTAL ================= */
.jawaban-row.total span {
  font-weight: bold;
}

/* ================= BADGE ================= */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  padding: 4px 0;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
}

.badge.benar {
  background: #16a34a;
}

.badge.salah {
  background: #dc2626;
}
</style>
