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

    <!-- ================= MODAL UNDANG ================= -->
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

          <!-- PILIH TES / MATERI DENGAN CHECKBOX -->
          <div class="form-group">
            <label>Pilih Tes / Materi</label>
            <div class="checkbox-list">
              <label v-for="m in materiList" :key="m._id" class="checkbox-item">
                <input type="checkbox" :value="m._id" v-model="undangForm.materiId" />
                {{ m.judul }} ({{ m.soalCount }} soal)
              </label>
            </div>
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
    <!-- ================================================= -->
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

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

interface Materi {
  _id: string
  judul: string
  soalCount: number
}

/* ======================
   STATE
====================== */
const pelamarList = ref<Pelamar[]>([])
const materiList = ref<Materi[]>([])
const loading = ref(false)
const error = ref('')

const showUndang = ref(false)
const undangPelamar = ref<Pelamar | null>(null)

const undangForm = ref({
  judul: '',
  materiId: [] as string[], // ✅ array kosong
  tanggal: '',
  waktu: '',
  lokasi: '',
  pesan: '',
})

const router = useRouter()
const API_LAMARAN = 'http://localhost:5000/api/admin/lamaran'
const API_MATERI = 'http://localhost:5000/api/admin/materi'

/* ======================
   HELPERS
====================== */
const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID')

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  return 'Terjadi kesalahan'
}

/* ======================
   FETCH DATA
====================== */
const fetchPelamar = async () => {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await axios.get<Pelamar[]>(API_LAMARAN, {
      headers: { Authorization: `Bearer ${token}` },
    })
    pelamarList.value = res.data
  } catch (err: unknown) {
    error.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}

const fetchMateri = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    const res = await axios.get<Materi[]>(API_MATERI, {
      headers: { Authorization: `Bearer ${token}` },
    })
    materiList.value = res.data
  } catch (err: unknown) {
    console.error('Gagal ambil materi', getErrorMessage(err))
  }
}

/* ======================
   UNDANG
====================== */
const openUndang = async (p: Pelamar) => {
  undangPelamar.value = p
  showUndang.value = true
  if (!materiList.value.length) await fetchMateri()
}

const closeUndang = () => {
  showUndang.value = false
  undangForm.value = {
    judul: '',
    materiId: [] as string[], // ✅ array kosong
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

    const res = await axios.post(
      `${API_LAMARAN}/${undangPelamar.value._id}/undang`,
      undangForm.value,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    alert(res.data.message || 'Undangan berhasil dikirim')
    closeUndang()
  } catch (err: unknown) {
    alert(getErrorMessage(err))
  }
}

/* ======================
   STATUS & NAV
====================== */
const updateStatus = async (id: string, status: Exclude<StatusLamaran, 'pending'>) => {
  if (!confirm(`Yakin ingin ${status}?`)) return

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    await axios.put(
      `${API_LAMARAN}/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    fetchPelamar()
  } catch (err: unknown) {
    alert(getErrorMessage(err))
  }
}

const hapusLamaran = async (id: string) => {
  if (!confirm('Yakin ingin menghapus lamaran ini?')) return

  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token tidak ditemukan')

    await axios.delete(`${API_LAMARAN}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPelamar()
  } catch (err: unknown) {
    alert(getErrorMessage(err))
  }
}

const goDetail = (id: string) => {
  router.push({ name: 'detail-lamaran', params: { id } })
}

/* ======================
   ON MOUNT
====================== */
onMounted(() => {
  fetchPelamar()
  fetchMateri()
})
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
/* RESPONSIVE */
@media (max-width: 640px) {
  .table {
    min-width: 600px;
  }
  .form-group-grid {
    grid-template-columns: 1fr;
  }
}
</style>
