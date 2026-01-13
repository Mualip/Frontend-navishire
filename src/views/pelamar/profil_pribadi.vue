<template>
  <!-- HERO -->
  <section class="hero">
    <div class="hero-inner">
      <div>
        <h1 class="title">Profil Pribadi</h1>
        <p class="subtitle">Informasi lengkap mengenai data diri pelamar</p>
      </div>

      <button class="btn-primary" @click="toggleEdit" :disabled="loading">
        {{ isEditing ? 'Simpan' : 'Edit Profil' }}
      </button>
    </div>

    <!-- SMOOTH BLUR TRANSITION -->
    <div class="hero-fade"></div>
  </section>

  <!-- CONTENT -->
  <section class="content">
    <div class="card">
      <h2 class="card-title">Informasi Pribadi</h2>

      <div class="grid">
        <div v-for="field in profileFields" :key="field.key" class="field-row">
          <div class="field-label">{{ field.label }}</div>

          <input
            v-if="isEditing"
            v-model="profilEditable[field.key]"
            class="field-input"
            type="text"
            placeholder="Isi data..."
          />

          <div v-else class="field-value">
            {{ profilEditable[field.key] || '-' }}
          </div>
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
.hero {
  position: relative;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  padding: 3rem 1.5rem 6rem;
}

.hero-inner {
  max-width: 1300px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
}

.subtitle {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
}

/* BLUR TRANSITION */
.hero-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.15) 30%,
    rgba(255, 255, 255, 0.5) 60%,
    #ffffff 100%
  );
  backdrop-filter: blur(6px);
}

/* ================= BUTTON ================= */
.btn-primary {
  background: #ffffff;
  color: #1e3a8a;
  padding: 0.6rem 2rem;
  border-radius: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* ================= CONTENT ================= */
.content {
  max-width: 1300px;
  margin: -3rem auto 3rem;
  padding: 0 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 22px;
  padding: 2.2rem;
  box-shadow: 0 25px 45px rgba(37, 99, 235, 0.25);
}

.card-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 1.5rem;
}

/* ================= GRID ================= */
.grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ================= FIELD ROW ================= */
.field-row {
  display: grid;
  grid-template-columns: 260px 1fr;
  align-items: center;
  border: 1.5px solid #bfdbfe;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  background: #f9fbff;
}

.field-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #1e40af;
  letter-spacing: 0.06em;
}

.field-value {
  font-size: 0.95rem;
  color: #0f172a;
}

.field-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #2563eb;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  padding: 0.25rem 0;
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {
  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .field-row {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
}
</style>
