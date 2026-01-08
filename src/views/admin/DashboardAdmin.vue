<template>
  <div class="dashboard-page">
    <!-- HEADER -->
    <DashboardHeader :nama="user.name" />

    <!-- SUMMARY -->
    <section class="section">
      <StatCards
        :profilLengkap="profilLengkap"
        :totalLamaran="lamaran ? 1 : 0"
        :statusBerkas="statusLabel"
        :tahapAktif="tahapAktif"
      />
    </section>

    <!-- PROGRESS + UNDANGAN -->
    <section class="section grid-2">
      <ProgressTahapan :tahapan="tahapan" />

      <UndanganAktifCard v-if="lamaran?.status === 'diterima' && undangan" :undangan="undangan" />
    </section>

    <!-- NOTIFIKASI -->
    <section class="section">
      <NotifikasiList :data="notifikasi" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import DashboardHeader from '@/components/admin/DashboardHeader.vue'
import StatCards from '@/components/admin/StatCards.vue'
import ProgressTahapan from '@/components/pelamar/ProgressTahapan.vue'
import NotifikasiList from '@/components/pelamar/NotifikasiList.vue'
import UndanganAktifCard from '@/components/pelamar/UndanganAktifCard.vue'

import { getLamaranSaya, getUndanganSaya } from '@/services/lamaran.service'
import { getNotifikasi } from '@/services/notifikasiService'

import type { Notifikasi } from '@/types/Notifikasi'
import type { Undangan } from '@/services/lamaran.service'

interface Lamaran {
  _id: string
  nama: string
  email: string
  posisi: string
  status: 'pending' | 'diterima' | 'ditolak'
}

/* ================= STATE ================= */
const user = ref({ name: 'Mualip' })
const profilLengkap = ref(true)

const lamaran = ref<Lamaran | null>(null)
const undangan = ref<Undangan | null>(null)
const notifikasi = ref<Notifikasi[]>([])

const tahapan = ['Berkas', 'Tes Tulis', 'Tes Wawancara', 'Micro Teaching', 'Pengumuman']

/* ================= COMPUTED ================= */
const statusLabel = computed(() => {
  if (!lamaran.value) return '-'
  if (lamaran.value.status === 'diterima') return 'Diterima'
  if (lamaran.value.status === 'ditolak') return 'Ditolak'
  return 'Menunggu Verifikasi'
})

const tahapAktif = computed(() => {
  if (!lamaran.value) return '-'
  if (lamaran.value.status === 'diterima') return 'Tes Tahap 1'
  if (lamaran.value.status === 'ditolak') return 'Tidak Lolos'
  return 'Verifikasi Berkas'
})

/* ================= FETCH ================= */
onMounted(async () => {
  try {
    // 1️⃣ STATUS REAL DARI DB
    lamaran.value = await getLamaranSaya()

    // 2️⃣ NOTIFIKASI
    notifikasi.value = await getNotifikasi()

    // 3️⃣ UNDANGAN REAL DARI DB
    if (lamaran.value.status === 'diterima') {
      const list = await getUndanganSaya(lamaran.value._id)
      undangan.value = list.length ? list[0] : null
    }
  } catch (err) {
    console.error('Dashboard error:', err)
  }
})
</script>

<style scoped>
/* ================= PAGE ================= */
.dashboard-page {
  min-height: 100vh;
  padding: 2.5rem;
  background: linear-gradient(180deg, #2563eb 0%, #eff6ff 40%);
}

/* ================= SECTION ================= */
.section {
  margin-bottom: 2rem;
}

/* ================= GRID ================= */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
}

/* ================= CARD STYLE ================= */
:deep(.card),
:deep(.stat-card),
:deep(.progress-card),
:deep(.notif-card),
:deep(.undangan-card) {
  background: #ffffff;
  border-radius: 18px;
  padding: 1.75rem;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.15);
  transition: all 0.25s ease;
}

:deep(.card:hover),
:deep(.stat-card:hover),
:deep(.progress-card:hover),
:deep(.notif-card:hover),
:deep(.undangan-card:hover) {
  transform: translateY(-5px);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.22);
}

/* ================= BADGE STATUS ================= */
:deep(.badge.diterima) {
  background: #dcfce7;
  color: #166534;
}

:deep(.badge.ditolak) {
  background: #fee2e2;
  color: #991b1b;
}

:deep(.badge.pending) {
  background: #fef9c3;
  color: #854d0e;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }

  .dashboard-page {
    padding: 1.5rem;
  }
}
</style>
