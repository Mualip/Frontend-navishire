<template>
  <!-- ================= HERO ================= -->
  <section class="hero-section">
    <div class="hero-blue"></div>

    <header class="header-wrapper">
      <h1 class="title">Profil Pribadi</h1>
      <p class="subtitle">Informasi lengkap mengenai data diri pelamar</p>
    </header>
  </section>

  <!-- ================= CARD ================= -->
  <div class="card-wrapper">
    <!-- HEADER CARD -->
    <div class="card-header">
      <h2 class="section-title">Informasi Pribadi</h2>

      <button class="btn-edit" @click="toggleEdit" :disabled="loading">
        {{ isEditing ? 'Simpan Perubahan' : 'Edit Profil' }}
      </button>
    </div>

    <div class="form-grid">
      <div v-for="field in profileFields" :key="field.key" class="form-group">
        <label>{{ field.label }}</label>

        <input
          v-if="isEditing"
          type="text"
          v-model="profilEditable[field.key]"
          placeholder="Isi data..."
        />

        <div v-else class="value-box">
          {{ profilEditable[field.key] || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_BASE = `${import.meta.env.VITE_API_URL}/api/profile`

interface ProfileData {
  namaLengkap: string
  email: string
  nik: string
  ttl: string
  jenisKelamin: string
  agama: string
  alamat: string
  nomorHp: string
  pendidikan: string
  pengalamanKerja: string
  keahlian: string
  statusPernikahan: string
  kewarganegaraan: string
}

const profileFields = [
  { label: 'Nama Lengkap', key: 'namaLengkap' },
  { label: 'Email', key: 'email' },
  { label: 'NIK', key: 'nik' },
  { label: 'Tempat, Tanggal Lahir', key: 'ttl' },
  { label: 'Jenis Kelamin', key: 'jenisKelamin' },
  { label: 'Agama', key: 'agama' },
  { label: 'Alamat', key: 'alamat' },
  { label: 'Nomor HP', key: 'nomorHp' },
  { label: 'Pendidikan', key: 'pendidikan' },
  { label: 'Pengalaman Kerja', key: 'pengalamanKerja' },
  { label: 'Keahlian', key: 'keahlian' },
  { label: 'Status Pernikahan', key: 'statusPernikahan' },
  { label: 'Kewarganegaraan', key: 'kewarganegaraan' },
] as const

const profilEditable = ref<ProfileData>({
  namaLengkap: '',
  email: '',
  nik: '',
  ttl: '',
  jenisKelamin: '',
  agama: '',
  alamat: '',
  nomorHp: '',
  pendidikan: '',
  pengalamanKerja: '',
  keahlian: '',
  statusPernikahan: '',
  kewarganegaraan: '',
})

const isEditing = ref(false)
const loading = ref(false)

async function apiFetch(url: string, method: string, body?: unknown) {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('TOKEN TIDAK ADA')

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'API Error')
  return data
}

const loadProfile = async () => {
  const data = await apiFetch(API_BASE, 'GET')
  profileFields.forEach((f) => {
    profilEditable.value[f.key] = data?.[f.key] ?? ''
  })
}

const saveProfile = async () => {
  loading.value = true
  await apiFetch(API_BASE, 'POST', profilEditable.value)
  loading.value = false
  alert('Profil berhasil disimpan')
}

const toggleEdit = async () => {
  if (isEditing.value) await saveProfile()
  isEditing.value = !isEditing.value
}

onMounted(loadProfile)
</script>

<style scoped>
/* ================= HERO ================= */
.hero-section {
  position: relative;
  padding-top: 1.5rem;
  padding-bottom: 7.5rem; /* ⬅️ tambah agar card tidak ketiban */
}

.hero-blue {
  position: absolute;
  inset: 0;
  height: 24rem; /* ⬅️ lebih pendek untuk desktop */
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 40%, #eff6ff 100%);
  border-radius: 0 0 1.5rem 1.5rem;
}

.header-wrapper {
  position: relative;
  max-width: 82rem;
  margin: auto;
  padding: 0 2rem; /* ⬅️ padding kiri kanan dikurangi */
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  margin-top: 0.5rem;
  color: #e0e7ff;
  max-width: 36rem;
}

/* ================= CARD ================= */
.card-wrapper {
  position: relative;
  background: #ffffff;
  max-width: 82rem;
  margin: -7rem auto 2.5rem; /* ⬅️ TURUN LAGI (inti masalah) */
  padding: 2.2rem;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.18);
}

/* HEADER CARD */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.6rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
}

.btn-edit {
  background: #2563eb;
  color: #ffffff;
  padding: 0.55rem 1.4rem;
  border-radius: 0.6rem;
  font-weight: 600;
  transition: all 0.25s ease;
}
.btn-edit:hover {
  background: #1e40af;
}

/* ================= FORM ================= */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a8a;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  background: #f9fafb;
}

.value-box {
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

/* ================= RESPONSIVE ================= */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-blue {
    height: 20rem;
  }

  .card-wrapper {
    margin: -5rem 1rem 2rem;
    padding: 1.4rem;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-edit {
    width: 100%;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>
