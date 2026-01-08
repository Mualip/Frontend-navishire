<template>
  <div class="page">
    <!-- ================= FORM MATERI ================= -->
    <div class="card">
      <h2 class="title">Buat Materi Tes</h2>

      <div class="materi-form">
        <div class="field">
          <label>Nama Materi</label>
          <input v-model="materiForm.judul" placeholder="Tes Logika Dasar" />
        </div>

        <div class="field">
          <label>Tanggal Tes</label>
          <input type="date" v-model="materiForm.tanggal" />
        </div>

        <div class="field">
          <label>Durasi (menit)</label>
          <input type="number" v-model="materiForm.durasi" min="1" />
        </div>
      </div>

      <hr />

      <!-- ================= FORM SOAL ================= -->
      <h3 class="subtitle">
        {{ isEditSoal ? 'Edit Soal' : 'Tambah Soal' }}
        <span class="badge">Soal ke-{{ materiForm.soal.length + 1 }}</span>
      </h3>

      <label>Pertanyaan</label>
      <textarea v-model="soalForm.pertanyaan" rows="3"></textarea>

      <label>Gambar Soal (opsional)</label>
      <input type="file" accept="image/*" @change="uploadGambarSoal" />
      <img v-if="previewSoal" :src="previewSoal" class="preview" />

      <label>Tipe Soal</label>
      <select v-model="soalForm.tipe">
        <option value="pg">Pilihan Ganda</option>
        <option value="esai">Esai</option>
      </select>

      <!-- ===== PILIHAN GANDA ===== -->
      <div v-if="soalForm.tipe === 'pg'" class="opsi-box">
        <div v-for="(opsi, i) in soalForm.opsi" :key="i" class="opsi">
          <input type="radio" :value="i" v-model="soalForm.jawabanBenar" />
          <strong>{{ huruf(i) }}</strong>

          <input v-model="soalForm.opsi[i]" placeholder="Isi jawaban" />
          <input type="file" accept="image/*" @change="uploadGambarOpsi($event, i)" />
          <button class="btn-x" @click="hapusOpsi(i)">✕</button>

          <img v-if="previewOpsi[i]" :src="previewOpsi[i]" class="preview-opsi" />
        </div>

        <button class="btn-link" @click="tambahOpsi">+ Tambah Jawaban</button>
      </div>

      <button class="btn-primary" @click="simpanSoal">
        {{ isEditSoal ? '💾 Simpan Perubahan' : '+ Tambah Soal' }}
      </button>

      <p class="info">
        Total soal: <strong>{{ materiForm.soal.length }}</strong> / minimal 1
      </p>

      <button class="btn-success" @click="simpanMateri">Simpan Materi</button>
    </div>

    <!-- ================= LIST MATERI ================= -->
    <div class="card">
      <h2 class="title">Daftar Materi Tes</h2>

      <div v-if="materiList.length === 0" class="empty">Belum ada materi</div>

      <div v-for="(materi, i) in materiList" :key="materi._id" class="materi-item">
        <div class="materi-head">
          <div>
            <strong>{{ materi.judul }}</strong>
            <div class="meta">
              {{ materi.tanggal }} · {{ materi.durasi }} menit · {{ materi.soal.length }} soal
            </div>
          </div>

          <button class="btn-link" @click="toggle(i)">
            {{ openIndex === i ? 'Tutup' : 'Lihat Soal' }}
          </button>
        </div>

        <div v-if="openIndex === i" class="detail">
          <ol>
            <li v-for="(s, idx) in materi.soal" :key="idx">
              <strong>{{ idx + 1 }}. {{ s.pertanyaan }}</strong>

              <img v-if="s.gambarUrl" :src="s.gambarUrl" class="preview" />

              <ul v-if="s.tipe === 'pg'" class="jawaban">
                <li
                  v-for="(o, j) in s.opsi"
                  :key="j"
                  :class="{ benar: j === s.jawabanBenar }"
                  class="jawaban-item"
                >
                  {{ huruf(j) }}. {{ o }}
                  <img v-if="s.opsiGambarUrl?.[j]" :src="s.opsiGambarUrl[j]" class="preview-opsi" />
                </li>
              </ul>

              <em v-else class="esai">Soal esai</em>

              <div class="aksi-soal">
                <button class="btn-link" @click="editSoal(idx)">Edit</button>
                <button class="btn-x" @click="hapusSoal(idx)">Hapus</button>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

