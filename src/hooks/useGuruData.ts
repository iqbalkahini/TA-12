'use client'

import { useState, useEffect } from 'react'
import type { Guru } from '@/types/api'

// Hook untuk mendapatkan data guru
export const useGuruData = () => {
  const [guruData, setGuruData] = useState<Guru | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuruData = async () => {
      try {
        // Coba ambil dari localStorage dulu (dari login response)
        const storedGuruData = localStorage.getItem('guruData')
        
        if (storedGuruData) {
          const parsedData = JSON.parse(storedGuruData)
          setGuruData(parsedData)
          setLoading(false)
          return
        }

        // TODO: Jika tidak ada di localStorage, fetch dari API
        // const response = await axiosInstance.get('/auth/guru/me')
        // setGuruData(response.data.data)
        // localStorage.setItem('guruData', JSON.stringify(response.data.data))

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch guru data')
        setLoading(false)
      }
    }

    fetchGuruData()
  }, [])

  // Fungsi untuk update guru data
  const updateGuruData = (data: Guru) => {
    setGuruData(data)
    localStorage.setItem('guruData', JSON.stringify(data))
  }

  // Fungsi untuk clear guru data (saat logout)
  const clearGuruData = () => {
    setGuruData(null)
    localStorage.removeItem('guruData')
  }

  return {
    guruData,
    loading,
    error,
    updateGuruData,
    clearGuruData,
  }
}
