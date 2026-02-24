import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { ordersApi } from '../api/ordersApi'
import type { CreateOrderDto, AddOrderItemDto, UpdateOrderItemDto } from '../types/order.types'

const ORDERS_KEY = ['orders']
const orderKey = (id: string) => ['orders', id]

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: ordersApi.getAll,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKey(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data: CreateOrderDto) => ordersApi.create(data),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
      void navigate(`/orders/${order.id}`)
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
    },
  })
}

export function useConfirmOrder(orderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => ordersApi.confirm(orderId, { status: 'CONFIRMED' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKey(orderId) })
      void queryClient.invalidateQueries({ queryKey: ORDERS_KEY })
    },
  })
}

export function useAddOrderItem(orderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AddOrderItemDto) => ordersApi.addItem(orderId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKey(orderId) })
    },
  })
}

export function useUpdateOrderItem(orderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: UpdateOrderItemDto }) =>
      ordersApi.updateItem(orderId, productId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKey(orderId) })
    },
  })
}

export function useDeleteOrderItem(orderId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => ordersApi.deleteItem(orderId, productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKey(orderId) })
    },
  })
}
