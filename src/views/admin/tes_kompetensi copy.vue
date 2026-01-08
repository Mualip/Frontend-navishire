<template>
  <div class="page-wrapper bg-gray-100 min-h-screen">
    <div class="a4 bg-white mx-auto">
      <!-- ================= HEADER ================= -->
      <h1 class="title">Hasil Tes Uji Kompetensi</h1>

      <!-- ================= IDENTITAS ================= -->
      <table class="info-table">
        <tbody>
          <tr>
            <td class="label">Nama</td>
            <td>{{ data.nama }}</td>
          </tr>
          <tr>
            <td class="label">Formasi</td>
            <td>{{ data.formasi }}</td>
          </tr>
          <tr>
            <td class="label">Tgl Tes</td>
            <td>{{ data.tanggal }}</td>
          </tr>
        </tbody>
      </table>

      <!-- ================= HASIL TES ================= -->
      <h3 class="section-title">Hasil Tes</h3>

      <table class="result-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Item Penilaian</th>
            <th>Nilai</th>
            <th>Bobot</th>
            <th>Nilai Akhir</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i, index) in data.penilaian" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ i.item }}</td>
            <td>{{ i.nilai }}</td>
            <td>{{ i.bobot }}%</td>
            <td>{{ i.nilaiAkhir }}</td>
            <td>{{ i.keterangan }}</td>
          </tr>

          <!-- TOTAL -->
          <tr class="total-row">
            <td colspan="3"></td>
            <td><strong>Jumlah</strong></td>
            <td><strong>100%</strong></td>
            <td>
              <strong>{{ totalNilai }}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ================= BFI ================= -->
      <div class="bfi">
        <h3 class="section-title">Kepribadian (Big Five Test / BFI)</h3>

        <p>
          <strong>Ekstraversi {{ data.bfi.ekstraversi }}%</strong> (sedang):
          {{ data.bfi.descEkstraversi }}
        </p>
        <p>
          <strong>Agreeableness {{ data.bfi.agreeableness }}%</strong> (tinggi):
          {{ data.bfi.descAgreeableness }}
        </p>
        <p>
          <strong>Conscientiousness {{ data.bfi.conscientiousness }}%</strong> (tinggi sekali):
          {{ data.bfi.descConscientiousness }}
        </p>
        <p>
          <strong>Neuroticism {{ data.bfi.neuroticism }}%</strong> (sedang):
          {{ data.bfi.descNeuroticism }}
        </p>
        <p>
          <strong>Openness {{ data.bfi.openness }}%</strong> (sedang): {{ data.bfi.descOpenness }}
        </p>

        <div class="implication">
          <p><strong>Implikasi rekrutmen:</strong></p>
          <p>{{ data.implikasi }}</p>
        </div>

        <div class="note">
          <p><strong>Catatan:</strong></p>
          <p>{{ data.catatan }}</p>
        </div>
      </div>

      <!-- ================= ACTION ================= -->
      <div class="actions">
        <button class="btn btn-gray" @click="$router.back()">Kembali</button>
        <button class="btn btn-primary" @click="print">Cetak</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/* ================= DATA DUMMY (GANTI DARI API) ================= */

const data = {
  nama: 'Azizah Auliya Rahmah',
  formasi: 'Tutor Al Quran',
  tanggal: '12 Juni 2025',

  penilaian: [
    {
      item: 'Potensi Akademik',
      nilai: 64,
      bobot: 15,
      nilaiAkhir: 9.6,
      keterangan: 'Tes Potensi Akademik',
    },
    {
      item: 'Teori Pedagogik',
      nilai: 87,
      bobot: 5,
      nilaiAkhir: 4.4,
      keterangan: 'Pedagogik Halaqah',
    },
    {
      item: 'Taksonomi Ranah Kognitif',
      nilai: 0,
      bobot: 10,
      nilaiAkhir: 0,
      keterangan: '-',
    },
    {
      item: 'Praktik Implementasi Pedagogik (Microteaching)',
      nilai: 0,
      bobot: 15,
      nilaiAkhir: 0,
      keterangan: 'Simulasi halaqah muraja’ah surat Al Fajr',
    },
    {
      item: 'Teori Keilmuan',
      nilai: 75,
      bobot: 25,
      nilaiAkhir: 18.8,
      keterangan: 'Ilmu Al Quran',
    },
    {
      item: 'Praktik Psikomotor Keilmuan',
      nilai: 0,
      bobot: 30,
      nilaiAkhir: 0,
      keterangan: 'Tilawah & Hafalan Juz 28–30',
    },
    {
      item: 'Pendalaman (W)',
      nilai: 0,
      bobot: 10,
      nilaiAkhir: 0,
      keterangan: '-',
    },
  ],

  bfi: {
    ekstraversi: 42,
    agreeableness: 78,
    conscientiousness: 98,
    neuroticism: 46,
    openness: 60,

    descEkstraversi: 'Cenderung seimbang, mampu berinteraksi sosial namun tetap reflektif.',
    descAgreeableness: 'Kooperatif, ramah, mudah bekerja sama, mendukung kerja tim.',
    descConscientiousness: 'Sangat terorganisir, teliti, bertanggung jawab, dan konsisten.',
    descNeuroticism: 'Relatif stabil secara emosional, namun bisa sensitif dalam tekanan tinggi.',
    descOpenness: 'Cukup terbuka terhadap hal baru, nyaman dengan struktur yang jelas.',
  },

  implikasi:
    'Sangat potensial untuk posisi yang menuntut ketelitian, tanggung jawab tinggi, dan SOP yang jelas.',
  catatan: 'Sebaiknya ditempatkan pada peran dengan struktur kerja rapi dan lingkungan suportif.',
}

/* ================= COMPUTED ================= */

const totalNilai = computed(() => data.penilaian.reduce((t, i) => t + i.nilaiAkhir, 0).toFixed(1))

const print = () => window.print()
</script>

<style scoped>
/* ================= PAGE ================= */
.page-wrapper {
  padding: 24px;
}
.a4 {
  width: 210mm;
  min-height: 297mm;
  padding: 32px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* ================= TEXT ================= */
.title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
}
.section-title {
  font-size: 14px;
  font-weight: 700;
  margin: 24px 0 12px;
}

/* ================= TABLE ================= */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th,
td {
  border: 1px solid #000;
  padding: 6px 8px;
}
th {
  text-align: center;
  background: #f3f4f6;
}
.label {
  width: 25%;
  font-weight: 600;
  background: #f9fafb;
}

.info-table td {
  border: none;
  padding: 4px 8px;
}

.result-table th,
.result-table td {
  text-align: center;
}
.result-table td:nth-child(2),
.result-table td:nth-child(6) {
  text-align: left;
}

.total-row td {
  font-weight: 700;
}

/* ================= BFI ================= */
.bfi p {
  margin-bottom: 6px;
  line-height: 1.5;
}
.implication,
.note {
  margin-top: 12px;
}

/* ================= ACTION ================= */
.actions {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
}
.btn {
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 4px;
}
.btn-gray {
  background: #6b7280;
  color: #fff;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}

/* ================= PRINT ================= */
@media print {
  .page-wrapper {
    padding: 0;
    background: white;
  }
  .actions {
    display: none;
  }
  .a4 {
    box-shadow: none;
  }
}
</style>
