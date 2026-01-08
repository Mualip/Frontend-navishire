export interface Notifikasi {
  _id: string
  title: string
  message: string
  type: 'info' | 'berkas' | 'tes' | 'pengumuman'
  isRead: boolean
  createdAt: string
}
