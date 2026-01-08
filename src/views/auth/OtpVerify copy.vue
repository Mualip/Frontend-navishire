<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="icon">🔐</div>
      <h2>Verifikasi OTP</h2>

      <!-- STEP 1 -->
      <div v-if="step === 'inactive'">
        <p class="subtitle">Aktifkan OTP untuk melanjutkan login</p>
        <button class="btn" @click="startSetup" :disabled="loadingQr">
          {{ loadingQr ? 'Memuat...' : 'Aktifkan OTP' }}
        </button>
      </div>

      <!-- STEP 2 -->
      <div v-if="step === 'setup'">
        <p class="subtitle">Scan QR dengan Google Authenticator</p>
        <img :src="qrData" class="qr-image" />
        <p class="manual-key">Kode manual: {{ manualKey }}</p>

        <input v-model="otp" class="otp-input" placeholder="Masukkan OTP" />
        <button class="btn" @click="verifyOtp" :disabled="otp.length !== 6">
          Aktifkan & Verifikasi
        </button>
      </div>

      <!-- STEP 3 -->
      <div v-if="step === 'verify'">
        <p class="subtitle">Masukkan kode OTP</p>
        <input v-model="otp" class="otp-input" placeholder="Masukkan OTP" />
        <button class="btn" @click="verifyOtp" :disabled="otp.length !== 6">Verifikasi</button>
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

const step = ref<'inactive' | 'setup' | 'verify'>('inactive')

const otp = ref('')
const qrData = ref('')
const manualKey = ref('')
const error = ref('')
const loadingQr = ref(false)
onMounted(() => {
  const userId = localStorage.getItem('tempUserId')
  const setup = localStorage.getItem('twoFactorSetup')

  if (!userId) {
    router.replace('/login')
    return
  }

  if (!setup) {
    step.value = 'inactive'
  } else if (setup === 'setup') {
    step.value = 'setup'
  } else {
    step.value = 'verify'
  }
})

const startSetup = async () => {
  const userId = localStorage.getItem('tempUserId')

  if (!userId) {
    error.value = 'User tidak valid, silakan login ulang'
    router.replace('/login')
    return
  }

  loadingQr.value = true
  error.value = ''

  try {
    const res = await axios.post('http://localhost:5000/api/2fa/setup', {
      userId: localStorage.getItem('tempUserId'),
    })

    // 🔥 PASTI KEISI
    qrData.value = res.data.qrCode
    manualKey.value = res.data.manualKey
    step.value = 'setup'
  } catch (err) {
    console.error('QR ERROR:', err)
    error.value = 'Gagal memuat QR'
  } finally {
    loadingQr.value = false
  }
}

const verifyOtp = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login/2fa', {
      userId: localStorage.getItem('tempUserId'),
      token: otp.value,
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)

    localStorage.removeItem('tempUserId')
    localStorage.removeItem('twoFactorSetup')

    router.push('/dashboard')
  } catch (err) {
    const e = err as AxiosError<{ message: string }>
    error.value = e.response?.data?.message ?? 'OTP salah'
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