/* ================= API ================= */
const API_BASE = 'http://localhost:5000'
const API = `${API_BASE}/api/materi`

/* ================= TYPES ================= */
type TipeSoal = 'pg' | 'esai'

interface SoalBackend {
  pertanyaan: string
  tipe: TipeSoal
  opsi: string[]
  jawabanBenar: number | null
  gambar?: string | null
  opsiGambar?: (string | null)[]
}

interface MateriBackend {
  _id: string
  judul: string
  tanggal: string
  durasi: number
  soal: SoalBackend[]
}

interface Soal {
  pertanyaan: string
  tipe: TipeSoal
  opsi: string[]
  jawabanBenar: number | null

  // upload
  gambar?: File | null
  opsiGambar?: (File | null)[]

  // preview
  gambarUrl?: string | null
  opsiGambarUrl?: (string | null)[]
}

interface Materi {
  _id?: string
  judul: string
  tanggal: string
  durasi: number
  soal: Soal[]
}

/* ================= STATE ================= */
const materiList = ref<Materi[]>([])
const openIndex = ref<number | null>(null)

const materiForm = reactive<Materi>({
  judul: '',
  tanggal: '',
  durasi: 60,
  soal: [],
})

const soalForm = reactive<Soal>({
  pertanyaan: '',
  tipe: 'pg',
  opsi: [''],
  jawabanBenar: null,
  gambar: null,
  opsiGambar: [null],
})

const previewSoal = ref<string | null>(null)
const previewOpsi = ref<(string | null)[]>([null])

const isEditSoal = ref(false)
const editSoalIndex = ref<number | null>(null)

/* ================= UTIL ================= */
const huruf = (i: number) => String.fromCharCode(65 + i)

// resolve path sesuai folder soal / opsi
const resolveImage = (filename?: string | null, type: 'soal' | 'opsi' = 'soal'): string | null => {
  if (!filename) return null
  if (filename.startsWith('http')) return filename
  return `${API_BASE}/uploads/${type}/${filename}`
}

/* ================= FILE ================= */
const uploadGambarSoal = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  soalForm.gambar = file
  previewSoal.value = URL.createObjectURL(file)
}

const uploadGambarOpsi = (e: Event, i: number) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  soalForm.opsiGambar![i] = file
  previewOpsi.value[i] = URL.createObjectURL(file)
}

/* ================= OPSI ================= */
const tambahOpsi = () => {
  soalForm.opsi.push('')
  soalForm.opsiGambar!.push(null)
  previewOpsi.value.push(null)
}

const hapusOpsi = (i: number) => {
  soalForm.opsi.splice(i, 1)
  soalForm.opsiGambar!.splice(i, 1)
  previewOpsi.value.splice(i, 1)
  if (soalForm.jawabanBenar === i) soalForm.jawabanBenar = null
}

/* ================= SOAL ================= */
const resetSoal = () => {
  soalForm.pertanyaan = ''
  soalForm.tipe = 'pg'
  soalForm.opsi = ['']
  soalForm.jawabanBenar = null
  soalForm.gambar = null
  soalForm.opsiGambar = [null]
  previewSoal.value = null
  previewOpsi.value = [null]
  isEditSoal.value = false
  editSoalIndex.value = null
}

const simpanSoal = () => {
  if (!soalForm.pertanyaan.trim()) {
    alert('Pertanyaan wajib diisi')
    return
  }

  if (soalForm.tipe === 'pg' && soalForm.jawabanBenar === null) {
    alert('Pilih jawaban benar')
    return
  }

  const payload: Soal = {
    pertanyaan: soalForm.pertanyaan,
    tipe: soalForm.tipe,
    opsi: [...soalForm.opsi],
    jawabanBenar: soalForm.jawabanBenar,
    gambar: soalForm.gambar,
    opsiGambar: [...soalForm.opsiGambar!],
    gambarUrl: previewSoal.value,
    opsiGambarUrl: [...previewOpsi.value],
  }

  if (editSoalIndex.value !== null) {
    materiForm.soal[editSoalIndex.value] = payload
  } else {
    materiForm.soal.push(payload)
  }

  resetSoal()
}

