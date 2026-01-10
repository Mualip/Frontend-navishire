<template>
  <section class="header-card">
    <h1 class="title" style="color: white">Selamat Datang, {{ nama || '...' }} 👋</h1>

    <p class="subtitle">Pantau status lamaran dan tahapan seleksi Anda</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

/* ================= STATE ================= */
const nama = ref<string>('')

/* ================= API BASE ================= */
const API_BASE = import.meta.env.VITE_API_URL

/* ================= LOAD USER ================= */
const loadUser = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return

    const res = await axios.get(`${API_BASE}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Ambil nama user dari response
    nama.value = res.data.user.name
  } catch (err: unknown) {
    console.error('Gagal mengambil data user', err)
  }
}

/* ================= MOUNT ================= */
onMounted(loadUser)
</script>

<style scoped>
.header-card {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
}

.subtitle {
  margin-top: 0.5rem;
  opacity: 0.9;
}
</style>
