<template>
  <div class="job-application">
    <h1>Form Penerimaan Karyawan</h1>
    <form>
      <div>
        <label>Nama:</label>
        <input type="text" placeholder="Masukkan nama" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" placeholder="Masukkan email" />
      </div>
      <div>
        <label>Posisi yang dilamar:</label>
        <input type="text" placeholder="Contoh: Backend Developer" />
      </div>
      <button type="submit">Kirim Lamaran</button>
    </form>
  </div>
</template>

<script setup></script>

<style scoped>
.job-application {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
.job-application form div {
  margin-bottom: 12px;
}
</style>
