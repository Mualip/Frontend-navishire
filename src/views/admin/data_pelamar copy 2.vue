<template>
  <section class="page">
    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 style="color: #ffffff">Lamaran Masuk</h1>
        <p style="color: #ffffff">Kelola dan verifikasi berkas pelamar</p>
      </div>
    </div>

    <!-- CARD -->
    <div class="card">
      <div v-if="loading" class="info">Memuat data...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <table v-if="!loading && pelamarList.length" class="table">
        <thead>
          <tr>
            <th>Pelamar</th>
            <th>Posisi</th>
            <th>Lembaga</th>
            <th>Tgl Lahir</th>
            <th>Status</th>
            <th class="center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in pelamarList" :key="p._id">
            <td>
              <div class="user">
                <div class="avatar">{{ p.nama.charAt(0).toUpperCase() }}</div>
                <div>
                  <strong>{{ p.nama }}</strong>
                  <small>{{ p.email }}</small>
                </div>
              </div>
            </td>

            <td>{{ p.posisi }}</td>
            <td>{{ p.lembaga }}</td>
            <td>{{ formatDate(p.tglLahir) }}</td>

            <td>
              <span :class="['badge', p.status ?? 'pending']">
                {{ p.status ?? 'pending' }}
              </span>
            </td>

            <td class="center actions">
              <button class="btn blue" @click="goDetail(p._id)">Detail</button>

              <!-- ✅ TAMBAHAN UNDANG -->
              <button class="btn purple" @click="openUndang(p)">Undang</button>

              <button
                v-if="p.status !== 'diterima'"
                class="btn green"
                @click="updateStatus(p._id, 'diterima')"
              >
                Terima
              </button>

              <button
                v-if="p.status !== 'ditolak'"
                class="btn orange"
                @click="updateStatus(p._id, 'ditolak')"
              >
                Tolak
              </button>

              <button class="btn red" @click="hapusLamaran(p._id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && !pelamarList.length" class="empty">Belum ada lamaran masuk</div>
    </div>

    <!-- ================= MODAL UNDANG (TAMBAHAN) ================= -->
    <div v-if="showUndang" class="modal-overlay">
      <div class="modal">
        <h3>Undang Pelamar</h3>
        <p class="modal-subtitle">
          Undang <strong>{{ undangPelamar?.nama }}</strong>
        </p>

        <form @submit.prevent="kirimUndangan">
          <div class="form-group">
            <label>Judul Undangan</label>
            <input v-model="undangForm.judul" required />
          </div>

          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="undangForm.tanggal" required />
          </div>

          <div class="form-group">
            <label>Waktu</label>
            <input type="time" v-model="undangForm.waktu" required />
          </div>

          <div class="form-group">
            <label>Lokasi</label>
            <input v-model="undangForm.lokasi" required />
          </div>

          <div class="form-group">
            <label>Pesan</label>
            <textarea rows="4" v-model="undangForm.pesan" required></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn gray" @click="closeUndang">Batal</button>
            <button type="submit" class="btn green">Kirim Undangan</button>
          </div>
        </form>
      </div>
    </div>
    <!-- ========================================================== -->
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

/* ======================
   TYPES
====================== */
type StatusLamaran = 'pending' | 'diterima' | 'ditolak'

interface Pelamar {
  _id: string
  nama: string
  email: string
  posisi: string
  lembaga: string
  tglLahir: string
  status?: StatusLamaran
}

interface ApiError {
  message: string
}

/* ======================
   STATE (ASLI)
====================== */
const pelamarList = ref<Pelamar[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

/* ======================
   STATE TAMBAHAN UNDANG
====================== */
const showUndang = ref(false)
const undangPelamar = ref<Pelamar | null>(null)
const undangForm = ref({
  judul: '',
  tanggal: '',
  waktu: '',
  lokasi: '',
  pesan: '',
})

const router = useRouter()
const API = 'http://localhost:5000/api/admin/lamaran'

/* ======================
   HELPERS (ASLI)
====================== */
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Terjadi kesalahan'
}

const formatDate = (d: string): string => new Date(d).toLocaleDateString('id-ID')

/* ======================
   FETCH DATA (ASLI)
====================== */
const fetchPelamar = async (): Promise<void> => {
  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const errRes: ApiError = await res.json()
      throw new Error(errRes.message)
    }

    const data: Pelamar[] = await res.json()
    pelamarList.value = data
  } catch (err: unknown) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}

