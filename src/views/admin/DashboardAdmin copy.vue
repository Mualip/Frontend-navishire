<template>
  <div class="dashboard-container p-6">
    <!-- HEADER -->
    <nav
      class="relative flex flex-wrap items-center justify-between px-6 py-4 gradient-blue rounded-xl"
    >
      <div class="flex items-center justify-between w-full">
        <div>
          <ol class="flex text-sm text-white opacity-80">
            <li>Pages</li>
            <li class="px-2">/</li>
            <li class="font-semibold opacity-100">Dashboard</li>
          </ol>
          <h6 class="font-bold text-white text-lg">Dashboard Admin</h6>
        </div>
        <div class="flex items-center gap-5">
          <div class="relative" @click.self="open = false">
            <button @click="open = !open" class="flex items-center gap-2 text-white">
              <i class="fa fa-user"></i>
              <span class="font-semibold">{{ namaUser }}</span>
            </button>
            <div v-if="open" class="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-lg z-50">
              <button
                class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100"
                @click="logout"
              >
                <i class="fa fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
          <button class="xl:hidden text-white" @click="$emit('toggle-sidebar')">
            <div class="w-5 space-y-1">
              <span class="block h-0.5 bg-white rounded"></span>
              <span class="block h-0.5 bg-white rounded"></span>
              <span class="block h-0.5 bg-white rounded"></span>
            </div>
          </button>
        </div>
      </div>
    </nav>

    <!-- STAT GRID -->
    <div class="stat-grid mt-6">
      <div class="stat-card">
        <div class="icon bg-blue">👤</div>
        <div class="info inline">
          <span>Status Profil</span>
          <strong>{{ profilLengkap ? 'Lengkap' : 'Belum Lengkap' }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon bg-green">📄</div>
        <div class="info inline">
          <span>Total Lamaran</span>
          <strong>{{ totalLamaran }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon bg-purple">📂</div>
        <div class="info">
          <span>Status Berkas</span>
          <span class="badge" :class="badgeClass">{{ statusLabel }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon bg-orange">🚀</div>
        <div class="info">
          <span>Tahap Aktif</span>
          <strong>{{ tahapAktif }}</strong>
        </div>
      </div>
    </div>

    <!-- TAMBAHAN STAT GRID -->
    <div class="stat-grid mt-6">
      <div class="stat-card">
        <div class="icon bg-green">🏢</div>
        <div class="info inline">
          <span>Total Lowongan</span>
          <strong>{{ totalLowongan }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon bg-blue">✅</div>
        <div class="info inline">
          <span>Lamaran Diterima</span>
          <strong>{{ lamaranDiterima }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon bg-orange">❌</div>
        <div class="info inline">
          <span>Lamaran Ditolak</span>
          <strong>{{ lamaranDitolak }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <div class="icon bg-purple">🚀</div>
        <div class="info inline">
          <span>Tahap Tes Aktif</span>
          <strong>{{ tahapTesAktif }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

/* ==========================
   STATE DUMMY
========================== */
const open = ref(false)
const namaUser = ref('Admin Demo')
const profilLengkap = ref(true)
const totalLamaran = ref(25)
const totalLowongan = ref(10)
const lamaranDiterima = ref(12)
const lamaranDitolak = ref(5)
const tahapAktif = ref('Seleksi Wawancara')
const tahapTesAktif = ref('Tes Kompetensi')
const status = ref<'pending' | 'diterima' | 'ditolak'>('diterima')

/* ==========================
   COMPUTED
========================== */
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

/* ==========================
   LIFECYCLE
========================== */
onMounted(() => {
  // Dummy API simulasi bisa diganti axios call nanti
  console.log('Dashboard Admin Mounted')
})

/* ==========================
   METHODS
========================== */
const logout = () => {
  alert('Logout clicked!')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* NAVBAR */
.gradient-blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

/* STAT GRID */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: 0.3s ease;
  color: white;
}

.stat-card:hover {
  transform: translateY(-5px);
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

/* INFO TEXT */
.info span {
  font-size: 0.75rem;
  color: #e0e7ff;
}
.info strong {
  font-size: 1rem;
  font-weight: 700;
}
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
