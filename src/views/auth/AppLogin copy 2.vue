<template>
  <div class="auth-container">
    <div class="auth-card" :class="{ shake: loginFailed }" @animationend="loginFailed = false">
      <!-- ===== LOGIN FORM ===== -->
      <template v-if="step === 'login'">
        <h2 class="auth-title">Welcome Navishire</h2>
        <p class="auth-subtitle">Login to your account</p>

        <button class="google-btn" @click="loginWithGoogle">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" />
          Continue with Google
        </button>

        <div class="divider">
          <span>or login with email</span>
        </div>

        <form @submit.prevent="login" class="auth-form">
          <div class="input-group">
            <label>Email</label>
            <input type="email" v-model="form.email" />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input type="password" v-model="form.password" />
          </div>

          <button class="btn-primary" :disabled="loading">
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account?
          <router-link to="/register" class="auth-link">Register</router-link>
        </p>
      </template>

      <!-- ===== OTP FORM ===== -->
      <template v-else>
        <h2 class="auth-title">Autentikasi Dua Langkah</h2>
        <p class="auth-subtitle">Masukkan kode 6 digit dari Google Authenticator</p>

        <div class="otp-wrapper">
          <input
            type="text"
            v-model="otp"
            maxlength="6"
            inputmode="numeric"
            placeholder="••••••"
            class="otp-input"
          />
        </div>

        <button class="btn-primary" @click="verifyOTP" :disabled="loading">
          {{ loading ? 'Verifikasi...' : 'Verifikasi Kode' }}
        </button>

        <button class="back-link" @click="backToLogin">← Kembali ke login</button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const step = ref<'login' | 'otp'>('login')
const loading = ref(false)
const loginFailed = ref(false)

const otp = ref('')
const tempToken = ref('')
const tempUserId = ref('')
const tempRole = ref('')

const login = async () => {
  if (!form.email || !form.password) {
    loginFailed.value = true
    return
  }

  loading.value = true
  loginFailed.value = false

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      loginFailed.value = true
      return
    }

    // LOGIN SUKSES
    tempToken.value = data.token
    tempUserId.value = data.user._id
    tempRole.value = data.user.role

    if (data.user.twoFactorEnabled) {
      step.value = 'otp'
      return
    }

    finalizeLogin()
  } catch {
    loginFailed.value = true
  } finally {
    loading.value = false
  }
}

const verifyOTP = async () => {
  if (otp.value.length !== 6) {
    loginFailed.value = true
    return
  }

  loading.value = true
  loginFailed.value = false

  try {
    const res = await fetch('http://localhost:5000/api/2fa/verify-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: tempUserId.value,
        token: otp.value,
      }),
    })

    if (!res.ok) {
      loginFailed.value = true
      return
    }

    finalizeLogin()
  } catch {
    loginFailed.value = true
  } finally {
    loading.value = false
  }
}

const finalizeLogin = () => {
  localStorage.setItem('token', tempToken.value)
  localStorage.setItem('role', tempRole.value)
  router.push('/dashboard')
}

const backToLogin = () => {
  step.value = 'login'
  otp.value = ''
  loginFailed.value = false
}

const loginWithGoogle = () => {
  window.location.href = 'http://localhost:5000/api/auth/google'
}
</script>

<style scoped>
/* ===== BACKGROUND ===== */
.auth-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}
/* ===== OTP ===== */
.otp-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.otp-input {
  width: 100%;
  text-align: center;
  font-size: 28px;
  letter-spacing: 10px;
  padding: 14px;
  border-radius: 14px;
  border: 2px solid #2563eb;
  outline: none;
}

.otp-input:focus {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);
}

/* ===== BACK LINK ===== */
.back-link {
  margin-top: 14px;
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
}

/* ===== CARD ===== */
.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);

  opacity: 0;
  transform: translateY(-20px) scale(0.98);
  animation: fadeInUp 0.5s ease forwards;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

/* ===== FADE IN ===== */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== SHAKE EFFECT ===== */
.shake {
  animation: shake 0.3s;
}

@keyframes shake {
  0% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-6px);
  }
  50% {
    transform: translateX(6px);
  }
  75% {
    transform: translateX(-6px);
  }
  100% {
    transform: translateX(0px);
  }
}

/* ===== TITLE ===== */
.auth-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #2563eb;
}

.auth-subtitle {
  text-align: center;
  font-size: 14px;
  color: #374151;
  margin-bottom: 28px;
}

/* ===== GOOGLE BUTTON ===== */
.google-btn {
  width: 100%;
  background: #ffffff;
  border: 1.5px solid #dcdcdc;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.25s;
}

.google-btn img {
  width: 22px;
  height: 22px;
}

.google-btn:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* ===== DIVIDER ===== */
.divider {
  position: relative;
  text-align: center;
  margin: 28px 0;
}

.divider span {
  background: #fff;
  padding: 0 10px;
  color: #777;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background: #ddd;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

/* ===== FORM ===== */
.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

.input-group input {
  padding: 12px;
  border-radius: 12px;
  border: 1.5px solid #ddd;
  font-size: 15px;
  transition: 0.25s;
}

.input-group input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);
  transform: scale(1.02);
}

/* ===== BUTTON ===== */
.btn-primary {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: #1d4ed8;
}

/* ===== FOOTER ===== */
.auth-footer {
  text-align: center;
  margin-top: 22px;
  font-size: 14px;
}

.auth-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
