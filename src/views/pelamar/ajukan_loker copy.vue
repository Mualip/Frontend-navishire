<template>
  <!-- HERO -->
  <div class="hero-blue"></div>

  <!-- HEADER -->
  <header class="header-wrapper">
    <h1 class="title">Form Lamaran Kerja</h1>
    <p class="subtitle">Lengkapi semua data dengan benar</p>
  </header>

  <!-- CARD -->
  <div class="card-wrapper">
    <!-- STEP BAR -->
    <div class="step-indicator">
      <div v-for="n in 5" :key="n" :class="['step-bar', step >= n ? 'active' : '']"></div>
    </div>

    <!-- STEP 1 -->
    <section v-if="step === 1">
      <h2 class="step-title">Step 1 — Data Pribadi</h2>
      <div class="form-grid">
        <Field label="Nama Lengkap">
          <input v-model="form.nama" />
        </Field>

        <Field label="NIK">
          <input v-model="form.nik" />
        </Field>

        <Field label="Email">
          <input v-model="form.email" />
        </Field>

        <Field label="No HP / WA">
          <input v-model="form.phone" />
        </Field>

        <Field label="Sosial Media">
          <input v-model="form.sosmed" />
        </Field>

        <Field label="Alamat">
          <input v-model="form.alamat" />
        </Field>

        <Field label="Jenis Kelamin">
          <select v-model="form.jk">
            <option value="">-- Pilih --</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </Field>

        <Field label="Tanggal Lahir">
          <input type="date" v-model="form.tglLahir" />
        </Field>

        <Field label="Status Pernikahan">
          <select v-model="form.statusNikah">
            <option value="">-- Pilih --</option>
            <option>Menikah</option>
            <option>Belum Menikah</option>
          </select>
        </Field>
      </div>
    </section>

    <!-- STEP 2 -->
    <section v-if="step === 2">
      <h2 class="step-title">Step 2 — Posisi & Penempatan</h2>
      <div class="form-grid">
        <Field label="Posisi Dilamar">
          <select v-model="form.posisi">
            <option value="">-- Pilih --</option>
            <option v-for="p in posisiOptions" :key="p">{{ p }}</option>
          </select>
        </Field>

        <Field label="Lembaga">
          <select v-model="form.lembaga">
            <option value="">-- Pilih --</option>
            <option v-for="l in lembagaOptions" :key="l">{{ l }}</option>
          </select>
        </Field>

        <Field label="Lokasi Kerja">
          <select v-model="form.lokasiKerja">
            <option value="">-- Pilih --</option>
            <option v-for="l in lokasiOptions" :key="l">{{ l }}</option>
          </select>
        </Field>
      </div>
    </section>

    <!-- STEP 3 -->
    <section v-if="step === 3">
      <h2 class="step-title">Step 3 — Pendidikan & Keislaman</h2>
      <div class="form-grid">
        <Field label="Pendidikan Terakhir">
          <select v-model="form.pendidikanTerakhir">
            <option value="">-- Pilih --</option>
            <option v-for="p in pendidikanOptions" :key="p">{{ p }}</option>
          </select>
        </Field>

        <Field label="Almamater">
          <input v-model="form.almamater" />
        </Field>

        <Field label="Pengabdian Pesantren">
          <select v-model="form.pengabdianPesantren">
            <option value="">-- Pilih --</option>
            <option>Ada</option>
            <option>Tidak</option>
          </select>
        </Field>

        <Field label="Nilai Motivasi (0-10)">
          <input type="number" min="0" max="10" v-model="form.motivasiNilai" />
        </Field>

        <Field label="Rutin Kajian">
          <select v-model="form.rutinKajian">
            <option value="">-- Pilih --</option>
            <option>Iya</option>
            <option>Tidak</option>
          </select>
        </Field>
      </div>
    </section>

    <!-- STEP 4 -->
    <section v-if="step === 4">
      <h2 class="step-title">Step 4 — Informasi Tambahan</h2>
      <div class="form-grid">
        <Field label="Motivasi Melamar">
          <textarea v-model="form.motivasiMelamar"></textarea>
        </Field>

        <Field label="Sumber Lowongan">
          <select v-model="form.sumberLowongan">
            <option value="">-- Pilih --</option>
            <option v-for="s in sumberOptions" :key="s">{{ s }}</option>
          </select>
        </Field>

        <Field label="Gaji Harapan">
          <input v-model="form.gajiHarapan" />
        </Field>

        <Field label="Deskripsi Diri">
          <textarea v-model="form.deskripsiDiri"></textarea>
        </Field>

        <Field label="Siap Bekerja Kapan?">
          <input v-model="form.siapBekerja" />
        </Field>
      </div>
    </section>

    <!-- STEP 5 -->
    <section v-if="step === 5">
      <h2 class="step-title">Step 5 — Upload Berkas</h2>
      <div class="upload-group">
        <div v-for="f in uploads" :key="f">
          <label>{{ f }}</label>
          <input type="file" @change="(e) => handleFileUpload(e, f)" />
        </div>
      </div>
    </section>

    <!-- BUTTON -->
    <div class="button-group">
      <button v-if="step > 1" class="btn-prev" @click="step--">Sebelumnya</button>
      <button v-if="step < 5" class="btn-next" @click="step++">Berikutnya</button>
      <button v-if="step === 5" class="btn-submit" @click="submitForm">Kirim Lamaran</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent } from 'vue'

