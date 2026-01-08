import axios from 'axios'

const API = 'http://localhost:5000/api'

/* ======================
   TYPES
====================== */
export type StatusLamaran = 'pending' | 'diterima' | 'ditolak'

export interface Pelamar {
  _id: string
  nama: string
  email: string
  posisi: string
  lembaga?: string
  tglLahir?: string
  status: StatusLamaran
}

/* 🔔 UNDANGAN */
export interface Undangan {
  _id: string
  lamaranId: string
  judul: string
  tanggal: string
  waktu: string
  lokasi: string
  pesan: string
  status: string
  createdAt: string
}

/* ======================
   HELPER
====================== */
const getToken = (): string => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token tidak ditemukan')
  return token
}

/* =====================================================
   ====================== PELAMAR ======================
===================================================== */

/**
 * 📄 Ambil lamaran milik sendiri (STATUS REAL DARI DB)
 */
export const getLamaranSaya = async (): Promise<Pelamar> => {
  const res = await axios.get(`${API}/lamaran/saya`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return res.data
}

/**
 * 🔔 Ambil undangan berdasarkan lamaranId
 */
export const getUndanganSaya = async (lamaranId: string): Promise<Undangan[]> => {
  const res = await axios.get(`${API}/lamaran/${lamaranId}/undangan`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return res.data
}
