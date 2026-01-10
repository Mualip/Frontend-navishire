<template>
  <!-- HERO -->
  <section class="hero-section">
    <div class="hero-blue"></div>
    <header class="header-wrapper">
      <h1 class="title">Form Lamaran Kerja</h1>
      <p class="subtitle">Lengkapi semua data berikut untuk melamar pekerjaan.</p>
    </header>
  </section>

  <!-- CARD -->
  <div class="card-wrapper">
    <!-- STEP BAR -->
    <div class="step-indicator">
      <div v-for="n in 4" :key="n" :class="['step-bar', step >= n ? 'active' : '']"></div>
    </div>

    <!-- ================= STEP 1 ================= -->
    <section v-if="step === 1">
      <h2 class="step-title">Step 1 — Data Pribadi & Pendidikan</h2>

      <div class="form-grid">
        <div v-for="f in fieldsStep1" :key="f.key">
          <label>{{ f.label }}</label>

          <!-- TEXT -->
          <input v-if="f.type === 'text'" type="text" v-model="form[f.key as keyof typeof form]" />

          <!-- DATE -->
          <input
            v-else-if="f.type === 'date'"
            type="date"
            v-model="form[f.key as keyof typeof form]"
          />

          <!-- SELECT -->
          <select v-else-if="f.type === 'select'" v-model="form[f.key as keyof typeof form]">
            <option value="">-- Pilih --</option>
            <option v-for="o in f.options" :key="o" :value="o">
              {{ o }}
            </option>
          </select>

          <!-- NIK -->
          <input
            v-else-if="f.type === 'nik'"
            type="text"
            inputmode="numeric"
            maxlength="16"
            placeholder="16 digit NIK"
            v-model="form.nik"
            @input="handleNikInput"
          />
        </div>
        <!-- ================= SOSIAL MEDIA (BALIK) ================= -->
        <div>
          <label>Sosial Media</label>

          <div style="display: flex; gap: 16px; margin-top: 6px">
            <label>
              <input type="checkbox" v-model="form.sosmed.facebook" />
              Facebook
            </label>

            <label>
              <input type="checkbox" v-model="form.sosmed.instagram" />
              Instagram
            </label>
          </div>
        </div>

        <div v-if="form.sosmed.facebook">
          <label>Link Facebook</label>
          <input type="text" v-model="form.facebookLink" placeholder="https://facebook.com/nama" />
        </div>

        <div v-if="form.sosmed.instagram">
          <label>Instagram</label>
          <input type="text" v-model="form.instagram" placeholder="@username / link instagram" />
        </div>

        <!-- PENDIDIKAN -->
        <div>
          <label>Pendidikan Terakhir</label>
          <select v-model="form.pendidikanTerakhir">
            <option value="">-- Pilih --</option>
            <option>SMA</option>
            <option>Diploma / Ma'had Ali / Tadribu Du'at</option>
            <option>S1</option>
            <option>S2</option>
            <option>S3</option>
          </select>
        </div>

        <div>
          <label>Almamater</label>
          <input type="text" v-model="form.almamater" />
        </div>

        <div>
          <label>Pengabdian Pesantren</label>
          <select v-model="form.pengabdianPesantren">
            <option value="">-- Pilih --</option>
            <option>Ada</option>
            <option>Tidak</option>
          </select>
        </div>
      </div>
    </section>

    <!-- ================= STEP 2 ================= -->
    <section v-if="step === 2">
      <h2 class="step-title">Step 2 — Posisi & Penempatan</h2>

      <div class="form-grid">
        <div>
          <label>Posisi</label>
          <select v-model="form.posisi">
            <option value="">-- Pilih --</option>
            <option>Guru Bahasa Indonesia Paruh Waktu</option>
            <option>Tutor Alquran Akhwat</option>
            <option>Tutor Diniyyah Akhwat</option>
            <option>Guru Bahasa Inggris Ikhwan</option>
          </select>
        </div>

        <div>
          <label>Lembaga</label>
          <select v-model="form.lembaga">
            <option value="">-- Pilih --</option>
            <option>Divisi Akademik (Litbang)</option>
            <option>Imam Nawawi School</option>
            <option>Imam Nawawi Boarding School</option>
            <option>Home Schooling Imam Nawawi</option>
          </select>
        </div>

        <div>
          <label>Lokasi Kerja</label>
          <select v-model="form.lokasiKerja">
            <option value="">-- Pilih --</option>
            <option>Ciomas</option>
            <option>Cibinong</option>
            <option>Pondok Gede</option>
            <option>Bersedia ditempatkan di mana saja</option>
          </select>
        </div>
      </div>
    </section>

    <!-- ================= STEP 3 ================= -->
    <section v-if="step === 3">
      <h2 class="step-title">Step 3 — Keislaman & Lainnya</h2>

      <div class="form-grid">
        <div>
          <label>Nilai Motivasi (0–10)</label>
          <input type="number" min="0" max="10" v-model="form.motivasiNilai" />
        </div>

        <div>
          <label>Rutin Kajian</label>
          <select v-model="form.rutinKajian">
            <option value="">-- Pilih --</option>
            <option>Iya</option>
            <option>Tidak</option>
          </select>
        </div>

        <div><label>Ustadz Diikuti</label><input v-model="form.ustadzDiikuti" /></div>
        <div><label>Ulama Internasional</label><input v-model="form.ulamaInternasional" /></div>
        <div><label>Situs Islam</label><input v-model="form.situsIslam" /></div>
        <div><label>Media Islam</label><input v-model="form.mediaIslam" /></div>

        <div>
          <label>Sumber Lowongan</label>
          <select v-model="form.sumberLowongan">
            <option value="">-- Pilih --</option>
            <option>Facebook</option>
            <option>Instagram</option>
            <option>Broadcast WA</option>
            <option>Telegram</option>
            <option>Pegawai YADIN</option>
            <option>Lainnya</option>
          </select>
        </div>

        <div><label>Gaji Harapan</label><input v-model="form.gajiHarapan" /></div>
        <div><label>Hobi</label><input v-model="form.hobi" /></div>
        <div><label>Motivasi Melamar</label><input v-model="form.motivasiMelamar" /></div>
        <div><label>Deskripsi Diri</label><input v-model="form.deskripsiDiri" /></div>
        <div><label>Kesiapan Bekerja</label><input v-model="form.siapBekerja" /></div>
      </div>
    </section>

    <!-- ================= STEP 4 ================= -->
    <section v-if="step === 4">
      <h2 class="step-title">Step 4 — Upload Berkas</h2>

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
      <button v-if="step < 4" class="btn-next" @click="step++">Berikutnya →</button>
      <button v-if="step === 4" class="btn-submit" @click="submitForm">Kirim Lamaran</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/* ================= STEP ================= */
