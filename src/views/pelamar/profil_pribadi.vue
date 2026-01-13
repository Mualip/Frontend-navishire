<template>
  <!-- HERO HEADER -->
  <section class="hero-blue">
    <div class="header-inner">
      <div>
        <h1 class="title">Profil Pribadi</h1>
        <p class="subtitle">Informasi lengkap mengenai data diri pelamar.</p>
      </div>

      <button class="btn-primary" @click="toggleEdit" :disabled="loading">
        {{ isEditing ? 'Simpan' : 'Edit' }}
      </button>
    </div>
  </section>

  <!-- CONTENT -->
  <section class="content-wrapper">
    <div class="card">
      <h2 class="card-title">Informasi Pribadi</h2>

      <div class="grid">
        <div v-for="field in profileFields" :key="field.key" class="field-card">
          <span class="field-label">{{ field.label }}</span>

          <input
            v-if="isEditing"
            v-model="profilEditable[field.key]"
            class="field-input"
            type="text"
          />

          <p v-else class="field-value">
            {{ profilEditable[field.key] || '-' }}
          </p>
        </div>
      </div>
    </div>
  </section>
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
/* ================= HERO (FIX FINAL) ================= */
.hero-blue {
  position: relative;
  width: 100%;
  padding-bottom: 6rem;

  /* BIRU TEGAS → BLUR KE BAWAH */
  background: linear-gradient(
    to bottom,
    #2563eb 0%,
    #2563eb 50%,
    #3b82f6 70%,
    rgba(59, 130, 246, 0.25) 85%,
    rgba(59, 130, 246, 0) 100%
  );

  /* ❌ TANPA LENGKUNG */
  border-radius: 0;
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
  font-size: 2.7rem;
  font-weight: 800;
  color: #ffffff;
}

.subtitle {
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
}

/* ================= BUTTON ================= */
.btn-primary {
  background: #ffffff;
  color: #1e3a8a;
  padding: 0.65rem 2rem;
  border-radius: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  background: #f0f7ff;
}

/* ================= CONTENT ================= */
.content-wrapper {
  max-width: 1280px;
  margin: -3.5rem auto 3rem;
  padding: 0 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.18);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 1.75rem;
}

/* ================= GRID ================= */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.field-card {
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
