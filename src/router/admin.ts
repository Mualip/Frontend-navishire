import type { RouteRecordRaw } from 'vue-router'

// Layout
import MainLayout from '@/layouts/admin/MainLayout.vue'

// Pages
import DashboardAdmin from '@/views/admin/DashboardAdmin.vue'
import DataPelamar from '@/views/admin/data_pelamar.vue'
import DetailLamaran from '@/views/admin/detail_lamaran.vue'
import TambahLowongan from '@/views/admin/tambah_lowongan.vue'
import TesKompetensi from '@/views/admin/tes_kompetensi.vue'

// TES
import TesTPA from '@/views/admin/tes/BuatSoal.vue'
import TesPedagogik from '@/views/admin/tes/TesPedagogik.vue'
import TesMapel from '@/views/admin/tes/TesMapel.vue'
import TesAlquran from '@/views/admin/tes/TesAlquran.vue'
import TesKepribadian from '@/views/admin/tes/TesKepribadian.vue'
import TesTertulis from '@/views/admin/tes/TesTertulis.vue'
import TesWawancara from '@/views/admin/tes/TesWawancara.vue'
import JawabanPelamar from '@/views/admin/jawabanPelamar.vue'

// ===== PENILAIAN (LANGSUNG DI ADMIN) =====
import PenilaianPelamar from '@/views/admin/PenilaianPelamar.vue'
import RankingSAW from '@/views/admin/PenilaianPelamar.vue'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: MainLayout,
    meta: {
      requiresAuth: true,
      role: 'admin',
    },
    children: [
      // ===== DASHBOARD =====
      {
        path: '',
        name: 'admin-dashboard',
        component: DashboardAdmin,
      },

      // ===== DATA PELAMAR =====
      {
        path: 'data-pelamar',
        name: 'data-pelamar',
        component: DataPelamar,
      },
      {
        path: 'data-pelamar/:id',
        name: 'detail-lamaran',
        component: DetailLamaran,
        props: true,
      },

      // ===== LOWONGAN =====
      {
        path: 'tambah-lowongan',
        name: 'tambah-lowongan',
        component: TambahLowongan,
      },

      // ===== TES KOMPETENSI =====
      {
        path: 'tes',
        name: 'tes-kompetensi',
        component: TesKompetensi,
      },
      {
        path: 'tes/buat',
        name: 'buat-soal',
        component: TesTPA,
      },
      {
        path: 'tes/pedagogik',
        name: 'tes-pedagogik',
        component: TesPedagogik,
      },
      {
        path: 'tes/mapel',
        name: 'tes-mapel',
        component: TesMapel,
      },
      {
        path: 'tes/alquran',
        name: 'tes-alquran',
        component: TesAlquran,
      },
      {
        path: 'tes/kepribadian',
        name: 'tes-kepribadian',
        component: TesKepribadian,
      },
      {
        path: 'tes/tertulis',
        name: 'tes-tertulis',
        component: TesTertulis,
      },
      {
        path: 'tes/wawancara',
        name: 'tes-wawancara',
        component: TesWawancara,
      },

      // ===== JAWABAN TES =====
      {
        path: 'jawaban',
        name: 'jawaban-pelamar',
        component: JawabanPelamar,
      },

      // ===== PENILAIAN MANUAL & SAW =====
      {
        path: 'penilaian',
        name: 'penilaian-pelamar',
        component: PenilaianPelamar,
      },
      {
        path: 'penilaian',
        name: 'penilaian-pelamar',
        component: RankingSAW,
      },
    ],
  },
]

export default adminRoutes
