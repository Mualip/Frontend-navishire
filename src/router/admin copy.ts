import type { RouteRecordRaw } from 'vue-router'

// Layout
import MainLayout from '@/layouts/admin/MainLayout.vue'

// Pages Admin
import HomeView from '@/views/HomeView.vue'
import DataPelamar from '@/views/admin/data_pelamar.vue'
import tambahlowongan from '@/views/admin/tambah_lowongan.vue'
import DetailLamaran from '@/views/admin/detail_lamaran.vue'
import TambahLowongan from '@/views/admin/tambah_lowongan.vue'
import TesKompetensi from '@/views/admin/tes_kompetensi.vue'
const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      role: 'admin', // ✅ role admin wajib
    },
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'data_pelamar',
        name: 'data_pelamar',
        component: DataPelamar,
        meta: { hideNavbar: true, role: 'admin' }, // ❗ Admin-only page
      },
      {
        path: 'tambah_lowongan',
        name: 'tambah_lowongan',
        component: tambahlowongan, // ✅ pakai component yang benar
        meta: { hideNavbar: true, role: 'admin' },
      },
      // 🔍 DETAIL LAMARAN
      {
        path: 'data_pelamar/:id',
        name: 'detail_lamaran',
        component: DetailLamaran,
        meta: { hideNavbar: true, role: 'admin' },
        props: true, // ✅ best practice
      },

      // ➕ TAMBAH LOWONGAN
      {
        path: 'tambah_lowongan',
        name: 'tambah_lowongan',
        component: TambahLowongan,
        meta: { hideNavbar: true, role: 'admin' },
      },
      {
        path: 'tes_kompetensi',
        name: 'tes_kompetensi',
        component: TesKompetensi,
        meta: { hideNavbar: true, role: 'admin' },
      },
    ],
  },
]

export default adminRoutes
