<template>
  <!-- HEADER -->
  <section class="header">
    <div class="header-inner">
      <span class="breadcrumb">Dashboard Pelamar</span>
      <h1 class="page-title">Form Lamaran Kerja</h1>
      <p class="page-desc">Lengkapi semua data berikut untuk melamar pekerjaan.</p>
    </div>
    <div class="header-fade"></div>
  </section>

  <!-- CONTENT -->
  <section class="content">
    <div class="card">
      <!-- PROGRESS -->
      <div class="progress">
        <span class="active"></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <h2 class="step-title">Step 1 — Data Pribadi & Pendidikan</h2>

      <form class="form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" placeholder="Nama lengkap sesuai KTP" />
        </div>

        <div class="form-group">
          <label>NIK</label>
          <input type="text" placeholder="16 digit NIK" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="email@contoh.com" />
        </div>

        <div class="form-group">
          <label>Nomor HP</label>
          <input type="text" placeholder="08xxxxxxxxxx" />
        </div>

        <div class="form-group">
          <label>Alamat</label>
          <textarea rows="3" placeholder="Alamat lengkap"></textarea>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// form logic nanti bisa ditambah
</script>

<style scoped>
/* ================= HEADER ================= */
.header {
  position: relative;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  padding: 2.8rem 1.5rem 6.5rem;
  color: #fff;
}

.header-inner {
  max-width: 1200px;
  margin: auto;
}

.breadcrumb {
  font-size: 0.8rem;
  opacity: 0.9;
}

.page-title {
  font-size: clamp(2rem, 3vw, 2.8rem);
  font-weight: 800;
  margin-top: 0.5rem;
}

.page-desc {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.header-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 45%,
    #ffffff 100%
  );
}

/* ================= CONTENT ================= */
.content {
  max-width: 1200px;
  margin: -4rem auto 3rem;
  padding: 0 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 30px 60px rgba(37, 99, 235, 0.25);
}

/* ================= PROGRESS ================= */
.progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 2.2rem;
}

.progress span {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
}

.progress span.active {
  background: #2563eb;
}

/* ================= STEP TITLE ================= */
.step-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 2rem;
}

/* ================= FORM ================= */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e40af;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1.5px solid #c7d2fe;
  font-size: 0.95rem;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #2563eb;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .card {
    padding: 1.8rem;
  }

  .step-title {
    font-size: 1.2rem;
  }
}
</style>
