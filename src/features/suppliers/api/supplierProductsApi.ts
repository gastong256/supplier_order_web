import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'
import type { SupplierProduct, LinkProductDto } from '../types/supplier.types'

export const supplierProductsApi = {
  getAll: async (supplierId: string): Promise<SupplierProduct[]> => {
    const response = await apiClient.get<ApiResponse<SupplierProduct[]>>(
      `/suppliers/${supplierId}/products`
    )
    return response.data
  },

  link: async (supplierId: string, data: LinkProductDto): Promise<void> => {
    await apiClient.post(`/suppliers/${supplierId}/products`, data)
  },

  unlink: async (supplierId: string, productId: string): Promise<void> => {
    await apiClient.delete(`/suppliers/${supplierId}/products/${productId}`)
  },
}
