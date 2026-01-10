<template>
  <div class="stat-grid">
    <!-- PROFIL -->
    <div class="stat-card">
      <div class="icon bg-blue">👤</div>
      <div class="info inline">
        <span>Status Profil</span>
        <strong>{{ profilLengkap ? 'Lengkap' : 'Belum Lengkap' }}</strong>
      </div>
    </div>

    <!-- TOTAL LAMARAN -->
    <div class="stat-card">
      <div class="icon bg-green">📄</div>
      <div class="info inline">
        <span>Total Lamaran</span>
        <strong>{{ totalLamaran }}</strong>
      </div>
    </div>

    <!-- STATUS BERKAS -->
    <div class="stat-card">
      <div class="icon bg-purple">📂</div>
      <div class="info">
        <span>Status Berkas</span>
        <span class="badge" :class="badgeClass">
          {{ statusLabel }}
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

/* =======================
   TYPE
======================= */
type Status = 'pending' | 'diterima' | 'ditolak'

/* =======================
   STATE
======================= */
const status = ref<Status>('pending')
const totalLamaran = ref<number>(0)
const profilLengkap = ref<boolean>(false)
const tahapAktif = ref<string>('Seleksi Berkas')

/* =======================
   API BASE
======================= */
const API_BASE = import.meta.env.VITE_API_URL
const token = localStorage.getItem('token')

/* =======================
   API CALL
======================= */
const fetchStatusBerkas = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/lamaran/saya`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    status.value = res.data?.status ?? 'pending'
  } catch {
    status.value = 'pending'
  }
}

const fetchTotalLamaran = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/lamaran/total`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    totalLamaran.value = res.data?.total ?? 0
  } catch {
    totalLamaran.value = 0
  }
}

const fetchProfileStatus = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/profile/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    profilLengkap.value = res.data?.lengkap ?? false
  } catch {
    profilLengkap.value = false
  }
}

/* =======================
   LIFECYCLE
======================= */
onMounted(() => {
  fetchProfileStatus()
  fetchStatusBerkas()
  fetchTotalLamaran()
})

/* =======================
   COMPUTED
======================= */
const statusLabel = computed(() => {
  if (status.value === 'diterima') return 'Diterima'
  if (status.value === 'ditolak') return 'Ditolak'
  return 'Pending'
})

const badgeClass = computed(() => ({
  pending: status.value === 'pending',
  diterima: status.value === 'diterima',
  ditolak: status.value === 'ditolak',
}))
</script>

<style scoped>
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
  transition: 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

/* ICON */
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

/* TEXT */
.info span {
  font-size: 0.75rem;
  color: #64748b;
}

.info strong {
  font-size: 1rem;
  font-weight: 700;
}

/* INLINE FIX */
.info.inline {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

/* BADGE */
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
  background: #fee2e2;
  color: #991b1b;
}
.badge.pending {
  background: #fef9c3;
  color: #854d0e;
}

/* RESPONSIVE */
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
