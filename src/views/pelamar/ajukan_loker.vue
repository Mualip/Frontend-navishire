<template>
  <!-- ================= HERO ================= -->
  <section class="hero-section">
    <div class="hero-blue"></div>

    <header class="header-wrapper">
      <h1 class="title">Profil Pribadi</h1>
      <p class="subtitle">Informasi lengkap mengenai data diri pelamar</p>

      <button class="btn-edit" @click="toggleEdit" :disabled="loading">
        {{ isEditing ? 'Simpan Perubahan' : 'Edit Profil' }}
      </button>
    </header>
  </section>

  <!-- ================= CARD ================= -->
  <div class="card-wrapper">
    <h2 class="section-title">Informasi Pribadi</h2>

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
}

.hero-blue {
  position: absolute;
  inset: 0;
  height: 26rem;
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 40%, #eff6ff 100%);
  border-radius: 0 0 1.5rem 1.5rem;
  z-index: 0;
}

.header-wrapper {
  position: relative;
  z-index: 1;
  max-width: 72rem;
  margin: auto;
  padding: 0 1.5rem;
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

.btn-edit {
  margin-top: 1.2rem;
  background: #ffffff;
  color: #1e40af;
  padding: 0.65rem 1.6rem;
  border-radius: 0.6rem;
  font-weight: 600;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  transition: all 0.25s ease;
}
.btn-edit:hover {
  transform: translateY(-2px);
}

/* ================= CARD ================= */
.card-wrapper {
  position: relative;
  z-index: 10;
  background: #ffffff;
  max-width: 72rem;
  margin: -10rem auto 2.5rem;
  padding: 2.2rem;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.18);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.6rem;
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
  transition: all 0.25s ease;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  outline: none;
}

.value-box {
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  color: #0f172a;
}

/* ================= RESPONSIVE ================= */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .card-wrapper {
    margin: -8rem 1rem 2rem;
    padding: 1.6rem;
  }
}
</style>
