<template>
  <div class="container">
    <h1>Jawaban Pelamar</h1>

    <!-- FILTER -->
    <div class="filter">
      <label>Nama Pelamar</label>
      <select v-model="selectedName">
        <option value="">Semua Pelamar</option>
        <option v-for="n in namaList" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <section>
      <h2>Semua Jawaban (Admin)</h2>

      <div v-if="loadingAll" class="loading">Memuat jawaban...</div>

      <div v-else>
        <div v-if="filteredJawaban.length === 0" class="no-data">Tidak ada data</div>

        <div v-for="j in filteredJawaban" :key="j._id" class="card">
          <!-- INFO -->
          <div class="info">
            <p><strong>Nama:</strong> {{ j.pelamar?.name }}</p>
            <!-- <p><strong>Email:</strong> {{ j.pelamar?.email }}</p> -->
            <p><strong>Materi:</strong> {{ j.materi?.judul }}</p>
          </div>

          <!-- JAWABAN -->
          <div class="jawaban-wrapper">
            <div class="jawaban-row header">
              <span>No</span>
              <span>Jawaban</span>
              <span>Status</span>
            </div>

            <div v-for="(jawab, idx) in Object.values(j.jawaban)" :key="idx" class="jawaban-row">
              <span>{{ idx + 1 }}</span>
              <span>{{ jawab }}</span>

              <span class="status-wrapper">
                <select
                  v-model="statusJawaban[j._id][idx]"
                  class="status-select"
                  @change="updateRekap(j._id)"
                >
                  <option value="">--</option>
                  <option value="benar">Benar</option>
                  <option value="salah">Salah</option>
                </select>

                <div
                  v-if="statusJawaban[j._id][idx]"
                  class="status-badge"
                  :class="statusJawaban[j._id][idx]"
                >
                  {{ statusJawaban[j._id][idx] }}
                </div>
              </span>
            </div>

            <!-- REKAP -->
            <div class="rekap">
              <div class="rekap-box benar">
                Benar
                <strong>{{ rekap[j._id]?.benar ?? 0 }}</strong>
              </div>
              <div class="rekap-box salah">
                Salah
                <strong>{{ rekap[j._id]?.salah ?? 0 }}</strong>
              </div>
            </div>

            <!-- SIMPAN -->
            <button class="btn-save" @click="simpanStatus(j._id)">💾 Simpan</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

interface Pelamar {
  _id: string
  name: string
  email: string
}

interface Materi {
  _id: string
  judul: string
}

interface Jawaban {
  _id: string
  pelamar?: Pelamar
  materi?: Materi
  jawaban: Record<string, string>
}

interface Penilaian {
  detailStatus: Record<number, string>
}

const token = localStorage.getItem('token') ?? ''

const API_BASE = 'http://localhost:5000/api/lamaran'
const API_SAVE = 'http://localhost:5000/api/penilaian/save'
const API_GET_PENILAIAN = 'http://localhost:5000/api/penilaian/jawaban'

const allJawaban = ref<Jawaban[]>([])
const loadingAll = ref(false)
const selectedName = ref('')

const statusJawaban = ref<Record<string, Record<number, string>>>({})
const rekap = reactive<Record<string, { benar: number; salah: number }>>({})

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Fetch error')
  return (await res.json()) as T
}

/* ================= LOAD ================= */
const loadAllJawaban = async () => {
  loadingAll.value = true
  try {
    const res = await fetchJSON<{ data: Jawaban[] }>(`${API_BASE}/jawaban/all`)
    allJawaban.value = res.data

    for (const j of res.data) {
      // init
      statusJawaban.value[j._id] = {}

      Object.keys(j.jawaban).forEach((_, idx) => {
        statusJawaban.value[j._id][Number(idx)] = ''
      })

      // 🔥 ambil penilaian dari backend
      try {
        const penRes = await fetchJSON<{ data: Penilaian | null }>(`${API_GET_PENILAIAN}/${j._id}`)

        if (penRes.data?.detailStatus) {
          statusJawaban.value[j._id] = penRes.data.detailStatus
        }
      } catch {
        // aman kalau belum pernah dinilai
      }

      updateRekap(j._id)
    }
  } finally {
    loadingAll.value = false
  }
}

/* ================= REKAP ================= */
const updateRekap = (id: string) => {
  const vals = Object.values(statusJawaban.value[id] ?? {})
  rekap[id] = {
    benar: vals.filter((v) => v === 'benar').length,
    salah: vals.filter((v) => v === 'salah').length,
  }
}

/* ================= FILTER ================= */
const namaList = computed(() => [
  ...new Set(allJawaban.value.map((j) => j.pelamar?.name).filter(Boolean) as string[]),
])

const filteredJawaban = computed(() =>
  !selectedName.value
    ? allJawaban.value
    : allJawaban.value.filter((j) => j.pelamar?.name === selectedName.value),
)

/* ================= SIMPAN ================= */
const simpanStatus = async (jawabanId: string) => {
  const statusData = statusJawaban.value[jawabanId]
  if (!statusData) return alert('Tidak ada data')

  try {
    const res = await fetch(API_SAVE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jawabanId, statusData }),
    })

    if (!res.ok) throw new Error('Gagal')

    alert('✅ Status jawaban berhasil disimpan')
  } catch (err) {
    console.error(err)
    alert('❌ Terjadi kesalahan saat menyimpan')
  }
}

onMounted(loadAllJawaban)
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(180deg, #3b82f6, #60a5fa, #bfdbfe);
}
h1,
h2 {
  color: #fff;
  margin-bottom: 16px;
}
.filter {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.filter label {
  color: #fff;
  font-weight: 600;
}
.filter select {
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
}
.card {
  background: #fff;
  border-radius: 14px;
  margin-bottom: 32px;
  padding: 12px;
}
.info p {
  margin: 4px 0;
}
.jawaban-wrapper {
  margin-top: 12px;
}
.jawaban-row {
  display: grid;
  grid-template-columns: 60px 1fr 200px;
  border-bottom: 1px solid #e5e7eb;
  padding: 4px 0;
}
.jawaban-row span {
  text-align: center;
  padding: 4px;
}
.jawaban-row.header span {
  font-weight: bold;
  background: #f9fafb;
}
.status-wrapper {
  position: relative;
}
.status-select {
  width: 100%;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.status-badge {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.status-badge.benar {
  background: #16a34a;
}
.status-badge.salah {
  background: #dc2626;
}
.rekap {
  display: flex;
  gap: 14px;
  margin-top: 16px;
}
.rekap-box {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  color: #fff;
}
.rekap-box strong {
  display: block;
  font-size: 18px;
  margin-top: 2px;
}
.rekap-box.benar {
  background: #16a34a;
}
.rekap-box.salah {
  background: #dc2626;
}
.btn-save {
  margin-top: 12px;
  padding: 6px 12px;
  border: none;
  background: #1e40af;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.btn-save:hover {
  background: #2563eb;
}
.loading,
.no-data {
  color: #fff;
  margin: 16px 0;
  font-weight: 500;
}
</style>