/* ======================
   UPDATE STATUS (ASLI)
====================== */
const updateStatus = async (
  id: string,
  status: Exclude<StatusLamaran, 'pending'>,
): Promise<void> => {
  if (!confirm(`Yakin ingin ${status}?`)) return

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await fetch(`${API}/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      const errRes: ApiError = await res.json()
      throw new Error(errRes.message)
    }

    const result = await res.json()
    const updated: Pelamar = result.data

    const index = pelamarList.value.findIndex((p) => p._id === id)
    if (index !== -1) {
      pelamarList.value[index].status = updated.status
    }

    alert(result.message)
  } catch (err: unknown) {
    alert(getErrorMessage(err))
  }
}

/* ======================
   DELETE (ASLI)
====================== */
const hapusLamaran = async (id: string): Promise<void> => {
  if (!confirm('Yakin ingin menghapus lamaran ini?')) return

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const errRes: ApiError = await res.json()
      throw new Error(errRes.message)
    }

    pelamarList.value = pelamarList.value.filter((p) => p._id !== id)
  } catch (err: unknown) {
    alert(getErrorMessage(err))
  }
}

/* ======================
   TAMBAHAN LOGIKA UNDANG
====================== */
const openUndang = (p: Pelamar) => {
  undangPelamar.value = p
  showUndang.value = true
}

const closeUndang = () => {
  showUndang.value = false
  undangForm.value = {
    judul: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    pesan: '',
  }
}

const kirimUndangan = async () => {
  if (!undangPelamar.value) return

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await fetch(`${API}/${undangPelamar.value._id}/undang`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(undangForm.value),
    })

    // 🔴 INI YANG SEBELUMNYA TIDAK ADA
    if (!res.ok) {
      const errRes = await res.json()
      throw new Error(errRes.message || 'Gagal mengirim undangan')
    }

    const result = await res.json()

    // 🟢 UPDATE STATUS DI FE (TIDAK MERUSAK LOGIC)
    const index = pelamarList.value.findIndex((p) => p._id === undangPelamar.value?._id)
    if (index !== -1) {
      pelamarList.value[index].status = 'pending' // atau 'diundang' kalau mau
    }

    alert(result.message || 'Undangan berhasil dikirim')
    closeUndang()
  } catch (err: unknown) {
    alert(getErrorMessage(err))
  }
}

/* ======================
   NAVIGATION (ASLI)
====================== */
const goDetail = (id: string): void => {
  router.push({ name: 'detail_lamaran', params: { id } })
}

onMounted(fetchPelamar)
</script>

<style scoped>
/* ================= CSS ASLI (TIDAK DIUBAH) ================= */
.page {
  padding: 15px;
}

/* HEADER */
.page-header {
  margin-bottom: 20px;
}
.page-header h1 {
  font-size: 24px;
  font-weight: 700;
}
.page-header p {
  color: #64748b;
  font-size: 14px;
}

/* CARD */
.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  text-transform: uppercase;
  font-size: 12px;
  color: #64748b;
  padding: 12px;
}
.table td {
  padding: 14px 12px;
  border-top: 1px solid #e5e7eb;
}
.center {
  text-align: center;
}

/* USER */
.user {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user small {
  display: block;
  font-size: 12px;
  color: #64748b;
}

/* STATUS */
.badge {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}
.badge.pending {
  background: #fde68a;
  color: #92400e;
}
.badge.diterima {
  background: #bbf7d0;
  color: #065f46;
}
.badge.ditolak {
  background: #fecaca;
  color: #7f1d1d;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.btn {
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
}
.blue {
  background: #2563eb;
  color: white;
}
.green {
  background: #16a34a;
  color: white;
}
.orange {
  background: #f97316;
  color: white;
}
.red {
  background: #dc2626;
  color: white;
}

/* INFO */
.info {
  color: #64748b;
}
.error {
  color: #dc2626;
  margin-bottom: 12px;
}
.empty {
  text-align: center;
  padding: 24px;
  color: #64748b;
}

/* ================= CSS TAMBAHAN UNDANG ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal {
  background: #ffffff;
  width: 420px;
  border-radius: 14px;
  padding: 20px;
}
.modal-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}
.form-group {
  margin-bottom: 10px;
}
.form-group label {
  font-size: 12px;
  font-weight: 600;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.purple {
  background: #7c3aed;
  color: white;
}
.gray {
  background: #e5e7eb;
}
</style>
