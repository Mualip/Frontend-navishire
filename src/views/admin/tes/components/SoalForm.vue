<template>
  <div class="form">
    <input placeholder="Pertanyaan" />
    <input placeholder="Opsi A" />
    <input placeholder="Opsi B" />
    <input placeholder="Opsi C" />
    <input placeholder="Opsi D" />
    <select>
      <option>Jawaban Benar</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
      <option>D</option>
    </select>

    <button>Simpan Soal</button>
  </div>
</template>

<style scoped>
.form {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
button {
  background: #2563eb;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
