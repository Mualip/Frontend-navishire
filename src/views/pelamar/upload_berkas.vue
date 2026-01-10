<template>
  <div class="p-8">
    <!-- Judul -->
    <h2 class="text-3xl font-bold text-white mb-6">Upload Berkas Pelamar</h2>

    <!-- ===================================================== -->
    <!--            PRATINJAU PDF (MUNCUL SETELAH DIKLIK)     -->
    <!-- ===================================================== -->
    <transition name="fade">
      <div
        v-if="showPreview && filePreview"
        class="w-full bg-white border rounded-2xl shadow-2xl p-4 mb-10"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-xl font-bold text-gray-800">Pratinjau Berkas</h3>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            @click="showPreview = false"
          >
            Tutup Pratinjau
          </button>
        </div>

        <iframe :src="filePreview" class="w-full rounded-xl" style="height: 900px"></iframe>
      </div>
    </transition>

    <!-- ===================================================== -->
    <!--                     CARD UPLOAD                      -->
    <!-- ===================================================== -->
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 max-w-3xl">
      <p class="text-gray-600 text-sm mb-4">
        Silakan unggah berkas persyaratan dalam format PDF. Maksimal ukuran file:
        <b>2 MB</b>
      </p>

      <!-- INPUT FILE -->
      <label
        for="fileUpload"
        class="block cursor-pointer border-dashed border-2 border-indigo-400 rounded-xl py-10 text-center hover:bg-indigo-50 transition"
      >
        <div class="flex flex-col items-center space-y-2">
          <i class="fa-solid fa-file-pdf text-5xl text-indigo-500"></i>
          <span class="text-gray-600 font-medium text-lg">
            Klik di sini untuk memilih file PDF
          </span>
        </div>
      </label>

      <input
        id="fileUpload"
        type="file"
        accept="application/pdf"
        class="hidden"
        @change="handleFileUpload"
      />

      <!-- Nama File + Tombol Aksi -->
      <div
        v-if="selectedFile"
        class="mt-5 p-4 bg-gray-100 border rounded-xl flex justify-between items-center"
      >
        <div>
          <p class="text-gray-800 font-bold">File Dipilih:</p>
          <p class="text-gray-700 text-sm">{{ selectedFile.name }}</p>
        </div>

        <div class="flex gap-3">
          <!-- Tombol Lihat -->
          <button
            @click="togglePreview"
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 transition font-semibold shadow-sm"
          >
            <i class="fa-solid fa-eye"></i>
            Lihat
          </button>

          <!-- Tombol Hapus -->
          <button
            @click="hapusFile"
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition font-semibold shadow-sm"
          >
            <i class="fa-solid fa-trash"></i>
            Hapus
          </button>
        </div>
      </div>

      <!-- Tombol Upload -->
      <button
        class="mt-5 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-semibold w-full"
        :disabled="isUploading || !selectedFile"
        @click="uploadFile"
      >
        <span v-if="!isUploading">Upload Berkas</span>
        <span v-else>Mengunggah...</span>
      </button>

      <p v-if="uploadSuccess" class="text-green-600 mt-4 font-medium text-lg text-center">
        ✓ Berkas berhasil diupload! (dummy)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

/* ================= STATE ================= */
const selectedFile = ref<File | null>(null)
const filePreview = ref<string | null>(null)
const showPreview = ref(false)
const isUploading = ref(false)
const uploadSuccess = ref(false)

/* ================= API BASE ================= */
const API_BASE = import.meta.env.VITE_API_URL

/* ================= HANDLER FILE ================= */
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validasi type dan ukuran
  if (file.type !== 'application/pdf') {
    alert('Hanya file PDF yang diperbolehkan!')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    alert('Ukuran file maksimal 2MB!')
    return
  }

  selectedFile.value = file
  uploadSuccess.value = false
  filePreview.value = URL.createObjectURL(file)
  showPreview.value = false
}

/* ================= PREVIEW ================= */
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

/* ================= UPLOAD ================= */
const uploadFile = async () => {
  if (!selectedFile.value) return alert('Belum ada file yang dipilih!')
  isUploading.value = true

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const res = await axios.post(`${API_BASE}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Upload success:', res.data)
    uploadSuccess.value = true
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.message || 'Gagal mengunggah file')
      console.error(err.response?.data)
    } else {
      console.error(err)
      alert('Gagal mengunggah file')
    }
  } finally {
    isUploading.value = false
  }
}

/* ================= HAPUS ================= */
const hapusFile = () => {
  selectedFile.value = null
  filePreview.value = null
  showPreview.value = false
  uploadSuccess.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
