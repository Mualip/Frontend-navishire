<template>
  <div class="min-h-screen">
    <!-- Blue Hero Background -->
    <div class="fixed w-full bg-blue-500 dark:hidden min-h-75 top-0 left-0 z-0 rounded-b-2xl"></div>

    <!-- Main -->
    <main class="relative h-full max-h-screen transition-all duration-200 xl:ml-68 rounded-xl">
      <!-- Navbar -->
      <nav
        class="relative flex flex-wrap items-center justify-between px-4 py-3 mx-6 mt-4 transition-all bg-transparent lg:flex-nowrap lg:justify-start"
      >
        <div class="flex items-center justify-between w-full">
          <!-- Left: Breadcrumb + Title -->
          <div>
            <ol class="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-5">
              <li class="text-sm leading-normal">
                <a class="text-white opacity-70 hover:opacity-100" href="#">Pages</a>
              </li>
              <li
                class="text-sm pl-2 capitalize leading-normal text-white before:float-left before:pr-2 before:text-white before:content-['/']"
              >
                Dashboard
              </li>
            </ol>

            <h6 class="mb-0 font-bold text-white capitalize">Dashboard</h6>
          </div>

          <!-- Right Section -->
          <div class="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex">
            <!-- Search -->
            <div class="flex items-center md:ml-auto md:pr-4">
              <div class="relative flex flex-wrap items-stretch w-full transition-all rounded-lg">
                <span class="absolute z-50 flex items-center h-full px-2.5 text-sm text-slate-500">
                  <i class="fas fa-search"></i>
                </span>

                <input
                  type="text"
                  placeholder="Type here..."
                  class="pl-9 text-sm rounded-lg border border-gray-300 bg-white dark:bg-slate-850 dark:text-white py-2 pr-3 text-gray-700 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Menu Right -->
            <ul class="flex flex-row items-center pl-0 mb-0">
              <!-- Sign In -->
              <li class="flex items-center">
                <router-link
                  to="/navbarlogin"
                  class="block px-0 py-2 text-sm font-semibold text-white transition-all"
                >
                  <i class="fa fa-user sm:mr-1"></i>
                  <span class="hidden sm:inline">Sign In</span>
                </router-link>
              </li>

              <!-- Mobile Burger -->
              <li class="flex items-center pl-4 xl:hidden">
                <button class="text-white" @click="toggleMobileSidenav">
                  <div class="w-4.5 overflow-hidden">
                    <i class="block h-0.5 rounded-sm bg-white mb-0.5"></i>
                    <i class="block h-0.5 rounded-sm bg-white mb-0.5"></i>
                    <i class="block h-0.5 rounded-sm bg-white"></i>
                  </div>
                </button>
              </li>

              <!-- Settings Button -->
              <li class="flex items-center px-4">
                <button class="text-white" @click="openSettings">
                  <i class="fa fa-cog cursor-pointer"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
/* Tambahkan function sesuai kebutuhan */
const toggleMobileSidenav = () => {
  console.log('Toggle sidenav clicked')
}

const openSettings = () => {
  console.log('Open settings panel')
}
</script>
