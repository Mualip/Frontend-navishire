<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Register Navishire</h2>
      <p class="auth-subtitle">Create your account</p>

      <form @submit.prevent="register" class="auth-form">
        <!-- NAME -->
        <div class="input-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.name" placeholder="Enter your full name" required />
        </div>

        <!-- EMAIL -->
        <div class="input-group">
          <label>Email</label>
          <input type="email" v-model="form.email" placeholder="Enter your email" required />
        </div>

        <!-- PASSWORD -->
        <div class="input-group password-group">
          <label>Password</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              placeholder="Enter your password"
              required
            />
            <span class="icon" @click="togglePassword">
              <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </span>
          </div>
        </div>

        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account?
        <router-link to="/" class="auth-link">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL // ✅ Railway / env API

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)
const togglePassword = () => (showPassword.value = !showPassword.value)

const register = async () => {
  if (!form.name || !form.email || !form.password) {
    alert('Semua field wajib diisi!')
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Register gagal!')
      return
    }

    alert('Registrasi berhasil! Silakan login.')
    router.push('/')
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan server.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* ===============================
   BACKGROUND
================================ */
.auth-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #3b82f6 0%, #1e3a8a 45%, #020617 100%);
  overflow: hidden;
}

/* floating light effect */
.auth-container::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(59, 130, 246, 0.35);
  filter: blur(120px);
  top: -120px;
  left: -120px;
  animation: float 10s infinite alternate;
  pointer-events: none; /* ✅ */
}

.auth-container::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(96, 165, 250, 0.25);
  filter: blur(100px);
  bottom: -120px;
  right: -120px;
  animation: float 12s infinite alternate-reverse;
  pointer-events: none; /* ✅ */
}
.auth-card {
  position: relative;
  z-index: 2; /* ✅ */
}
@keyframes float {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(40px);
  }
}

/* ===============================
   CARD
================================ */
.auth-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 42px 32px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  box-shadow:
    0 20px 50px rgba(2, 6, 23, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  animation: slideUp 0.8s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===============================
   TITLE
================================ */
.auth-title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
  color: #020617;
}

.auth-subtitle {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 30px;
}

/* ===============================
   FORM
================================ */
.auth-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #020617;
}

/* ===============================
   INPUT
================================ */
input {
  width: 100%;
  padding: 14px 44px 14px 14px;
  border-radius: 14px;
  border: 1.6px solid #e5e7eb;
  font-size: 15px;
  background: #f8fafc;
  transition: all 0.25s ease;
}

input::placeholder {
  color: #94a3b8;
}

input:focus {
  outline: none;
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);
}

/* ===============================
   PASSWORD
================================ */
.password-wrapper {
  position: relative;
}

.password-wrapper .icon {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #64748b;
  font-size: 16px;
  transition: 0.2s;
}

.password-wrapper .icon:hover {
  color: #2563eb;
}

/* ===============================
   BUTTON
================================ */
.btn-primary {
  margin-top: 8px;
  padding: 15px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.45);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.55);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

/* ===============================
   FOOTER
================================ */
.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #475569;
}

.auth-link {
  margin-left: 4px;
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
