<template>
  <!-- HEADER / HERO -->
  <div class="hero-blue">
    <div class="header-inner">
      <!-- TITLE -->
      <div>
        <h1 class="title">Profil Pribadi</h1>
        <p class="subtitle">Informasi lengkap mengenai data diri pelamar.</p>
      </div>

      <!-- BUTTON -->
      <div class="header-action">
        <button @click="toggleEdit" :disabled="loading" class="btn-primary">
          {{ isEditing ? 'Simpan' : 'Edit' }}
        </button>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="content-wrapper">
    <div class="card">
      <h2 class="card-title">Informasi Pribadi</h2>

      <div class="grid">
        <div v-for="field in profileFields" :key="field.key" class="field-card">
          <p class="field-label">{{ field.label }}</p>

          <!-- EDIT -->
          <input
            v-if="isEditing"
            v-model="profilEditable[field.key]"
            class="field-input"
            type="text"
          />

          <!-- READ -->
          <p v-else class="field-value">
            {{ profilEditable[field.key] || '-' }}
          </p>
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
  await apiFetch(API_BASE, 'POST', profilEditable.value)
  await loadProfile()
  alert('Profil berhasil disimpan')
}

const toggleEdit = async () => {
  if (isEditing.value) await saveProfile()
  isEditing.value = !isEditing.value
}

onMounted(loadProfile)
</script>

<style scoped>
/* ================= HEADER ================= */
.hero-blue {
  width: 100%;
  padding-bottom: 3.5rem;
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 55%, #60a5fa 75%, #eff6ff 100%);
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
}

.header-inner {
  max-width: 1280px;
  margin: auto;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.title {
  font-size: 2.75rem;
  font-weight: 800;
  color: white;
}

.subtitle {
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
}

/* ================= BUTTON ================= */
.btn-primary {
  background: white;
  color: #1e3a8a;
  padding: 0.65rem 2rem;
  border-radius: 14px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.btn-primary:hover {
  background: #f0f7ff;
}

/* ================= CONTENT ================= */
.content-wrapper {
  max-width: 1280px;
  margin: -3rem auto 3rem;
  padding: 0 1.5rem;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.15);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1.5rem;
}

/* ================= GRID ================= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.field-card {
  background: white;
  border: 1.5px solid #bfdbfe;
  border-radius: 16px;
  padding: 1rem 1.25rem;
}

.field-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #1e40af;
  letter-spacing: 0.05em;
}

.field-value {
  margin-top: 0.4rem;
  font-size: 1rem;
  font-weight: 500;
  color: #0f172a;
}

.field-input {
  margin-top: 0.4rem;
  width: 100%;
  border: none;
  outline: none;
  font-size: 1rem;
  border-bottom: 2px solid #2563eb;
  padding: 0.25rem 0;
}
</style>
