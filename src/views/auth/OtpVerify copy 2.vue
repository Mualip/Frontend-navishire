<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="icon">🔐</div>
      <h2>Verifikasi OTP</h2>

      <!-- SETUP QR -->
      <div v-if="step === 'setup'">
        <p class="subtitle">Scan QR dengan Google Authenticator</p>
        <img :src="qrData" class="qr-image" />
        <p class="manual-key">Kode manual: {{ manualKey }}</p>

        <input v-model="otp" class="otp-input" placeholder="Masukkan OTP" maxlength="6" />

        <button class="btn" @click="verifySetupOtp" :disabled="otp.length !== 6">
          Aktifkan & Verifikasi
        </button>
      </div>

      <!-- LOGIN OTP -->
      <div v-else>
        <p class="subtitle">Masukkan kode OTP</p>

        <input v-model="otp" class="otp-input" placeholder="Masukkan OTP" maxlength="6" />

        <button class="btn" @click="verifyLoginOtp" :disabled="otp.length !== 6">Verifikasi</button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { AxiosError } from 'axios'

const router = useRouter()

const step = ref<'setup' | 'verify'>('verify')
const otp = ref('')
const qrData = ref('')
const manualKey = ref('')
const error = ref('')
const loadingQr = ref(false)

const userId = localStorage.getItem('tempUserId')
const status = localStorage.getItem('twoFactorStatus')

/* ===============================
   INIT (PALING PENTING)
================================ */
onMounted(() => {
  if (!userId) return router.replace('/login')

  if (status === 'inactive') {
    startSetup() // 🔥 WAJIB SETUP
    step.value = 'setup'
  } else {
    step.value = 'verify'
  }
})

/* ===============================
   SETUP 2FA (QR)
================================ */
const startSetup = async () => {
  loadingQr.value = true
  error.value = ''

  try {
    const res = await axios.post('http://localhost:5000/api/2fa/setup', {
      userId,
    })

    qrData.value = res.data.qrCode
    manualKey.value = res.data.manualKey
    step.value = 'setup'
  } catch {
    error.value = 'Gagal memuat QR'
  } finally {
    loadingQr.value = false
  }
}

/* ===============================
   VERIFIKASI SETUP
================================ */
const verifySetupOtp = async () => {
  try {
    await axios.post('http://localhost:5000/api/2fa/login', {
      userId,
      token: otp.value,
    })

    otp.value = ''
    step.value = 'verify'
  } catch {
    error.value = 'OTP salah'
  }
}

/* ===============================
   LOGIN DENGAN OTP
================================ */
const verifyLoginOtp = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login/2fa', {
      userId,
      token: otp.value,
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)

    localStorage.removeItem('tempUserId')
    localStorage.removeItem('twoFactorStatus')

    router.push('/dashboard')
  } catch (err) {
    const e = err as AxiosError<{ message: string }>
    error.value = e.response?.data?.message || 'OTP salah'
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2563eb;
}
.auth-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 360px;
  text-align: center;
}
.qr-image {
  width: 180px;
  margin: 10px auto;
}
.otp-input {
  width: 100%;
  padding: 14px;
  font-size: 18px;
  text-align: center;
}
.btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  margin-top: 12px;
}
.error {
  color: red;
  margin-top: 12px;
}
</style>
