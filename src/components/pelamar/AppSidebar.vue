<template>
  <aside :class="['sidebar', open && 'open']">
    <!-- HEADER -->
    <div class="sidebar-header">
      <span class="logo">NavisHire</span>

      <!-- CLOSE (MOBILE ONLY) -->
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <hr class="divider" />

    <!-- MENU -->
    <ul class="menu">
      <li>
        <RouterLink
          to="/pelamar/dashboard"
          class="menu-item"
          active-class="active"
          @click="handleNavigate"
        >
          <BriefcaseIcon class="icon" />
          <span>Dashboard</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/pelamar/profil_pribadi"
          class="menu-item"
          active-class="active"
          @click="handleNavigate"
        >
          <UserIcon class="icon" />
          <span>Profil Pribadi</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink
          to="/pelamar/ajukan-loker"
          class="menu-item"
          active-class="active"
          @click="handleNavigate"
        >
          <ClipboardDocumentListIcon class="icon" />
          <span>Lowongan</span>
        </RouterLink>
      </li>

      <!-- DROPDOWN -->
      <li class="dropdown">
        <button class="menu-item dropdown-btn" @click="toggleDropdown">
          <div class="left">
            <Cog6ToothIcon class="icon" />
            <span>Pengaturan</span>
          </div>
          <span :class="['arrow', openDropdown && 'rotate']">⌄</span>
        </button>

        <transition name="fade-slide">
          <ul v-if="openDropdown" class="submenu">
            <li>
              <RouterLink
                to="/pelamar/settings"
                class="submenu-item"
                active-class="active-sub"
                @click="handleNavigate"
              >
                Akun & Profil
              </RouterLink>
            </li>

            <li>
              <button class="submenu-item logout" @click="logout">Logout</button>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  BriefcaseIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const router = useRouter()
const openDropdown = ref(false)

const toggleDropdown = () => {
  openDropdown.value = !openDropdown.value
}

const handleNavigate = () => {
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
