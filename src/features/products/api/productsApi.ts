import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'
import type { Product, CreateProductDto, UpdateProductDto } from '../types/product.types'

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products')
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/products', data)
    return response.data
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}
