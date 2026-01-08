<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Login</h2>

      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <p v-if="error" class="error">{{ error }}</p>

      <button @click="login" :disabled="loading">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    // 🔐 2FA AKTIF
    if (res.data.twoFactorRequired) {
      localStorage.setItem('tempUserId', res.data.userId)
      router.push('/otp-verify')
      return
    }

    // 🔓 LOGIN NORMAL
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)
    router.push('/dashboard')
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message ?? 'Login gagal'
    } else {
      error.value = 'Terjadi kesalahan server'
    }
  }
}
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2563eb;
}
.auth-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 300px;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
button {
  width: 100%;
  padding: 10px;
}
.error {
  color: red;
  font-size: 14px;
}
</style>
