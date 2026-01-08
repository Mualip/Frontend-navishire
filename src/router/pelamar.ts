import PelamarLayout from '@/layouts/pelamar/MainLayout.vue'

const pelamarRoutes = [
  {
    path: '/pelamar',
    component: PelamarLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboardPelamar',
        component: () => import('@/views/pelamar/dashboardPelamar.vue'),
        meta: { hideNavbar: false, requiresAuth: true, role: 'pelamar' },
      },
      {
        path: 'profil_pribadi',
        name: 'profilPribadi',
        component: () => import('@/views/pelamar/profil_pribadi.vue'),
        meta: { hideNavbar: true, requiresAuth: true, role: 'pelamar' },
      },
      {
        path: 'ajukan-loker',
        name: 'ajukanLoker',
        component: () => import('@/views/pelamar/ajukan_loker.vue'),
        meta: { requiresAuth: true, role: 'pelamar' },
      },
      {
        path: 'upload-berkas',
        name: 'uploadBerkas',
        component: () => import('@/views/pelamar/upload_berkas.vue'),
        meta: { hideNavbar: true, requiresAuth: true, role: 'pelamar' },
      },

      /* =========================
         STEP 1 – LIST TES
         /pelamar/tes
         ========================= */
      {
        path: 'tes',
        name: 'mulaiTes',
        component: () => import('@/views/pelamar/MulaiTes.vue'),
        meta: { requiresAuth: true, role: 'pelamar' },
      },

      /* =========================
         STEP 2 – KERJAKAN TES
         /pelamar/tes/:materiId
      ========================= */
      {
        path: 'tes/:materiId',
        name: 'tesPelamar',
        component: () => import('@/views/pelamar/TesPelamar.vue'),
        props: true,
        meta: { requiresAuth: true, role: 'pelamar' },
      },
    ],
  },
]

export default pelamarRoutes
