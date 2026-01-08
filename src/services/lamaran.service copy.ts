/* ======================
   TYPES
====================== */
export type StatusLamaran = 'pending' | 'diterima' | 'ditolak'

export interface Pelamar {
  _id: string
  nama: string
  email: string
  posisi: string
  lembaga: string
  tglLahir: string
  status?: StatusLamaran
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

interface ApiError {
  message: string
}

/* ======================
   CONFIG
====================== */
const ADMIN_BASE_URL = 'http://localhost:5000/api/admin/lamaran'
const USER_BASE_URL = 'http://localhost:5000/api/lamaran'

const getToken = (): string => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token tidak ditemukan')
  return token
}

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err: ApiError = await res.json()
    throw new Error(err.message || 'Terjadi kesalahan')
  }
  return res.json()
}

/* =====================================================
   ======================= ADMIN =======================
===================================================== */

/**
 * 🔹 ADMIN: Ambil semua lamaran
 */
export const fetchLamaran = async (): Promise<Pelamar[]> => {
  const res = await fetch(ADMIN_BASE_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return handleResponse<Pelamar[]>(res)
}

/**
 * 🔹 ADMIN: Update status lamaran (diterima / ditolak)
 */
export const updateLamaranStatus = async (
  id: string,
  status: Exclude<StatusLamaran, 'pending'>,
): Promise<Pelamar> => {
  const res = await fetch(`${ADMIN_BASE_URL}/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }),
  })

  return handleResponse<Pelamar>(res)
}

/**
 * 🔹 ADMIN: Hapus lamaran
 */
export const deleteLamaran = async (id: string): Promise<void> => {
  const res = await fetch(`${ADMIN_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!res.ok) {
    const err: ApiError = await res.json()
    throw new Error(err.message)
  }
}

/* =====================================================
   ====================== PELAMAR ======================
===================================================== */

/**
 * 🔹 PELAMAR: Ambil lamaran milik sendiri
 * Dashboard Pelamar (status, posisi, lembaga, dll)
 */
export const fetchLamaranSaya = async (): Promise<Pelamar> => {
  const res = await fetch(`${USER_BASE_URL}/saya`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return handleResponse<Pelamar>(res)
}

/**
 * 🔔 PELAMAR: Ambil undangan tes berdasarkan lamaran
 * dipakai untuk:
 * - Notifikasi
 * - UndanganAktifCard
 */
export const fetchUndanganLamaran = async (lamaranId: string): Promise<Undangan[]> => {
  const res = await fetch(`${USER_BASE_URL}/${lamaranId}/undangan`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  return handleResponse<Undangan[]>(res)
}
