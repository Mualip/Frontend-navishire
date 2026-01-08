<template>
  <div class="stat-grid">
    <!-- TOTAL PELAMAR -->
    <div class="stat-card">
      <div class="icon bg-blue">👥</div>
      <div class="info">
        <span>Total Pelamar</span>
        <strong>{{ totalPelamar }}</strong>
      </div>
    </div>

    <!-- LOLOS ADMINISTRASI -->
    <div class="stat-card">
      <div class="icon bg-green">✅</div>
      <div class="info">
        <span>Lolos Administrasi</span>
        <strong>{{ lolosAdministrasi }}</strong>
      </div>
    </div>

    <!-- STATUS SPK -->
    <div class="stat-card">
      <div class="icon bg-purple">🧮</div>
      <div class="info">
        <span>Status SPK</span>
        <span class="badge" :class="spkStatusClass">
          {{ spkStatusLabel }}
        </span>
      </div>
    </div>

    <!-- TAHAP AKTIF -->
    <div class="stat-card">
      <div class="icon bg-orange">🚀</div>
      <div class="info">
        <span>Tahap Aktif</span>
        <strong>{{ tahapAktif }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const totalPelamar = ref(0)
const lolosAdministrasi = ref(0)
const spkStatus = ref<'belum' | 'proses' | 'selesai'>('belum')
const tahapAktif = ref('Seleksi Berkas')

const token = localStorage.getItem('token')

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/spk/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    totalPelamar.value = res.data.totalPelamar
    lolosAdministrasi.value = res.data.lolosAdministrasi
    spkStatus.value = res.data.spkStatus
    tahapAktif.value = res.data.tahapAktif
  } catch (err) {
    console.error('Gagal load dashboard SPK', err)
  }
})

const spkStatusLabel = computed(() => {
  if (spkStatus.value === 'selesai') return 'SPK Selesai'
  if (spkStatus.value === 'proses') return 'Proses SPK'
  return 'Belum Diproses'
})

const spkStatusClass = computed(() => ({
  pending: spkStatus.value === 'belum',
  diterima: spkStatus.value === 'selesai',
  ditolak: spkStatus.value === 'proses',
}))
</script>

<style scoped>
/* ====== TIDAK DIUBAH (ASLI PUNYAMU) ====== */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-4px);
}

.icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.bg-blue {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}
.bg-green {
  background: linear-gradient(135deg, #16a34a, #22c55e);
}
.bg-purple {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
}
.bg-orange {
  background: linear-gradient(135deg, #f97316, #fb923c);
}

.info span {
  font-size: 0.75rem;
  color: #64748b;
}

.info strong {
  font-size: 1rem;
  font-weight: 700;
}

/* ===== BADGE (PAKAI STYLE LAMA) ===== */
.badge {
  margin-top: 0.25rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge.diterima {
  background: #dcfce7;
  color: #166534;
}
.badge.ditolak {
  background: #e0e7ff;
  color: #3730a3;
}
.badge.pending {
  background: #fef9c3;
  color: #854d0e;
}

@media (max-width: 1024px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
