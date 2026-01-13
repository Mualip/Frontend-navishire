<template>
  <!-- HERO HEADER -->
  <div class="hero-blue w-full rounded-b-2xl">
    <div class="px-6 py-10 md:py-12 space-y-6 mx-auto max-w-7xl">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Profil Pribadi</h1>
        <p class="text-blue-100 text-sm mt-2">Informasi lengkap mengenai data diri pelamar.</p>
      </div>

      <!-- BUTTON -->
      <div class="mt-28 flex justify-end">
        <button
          @click="toggleEdit"
          :disabled="loading"
          class="px-8 py-2.5 rounded-lg bg-white text-blue-700 font-semibold shadow-md hover:bg-blue-50 transition-all disabled:opacity-50"
        >
          {{ isEditing ? 'Simpan' : 'Edit' }}
        </button>
      </div>
    </div>
  </div>

  <!-- CARD PROFILE -->
  <div class="bg-white shadow-md border border-blue-100 rounded-xl p-6 mt-8 max-w-7xl mx-auto">
    <h2 class="text-lg font-semibold text-blue-800 mb-6">Informasi Pribadi</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="field in profileFields"
        :key="field.key"
        class="p-4 rounded-lg bg-blue-50 border border-blue-100"
      >
        <p class="text-xs font-semibold text-blue-600 uppercase mb-1">
          {{ field.label }}
        </p>

        <!-- EDIT MODE -->
        <input
          v-if="isEditing"
          v-model="profilEditable[field.key]"
          type="text"
          class="w-full px-3 py-2 rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
        />

        <!-- READ MODE -->
        <p v-else class="mt-1.5 text-blue-900 font-medium min-h-[24px]">
          {{ profilEditable[field.key] || '-' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

/* ================= API ================= */
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

/* ================= API FETCH ================= */
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

/* ================= LOAD ================= */
const loadProfile = async () => {
  try {
    loading.value = true
    const data = await apiFetch(API_BASE, 'GET')
    profileFields.forEach((f) => {
      profilEditable.value[f.key] = data?.[f.key] ?? ''
    })
  } catch (err) {
    console.error('Load profile gagal:', err)
  } finally {
    loading.value = false
  }
}

/* ================= SAVE ================= */
const saveProfile = async () => {
  try {
    loading.value = true
    await apiFetch(API_BASE, 'POST', profilEditable.value)
    await loadProfile()
    alert('Profil berhasil disimpan')
  } catch (err) {
    console.error('SAVE PROFILE ERROR:', err)
    if (err instanceof Error) alert(err.message)
  } finally {
    loading.value = false
  }
}

const toggleEdit = async () => {
  if (isEditing.value) {
    await saveProfile()
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

onMounted(loadProfile)
</script>

<style scoped>
/* ===== HERO BLUE GRADIENT (SAMA DENGAN FORM LAMARAN) ===== */
.hero-blue {
  width: 100%;
  height: 10rem;
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 45%, #60a5fa 65%, #eff6ff 90%);
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
</style>
