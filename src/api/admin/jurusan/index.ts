import { Jurusan } from "@/types/api"
import axiosInstance from "@/utils/axios"

export const getJurusan = async () => {
    try {
        const response = await axiosInstance.get('/api/jurusan')
        return response.data
    } catch (error) {
        console.error('Get jurusan failed:', error)
        return null
    }
}


export const getJurusanById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/api/jurusan/${id}`)
        return response.data
    } catch (error) {
        console.error('Get jurusan by id failed:', error)
        return null
    }
}

export const createJurusan = async (data: Jurusan) => {
    try {
        const response = await axiosInstance.post('/api/jurusan', data)
        return response.data
    } catch (error) {
        console.error('Create jurusan failed:', error)
        return null
    }
}

export const updateJurusan = async (id: number, data: Jurusan) => {
    try {
        const response = await axiosInstance.put(`/api/jurusan/${id}`, data)
        return response.data
    } catch (error) {
        console.error('Update jurusan failed:', error)
        return null
    }
}

export const deleteJurusan = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/jurusan/${id}`)
        return response.data
    } catch (error) {
        console.error('Delete jurusan failed:', error)
        return null
    }
}