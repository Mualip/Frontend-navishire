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
      {
        path: '', // /
        name: 'login',
        component: AppLogin,
        meta: { requiresGuest: true },
      },
      {
        path: 'register', // /register
        name: 'register',
        component: AppRegister,
        meta: { requiresGuest: true },
      },
      {
        path: 'otp-verify', // /otp-verify
        name: 'otp-verify',
        component: OtpVerify,
        meta: {
          requiresGuest: true,
          isOtp: true,
        },
      },
    ],
  },
]

export default authRoutes