/* FIELD WRAPPER (LOCAL COMPONENT) */
const Field = defineComponent({
  props: { label: String },
  template: `
    <div>
      <label>{{ label }}</label>
      <slot />
    </div>
  `,
})

const step = ref(1)

const form = ref({
  nama: '',
  nik: '',
  email: '',
  phone: '',
  sosmed: '',
  alamat: '',
  jk: '',
  tglLahir: '',
  statusNikah: '',

  posisi: '',
  lembaga: '',
  lokasiKerja: '',

  pendidikanTerakhir: '',
  almamater: '',
  pengabdianPesantren: '',
  motivasiNilai: 0,
  rutinKajian: '',

  motivasiMelamar: '',
  sumberLowongan: '',
  gajiHarapan: '',
  deskripsiDiri: '',
  siapBekerja: '',
})

const posisiOptions = [
  'Guru Bahasa Indonesia Paruh Waktu',
  'Tutor Alquran Akhwat',
  'Tutor Diniyyah Akhwat',
  'Guru Bahasa Inggris Ikhwan',
]

const lembagaOptions = [
  'Divisi Akademik (Litbang)',
  'Imam Nawawi School',
  'Imam Nawawi Boarding School',
  'Home Schooling Imam Nawawi',
]

const lokasiOptions = ['Ciomas', 'Cibinong', 'Pondok Gede', 'Bersedia ditempatkan di mana saja']

const pendidikanOptions = ['SMA', "Diploma / Ma'had Ali / Tadribu Du'at", 'S1', 'S2', 'S3']

const sumberOptions = [
  'Facebook',
  'Instagram',
  'Broadcast WA',
  'Telegram',
  'Pegawai YADIN',
  'Lainnya',
]

const uploads = ['CV', 'Ijazah', 'Transkrip', 'Berkas Pendukung']

const uploadedFiles = ref<Record<string, File>>({})

const handleFileUpload = (e: Event, key: string) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadedFiles.value[key] = file
}

const submitForm = async () => {
  const fd = new FormData()
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, String(v)))
  Object.values(uploadedFiles.value).forEach((f) => fd.append('berkas', f))

  const token = localStorage.getItem('token')

  const res = await fetch('http://localhost:5000/api/lamaran', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  })

  if (!res.ok) return alert('Gagal submit lamaran')

  alert('Lamaran berhasil dikirim')
  step.value = 1
}
</script>

<style scoped>
/* (CSS SAMA SEPERTI YANG KAMU PUNYA — TIDAK DIUBAH) */
.hero-blue {
  position: fixed;
  inset: 0 0 auto 0;
  height: 18rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 0 0 1.5rem 1.5rem;
  z-index: 0;
}
.header-wrapper {
  position: relative;
  z-index: 5;
  max-width: 72rem;
  margin: auto;
  padding: 1rem 1.5rem;
}
.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #fff;
}
.subtitle {
  color: #e0e7ff;
  margin-top: 0.5rem;
}
.card-wrapper {
  position: relative;
  z-index: 10;
  background: #fff;
  max-width: 72rem;
  margin: 1.5rem auto;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.step-indicator {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.step-bar {
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 999px;
}
.step-bar.active {
  background: #2563eb;
}
.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
}
input,
select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
}
.btn-prev {
  background: #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
.btn-next {
  background: #2563eb;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
.btn-submit {
  background: #16a34a;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}
</style>
