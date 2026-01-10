<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="icon">🔐</div>
      <h2>Verifikasi OTP</h2>

      <!-- SETUP QR -->
      <div v-if="step === 'setup'">
        <p class="subtitle">Scan QR dengan Google Authenticator</p>

        <img v-if="qrData" :src="qrData" class="qr-image" />
        <p v-if="manualKey" class="manual-key">Kode manual: {{ manualKey }}</p>

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

// ===============================
// STATE
// ===============================
const step = ref<'setup' | 'verify'>('verify')
const otp = ref('')
const qrData = ref('')
const manualKey = ref('')
const error = ref('')
const loadingQr = ref(false)

const userId = localStorage.getItem('tempUserId')
const status = localStorage.getItem('twoFactorStatus')

// ===============================
// BASE API
// ===============================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ===============================
// INIT
// ===============================
onMounted(() => {
  if (!userId) {
    router.replace('/login')
    return
  }

  if (status === 'inactive') {
    step.value = 'setup'
    startSetup()
  } else {
    step.value = 'verify'
  }
})

// ===============================
// SETUP 2FA (QR)
// ===============================
const startSetup = async () => {
  loadingQr.value = true
  error.value = ''

  try {
    const res = await axios.post(`${API_URL}/api/2fa/setup`, { userId })
    qrData.value = res.data.qrCode
    manualKey.value = res.data.manualKey
  } catch {
    error.value = 'Gagal memuat QR'
  } finally {
    loadingQr.value = false
  }
}

// ===============================
// VERIFIKASI SETUP OTP
// ===============================
const verifySetupOtp = async () => {
  error.value = ''

  try {
    await axios.post(`${API_URL}/api/2fa/setup/verify`, {
      userId,
      token: otp.value,
    })

    otp.value = ''
    localStorage.setItem('twoFactorStatus', 'active')
    step.value = 'verify'
  } catch (err: unknown) {
    const e = err as AxiosError<{ message: string; code?: string }>
    error.value = e.response?.data?.message || 'OTP salah atau belum sinkron'
  }
}

// ===============================
// LOGIN DENGAN OTP
// ===============================
const verifyLoginOtp = async () => {
  error.value = ''

  try {
    const res = await axios.post(`${API_URL}/api/2fa/login`, {
      userId,
      token: otp.value,
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)

    localStorage.removeItem('tempUserId')
    localStorage.removeItem('twoFactorStatus')

    router.push('/dashboard')
  } catch (err) {
    const e = err as AxiosError<{ message: string; code?: string }>

    if (e.response?.data?.code === '2FA_NOT_VERIFIED') {
      step.value = 'setup'
      error.value = 'Silakan aktifkan 2FA terlebih dahulu'
      startSetup()
    } else {
      error.value = e.response?.data?.message || 'OTP salah'
    }
  }
}
</script>

<style scoped>
/* ===============================
  BACKGROUND FULL BIRU
=============================== */
.auth-container {
  min-height: 100vh;
  width: 100vw; /* ⬅️ tambah ini */
  display: flex;
  justify-content: center;
  align-items: center;

  background: linear-gradient(135deg, #1e3a8a, #2563eb, #1d4ed8);
  background-size: 200% 200%;
  animation: bgMove 8s ease infinite;
}

@keyframes bgMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* ===============================
  CARD (BIRU FULL)
=============================== */
.auth-card {
  width: 360px;
  padding: 36px 32px;
  border-radius: 22px;
  text-align: center;
  color: #ffffff;
  background: linear-gradient(180deg, #2563eb, #1e40af);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35);

  animation: cardIn 0.6s ease;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ===============================
  HEADER
=============================== */
.icon {
  font-size: 42px;
  margin-bottom: 8px;
}

h2 {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  font-size: 14px;
  color: #dbeafe;
  margin-bottom: 14px;
}

/* ===============================
  QR IMAGE
=============================== */
.qr-image {
  width: 180px;
  margin: 16px auto;
  padding: 12px;
  border-radius: 18px;

  background: #ffffff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

.qr-image:hover {
  transform: scale(1.05);
}

.manual-key {
  font-size: 12px;
  color: #bfdbfe;
  margin-bottom: 14px;
  word-break: break-all;
}

/* ===============================
  OTP INPUT
=============================== */
.otp-input {
  width: 100%;
  padding: 14px;
  font-size: 20px;
  text-align: center;
  letter-spacing: 6px;

  color: #1e3a8a;
  background: #eff6ff;

  border-radius: 14px;
  border: none;
  outline: none;

  transition: all 0.25s ease;
}

.otp-input::placeholder {
  color: #94a3b8;
}

.otp-input:focus {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.35);
}

/* ===============================
  BUTTON
=============================== */
.btn {
  width: 100%;
  margin-top: 18px;
  padding: 14px;
  border-radius: 16px;
  border: none;

  font-size: 15px;
  font-weight: 600;
  color: #1e3a8a;

  background: linear-gradient(135deg, #ffffff, #dbeafe);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===============================
  ERROR
=============================== */
.error {
  margin-top: 14px;
  font-size: 13px;
  color: #fecaca;
}
</style>
