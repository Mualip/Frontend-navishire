import axios from '@/lib/axios'
import type { Notifikasi } from '@/types/Notifikasi'

export const getNotifikasi = async (): Promise<Notifikasi[]> => {
  const res = await axios.get('/notifikasi')
  return res.data
}

export const markAsRead = async (id: string) => {
  await axios.put(`/notifikasi/${id}/read`)
}
