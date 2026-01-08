<template>
  <div class="wrapper">
    <h2 class="title">Input Hasil Tes (Spreadsheet)</h2>

    <div class="table-wrapper">
      <table class="sheet">
        <thead>
          <!-- HEADER UTAMA -->
          <tr>
            <th rowspan="2" class="col-no">No</th>
            <th rowspan="2" class="col-nama">Nama</th>

            <th v-for="item in itemPenilaian" :key="item.key" colspan="4" class="group-header">
              {{ item.label }}
            </th>
          </tr>

          <!-- SUB HEADER -->
          <tr>
            <template v-for="item in itemPenilaian" :key="item.key">
              <th class="col-nilai">Nilai</th>
              <th class="col-bobot">Bobot</th>
              <th class="col-akhir">Nilai Akhir</th>
              <th class="col-ket">Keterangan</th>
            </template>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(peserta, rowIndex) in pesertaList" :key="rowIndex">
            <td class="no-cell">{{ rowIndex + 1 }}</td>

            <!-- NAMA -->
            <td>
              <input v-model="peserta.nama" class="nama" />
            </td>

            <!-- ITEM PENILAIAN -->
            <template v-for="item in itemPenilaian" :key="item.key">
              <td>
                <input
                  type="number"
                  v-model.number="peserta.nilai[item.key].nilai"
                  @input="hitungNilaiAkhir(peserta, item.key)"
                />
              </td>

              <!-- BOBOT DENGAN % -->
              <td>
                <div class="percent-input">
                  <input
                    type="number"
                    v-model.number="peserta.nilai[item.key].bobot"
                    @input="hitungNilaiAkhir(peserta, item.key)"
                  />
                  <span>%</span>
                </div>
              </td>

              <td class="readonly">
                {{ peserta.nilai[item.key].nilaiAkhir }}
              </td>

              <td>
                <input v-model="peserta.nilai[item.key].keterangan" class="ket" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ACTION -->
    <div class="actions">
      <button @click="simpan">Simpan</button>
      <button @click="print">Cetak</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

/* ================= TYPES ================= */

interface NilaiItem {
  nilai: number
  bobot: number
  nilaiAkhir: number
  keterangan: string
}

type ItemKey =
  | 'potensi'
  | 'pedagogik'
  | 'kognitif'
  | 'microteaching'
  | 'keilmuan'
  | 'psikomotor'
  | 'pendalaman'

interface Peserta {
  nama: string
  nilai: Record<ItemKey, NilaiItem>
}

/* ================= MASTER ITEM ================= */

const itemPenilaian: { key: ItemKey; label: string }[] = [
  { key: 'potensi', label: 'Potensi Akademik' },
  { key: 'pedagogik', label: 'Teori Pedagogik' },
  { key: 'kognitif', label: 'Taksonomi Ranah Kognitif' },
  { key: 'microteaching', label: 'Praktik Pedagogik (Microteaching)' },
  { key: 'keilmuan', label: 'Teori Keilmuan' },
  { key: 'psikomotor', label: 'Praktik Psikomotor Keilmuan' },
  { key: 'pendalaman', label: 'Pendalaman (W)' },
]

/* ================= DATA ================= */

const createNilaiItem = (): NilaiItem => ({
  nilai: 0,
  bobot: 0,
  nilaiAkhir: 0,
  keterangan: '',
})

const createPeserta = (): Peserta => ({
  nama: '',
  nilai: {
    potensi: createNilaiItem(),
    pedagogik: createNilaiItem(),
    kognitif: createNilaiItem(),
    microteaching: createNilaiItem(),
    keilmuan: createNilaiItem(),
    psikomotor: createNilaiItem(),
    pendalaman: createNilaiItem(),
  },
})

/* default 10 peserta */
const pesertaList = reactive<Peserta[]>(Array.from({ length: 10 }, () => createPeserta()))

/* ================= METHODS ================= */

const hitungNilaiAkhir = (peserta: Peserta, key: ItemKey): void => {
  const item = peserta.nilai[key]
  item.nilaiAkhir = Number(((item.nilai * item.bobot) / 100).toFixed(2))
}

/* SIMPAN (contoh localStorage → siap ganti API) */
const simpan = (): void => {
  localStorage.setItem('hasilTes', JSON.stringify(pesertaList))
  alert('Data berhasil disimpan')
}

const print = (): void => {
  window.print()
}
</script>

<style scoped>
/* ================= LAYOUT ================= */

.wrapper {
  padding: 20px;
  background: #f0f6ff;
}

.title {
  color: #1e3a8a;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}

/* ================= TABLE ================= */

.sheet {
  border-collapse: collapse;
  min-width: 2400px;
  font-size: 13px;
  background: #ffffff;
}

.sheet th,
.sheet td {
  border: 1px solid #c7d2fe;
  padding: 6px;
  text-align: center;
}

.sheet thead th {
  background: #1e40af;
  color: #ffffff;
  font-weight: 700;
}

.group-header {
  background: #1d4ed8 !important;
}

/* ================= COLUMN ================= */

.col-no {
  width: 50px;
}

.col-nama {
  width: 160px;
}

.col-nilai {
  width: 70px;
}

.col-bobot {
  width: 90px;
}

.col-akhir {
  width: 90px;
}

.col-ket {
  width: 220px;
}

/* ================= BODY ================= */

.no-cell {
  background: #e0e7ff;
  font-weight: 600;
}

.sheet tbody tr:nth-child(even) {
  background: #f8fafc;
}

/* ================= INPUT ================= */

.sheet input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
}

.sheet input.nama,
.sheet input.ket {
  text-align: left;
}

.percent-input {
  display: flex;
  align-items: center;
  gap: 4px;
}

.percent-input span {
  font-size: 12px;
  color: #1e3a8a;
  font-weight: 600;
}

.readonly {
  background: #eef2ff;
  font-weight: 600;
  color: #1e3a8a;
}

/* ================= ACTION ================= */

.actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.actions button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.actions button:hover {
  background: #1d4ed8;
}

@media print {
  .actions {
    display: none;
  }

  .wrapper {
    background: #fff;
  }
}
</style>
