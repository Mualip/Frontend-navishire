import { createRouter, createWebHistory } from 'vue-router'

// Import routes
import adminRoutes from './admin'
import authRoutes from './auth'
import pelamarRoutes from './pelamar'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...adminRoutes, ...pelamarRoutes],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const tempUserId = localStorage.getItem('tempUserId')

  /**
   * =========================
   * 1️⃣ HALAMAN OTP (2FA)
   * =========================
   * Boleh TANPA token
   * tapi HARUS ada tempUserId
   */
  if (to.meta.requiresOtp) {
    if (!tempUserId) return next('/')
    return next()
  }

  /**
   * =========================
   * 2️⃣ HALAMAN BUTUH LOGIN
   * =========================
   */
  if (to.meta.requiresAuth && !token) {
    return next('/')
  }

  /**
   * =========================
   * 3️⃣ HALAMAN GUEST (LOGIN / REGISTER)
   * =========================
   */
  if (to.meta.requiresGuest && token) {
    if (role === 'admin') return next('/dashboard')
    if (role === 'pelamar') return next('/pelamar/dashboard')
    return next('/dashboard')
  }

  /**
   * =========================
   * 4️⃣ ROLE CHECK
   * =========================
   */
  if (to.meta.role && token && to.meta.role !== role) {
    if (role === 'admin') return next('/dashboard')
    if (role === 'pelamar') return next('/pelamar/dashboard')
    return next('/')
  }

  next()
})

export default router
