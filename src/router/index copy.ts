import { createRouter, createWebHistory } from 'vue-router'

// Import routes
import adminRoutes from './admin'
import authRoutes from './auth'
import pelamarRoutes from './pelamar'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...adminRoutes, ...pelamarRoutes],
})

// Middleware global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // ❌ Jika butuh login tapi tidak ada token → lempar ke login
  if (to.meta.requiresAuth && !token) return next('/')

  // ❌ Jika halaman khusus tamu (login) tapi user sudah login
  if (to.meta.requiresGuest && token) {
    if (role === 'admin') return next('/dashboard')
    if (role === 'pelamar') return next('/pelamar/dashboard')
  }

  // ❌ Role checking
  if (to.meta.role && to.meta.role !== role) {
    // Jika bukan role yang benar, arahkan ke halaman role masing-masing
    if (role === 'admin') return next('/dashboard')
    if (role === 'pelamar') return next('/pelamar/dashboard')
  }

  next()
})

export default router