const step = ref(1)

/* ================= FORM ================= */
const form = ref({
  // DATA PRIBADI
  nama: '',
  nik: '',
  email: '',
  phone: '',
  alamat: '',
  jk: '',
  tglLahir: '',
  statusNikah: '',

  // SOSMED
  sosmed: {
    facebook: false,
    instagram: false,
  },
  facebookLink: '',
  instagram: '',

  // LAMARAN
  posisi: '',
  lembaga: '',
  lokasiKerja: '',

  // PENDIDIKAN
  pendidikanTerakhir: '',
  almamater: '',
  pengabdianPesantren: '',

  // KEISLAMAN
  motivasiNilai: '',
  rutinKajian: '',
  ustadzDiikuti: '',
  ulamaInternasional: '',
  situsIslam: '',
  mediaIslam: '',

  // LAINNYA
  motivasiMelamar: '',
  sumberLowongan: '',
  gajiHarapan: '',
  hobi: '',
  deskripsiDiri: '',
  siapBekerja: '',
})

/* ================= FIELD STEP 1 ================= */
const fieldsStep1 = ref([
  { label: 'Nama Lengkap', key: 'nama', type: 'text' },
  { label: 'NIK', key: 'nik', type: 'nik' },
  { label: 'Email', key: 'email', type: 'text' },
  { label: 'Nomor HP', key: 'phone', type: 'text' },
  { label: 'Alamat', key: 'alamat', type: 'text' },
  {
    label: 'Jenis Kelamin',
    key: 'jk',
    type: 'select',
    options: ['Laki-laki', 'Perempuan'],
  },
  { label: 'Tanggal Lahir', key: 'tglLahir', type: 'date' },
  {
    label: 'Status Pernikahan',
    key: 'statusNikah',
    type: 'select',
    options: ['Menikah', 'Belum Menikah'],
  },
])

