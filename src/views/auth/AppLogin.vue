<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- HEADER -->
      <div class="auth-header">
        <h2>Login</h2>
        <p>Masuk ke akun Anda</p>
      </div>

      <!-- FORM -->
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="contoh@email.com" class="input" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" class="input" />
      </div>

      <button class="btn" @click="login" :disabled="loading">
        {{ loading ? 'Memproses...' : 'Login' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <!-- REGISTER -->
      <div class="auth-footer">
        <span>Belum punya akun?</span>
        <router-link to="/register">Daftar</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { AxiosError } from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    const API_URL = import.meta.env.VITE_API_URL
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email: email.value,
      password: password.value,
    })

    // // 🔐 2FA AKTIF
    // if (res.data.twoFactorRequired) {
    //   localStorage.setItem('tempUserId', res.data.userId)
    //   router.push('/otp-verify')
    //   return
    // }

    // ===== 2FA FLOW =====
    if (res.data.twoFactorRequired) {
      localStorage.setItem('tempUserId', res.data.userId)
      localStorage.setItem('twoFactorStatus', res.data.twoFactorStatus)
      router.push('/otp-verify')
      return
    }

    // ===== LOGIN NORMAL =====
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)
    router.push('/dashboard')
  } catch (err) {
    const e = err as AxiosError<{ message: string }>
    error.value = e.response?.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===============================
  BACKGROUND (ANIMATED GRADIENT)
=============================== */
.auth-container {
  min-height: 100vh;
  width: 100vw;
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
  CARD (FLOAT + FADE IN)
=============================== */
.auth-card {
  background: white;
  padding: 32px;
  border-radius: 18px;
  width: 100%;
  max-width: 360px;

  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  position: relative;
  z-index: 2;

  animation: cardEnter 0.8s ease;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===============================
  HEADER
=============================== */
.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-header h2 {
  font-size: 22px;
  font-weight: 700;
}

.auth-header p {
  font-size: 14px;
  color: #64748b;
}

/* ===============================
  FORM
=============================== */
.form-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;

  transition: all 0.25s ease;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

/* ===============================
  BUTTON (HOVER LIFT)
=============================== */
.btn {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;

  font-weight: 600;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  cursor: pointer;

  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
}

.btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

/* ===============================
  ERROR (SHAKE)
=============================== */
.error {
  color: #dc2626;
  font-size: 13px;
  margin-top: 10px;
  text-align: center;
  animation: shake 0.4s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

/* ===============================
  FOOTER
=============================== */
.auth-footer {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
}

.auth-footer a {
  color: #2563eb;
  font-weight: 600;
  margin-left: 4px;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
