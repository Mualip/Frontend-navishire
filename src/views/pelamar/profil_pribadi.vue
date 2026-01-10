<template>
  <!-- HEADER -->
  <div class="w-full rounded-b-2xl" style="background: linear-gradient(#2563eb)">
    <div class="px-6 py-10 md:py-12 space-y-6 mx-auto max-w-7xl">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Profil Pribadi</h1>
        <p class="text-white text-sm mt-2">Informasi lengkap mengenai data diri pelamar.</p>
      </div>

      <!-- BUTTON -->
      <div class="mt-32 flex justify-end">
        <button
          @click="toggleEdit"
          :disabled="loading"
          class="px-8 py-2.5 rounded-lg bg-blue-800 text-white font-semibold shadow hover:bg-blue-900 transition-all disabled:opacity-50"
        >
          {{ isEditing ? 'Simpan' : 'Edit' }}
        </button>
      </div>
    </div>
  </div>

  <!-- CARD PROFILE -->
  <div class="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mt-8">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Informasi Pribadi</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="field in profileFields"
        :key="field.key"
        class="p-4 border border-gray-100 rounded-lg bg-gray-50"
      >
        <p class="text-xs font-semibold text-gray-500 uppercase mb-1">
          {{ field.label }}
        </p>

        <!-- EDIT -->
        <input
          v-if="isEditing"
          v-model="profilEditable[field.key]"
          type="text"
          class="w-full px-3 py-2 rounded border border-gray-300 focus:ring focus:ring-blue-200"
        />

        <!-- READ -->
        <p v-else class="mt-1.5 text-gray-800 font-medium min-h-[24px]">
          {{ profilEditable[field.key] || '-' }}
        </p>
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

const saveProfile = async () => {
  try {
    loading.value = true
    await apiFetch(API_BASE, 'POST', profilEditable.value)
    await loadProfile()
    alert('Profil berhasil disimpan')
  } catch (err) {
    console.error('SAVE PROFILE ERROR:', err)
    if (err instanceof Error) alert(err.message)
    else alert('Gagal menyimpan profil')
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
/* ===== HERO BLUE BACKGROUND ===== */
.hero-blue {
  position: relative;
  width: 100%;
  height: 18rem;
  background: linear-gradient(
    180deg,
    #2563eb 0%,
    /* biru gelap di atas */ #3b82f6 40%,
    /* biru medium agak ke tengah */ #eff6ff 70% /* biru muda ke bawah */
  );
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 0;
}
/* Opsional, untuk tambahan styling jika mau */
</style>
