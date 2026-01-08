<template>
  <aside :class="['sidebar', open && 'open']">
    <!-- HEADER -->
    <div class="sidebar-header">
      <span class="logo">NavisHire</span>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <hr class="divider" />

    <!-- MENU -->
    <ul class="menu">
      <!-- ================= DASHBOARD ================= -->
      <li>
        <RouterLink to="/dashboard" class="menu-item" active-class="active" @click="close">
          <BriefcaseIcon class="icon" />
          <span>Dashboard</span>
        </RouterLink>
      </li>

      <!-- ================= LOWONGAN ================= -->
      <li>
        <RouterLink
          to="/dashboard/tambah-lowongan"
          class="menu-item"
          active-class="active"
          @click="close"
        >
          <BriefcaseIcon class="icon" />
          <span>Tambah Lowongan</span>
        </RouterLink>
      </li>

      <!-- ================= DATA PELAMAR ================= -->
      <li>
        <RouterLink
          to="/dashboard/data-pelamar"
          class="menu-item"
          active-class="active"
          @click="close"
        >
          <UserGroupIcon class="icon" />
          <span>Data Pelamar</span>
        </RouterLink>
      </li>

      <!-- ================= TES KOMPETENSI ================= -->
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggle('tes')">
          <div class="left">
            <AcademicCapIcon class="icon" />
            <span>Tes Kompetensi</span>
          </div>
          <span :class="['arrow', openDropdown === 'tes' && 'rotate']">⌄</span>
        </button>

        <transition name="fade-slide">
          <ul v-if="openDropdown === 'tes'" class="submenu">
            <li>
              <RouterLink
                to="/dashboard/tes/buat"
                class="submenu-item"
                active-class="active-sub"
                @click="close"
              >
                Buat Soal
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/dashboard/jawaban"
                class="submenu-item"
                active-class="active-sub"
                @click="close"
              >
                Jawaban Pelamar
              </RouterLink>
            </li>
          </ul>
        </transition>
      </li>

      <!-- ================= PENILAIAN & SPK ================= -->
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggle('penilaian')">
          <div class="left">
            <DocumentChartBarIcon class="icon" />
            <span>Penilaian & SPK</span>
          </div>
          <span :class="['arrow', openDropdown === 'penilaian' && 'rotate']">⌄</span>
        </button>

        <transition name="fade-slide">
          <ul v-if="openDropdown === 'penilaian'" class="submenu">
            <li>
              <RouterLink
                to="/dashboard/penilaian"
                class="submenu-item"
                active-class="active-sub"
                @click="close"
              >
                Penilaian Pelamar
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/dashboard/penilaian-saw"
                class="submenu-item"
                active-class="active-sub"
                @click="close"
              >
                Ranking SAW
              </RouterLink>
            </li>
          </ul>
        </transition>
      </li>

      <!-- ================= DOKUMEN =================
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggle('dokumen')">
          <div class="left">
            <FolderOpenIcon class="icon" />
            <span>Dokumen & Berkas</span>
          </div>
          <span :class="['arrow', openDropdown === 'dokumen' && 'rotate']">⌄</span>
        </button>

        <transition name="fade-slide">
          <ul v-if="openDropdown === 'dokumen'" class="submenu">
            <li>
              <RouterLink to="/dokumen_upload" class="submenu-item" @click="close"
                >Upload Template</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/dokumen_download" class="submenu-item" @click="close"
                >Download Berkas</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/dokumen_verifikasi" class="submenu-item" @click="close"
                >Verifikasi Berkas</RouterLink
              >
            </li>
          </ul>
        </transition>
      </li> -->

      <!-- ================= LAPORAN ================= -->
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggle('laporan')">
          <div class="left">
            <DocumentChartBarIcon class="icon" />
            <span>Laporan</span>
          </div>
          <span :class="['arrow', openDropdown === 'laporan' && 'rotate']">⌄</span>
        </button>

        <transition name="fade-slide">
          <ul v-if="openDropdown === 'laporan'" class="submenu">
            <li>
              <RouterLink to="/laporan_rekrutmen" class="submenu-item" @click="close"
                >Laporan Rekrutmen</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/laporan_spk" class="submenu-item" @click="close"
                >Laporan Hasil SPK</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/laporan_export" class="submenu-item" @click="close"
                >Export PDF / Excel</RouterLink
              >
            </li>
          </ul>
        </transition>
      </li>

      <!-- ================= PENGGUNA ================= -->
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggle('pengguna')">
          <div class="left">
            <Cog6ToothIcon class="icon" />
            <span>Manajemen Pengguna</span>
          </div>
          <span :class="['arrow', openDropdown === 'pengguna' && 'rotate']">⌄</span>
        </button>

        <!-- <transition name="fade-slide">
          <ul v-if="openDropdown === 'pengguna'" class="submenu">
            <li>
              <RouterLink to="/pengguna_admin" class="submenu-item" @click="close"
                >Admin / Operator</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/pengguna_hrd" class="submenu-item" @click="close"
                >HRD / Asesor</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/pengguna_role" class="submenu-item" @click="close"
                >Hak Akses / Role</RouterLink
              >
            </li>
          </ul>
        </transition> -->
      </li>

      <!-- ================= PENGATURAN ================= -->
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggle('pengaturan')">
          <div class="left">
            <Cog6ToothIcon class="icon" />
            <span>Pengaturan Sistem</span>
          </div>
          <span :class="['arrow', openDropdown === 'pengaturan' && 'rotate']">⌄</span>
        </button>

        <transition name="fade-slide">
          <ul v-if="openDropdown === 'pengaturan'" class="submenu">
            <!-- <li>
              <RouterLink to="/pengaturan_spk" class="submenu-item" @click="close"
                >Konfigurasi SPK</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/pengaturan_periode" class="submenu-item" @click="close"
                >Periode Rekrutmen</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/pengaturan_tampilan" class="submenu-item" @click="close"
                >Tema & Tampilan</RouterLink
              >
            </li> -->
            <li><button class="submenu-item logout" @click="logout">Logout</button></li>
          </ul>
        </transition>
      </li>
    </ul>
  </aside>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

