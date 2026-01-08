<template>
  <div class="page-wrapper bg-gray-100 min-h-screen">
    <div class="a4 bg-white p-8 mx-auto">
      <!-- JUDUL -->
      <h1 class="text-xl font-bold text-center mb-6">DETAIL LAMARAN PEKERJAAN</h1>

      <!-- DATA -->
      <table v-if="d" class="w-full border text-sm">
        <tbody>
          <tr v-for="(val, label) in dataRows" :key="label">
            <td class="label">{{ label }}</td>
            <td>{{ val }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 📎 BERKAS -->
      <div v-if="d?.berkas?.length" class="mt-10">
        <h3 class="text-lg font-semibold mb-4">📎 Berkas Lampiran</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="b in d.berkas"
            :key="b._id"
            class="border rounded-lg p-4 bg-gray-50 flex gap-4"
          >
            <!-- ICON -->
            <div class="text-4xl">
              <span v-if="isPDF(b.originalName)">📄</span>
              <span v-else-if="isImage(b.originalName)">🖼️</span>
              <span v-else>📁</span>
            </div>

            <!-- INFO -->
            <div class="flex-1">
              <p class="font-medium text-sm break-all">
                {{ b.originalName }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ fileType(b.originalName) }}
              </p>

              <div class="mt-3 flex gap-2">
                <button
                  @click="openPreview(b)"
                  class="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  👁 Lihat
                </button>

                <a
                  :href="fileUrl(b.gridfsId)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1 text-xs rounded bg-blue-600 text-black hover:bg-blue-700 inline-block"
                >
                  👁 Lihat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- KEMBALI -->
      <div class="mt-10 text-right">
        <router-link to="/dashboard/data_pelamar" class="btn btn-gray"> Kembali </router-link>
      </div>
    </div>

    <!-- ================= MODAL PREVIEW ================= -->
    <div
      v-if="preview"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    >
      <div class="bg-white w-[90%] h-[90%] rounded-lg relative overflow-hidden">
        <button
          @click="closePreview"
          class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          ✕ Tutup
        </button>

        <!-- PDF -->
        <iframe v-if="previewType === 'pdf'" :src="previewUrl" class="w-full h-full"></iframe>

        <!-- IMAGE -->
        <div
          v-else-if="previewType === 'image'"
          class="w-full h-full flex items-center justify-center bg-gray-100"
        >
          <img :src="previewUrl" class="max-h-full max-w-full object-contain" />
        </div>

        <!-- OTHER -->
        <div v-else class="w-full h-full flex items-center justify-center">
          <p class="text-gray-600">File tidak bisa dipratinjau</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

/* ================= TYPE ================= */

interface Berkas {
  _id: string
  originalName: string
  gridfsId: string
}

interface LamaranDetail {
  nama: string
  nik: string
  email: string
  phone: string
  sosmed?: string
  alamat: string
  jk: string
  tglLahir: string
  statusNikah: string
  posisi: string
  lembaga: string
  lokasiKerja: string
  pendidikanTerakhir: string
  almamater?: string
  pengabdianPesantren: string
  motivasiNilai: number
  rutinKajian: string
  motivasiMelamar: string
  sumberLowongan: string
  gajiHarapan?: string
  hobi?: string[]
  deskripsiDiri?: string
  siapBekerja?: string
  berkas?: Berkas[]
}

/* ================= LOGIC ================= */

const route = useRoute()
const d = ref<LamaranDetail | null>(null)

const API = 'http://localhost:5000/api/admin/lamaran'
const FILE_API = 'http://localhost:5000/api/files'

const fileUrl = (id: string) => `${FILE_API}/${id}`

const isPDF = (name: string) => name.toLowerCase().endsWith('.pdf')
const isImage = (name: string) => /\.(jpg|jpeg|png|webp)$/i.test(name)

const fileType = (name: string) => {
  if (isPDF(name)) return 'PDF Document'
  if (isImage(name)) return 'Image File'
  return 'File'
}

/* ================= PREVIEW ================= */

const preview = ref<Berkas | null>(null)
const previewUrl = ref('')
const previewType = ref<'pdf' | 'image' | 'other'>('other')

const openPreview = (b: Berkas) => {
  preview.value = b
  previewUrl.value = fileUrl(b.gridfsId)

  if (isPDF(b.originalName)) previewType.value = 'pdf'
  else if (isImage(b.originalName)) previewType.value = 'image'
  else previewType.value = 'other'
}

const closePreview = () => {
  preview.value = null
  previewUrl.value = ''
}

/* ================= DATA ================= */

const dataRows = computed(() => {
  if (!d.value) return {}
  return {
    Nama: d.value.nama,
    NIK: d.value.nik,
    Email: d.value.email,
    'No HP': d.value.phone,
    'Sosial Media': d.value.sosmed || '-',
    Alamat: d.value.alamat,
    'Jenis Kelamin': d.value.jk,
    'Tanggal Lahir': d.value.tglLahir,
    'Status Nikah': d.value.statusNikah,
    Posisi: d.value.posisi,
    Lembaga: d.value.lembaga,
    'Lokasi Kerja': d.value.lokasiKerja,
    Pendidikan: d.value.pendidikanTerakhir,
    Almamater: d.value.almamater || '-',
    'Motivasi Nilai': `${d.value.motivasiNilai}/10`,
    'Motivasi Melamar': d.value.motivasiMelamar,
    'Sumber Lowongan': d.value.sumberLowongan,
    'Siap Bekerja': d.value.siapBekerja || '-',
  }
})

const fetchDetail = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const res = await fetch(`${API}/${route.params.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  d.value = await res.json()
}

onMounted(fetchDetail)
</script>

<style scoped>
/* .a4 {
  width: 210mm;
  min-height: 297mm;
} */
.a4 {
  max-width: 1250px; /* ⬅️ ini bikin lebih lebar */
  width: 100%;
  min-height: auto;
  margin: 0 auto;
  padding: 32px;
}
table td {
  border: 1px solid #e5e7eb;
  padding: 8px;
}
.label {
  width: 35%;
  font-weight: 600;
  background: #f9fafb;
}
.btn {
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 13px;
}
.btn-gray {
  background: #6b7280;
  color: white;
}
/* WRAPPER HALAMAN */
.page-wrapper {
  padding: 16px; /* dari 32px 48px → lebih seimbang */
}
/* RESPONSIVE */
@media (max-width: 768px) {
  .page-wrapper {
    padding: 16px;
  }
}
</style>
