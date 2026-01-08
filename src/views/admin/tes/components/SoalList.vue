<template>
  <div class="bg-white dark:bg-slate-900 rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold mb-4">Daftar Soal</h3>

    <table class="w-full text-sm border">
      <thead class="bg-gray-100 dark:bg-slate-800">
        <tr>
          <th class="p-2 border">No</th>
          <th class="p-2 border">Soal</th>
          <th class="p-2 border">Tipe</th>
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
          <td class="p-2 border text-center">{{ soal.tipe }}</td>
          <td class="p-2 border text-center">
            <button class="px-2 py-1 bg-blue-500 text-white rounded mr-2">Edit</button>
            <button class="px-2 py-1 bg-red-500 text-white rounded">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Soal {
  id: number
  pertanyaan: string
  tipe: string
}

const soalList: Soal[] = [
  {
    id: 1,
    pertanyaan: 'Jika 2x + 4 = 10, maka x = ?',
    tipe: 'Pilihan Ganda',
  },
  {
    id: 2,
    pertanyaan: 'Apa tujuan utama evaluasi pembelajaran?',
    tipe: 'Esai',
  },
  {
    id: 3,
    pertanyaan: 'Manakah metode mengajar yang paling efektif?',
    tipe: 'Pilihan Ganda',
  },
]
</script>