// ICONS
import {
  BriefcaseIcon,
  UserGroupIcon,
  // FolderOpenIcon,
  AcademicCapIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

// ================= PROPS & EMIT =================
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// ================= ROUTER =================
const router = useRouter()

// ================= STATE =================
const openDropdown = ref<string | null>(null)

// ================= METHODS =================
const toggle = (id: string) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const close = () => {
  emit('close')
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
/* ===== SIDEBAR ===== */
.sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 260px;
  height: calc(100% - 40px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  z-index: 1000;
}

/* MOBILE OPEN */
.sidebar.open {
  left: 0;
}

/* ===== HEADER ===== */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
}

.logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #4f46e5;
}

.close-btn {
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
}

.divider {
  border: none;
  height: 1px;
  background: #e5e7eb;
  margin: 0 12px;
}

/* ===== MENU ===== */
.menu {
  list-style: none;
  padding: 8px;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #eef2ff;
  color: #4338ca;
}

.menu-item.active {
  background: #e0e7ff;
  color: #3730a3;
  font-weight: 600;
}

.icon {
  width: 22px;
  height: 22px;
  color: inherit;
}

/* ===== DROPDOWN ===== */
.dropdown {
  margin-top: 4px;
}

.dropdown-btn {
  width: 100%;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-btn .left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.arrow {
  transition: transform 0.25s ease;
}

.arrow.rotate {
  transform: rotate(180deg);
}

/* ===== SUBMENU ===== */
.submenu {
  margin-top: 6px;
  padding-left: 44px;
}

.submenu-item {
  display: block;
  padding: 8px 12px;
  font-size: 13px;
  color: #4b5563;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background: #f1f5f9;
}

.active-sub {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 600;
}

.logout {
  color: #dc2626;
}

/* ===== TRANSITION ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ===== DESKTOP ===== */
@media (min-width: 1024px) {
  .sidebar {
    left: 0;
  }

  .close-btn {
    display: none;
  }
}

/* ===== MOBILE ===== */
@media (max-width: 1023px) {
  .sidebar {
    left: -280px;
  }

  .sidebar.open {
    left: 0;
  }
}
</style>
