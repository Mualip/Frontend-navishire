<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <AppNavbar />

      <!-- Konten halaman -->
      <main class="flex-1 bg-gray-100 p-6">
        <RouterView />
      </main>

      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
</script>
<script setup lang="ts">
import { ref } from 'vue'

// state
const sidebarOpen = ref(false)
const forceShow = ref(false)
const notifOpen = ref(false)

// assets
import logoDark from '@/assets/logo.png'
import logoLight from '@/assets/logo-light.png'
import illustration from '@/assets/sidebar-illustration.png'
</script>

<template>
  <!-- sidenav -->
  <aside
    :class="[
      { '-translate-x-full': !sidebarOpen && !forceShow },
      'fixed inset-y-0 flex-wrap items-center justify-between block p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-50 rounded-2xl xl:ml-6',
    ]"
    :aria-expanded="notifOpen ? 'true' : 'false'"
  >
    <div class="h-19 relative">
      <!-- close icon (mobile only) -->
      <button
        class="absolute top-0 right-0 p-4 opacity-50 xl:hidden text-slate-400 dark:text-white"
        @click="sidebarOpen = false"
        aria-label="close sidenav"
      >
        <i class="fas fa-times"></i>
      </button>

      <!-- logo -->
      <a
        class="block px-8 py-6 m-0 text-sm whitespace-nowrap dark:text-white text-slate-700"
        href="#"
        target="_blank"
      >
        <img
          :src="logoDark"
          class="inline h-full max-w-full transition-all duration-200 dark:hidden ease-nav-brand max-h-8"
          alt="main_logo"
        />
        <img
          :src="logoLight"
          class="hidden h-full max-w-full transition-all duration-200 dark:inline ease-nav-brand max-h-8"
          alt="main_logo"
        />
        <span class="ml-1 font-semibold transition-all duration-200 ease-nav-brand">
          NavisHire
        </span>
      </a>
    </div>

    <hr
      class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"
    />

    <!-- menu list -->
    <div class="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
      <ul class="flex flex-col pl-0 mb-0">
        <!-- dashboard -->
        <li class="mt-0.5 w-full">
          <a
            class="py-2.7 bg-blue-500/13 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i class="relative top-0 text-sm leading-normal text-blue-500 ni ni-tv-2"></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Dashboard</span>
          </a>
        </li>

        <!-- tables -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i
                class="relative top-0 text-sm leading-normal text-orange-500 ni ni-calendar-grid-58"
              ></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Tables</span>
          </a>
        </li>

        <!-- billing -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i
                class="relative top-0 text-sm leading-normal text-emerald-500 ni ni-credit-card"
              ></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Billing</span>
          </a>
        </li>

        <!-- virtual reality -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i class="relative top-0 text-sm leading-normal text-cyan-500 ni ni-app"></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease"
              >Virtual Reality</span
            >
          </a>
        </li>

        <!-- rtl -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i class="relative top-0 text-sm leading-normal text-red-600 ni ni-world-2"></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">RTL</span>
          </a>
        </li>

        <!-- account pages -->
        <li class="w-full mt-4">
          <h6
            class="pl-6 ml-2 text-xs font-bold leading-tight uppercase dark:text-white opacity-60"
          >
            Account pages
          </h6>
        </li>

        <!-- profile -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i class="relative top-0 text-sm leading-normal text-slate-700 ni ni-single-02"></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Profile</span>
          </a>
        </li>

        <!-- sign in -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i
                class="relative top-0 text-sm leading-normal text-orange-500 ni ni-single-copy-04"
              ></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Sign In</span>
          </a>
        </li>

        <!-- sign up -->
        <li class="mt-0.5 w-full">
          <a
            class="dark:text-white dark:opacity-80 py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap px-4 transition-colors"
            href="#"
          >
            <div
              class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5"
            >
              <i class="relative top-0 text-sm leading-normal text-cyan-500 ni ni-collection"></i>
            </div>
            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease">Sign Up</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- sidebar card -->
    <div class="mx-4">
      <div
        class="relative flex flex-col min-w-0 break-words bg-transparent border-0 rounded-2xl bg-clip-border"
        sidenav-card
      >
        <img class="w-1/2 mx-auto" :src="illustration" alt="sidebar illustrations" />
        <div class="flex-auto w-full p-4 pt-0 text-center">
          <div class="transition-all duration-200 ease-nav-brand">
            <h6 class="mb-0 dark:text-white text-slate-700">Need help?</h6>
            <p class="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-60">
              Please check our docs
            </p>
          </div>
        </div>
      </div>

      <a
        class="inline-block w-full px-8 py-2 mb-4 text-xs font-bold leading-normal text-center text-white capitalize transition-all ease-in rounded-lg shadow-md bg-slate-700"
        href="#"
        target="_blank"
      >
        Documentation
      </a>
      <a
        class="inline-block w-full px-8 py-2 text-xs font-bold leading-normal text-center text-white align-middle transition-all ease-in bg-blue-500 border-0 rounded-lg shadow-md select-none"
        href="#"
        target="_blank"
      >
        Upgrade to pro
      </a>
    </div>
  </aside>
</template>
