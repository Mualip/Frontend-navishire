<template>
  <!-- HERO & HEADER -->
  <section class="hero-section relative">
    <div class="hero-blue"></div>

    <header class="header-wrapper relative z-10 px-6 md:px-12 py-10">
      <div>
        <h1 class="title">Profil Pribadi</h1>
        <p class="subtitle">Informasi lengkap mengenai data diri pelamar.</p>
      </div>

      <!-- BUTTON EDIT -->
      <div class="mt-8 flex justify-end">
        <button
          @click="toggleEdit"
          :disabled="loading"
          class="px-8 py-2.5 rounded-lg bg-blue-800 text-white font-semibold shadow hover:bg-blue-900 transition-all disabled:opacity-50"
        >
          {{ isEditing ? 'Simpan' : 'Edit' }}
        </button>
      </div>
    </header>
  </section>

  <!-- CARD PROFILE -->
  <div class="card-wrapper">
    <h2 class="step-title mb-4">Informasi Pribadi</h2>

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

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

onMounted(() => {
  // bisa fetch API disini
})
</script>

<style scoped>
/* ================= HERO ================= */
.hero-section {
  position: relative;
}
.hero-blue {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20rem; /* tinggi ringkas */
  background: linear-gradient(
    195deg,
    #1e40af 0%,
    #2563eb 25%,
    #3b82f6 50%,
    #60a5fa 75%,
    #eff6ff 100%
  );
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 0;
}
.header-wrapper {
  position: relative;
  z-index: 10;
  max-width: 72rem;
  margin: 0 auto;
  color: #ffffff;
}
.title {
  font-size: 1.875rem;
  font-weight: 700;
}
.subtitle {
  margin-top: 0.5rem;
  color: #e0e7ff;
}

/* ================= CARD ================= */
.card-wrapper {
  position: relative;
  z-index: 10;
  background: #ffffff;
  max-width: 72rem;
  margin: -6rem auto 2rem; /* overlap dengan hero */
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.15);
  transition: all 0.25s ease;
}
.card-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.22);
}

/* ================= STEP TITLE ================= */
.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e3a8a;
}
</style>
