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
/* ================= HERO ================= */
.hero-section {
  position: relative;
  padding-top: 16px;
}

.hero-blue {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 28rem; /* lebih tinggi untuk biru tebal */
  background: linear-gradient(135deg, #2563eb, #3b82f6); /* gradient tegas */
  border-radius: 0 0 1.5rem 1.5rem;
  z-index: 0;
}

/* HEADER */
.header-wrapper {
  position: relative;
  z-index: 1;
  margin: 0 20px;
  padding: 2rem 0;
  font-family: 'Poppins', sans-serif;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  color: #e0e7ff;
  margin-top: 0.5rem;
}

/* ================= CARD ================= */
.card-wrapper {
  position: relative;
  z-index: 10;
  background: #ffffff;
  max-width: 72rem;
  margin: 20px;
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: 0.25s ease;
}

.card-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.15);
}

/* ================= STEP BAR ================= */
.step-indicator {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.step-bar {
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 999px;
  transition: 0.25s ease;
}

.step-bar.active {
  background: #2563eb;
}

/* ================= STEP TITLE ================= */
.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e3a8a; /* biru gelap */
}

/* ================= LABEL & INPUT ================= */
label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a8a;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 16px; /* sama seperti stat-card */
  border: 1px solid #d1d5db;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  outline: none;
}

/* ================= BUTTON ================= */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
}

.btn-prev,
.btn-next,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 16px; /* mirip stat-card */
  font-weight: 600;
  transition: 0.25s ease;
}

.btn-prev {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-prev:hover {
  background: #d1d5db;
}

.btn-next {
  background: #2563eb;
  color: #ffffff;
}

.btn-next:hover {
  background: #1e40af;
}

.btn-submit {
  background: #16a34a;
  color: #ffffff;
}

.btn-submit:hover {
  background: #15803d;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .card-wrapper {
    margin: 1.5rem;
  }
}
</style>
