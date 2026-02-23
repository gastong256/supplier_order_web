import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'
import type { Supplier, CreateSupplierDto, UpdateSupplierDto } from '../types/supplier.types'

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await apiClient.get<ApiResponse<Supplier[]>>('/suppliers')
    console.log('API Response:', response.data) // Debug log
    return response.data
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`)
    return response.data
  },

  create: async (data: CreateSupplierDto): Promise<Supplier> => {
    const response = await apiClient.post<ApiResponse<Supplier>>('/suppliers', data)
    return response.data
  },

  update: async (id: number, data: UpdateSupplierDto): Promise<Supplier> => {
    const response = await apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/suppliers/${id}`)
  },
}
