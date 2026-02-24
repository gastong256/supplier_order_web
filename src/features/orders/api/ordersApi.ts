import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'
import type {
  Order,
  OrderWithItems,
  CreateOrderDto,
  AddOrderItemDto,
  UpdateOrderItemDto,
  ConfirmOrderDto,
  OrderItem,
} from '../types/order.types'

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders')
    return response.data
  },

  getById: async (id: string): Promise<OrderWithItems> => {
    const response = await apiClient.get<ApiResponse<OrderWithItems>>(`/orders/${id}`)
    return response.data
  },

  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/orders/${id}`)
  },

  confirm: async (id: string, data: ConfirmOrderDto): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, data)
    return response.data
  },

  addItem: async (orderId: string, data: AddOrderItemDto): Promise<OrderItem> => {
    const response = await apiClient.post<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items`,
      data
    )
    return response.data
  },

  updateItem: async (
    orderId: string,
    productId: string,
    data: UpdateOrderItemDto
  ): Promise<OrderItem> => {
    const response = await apiClient.patch<ApiResponse<OrderItem>>(
      `/orders/${orderId}/items/${productId}`,
      data
    )
    return response.data
  },

  deleteItem: async (orderId: string, productId: string): Promise<void> => {
    await apiClient.delete(`/orders/${orderId}/items/${productId}`)
  },
}
