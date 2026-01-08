<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Tes Pedagogik</h1>
      <button class="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
        + Tambah Soal
      </button>
    </div>

    <!-- DESKRIPSI -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
      Tes pedagogik digunakan untuk mengukur kemampuan mengajar, pengelolaan kelas, serta pemahaman
      peserta terhadap proses pembelajaran.
    </div>

    <!-- LIST SOAL -->
    <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
      <table class="w-full text-sm border">
        <thead class="bg-gray-100 dark:bg-slate-800">
          <tr>
            <th class="p-2 border">No</th>
            <th class="p-2 border">Pertanyaan</th>
            <th class="p-2 border">Tipe</th>
            <th class="p-2 border">Bobot</th>
            <th class="p-2 border">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(soal, index) in soalList"
            :key="soal.id"
            class="hover:bg-gray-50 dark:hover:bg-slate-800"
          >
            <td class="p-2 border text-center">{{ index + 1 }}</td>
            <td class="p-2 border">{{ soal.pertanyaan }}</td>
            <td class="p-2 border text-center">
              <span
                class="px-2 py-1 text-xs rounded"
                :class="
                  soal.tipe === 'pilihan'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ================= TYPE ================= */
interface SoalPedagogik {
  id: number
  pertanyaan: string
  tipe: 'pilihan' | 'studi_kasus'
  bobot: number
}

/* ================= DUMMY DATA ================= */
const soalList: SoalPedagogik[] = [
  {
    id: 1,
    pertanyaan:
      'Apa langkah pertama yang harus dilakukan guru saat menghadapi kelas yang tidak kondusif?',
    tipe: 'pilihan',
    bobot: 10,
  },
  {
    id: 2,
    pertanyaan:
      'Bagaimana strategi Anda untuk mengajar siswa dengan kemampuan belajar yang beragam?',
    tipe: 'studi_kasus',
    bobot: 20,
  },
  {
    id: 3,
    pertanyaan: 'Apa tujuan utama penilaian formatif dalam pembelajaran?',
    tipe: 'pilihan',
    bobot: 15,
  },
]
</script>
