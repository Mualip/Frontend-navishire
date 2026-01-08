<template>
  <section class="page">
    <!-- HEADER -->
    <header class="header">
      <h2>Penilaian SPK (SAW)</h2>
    </header>

    <!-- BOBOT -->
    <div class="card">
      <h4 class="card-title">Bobot Kriteria</h4>

      <div class="bobot-grid">
        <div v-for="k in allKriteria" :key="k.key" class="bobot-item">
          <label>{{ k.label }}</label>
          <input type="number" step="0.1" v-model.number="bobot[k.key]" />
        </div>
      </div>

      <small class="hint">Total bobot disarankan = 1</small>
    </div>

    <!-- TOOLBAR -->
    <div class="toolbar">
      <input v-model="newKolom" placeholder="Tambah tes offline (contoh: Microteaching)" />
      <button @click="tambahKolom">+ Tambah Kolom</button>
    </div>

    <!-- TABLE -->
    <div class="table-card">
      <table class="sheet">
        <thead>
          <tr>
            <th>Rank</th>
            <th class="left">Nama Pelamar</th>

            <th v-for="o in onlineTes" :key="o.key">
              {{ o.label }}
              <span>(Benar / Total)</span>
            </th>

            <th v-for="o in offlineTes" :key="o.key">
              {{ o.label }}
              <span>(Offline)</span>
            </th>

            <th>Nilai SAW</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, i) in rankedData" :key="row.nama" :class="{ best: i === 0 }">
            <td class="rank">{{ i + 1 }}</td>
            <td class="left name">{{ row.nama }}</td>

            <!-- ONLINE -->
            <td v-for="o in onlineTes" :key="o.key">
              <strong>{{ row.online[o.key].benar }}</strong>
              /
              {{ row.online[o.key].total }}
              <div class="percent">{{ persen(row.online[o.key]) }}%</div>
            </td>

            <!-- OFFLINE -->
            <td v-for="o in offlineTes" :key="o.key">
              <input type="number" min="0" max="100" v-model.number="row.offline[o.key]" />
            </td>

            <td class="final">{{ nilaiSAW(row).toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ACTION -->
    <div class="action">
      <button class="save" @click="simpanDummy">Simpan Penilaian SAW (Dummy)</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'

/* ================= TYPES ================= */
type ApiOnline = {
  materi: string
  label: string
  totalBenar: number
  totalSoal: number
  nilai: number
}

type ApiOffline = {
  key: string
  label: string
  nilai: number
}

type ApiPelamar = {
  _id: string
  pelamar: {
    name: string
  }
  online: ApiOnline[]
  offline: ApiOffline[]
  bobot: Record<string, number>
}

type OnlineTes = {
  benar: number
  total: number
}

type Pelamar = {
  id: string
  nama: string
  online: Record<string, OnlineTes>
  offline: Record<string, number>
}

/* ================= API ================= */
const API_URL = 'http://localhost:5000/api/penilaian-saw'

/* ================= STATE ================= */
const onlineTes = reactive<{ key: string; label: string }[]>([])
const offlineTes = reactive<{ key: string; label: string }[]>([])
const bobot = reactive<Record<string, number>>({})
const data = reactive<Pelamar[]>([])

/* ================= LOAD ================= */
const loadData = async (): Promise<void> => {
  const res = await axios.get<ApiPelamar[]>(API_URL)

  onlineTes.length = 0
  offlineTes.length = 0
  data.length = 0

  res.data.forEach((item) => {
    const online: Record<string, OnlineTes> = {}
    const offline: Record<string, number> = {}

    item.online.forEach((o) => {
      const key = o.label.toLowerCase().replace(/\s+/g, '_')

      if (!onlineTes.some((x) => x.key === key)) {
        onlineTes.push({ key, label: o.label })
        bobot[key] = item.bobot[key] ?? 0.3
      }

      online[key] = {
        benar: o.totalBenar,
        total: o.totalSoal,
      }
    })

    item.offline.forEach((o) => {
      if (!offlineTes.some((x) => x.key === o.key)) {
        offlineTes.push({ key: o.key, label: o.label })
        bobot[o.key] = item.bobot[o.key] ?? 0.3
      }

      offline[o.key] = o.nilai
    })

    data.push({
      id: item._id,
      nama: item.pelamar.name,
      online,
      offline,
    })
  })
}

onMounted(loadData)

/* ================= SAW ================= */
const persen = (t: OnlineTes): number => (t.total === 0 ? 0 : Math.round((t.benar / t.total) * 100))

const maxNilai = (key: string): number =>
  Math.max(...data.map((d) => (d.online[key] ? persen(d.online[key]) : (d.offline[key] ?? 0))))

const nilaiSAW = (row: Pelamar): number => {
  let total = 0

  onlineTes.forEach((o) => {
    const nilai = persen(row.online[o.key])
    total += (nilai / maxNilai(o.key)) * (bobot[o.key] || 0)
  })

  offlineTes.forEach((o) => {
    const nilai = row.offline[o.key] || 0
    total += (nilai / maxNilai(o.key)) * (bobot[o.key] || 0)
  })

  return total
}

const rankedData = computed<Pelamar[]>(() => [...data].sort((a, b) => nilaiSAW(b) - nilaiSAW(a)))

/* ================= OFFLINE ================= */
const newKolom = ref<string>('')

const tambahKolom = (): void => {
  if (!newKolom.value) return

  const key = newKolom.value.toLowerCase().replace(/\s+/g, '_')

  offlineTes.push({ key, label: newKolom.value })
  bobot[key] = 0.1

  data.forEach((d) => {
    d.offline[key] = 0
  })

  newKolom.value = ''
}

const allKriteria = computed(() => [...onlineTes, ...offlineTes])

/* ================= SAVE ================= */
const simpanDummy = async (): Promise<void> => {
  for (const row of data) {
    await axios.put(`${API_URL}/${row.id}/offline`, {
      offline: Object.entries(row.offline).map(([key, nilai]) => ({
        key,
        label: key.replace(/_/g, ' '),
        nilai,
      })),
      bobot,
    })
  }

  alert('Penilaian SAW berhasil disimpan')
  await loadData()
}
</script>

<style scoped>
.page {
  padding: 24px;
  background: #f1f5f9;
}

/* HEADER */
.header h2 {
  font-size: 22px;
  font-weight: 700;
}
.header p {
  color: #64748b;
  margin-top: 4px;
}

/* CARD */
.card {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.card-title {
  font-weight: 600;
  margin-bottom: 12px;
}
.hint {
  color: #64748b;
  font-size: 12px;
}

/* BOBOT */
.bobot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.bobot-item label {
  font-size: 13px;
  color: #475569;
}
.bobot-item input {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

/* TOOLBAR */
.toolbar {
  display: flex;
  gap: 8px;
  margin: 16px 0;
}
.toolbar input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}
.toolbar button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

/* TABLE */
.table-card {
  background: white;
  border-radius: 10px;
  overflow-x: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}
.sheet {
  width: 100%;
  border-collapse: collapse;
}
.sheet th {
  background: #f8fafc;
  font-weight: 600;
  font-size: 13px;
}
.sheet th span {
  display: block;
  font-weight: normal;
  font-size: 11px;
  color: #64748b;
}
.sheet th,
.sheet td {
  border: 1px solid #e5e7eb;
  padding: 10px;
  text-align: center;
}
.left {
  text-align: left;
}
.name {
  font-weight: 600;
}
.rank {
  font-weight: 700;
}
.percent {
  font-size: 12px;
  color: #64748b;
}
.final {
  font-weight: 700;
  color: #4338ca;
}
.best {
  background: #eef2ff;
}

/* INPUT */
.sheet input {
  width: 70px;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  text-align: center;
}

/* ACTION */
.action {
  margin-top: 16px;
  text-align: right;
}
.save {
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
