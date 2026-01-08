<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Tes Mata Pelajaran</h1>
        <p class="text-sm text-gray-500">Kelola soal berdasarkan mata pelajaran lowongan</p>
      </div>

      <button class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
        + Tambah Soal
      </button>
    </div>

    <!-- FILTER MAPEL -->
    <div class="bg-white dark:bg-slate-900 p-4 rounded-lg shadow">
      <label class="block text-sm font-medium mb-1"> Pilih Mata Pelajaran </label>
      <select v-model="selectedMapel" class="w-full border rounded px-3 py-2 text-sm">
        <option value="">Semua Mapel</option>
        <option v-for="mapel in mapelList" :key="mapel" :value="mapel">
          {{ mapel }}
        </option>
      </select>
    </div>

    <!-- TABEL SOAL -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
      <table class="w-full text-sm border">
        <thead class="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th class="p-2 border">No</th>
            <th class="p-2 border">Mapel</th>
            <th class="p-2 border">Soal</th>
            <th class="p-2 border">Tipe</th>
            <th class="p-2 border">Bobot</th>
            <th class="p-2 border">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(soal, index) in filteredSoal"
            :key="soal.id"
            class="hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <td class="p-2 border text-center">{{ index + 1 }}</td>
            <td class="p-2 border">{{ soal.mapel }}</td>
            <td class="p-2 border">{{ soal.pertanyaan }}</td>
            <td class="p-2 border text-center">
              <span
                class="px-2 py-1 text-xs rounded"
                :class="
                  soal.tipe === 'pilihan'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                "
              >
                {{ soal.tipe }}
              </span>
            </td>
            <td class="p-2 border text-center">{{ soal.bobot }}</td>
            <td class="p-2 border text-center space-x-2">
              <button class="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
              <button class="px-2 py-1 bg-red-500 text-white rounded">Hapus</button>
            </td>
          </tr>

          <tr v-if="filteredSoal.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">
              Tidak ada soal untuk mapel ini
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/* ================= TYPE ================= */
interface SoalMapel {
  id: number
  mapel: string
  pertanyaan: string
  tipe: 'pilihan' | 'uraian'
  bobot: number
}

/* ================= STATE ================= */
const selectedMapel = ref<string>('')

/* ================= DUMMY DATA ================= */
const mapelList: string[] = ['Matematika', 'Bahasa Indonesia', 'IPA', 'Bahasa Arab', 'PAI']

const soalList: SoalMapel[] = [
  {
    id: 1,
    mapel: 'Matematika',
    pertanyaan: 'Hasil dari 2x² + 3x − 5 = 0 adalah?',
    tipe: 'pilihan',
    bobot: 10,
  },
  {
    id: 2,
    mapel: 'Bahasa Indonesia',
    pertanyaan: 'Jelaskan struktur teks eksposisi!',
    tipe: 'uraian',
    bobot: 20,
  },
  {
    id: 3,
    mapel: 'IPA',
    pertanyaan: 'Apa fungsi utama mitokondria?',
    tipe: 'pilihan',
    bobot: 10,
  },
  {
    id: 4,
    mapel: 'PAI',
    pertanyaan: 'Sebutkan rukun iman secara berurutan!',
    tipe: 'uraian',
    bobot: 15,
  },
]

/* ================= COMPUTED ================= */
const filteredSoal = computed<SoalMapel[]>(() => {
  if (!selectedMapel.value) return soalList
  return soalList.filter((soal) => soal.mapel === selectedMapel.value)
})
</script>
