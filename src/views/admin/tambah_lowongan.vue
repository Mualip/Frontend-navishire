<template>
  <div class="dashboard-wrapper">
    <!-- HERO -->
    <div class="hero-blue">
      <h1 class="title" style="color: white">Kelola Lowongan</h1>
    </div>

    <!-- CARD -->
    <div class="dashboard-container">
      <!-- FORM TAMBAH / EDIT -->
      <form @submit.prevent="submitJob" class="job-form">
        <h3>{{ editMode ? 'Edit Lowongan' : 'Tambah Lowongan' }}</h3>

        <div class="form-grid">
          <div class="input-group">
            <label>Kategori</label>
            <select v-model="form.kategori" required>
              <option value="" disabled>Pilih kategori</option>
              <option v-for="cat in kategoriList" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="input-group">
            <label>Posisi</label>
            <input v-model="form.posisi" placeholder="Guru Tahfidz" required />
          </div>

          <div class="input-group">
            <label>Lokasi</label>
            <input v-model="form.lokasi" placeholder="Ciomas, Bogor" required />
          </div>

          <div class="input-group">
            <label>Gaji</label>
            <input v-model="form.gaji" placeholder="3.000.000 - 4.000.000" required />
          </div>

          <div class="input-group full">
            <label>Deskripsi Pekerjaan</label>
            <textarea
              v-model="form.deskripsi"
              rows="4"
              placeholder="Deskripsi pekerjaan"
              required
            ></textarea>
          </div>

          <div class="input-group">
            <label>Tanggal Tutup</label>
            <input type="date" v-model="form.tanggal_tutup" required />
          </div>

          <div class="input-group">
            <label>Status</label>
            <select v-model="form.status" required>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div class="form-action">
          <button class="btn-primary" type="submit">
            {{ editMode ? 'Update Lowongan' : '+ Tambah Lowongan' }}
          </button>
          <button v-if="editMode" type="button" class="btn-cancel" @click="resetForm">Batal</button>
        </div>
      </form>

      <!-- LIST LOWONGAN -->
      <div class="job-list">
        <h3>Daftar Lowongan</h3>
        <ul>
          <li v-for="job in jobs" :key="job._id">
            <div>
              <strong>{{ job.posisi }}</strong> - {{ job.kategori }} <br />
              <small
                >{{ job.lokasi }} | {{ job.gaji }} | Tutup: {{ formatDate(job.tanggal_tutup) }} |
                Status: {{ job.status }}</small
              >
            </div>
            <div>
              <button class="btn-edit" @click="editJob(job)">Edit</button>
              <button class="btn-delete" @click="deleteJob(job._id)">Hapus</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

// ===== Interface & Form =====
interface JobForm {
  _id?: string
  kategori: string
  posisi: string
  lokasi: string
  gaji: string
  deskripsi: string
  tanggal_tutup: string
  status: 'aktif' | 'nonaktif'
}

const kategoriList = ['HSIN', 'LITBANG', 'INBS', 'YAYASAN']

const form = reactive<JobForm>({
  kategori: '',
  posisi: '',
  lokasi: '',
  gaji: '',
  deskripsi: '',
  tanggal_tutup: '',
  status: 'aktif',
})

const jobs = ref<JobForm[]>([])
const editMode = ref(false)
const API_URL = 'http://localhost:5000/api/admin/lowongan'

// ===== GET ALL =====
const fetchJobs = async (): Promise<void> => {
  try {
    const res = await fetch(API_URL)
    const data = await res.json()
    jobs.value = data
  } catch (err) {
    console.error(err)
  }
}

// ===== SUBMIT =====
const submitJob = async (): Promise<void> => {
  try {
    const payload = { ...form }
    let res
    if (editMode.value && form._id) {
      res = await fetch(`${API_URL}/${form._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    const data = await res.json()
    if (!res.ok) {
      alert(`Error: ${data.message}`)
      return
    }

    alert(editMode.value ? 'Lowongan diperbarui!' : 'Lowongan berhasil ditambahkan!')
    resetForm()
    fetchJobs()
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan')
  }
}

// ===== EDIT =====
const editJob = (job: JobForm): void => {
  form._id = job._id
  form.kategori = job.kategori
  form.posisi = job.posisi
  form.lokasi = job.lokasi
  form.gaji = job.gaji
  form.deskripsi = job.deskripsi
  form.tanggal_tutup = job.tanggal_tutup.split('T')[0]
  form.status = job.status
  editMode.value = true
}

// ===== DELETE =====
const deleteJob = async (id: string): Promise<void> => {
  if (!confirm('Yakin ingin menghapus lowongan ini?')) return
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      alert(`Error: ${data.message}`)
      return
    }
    alert('Lowongan berhasil dihapus!')
    fetchJobs()
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan saat menghapus')
  }
}

// ===== RESET FORM =====
const resetForm = (): void => {
  form._id = undefined
  form.kategori = ''
  form.posisi = ''
  form.lokasi = ''
  form.gaji = ''
  form.deskripsi = ''
  form.tanggal_tutup = ''
  form.status = 'aktif'
  editMode.value = false
}

// ===== UTILS =====
const formatDate = (date: string) => new Date(date).toLocaleDateString()

onMounted(() => {
  fetchJobs()
})
</script>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  background: #f1f5f9;
}

/* HERO */
.hero-blue {
  padding: 48px 24px 40px;
  color: white;
  text-align: center;
  background: #2563eb;
  border-radius: 0 0 20px 20px;
}

.hero-blue h2 {
  font-size: 32px;
  font-weight: 700;
}

.hero-blue p {
  margin-top: 6px;
  opacity: 0.9;
}

/* CARD */
.dashboard-container {
  max-width: 1250px;
  margin: -50px auto 40px;
  background: white;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* FORM GRID */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.full {
  grid-column: span 2;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
}

input,
select,
textarea {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid #d1d5db;
  font-size: 14px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

/* ACTION */
.form-action {
  margin-top: 28px;
  text-align: right;
}

.btn-primary,
.btn-edit,
.btn-delete,
.btn-cancel {
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #2563eb;
  color: white;
  margin-right: 10px;
}

.btn-primary:hover {
  background: #1e40af;
}

.btn-cancel {
  background: #9ca3af;
  color: white;
}

.btn-cancel:hover {
  background: #6b7280;
}

.btn-edit {
  background: #10b981;
  color: white;
  margin-right: 8px;
}

.btn-edit:hover {
  background: #059669;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #b91c1c;
}

/* JOB LIST */
.job-list {
  margin-top: 36px;
}

.job-list ul {
  list-style: none;
  padding: 0;
}

.job-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.job-list small {
  display: block;
  color: #64748b;
  margin-top: 2px;
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .input-group.full {
    grid-column: span 1;
  }

  .form-action {
    text-align: center;
  }
}
</style>