const editSoal = (soalIdx: number) => {
  const s = materiForm.soal[soalIdx]

  soalForm.pertanyaan = s.pertanyaan
  soalForm.tipe = s.tipe
  soalForm.opsi = [...s.opsi]
  soalForm.jawabanBenar = s.jawabanBenar
  soalForm.gambar = null
  soalForm.opsiGambar = s.opsi.map(() => null)

  previewSoal.value = s.gambarUrl || null
  previewOpsi.value = s.opsiGambarUrl?.length ? [...s.opsiGambarUrl] : s.opsi.map(() => null)

  editSoalIndex.value = soalIdx
  isEditSoal.value = true
}

const hapusSoal = (idx: number) => {
  if (!confirm('Hapus soal ini?')) return
  materiForm.soal.splice(idx, 1)
  resetSoal()
}

/* ================= SIMPAN MATERI ================= */
const simpanMateri = async () => {
  if (!materiForm.judul || !materiForm.tanggal) {
    alert('Judul & tanggal wajib diisi')
    return
  }

  if (materiForm.soal.length < 1) {
    alert('Minimal 1 soal')
    return
  }

  const payload = {
    judul: materiForm.judul,
    tanggal: materiForm.tanggal,
    durasi: materiForm.durasi,
    soal: materiForm.soal.map((s) => ({
      pertanyaan: s.pertanyaan,
      tipe: s.tipe,
      opsi: s.opsi,
      jawabanBenar: s.jawabanBenar,
    })),
  }

  const fd = new FormData()
  fd.append('data', JSON.stringify(payload))

  materiForm.soal.forEach((s, si) => {
    if (s.gambar) fd.append(`gambarSoal_${si}`, s.gambar)
    s.opsiGambar?.forEach((f, oi) => {
      if (f) fd.append(`opsi_${si}_${oi}`, f)
    })
  })

  await axios.post(API, fd)
  alert('✅ Materi berhasil disimpan')

  materiForm.judul = ''
  materiForm.tanggal = ''
  materiForm.durasi = 60
  materiForm.soal = []
  resetSoal()

  loadMateri()
}

/* ================= LOAD ================= */
const loadMateri = async () => {
  const res = await axios.get<MateriBackend[]>(API)

  materiList.value = res.data.map((m) => ({
    _id: m._id,
    judul: m.judul,
    tanggal: m.tanggal,
    durasi: m.durasi,
    soal: m.soal.map((s) => ({
      pertanyaan: s.pertanyaan,
      tipe: s.tipe,
      opsi: s.opsi,
      jawabanBenar: s.jawabanBenar,
      gambarUrl: resolveImage(s.gambar, 'soal'),
      opsiGambarUrl: s.opsiGambar?.map((f) => resolveImage(f, 'opsi')) ?? [],
    })),
  }))
}

const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i
}

onMounted(loadMateri)
</script>

<style scoped>
.page {
  max-width: 1300px;
  margin: auto;
  padding: 10px;
}
.card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}
.title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}
.subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 8px;
}
label {
  font-size: 13px;
  font-weight: 600;
  margin-top: 10px;
  display: block;
}
input,
textarea,
select {
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}
.opsi-box {
  margin-top: 10px;
}
.opsi {
  display: grid;
  grid-template-columns: 18px 18px 1fr auto auto;
  gap: 6px;
  align-items: center;
  margin-bottom: 6px;
}
button {
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
  padding: 8px;
  width: 100%;
  margin-top: 10px;
}
.btn-success {
  background: #16a34a;
  color: #fff;
  padding: 10px;
  width: 100%;
  margin-top: 12px;
}
.btn-link {
  background: none;
  color: #2563eb;
}
.btn-x {
  background: none;
  color: #dc2626;
}
.preview {
  max-width: 160px;
  margin-top: 6px;
  border-radius: 6px;
}
.preview-opsi {
  max-width: 60px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.jawaban-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.materi-item {
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 0;
}
.materi-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.meta {
  font-size: 12px;
  color: #64748b;
}
.detail {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  margin-top: 10px;
}
.benar {
  color: #15803d;
  font-weight: 600;
}
.esai {
  font-style: italic;
  color: #64748b;
}
.badge {
  background: #e0e7ff;
  color: #1e3a8a;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.empty {
  font-style: italic;
  color: #94a3b8;
}
.materi-form {
  display: grid;
  grid-template-columns: 2.5fr 1.3fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}
@media (max-width: 640px) {
  .materi-form {
    grid-template-columns: 1fr;
  }
}
</style>