/* ================= NIK ================= */
const handleNikInput = (e: Event) => {
  const t = e.target as HTMLInputElement
  let val = t.value.replace(/\D/g, '')
  if (val.length > 16) val = val.slice(0, 16)
  form.value.nik = val
}

/* ================= UPLOAD ================= */
const uploads = ref(['CV', 'Ijazah', 'Transkrip', 'Berkas Pendukung'])
const uploadedFiles = ref<Record<string, File>>({})

const handleFileUpload = (e: Event, key: string) => {
  const t = e.target as HTMLInputElement
  if (t.files?.[0]) uploadedFiles.value[key] = t.files[0]
}

/* ================= SUBMIT (SUDAH ADA TOKEN) ================= */
const submitForm = async () => {
  /* 🔐 AMBIL TOKEN */
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Anda belum login')
    return
  }

  /* VALIDASI */
  if (form.value.nik.length !== 16) {
    alert('NIK harus 16 digit')
    step.value = 1
    return
  }

  if (!form.value.posisi || !form.value.lembaga || !form.value.lokasiKerja) {
    alert('Data lamaran belum lengkap')
    step.value = 2
    return
  }

  const fd = new FormData()

  /* SOSMED */
  const sosmedArr: string[] = []
  if (form.value.sosmed.facebook && form.value.facebookLink) {
    sosmedArr.push(`Facebook: ${form.value.facebookLink}`)
  }
  if (form.value.sosmed.instagram && form.value.instagram) {
    sosmedArr.push(`Instagram: ${form.value.instagram}`)
  }
  fd.append('sosmed', sosmedArr.join(' | '))

  /* HOBI */
  form.value.hobi
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
    .forEach((h) => fd.append('hobi[]', h))

  /* DATA */
  Object.entries(form.value).forEach(([k, v]) => {
    if (k !== 'sosmed' && k !== 'facebookLink' && k !== 'instagram' && k !== 'hobi') {
      fd.append(k, String(v))
    }
  })

  /* FILE */
  Object.values(uploadedFiles.value).forEach((f) => {
    fd.append('berkas', f)
  })

  /* REQUEST (🔥 TOKEN MASUK DI SINI) */
  const res = await fetch('http://localhost:5000/api/lamaran', {
    method: 'POST',
    body: fd,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = await res.json()
    alert(err.message || 'Gagal mengirim lamaran')
    return
  }

  alert('Lamaran berhasil dikirim')
  step.value = 1
}
</script>

<style scoped>
/* ================= HERO ================= */
.hero-blue {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40rem;
  background: linear-gradient(180deg, #2563eb 0%, #eff6ff 40%);
  border-radius: 0 0 1.5rem 1.5rem;
  z-index: 0;
}
.hero-section {
  position: relative;
  padding-top: 16px;
}
.header-wrapper {
  position: relative;
  z-index: 1;
  margin: 0 20px;
}
.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
}
.subtitle {
  color: #e0e7ff;
  margin-top: 0.5rem;
}

/* ================= CARD ================= */
.card-wrapper {
  position: relative;
  z-index: 10;
  background: #ffffff;
  max-width: 72rem;
  margin: 20px;
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.15);
  transition: all 0.25s ease;
}
.card-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.22);
}

/* ================= STEP BAR ================= */
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
  transition: all 0.25s ease;
}
.step-bar.active {
  background: #2563eb;
}

/* ================= STEP TITLE ================= */
.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1e3a8a;
}

/* ================= LABEL & INPUT ================= */
label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a8a;
}
input,
select,
textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem; /* agak lebih bulat */
  border: 1px solid #cbd5e1; /* lebih lembut dari #d1d5db */
  background: #f9fafb; /* soft putih mirip dashboard */
  transition: all 0.25s ease;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  outline: none;
}

/* ================= BUTTON ================= */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
}
.btn-prev {
  background: #f3f4f6; /* soft grey */
  color: #1f2937;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
}
.btn-prev:hover {
  background: #e5e7eb;
}
.btn-next {
  background: #2563eb;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
}
.btn-next:hover {
  background: #1e40af;
}
.btn-submit {
  background: #16a34a;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
}
.btn-submit:hover {
  background: #15803d;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 900px) {
  .card-wrapper {
    margin: 1.5rem;
  }
}
</style>
