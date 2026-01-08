export interface Lamaran {
  _id: string
  nama: string
  email: string
  posisi: string
  lembaga: string
  status: 'pending' | 'diterima' | 'ditolak'
}
