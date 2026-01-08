import type { RouteRecordRaw } from 'vue-router'

import AuthLayout from '@/layouts/admin/AuthLayout.vue'
import AppLogin from '@/views/auth/AppLogin.vue'
import AppRegister from '@/views/auth/AppRegister.vue'
import OtpVerify from '@/views/auth/OtpVerify.vue'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      // 🔐 LOGIN
      {
        path: '',
        name: 'login',
        component: AppLogin,
        meta: {
          requiresGuest: true,
        },
      },

      // 📝 REGISTER
      {
        path: 'register',
        name: 'register',
        component: AppRegister,
        meta: {
          requiresGuest: true,
        },
      },

      // 🔑 OTP VERIFY
      {
        path: 'otp-verify',
        name: 'otp-verify',
        component: OtpVerify,
        meta: {
          requiresOtp: true, // ⬅️ PENTING
        },
      },
    ],
  },
]

export default authRoutes
